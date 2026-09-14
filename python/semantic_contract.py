"""Source-aligned local role grammar and immutable semantic relationships.

Inspired by the separation of syntax/roles in CNL research; no upstream code or
trained weights. Closed operator lexicon, open argument phrases. A successful
local parse is NOT proof of full natural-language meaning or authorization.
"""
import importlib.util
import json
import re
import sys
from dataclasses import dataclass, asdict
from pathlib import Path
from lark import Lark, Token
from lark.exceptions import LarkError

LEX=json.loads(Path(__file__).with_name('semantic_lexicon.json').read_text(encoding='utf-8'))
PARSER=Lark(Path(__file__).with_name('semantic_actions.lark').read_text(encoding='utf-8'),parser='lalr')
_domain_spec=importlib.util.spec_from_file_location('boundx_domain_action_frames',Path(__file__).with_name('domain_action_frames.py'))
_domain=importlib.util.module_from_spec(_domain_spec)
sys.modules[_domain_spec.name]=_domain
_domain_spec.loader.exec_module(_domain)
FILE=re.compile(r'(?<![\w./-])[A-Za-z0-9_./-]+\.(?:parquet|csv|jsonl?|xlsx|txt|log|zip|tar\.gz)(?![\w.-])')

def alternatives(values):
    return '|'.join((r'\b'+re.escape(v)+r'\b') if v.isascii() else re.escape(v) for v in sorted(values,key=len,reverse=True))

VERBS={v.lower():k for k,c in LEX['operations'].items() for lang in ['zh','en'] for v in c[lang]}
for _trigger,_frames in _domain.TRIGGER_FRAMES.items():
    # Ambiguous triggers remain visible to the scanner and are rejected below.
    VERBS[_trigger]=_frames[0]['operation']
VERB=re.compile(alternatives(VERBS),re.I)
MODES={v:k for k,values in LEX['modalities'].items() for v in values}
MODE=re.compile(alternatives(MODES),re.I)

@dataclass(frozen=True)
class Evidence:
    quote: str
    start: int
    end: int

@dataclass(frozen=True)
class Role:
    name: str
    value: str
    source: Evidence

@dataclass(frozen=True)
class Action:
    id: str
    operation: str
    verb: str
    roles: tuple
    modality: str
    guard_sources: tuple
    source: Evidence
    rule: str = 'local_role_grammar/v1'
    domain_pack: str = ''
    domain_pack_version: str = ''
    frame_id: str = ''
    entity_type_candidates: tuple = ()
    core_entity_type_candidates: tuple = ()
    executor_role_candidates: tuple = ()
    risk_candidates: tuple = ()

@dataclass(frozen=True)
class Fact:
    field: str
    kind: str
    value_zh: str
    value_en: str
    sources: tuple
    relation_id: str = ''

def ev(value):return Evidence(value['quote'],value['start'],value['end'])
def includes(outer,inner):return outer['start']<=inner['start'] and inner['end']<=outer['end']
def public(value):
    # A single JSON boundary; immutable tuples become ordinary protocol arrays.
    return json.loads(json.dumps(asdict(value),ensure_ascii=False))

def parse_actions(text,source,spans,prohibitions,guards,memberships,numbers):
    actions=[];uncovered=[];completions=[]
    bans=prohibitions.get('records',[]);rules=guards.get('rules',[])
    protected=[m.span() for m in re.finditer(r'`[^`\n]+`',text)]+[m.span() for m in FILE.finditer(text)]
    # Some domain action words are also lexicalized inside ordinary nouns.
    # Keep the exception inspectable and narrow: it only suppresses the verb
    # occurrence, not the whole noun phrase (e.g. “果蔬打包箱”).
    lexicalized_noun_tails={'打包':('箱',),'结算':('核心',)}
    lexicalized_noun_prefixes={'发布':('预',),'向':('逆',)}
    def verbs(a,b):
        return [m for m in VERB.finditer(text,a,b)
                if not any(x<=m.start()<y for x,y in protected)
                and not any(text.startswith(tail,m.end()) for tail in lexicalized_noun_tails.get(m.group(),()))
                and not any(text[max(a,m.start()-len(prefix)):m.start()]==prefix for prefix in lexicalized_noun_prefixes.get(m.group(),()))
                and not (m.group().startswith('发布') and text[max(a,m.start()-1):m.start()]=='预')]
    # A colon separates an introductory task operation from following rules.
    local_spans=[]
    for a,b in spans:
        cuts=[a]
        for m in re.compile(r'[:：]').finditer(text,a,b):
            if not any(x<=m.start()<y for x,y in protected):
                local_spans.append((cuts[-1],m.start()));cuts.append(m.end())
        local_spans.append((cuts[-1],b))
    spans=[(a,b) for a,b in local_spans if text[a:b].strip()]
    # Resolve explicit executor phrases after structural headings are split.
    # Closed nominal endings identify a role head; the following verb comes
    # from the shared operation lexicon. Do not scan verbs inside that name.
    nominal=r'\s*由(?P<who>[^，,。；;:：]+?(?:'+LEX['executor_nominal_end']+r'))(?=\s*(?:'+LEX['executor_duty']+'|'+VERB.pattern+r'))'
    duty=r'\s*由(?P<who>[^，,。；;:：]+?)(?:负责执行|负责|执行|向|给|对|将)'
    for a,b in spans:
        m=re.match(nominal,text[a:b],re.I) or re.match(duty,text[a:b])
        if m:protected.append((a+m.start('who'),a+m.end('who')))
    inherited_guard=None;pending_actor=None
    for index,(a,b) in enumerate(spans):
        q=text[a:b];src=source(text,a,b)
        if any(r.get('guardSource') and includes(r['guardSource'],src) for r in bans):continue
        if b-a>1000:
            uncovered.append({'source':src,'reason':'local_clause_size_limit'});continue
        if len(actions)>=200:
            uncovered.append({'source':src,'reason':'action_count_limit'});break
        # Separate clauses cannot accidentally inherit an unrelated condition.
        if index and re.search(r'[；;。.!?！？\n]',text[spans[index-1][1]:a]):inherited_guard=None
        if index and not re.fullmatch(r'\s*[,，]\s*',text[spans[index-1][1]:a]):pending_actor=None
        # A reference clause may mention verbs in a policy title or in its
        # publication history. Those mentions are not this task's actions.
        if re.match(LEX['reference_prefix'],q,re.I):continue
        declaration=re.fullmatch(r'\s*由(?P<zh>[^，,。；;:：]{1,50}?)(?:负责|执行|处理)\s*|\s*[Bb]y\s+(?P<en>[A-Z][A-Za-z_-]*(?:\s+(?:[A-Z][A-Za-z_-]*|of|the|and)){0,5})\s*',q)
        if declaration and (not verbs(a,b) or (len(verbs(a,b))==1 and verbs(a,b)[0].end()==b)):
            group='zh' if declaration['zh'] else 'en';x,y=a+declaration.start(group),a+declaration.end(group)
            actor_source=source(text,x,y)
            completions.append(Fact('P','executor',actor_source['quote']+'（执行）',actor_source['quote']+' (executor)',(ev(actor_source),)))
            pending_actor=actor_source;continue
        if re.search(LEX['guard_prefix'],q,re.I) and not verbs(a,b):inherited_guard=src
        if not verbs(a,b):continue
        # Guard-only spans often contain words such as "system receives". Do
        # not turn nouns in a condition into required business actions.
        if re.match(r'^(?:若|如果|但若|if\b|but if\b)',q,re.I) and not re.search(r'[，,]|则|\bthen\b',q,re.I):
            inherited_guard=src;continue
        candidates=verbs(a,b)
        # Only an explicit action coordinator opens another action. Verb-looking
        # words inside an argument ("读取生成的文件") remain part of that argument.
        cuts=[a]
        for m in candidates[1:]:
            lead=re.search(r'(?:并且|并|且|然后|以及|\band\b|\bthen\b)\s*(?:自动|立即)?\s*$',text[a:m.start()],re.I)
            if lead:cuts.append(a+lead.start())
        cuts=sorted(set(cuts))+[b]
        actor_carry=pending_actor;pending_actor=None;context_carry=();mode_carry='STATED'
        for left,right in zip(cuts,cuts[1:]):
            if len(actions)>=200:
                uncovered.append({'source':source(text,left,b),'reason':'action_count_limit'});break
            value=text[left:right];strip=re.match(LEX['trim_prefix'],value,re.I)
            if strip:left+=strip.end();value=text[left:right]
            candidates=verbs(left,right)
            if not candidates:continue
            main=candidates[0]
            # Temporal noun "执行完毕后" is a contextual prefix, not CALL.
            if main.group()=='执行' and text[main.end():].startswith(('完毕后','完成后','过程中','期间','中')):
                candidates=candidates[1:]
                if not candidates:continue
                main=candidates[0]
            if re.search(LEX['non_action'],text[main.start():right],re.I):continue
            numeric_clause=any(n['kind']=='bound' and includes(n['source'],source(text,main.start(),right)) for n in numbers)
            if numeric_clause and not re.search(r'(?:^|\s)(?:由|by\b)',text[left:main.start()],re.I):continue
            action_src=source(text,main.start(),right)
            if any(includes(r['actionSource'],action_src) for r in bans):continue
            # Callable guards have their own stricter antecedent/anaphora parser.
            bound_rule=next((r for r in rules if includes(r['source'],action_src)),None)
            if bound_rule:continue
            context=list(context_carry)
            member=next((r for r in memberships if any(includes(s,action_src) for s in r['then'])),None)
            if member:context.append(ev(member['condition']))
            elif inherited_guard:context.append(ev(inherited_guard))
            if index+1<len(spans):
                na,nb=spans[index+1]
                if re.fullmatch(r'\s*[,，]\s*',text[b:na]) and re.match(r'\s*(?:除非|但仅|仅在|unless\b|only if\b)',text[na:nb],re.I):
                    context.append(ev(source(text,na,nb)))
            prefix=text[left:main.start()];tokens=[];refs=[]
            def push(kind,start,end):
                while start<end and text[start].isspace():start+=1
                while end>start and text[end-1].isspace():end-=1
                refs.append(source(text,start,end));tokens.append(kind+'_'+str(len(refs)-1))
            # Prefix grammar: explicit executor, modality, and recipient are
            # different slots; English bare subjects are allowed before a verb.
            prefix_end=main.start();modal=list(MODE.finditer(prefix))
            pos=left;mode=mode_carry
            if modal:
                mm=modal[-1];mode=MODES[mm.group().lower()]
                mode_carry=mode
                prefix_end=left+mm.start()
            before=text[pos:prefix_end].strip();recipient=None;actor=None;subject_input=None;unknown_prefix=False
            # "由 X [负责] 向 Y" and "By X ..." bind only explicit source roles.
            role_prefix=text[pos:prefix_end]
            by=re.fullmatch(r'\s*由(?P<who>.+?(?:'+LEX['executor_nominal_end']+r'))\s*(?:(?:向|给)\s*(?P<to>.+)|(?:对|将|为)\s*(?P<input>.+))?',role_prefix,re.I)
            if not by:
                by=re.fullmatch(r'\s*(?:由|by\s+)(?P<who>.+?)(?:\s*(?:'+LEX['executor_duty']+r'))?\s*(?:(?:向|给)\s*(?P<to>.+)|(?:对|将|为)\s*(?P<input>.+))?',role_prefix,re.I)
            to=re.fullmatch(r'\s*(?:向|给|to\s+)(?P<to>.+?)\s*',text[pos:prefix_end],re.I)
            if by:
                actor=(pos+by.start('who'),pos+by.end('who'))
                if by['to']:recipient=(pos+by.start('to'),pos+by.end('to'))
                if by['input']:subject_input=(pos+by.start('input'),pos+by.end('input'))
            elif to:recipient=(pos+to.start('to'),pos+to.end('to'))
            elif before and before.isascii() and re.fullmatch(r'[A-Za-z][A-Za-z0-9_-]*(?: [A-Za-z][A-Za-z0-9_-]*)?',before) and not re.search(LEX['guard_prefix'],before,re.I) and before.lower() not in ['but','only','also','otherwise','except','until']:
                actor=(pos,prefix_end)
            elif before:
                unknown_prefix=True;context.append(ev(source(text,pos,prefix_end)))
            if actor:push('BY',actor[0],actor[0]);push('ARG',*actor)
            elif actor_carry:
                refs.append(actor_carry);tokens.extend(['BY_'+str(len(refs)-1),'ARG_'+str(len(refs)-1)])
            if modal:
                mm=modal[-1];push(mode,left+mm.start(),left+mm.end())
                tail=text[left+mm.end():main.start()]
                if tail.strip() and not re.fullmatch(r'\s*(?:立即|自动|直接|无条件|immediately|automatically)\s*',tail,re.I):
                    unknown_prefix=True;context.append(ev(source(text,left+mm.end(),main.start())))
            context_carry=tuple(dict.fromkeys(context))
            if recipient:push('TO',recipient[0],recipient[0]);push('ARG',*recipient)
            if subject_input:push('ON',subject_input[0],subject_input[0]);push('ARG',*subject_input)
            trigger=main.group().casefold()
            domain_frames=_domain.TRIGGER_FRAMES.get(trigger,())
            if len(domain_frames)>1:
                uncovered.append({'source':source(text,left,right),'reason':'domain_frame_ambiguous',
                    'packId':_domain.PACK['manifest']['id'],'packVersion':_domain.PACK['manifest']['version'],
                    'triggerSource':source(text,main.start(),main.end()),
                    'candidateFrameIds':sorted(frame['id'] for frame in domain_frames)})
                continue
            domain_frame=domain_frames[0] if domain_frames else None
            operation=VERBS[trigger];push(operation,main.start(),main.end())
            body_start,body_end=main.end(),right
            complete=re.search(LEX['completion'],text[body_start:body_end],re.I)
            complete_span=None
            if complete:
                complete_span=(body_start+complete.start(),body_start+complete.end());body_end=complete_span[0]
            origin=re.search(r'\s+from\s+(?P<input>.+)$',text[body_start:body_end],re.I) if operation=='CREATE' else None
            origin_span=None
            if origin:
                origin_span=(body_start+origin.start('input'),body_start+origin.end('input'))
                body_end=body_start+origin.start()
            # Recipient postfix is part of SEND only, not a file path or input.
            postfix=re.search(r'\s+(?:to)\s+(?P<to>[^,;]+)$|(?:给|至)(?P<zh>[^，；]+)$',text[body_start:body_end],re.I) if operation=='SEND' else None
            if postfix:
                group='to' if postfix['to'] else 'zh'
                recipient_post=(body_start+postfix.start(group),body_start+postfix.end(group))
                end=body_start+postfix.start()
            else:recipient_post=None;end=body_end
            arg=text[body_start:end].strip()
            if re.match(LEX['incomplete_argument_prefix'],arg,re.I):
                uncovered.append({'source':source(text,left,right),'reason':'coordinated_argument_unresolved'});continue
            if operation=='SEND' and re.match(LEX['recipient_only_argument'],arg,re.I):
                uncovered.append({'source':source(text,left,right),'reason':'payload_reference_unresolved'});continue
            if not arg or re.search(LEX['unsafe_argument'],arg,re.I) or re.search(r'\b(?:who|which|that)\b',before,re.I):
                uncovered.append({'source':source(text,left,right),'reason':'role_or_scope_not_resolved'});continue
            if mode in ['FORBID','NOT_REQUIRED']:
                # Independent B is retained by its own adapter. Never project a
                # negative/nonrequired sentence as a delivery promise.
                continue
            push('ARG',body_start,end)
            if recipient_post:push('TO',*recipient_post);push('ARG',*recipient_post)
            if origin_span:push('FROM',*origin_span);push('ARG',*origin_span)
            if complete_span:push('COMPLETE',*complete_span)
            try:tree=PARSER.parse(' '.join(tokens))
            except LarkError:
                uncovered.append({'source':source(text,left,right),'reason':'local_role_grammar_uncovered'});continue
            roles=[]
            for node in tree.iter_subtrees_topdown():
                if node.data in ['executor','recipient','subject_input','origin','read','create','send','emit','process','change','call']:
                    arg_token=next((t for t in node.children if isinstance(t,Token) and t.type=='ARG'),None)
                    if arg_token is None:continue
                    s=refs[int(str(arg_token).rsplit('_',1)[1])]
                    role={'executor':'executor','recipient':'recipient','subject_input':'input','origin':'input'}.get(str(node.data),LEX['operations'][operation]['role'])
                    roles.append(Role(role,s['quote'],ev(s)))
            if len([r for r in roles if r.name=='recipient'])>1:
                uncovered.append({'source':source(text,left,right),'reason':'multiple_recipient_bindings'});continue
            if domain_frame:
                names={role.name for role in roles}
                missing=sorted(role['name'] for role in domain_frame['roles'] if role['required'] and role['name'] not in names)
                if missing:
                    uncovered.append({'source':source(text,left,right),'reason':'domain_required_role_missing',
                        'packId':_domain.PACK['manifest']['id'],'packVersion':_domain.PACK['manifest']['version'],
                        'frameId':domain_frame['id'],'missingRoles':missing})
                    continue
            for condition in dict.fromkeys(context):
                for approval in re.finditer(LEX['approval_context'],condition.quote,re.I):
                    group='zh' if approval['zh'] else 'en'
                    ra,rb=approval.span(group)
                    while ra<rb and condition.quote[ra].isspace():ra+=1
                    while rb>ra and condition.quote[rb-1].isspace():rb-=1
                    rs=Evidence(condition.quote[ra:rb],condition.start+len(condition.quote[:ra].encode('utf-16-le'))//2,condition.start+len(condition.quote[:rb].encode('utf-16-le'))//2)
                    roles.append(Role('approver',rs.quote,rs))
            if actor:actor_carry=next(public(r.source) for r in roles if r.name=='executor')
            id='action_'+str(len(actions)+1)
            entity_types=();executor_roles=()
            if domain_frame:
                primary=next((role for role in roles if role.name==domain_frame['primaryRole']),None)
                executor=next((role for role in roles if role.name=='executor'),None)
                if primary:entity_types=_domain.entity_candidates(primary.value,domain_frame)
                if executor:executor_roles=_domain.executor_role_candidates(executor.value,domain_frame)
            frame=Action(
                id,operation.lower(),main.group(),tuple(roles),mode,
                tuple(dict.fromkeys(context)),ev(source(text,left,right)),
                'domain_action_frame/v1' if domain_frame else 'local_role_grammar/v1',
                _domain.PACK['manifest']['id'] if domain_frame else '',
                _domain.PACK['manifest']['version'] if domain_frame else '',
                domain_frame['id'] if domain_frame else '',
                entity_types,
                _domain.core_entity_candidates(entity_types) if domain_frame else (),
                executor_roles,
                _domain.frame_risk_candidates(domain_frame['id']) if domain_frame else (),
            )
            actions.append(frame)
            if complete_span:completions.append(Fact('C','completion_assertion',text[left:complete_span[0]],text[left:complete_span[0]],(ev(source(text,left,right)),),id))
            if unknown_prefix:uncovered.append({'source':source(text,left,main.start()),'reason':'context_kept_as_unresolved_guard','relation_id':id})
    return actions,completions,uncovered
