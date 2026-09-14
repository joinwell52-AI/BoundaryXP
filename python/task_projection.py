"""Small evidence-backed display projections, not authorization or completion proofs."""
import re
import importlib.util
import sys
from pathlib import Path

# The UI launches Python in isolated mode (-I), with no script directory on
# sys.path. Load only our known sibling, and register dataclass metadata.
_spec=importlib.util.spec_from_file_location('boundx_semantic_contract',Path(__file__).with_name('semantic_contract.py'))
_semantic=importlib.util.module_from_spec(_spec)
sys.modules[_spec.name]=_semantic
_spec.loader.exec_module(_semantic)
Fact,ev,public,parse_actions,FILE_PATTERN=(_semantic.Fact,_semantic.ev,_semantic.public,_semantic.parse_actions,_semantic.FILE)

FILE=r'`?(?P<file>[A-Za-z0-9_./-]+\.(?:parquet|csv|jsonl?|xlsx|txt|log|zip|tar\.gz))`?'

def _source_candidates(text,source,numbers=(),guards=None,prohibitions=None,lists=(),memberships=(),spans=()):
    fields={k:[] for k in 'IOAPRVCB'};external=[];unresolved=[]
    bans=(prohibitions or {}).get('records',[])
    def includes(outer,inner):return outer['start']<=inner['start'] and inner['end']<=outer['end']
    def banned(a,b):return any(includes(r['actionSource'],source(text,a,b)) for r in bans)
    def add(k,a,b,zh,en=None):
        src=source(text,a,b);sources=[src];en=en or zh
        if k=='I' and banned(a,b):return
        if k in ['A','O']:
            if banned(a,b):return
            branch=next((r for r in memberships if any(includes(s,src) for s in r['then'])),None)
            if branch:
                zh=branch['condition']['quote']+'时：'+zh
                en='When '+branch['condition']['quote']+': '+en
                sources.insert(0,branch['condition'])
            else:
                rule=next((r for r in (guards or {}).get('rules',[]) if includes(r['source'],src) and r['guard']['op']!='constant'),None)
                if rule:
                    zh=rule['conditionSummary']['zh-CN']+'时：'+zh
                    en='When '+rule['conditionSummary']['en']+': '+en
                    sources.insert(0,rule['source'])
                else:
                    index=next((i for i,(x,y) in enumerate(spans) if includes(source(text,x,y),src)),None)
                    if index is not None and index>0:
                        x,y=spans[index-1];condition=text[x:y]
                        if re.search(r'^(?:当.+时|若|如果|对于.+的客户|when\b|if\b)',condition,re.I):
                            zh=condition+'：'+zh;en=condition+': '+en;sources.insert(0,source(text,x,y))
        fields[k].append({'text':{'zh-CN':zh,'en':en},'sources':sources})
    for m in re.finditer(r'(?:外部输入|已有输入|external input)\s*[:：]\s*'+FILE,text,re.I):
        if banned(m.start(),m.end()):continue
        external.append({'name':m['file'],'source':source(text,m.start(),m.end())})
        add('I',m.start(),m.end(),'已声明外部文件 '+m['file'],'Declared external file '+m['file'])
    for m in re.finditer(r'(?:^|[，,。；;\n])\s*(?:处理|结算)(?P<input>[^，,。；;:：\n]{1,1000})(?=$|[，,。；;:：\n])',text):
        if not re.search(r'耗时|时间|上限|以内',m['input']):add('I',m.start('input'),m.end('input'),m['input'])
    for m in re.finditer(r'\b(?:scan\s+and\s+update|process)\s+(?P<input>[^,;.\n]{1,500})(?=[,;.]|$)',text,re.I):
        add('I',m.start('input'),m.end('input'),m['input'])
    for m in re.finditer(r'针对(?P<input>[^，,。；;\n]{1,1000})(?=$|[，,。；;\n])',text):add('I',m.start('input'),m.end('input'),m['input'])
    for m in re.finditer(r'(?:对|针对)(?P<input>[^，,。；;\n]{1,30}?)(?:批量)?执行[^，,。；;\n]{0,20}?操作',text):
        add('I',m.start(),m.end(),m['input'])
    for m in re.finditer(r'对(?P<input>[^，,。；;\n]{1,30}?)调用',text):add('I',m.start('input'),m.end('input'),m['input'])
    for m in re.finditer(r'由[^对将，,。；;:：\n]{1,50}?执行(?P<input>[^，,。；;:：\n]{1,1000})(?=$|[，,。；;:：\n])',text):add('I',m.start('input'),m.end('input'),m['input'])
    for m in re.finditer(r'(?:根据|依据|依照|按照)(?P<version>[^，,。；;\n]+)',text):add('V',m.start(),m.end(),m['version'])
    for a,b in spans:
        m=re.match(r'\s*(?:according to|based on|in accordance with|per|under)\s+(?P<version>.+)',text[a:b],re.I)
        if m:add('V',a+m.start(),a+m.end(),m['version'])
    for m in re.finditer(r'(?:[^，,。；;\n]{0,30})返回[^，,。；;\n]{1,40}?成功(?=即为完成|为完成标志)',text):add('O',m.start(),m.end(),m.group())
    for a,b in spans:
        m=re.search(_semantic.LEX['completion'],text[a:b],re.I)
        if m and text[a:a+m.start()].strip():
            assertion=text[a:a+m.start()].strip()
            if re.fullmatch(_semantic.LEX['completion_reference'],assertion,re.I):
                unresolved.append({'source':source(text,a,b),'reason':'completion_antecedent_unresolved'})
            else:add('C',a,b,assertion)
    for m in re.finditer(r'\b(?:task is complete when|completion condition:)\s*(?P<finish>[^;\n]+)',text,re.I):add('C',m.start(),m.end(),m['finish'])
    for record in lists:
        k='I' if record['role']=='target' else 'B';s=record['source']
        fields[k].append({'text':{'zh-CN':('目标集合：' if k=='I' else '禁止集合：')+'{'+', '.join(record['values'])+'}',
            'en':('Target set: ' if k=='I' else 'Forbidden set: ')+'{'+', '.join(record['values'])+'}'},'sources':[s]})
    for branch in memberships:
        fields['I'].append({'text':{'zh-CN':'条件清单：{'+', '.join(branch['members'])+'}（用于判断分支，不代表全部任务对象）',
            'en':'Condition list: {'+', '.join(branch['members'])+'} (branch test, not the full task population)'},'sources':[branch['condition']]})
    for n in numbers:
        if n['kind']!='bound':continue
        unit=n.get('unitLabels',('单位待明确','unit unspecified'))
        sign={'lt':'<','le':'≤','gt':'>','ge':'≥','eq':'='}[n['relation']]
        metric=n.get('boundMetric',n.get('metricDisplay',n['metric'])) or '本句指标'
        fields['R'].append({'text':{'zh-CN':f'{metric} {sign} {n["value"]} {unit[0]}','en':f'{metric} {sign} {n["value"]} {unit[1]}'},'sources':[n['expressionSource'],*n.get('unitSources',[])]})
    for rule in (guards or {}).get('rules',[]):
        guard=rule['guard'];atom=guard['arg'] if guard['op']=='NOT' else guard
        if atom['op']=='approval':
            fields['P'].append({'text':{'zh-CN':'授权主体：'+atom['name'],'en':'Approval actor: '+atom['name']},'sources':[atom['source']]})
        k='B' if rule['modality']=='FORBID' else 'A';name=rule['predicate']['target']
        word={'FORBID':('禁止调用','Do not invoke'),'REQUIRE':('要求调用','Required invocation'),'PERMIT':('允许调用（原文）','Permission stated in text'),'NOT_REQUIRED':('不要求调用','Invocation not required')}[rule['modality']]
        condition=rule.get('conditionSummary',{})
        prefix_zh=condition.get('zh-CN','')+'时，' if guard['op']!='constant' else ''
        prefix_en='When '+condition.get('en','')+': ' if guard['op']!='constant' else ''
        fields[k].append({'text':{'zh-CN':prefix_zh+word[0]+' '+name,'en':prefix_en+word[1]+' '+name},'sources':[rule['source']]})
    for record in bans:
        s=record['source']
        # A richer guard-bound prohibition already covers this clause.
        if not any(any(includes(x,s) for x in v['sources']) for v in fields['B']):
            fields['B'].append({'text':{'zh-CN':s['quote'],'en':s['quote']},'sources':[s]})
        if record['approvalActor'] and not any(any(includes(s,record['guardSource']) for s in v['sources']) for v in fields['P']):
            fields['P'].append({'text':{'zh-CN':'授权主体：'+record['approvalActor'],'en':'Approval actor: '+record['approvalActor']},'sources':[record['guardSource']]})
    for k in fields:
        fields[k]=list({(x['text']['zh-CN'],tuple(s['start'] for s in x['sources'])):x for x in fields[k]}.values())
    return {'fields':fields,'externalInputs':external,'unresolved':unresolved}


def project(text,source,numbers=(),guards=None,prohibitions=None,lists=(),memberships=(),spans=()):
    """Project a shared, source-backed contract. Action roles own A/O/file I/O.

    Existing numeric, scope, reference, completion and prohibition extractors
    remain explicit adapters. They do not masquerade as fully parsed actions.
    """
    guards=guards or {};prohibitions=prohibitions or {}
    def includes(outer,inner):return outer['start']<=inner['start'] and inner['end']<=outer['end']
    legacy=_source_candidates(text,source,numbers,guards,prohibitions,lists,memberships,spans)
    actions,completions,uncovered=parse_actions(text,source,spans,prohibitions,guards,memberships,numbers)
    uncovered.extend(legacy['unresolved'])
    domain_classifications={key:[] for key in ['resources','references','completions','risks']}
    def classify(collection,src,relation_id=None):
        if not src:return
        for item_id in _semantic._domain.lexical_candidates(src['quote'],collection):
            item={'id':item_id,'source':src}
            if relation_id:item['relationId']=relation_id
            domain_classifications[collection].append(item)
    for number in numbers:
        classify('resources',number.get('source') or number.get('expressionSource'))
    for value in legacy['fields']['V']:
        for src in value['sources']:classify('references',src)
    for value in legacy['fields']['C']:
        for src in value['sources']:classify('completions',src)
    for frame in actions:
        for risk_id in frame.risk_candidates:
            domain_classifications['risks'].append({'id':risk_id,'source':public(frame.source),'relationId':frame.id})
    for key,items in domain_classifications.items():
        domain_classifications[key]=list({
            (item['id'],item['source']['start'],item.get('relationId')):item for item in items
        }.values())
    facts=[];inputs=[];outputs=[];conditional=[]
    def fact(k,kind,zh,en,sources,id=''):
        facts.append(Fact(k,kind,zh,en,tuple(ev(s) for s in sources),id))
    # Scalar/explicit-source adapters. P remains typed as approval/executor;
    # open text I/V/C candidates retain their weaker provenance label.
    for k in 'IPRVCB':
        for value in legacy['fields'][k]:
            kind={'R':'numeric_bound','B':'known_prohibition','V':'reference_phrase','C':'completion_phrase','I':'scope_phrase','P':'actor_phrase'}[k]
            if k=='P' and value['text']['en'].startswith('Approval actor:'):kind='approval_actor'
            if k=='P' and kind=='actor_phrase':continue # grammar owns execution roles
            fact(k,kind,value['text']['zh-CN'],value['text']['en'],value['sources'])
    process_scope_supplied=bool(legacy['fields']['I'])
    for frame in actions:
        item=public(frame);src=item['source'];condition=[s['quote'] for s in item['guard_sources']]
        def conditioned(value,lang):
            if not condition:return value
            unresolved=any(u.get('relation_id')==frame.id and u['reason']=='context_kept_as_unresolved_guard' for u in uncovered)
            zh,en=('上下文待绑定：','Context to bind: ') if unresolved else ('条件原句：','Condition: ')
            return (zh+'；'.join(condition)+' → ' if lang=='zh-CN' else en+'; '.join(condition)+' → ')+value
        evidence=item['guard_sources']+[src]
        fact('A','action',conditioned(src['quote'],'zh-CN'),conditioned(src['quote'],'en'),evidence,frame.id)
        for role in item['roles']:
            name=role['name'];value=role['value'];rs=role['source']
            if name=='executor':fact('P','executor',value+'（执行）',value+' (executor)',[rs],frame.id)
            if name=='approver':fact('P','approval_actor','授权主体：'+value+'（未表示已获批）','Approval actor: '+value+' (grant not established)',[rs],frame.id)
            if name=='input':
                fact('I','action_'+name,value,value,[rs],frame.id)
            # A direct PROCESS argument supplies a scope candidate only when
            # no explicit input/scope was identified. Sub-operations (e.g.
            # cleaning characters inside a stated log dataset) do not replace
            # or widen that explicit input declaration.
            if name=='target' and frame.operation=='process' and not process_scope_supplied:
                fact('I','action_target',conditioned(value,'zh-CN'),conditioned(value,'en'),evidence,frame.id)
                process_scope_supplied=True
            if name in ['artifact','payload']:
                recipient=next((r['value'] for r in item['roles'] if r['name']=='recipient'),None)
                zh=value+(' → '+recipient if recipient else '');en=zh
                fact('O','action_'+name,conditioned(zh,'zh-CN'),conditioned(en,'en'),evidence,frame.id)
            if name not in ['input','artifact']:continue
            if re.search(r'或|或者|\bor\b',value,re.I):
                uncovered.append({'source':rs,'reason':'alternative_file_role','relation_id':frame.id})
                continue
            # File names are arguments of READ/CREATE, never arbitrary mentions.
            matches=list(FILE_PATTERN.finditer(value))
            if name=='artifact' and matches:
                # Opaque descriptive clauses do not prove every file mentioned
                # in them is produced. Accept direct names/lists/file labels.
                remainder=FILE_PATTERN.sub('',value)
                remainder=re.sub(r'`|\b(?:a|the|new|file|files|and)\b|文件|和|与|以及|[\s,，、]','',remainder,flags=re.I)
                explicit_named_file=(len(matches)==1 and value.rstrip().endswith(matches[0].group()) and '文件' in value[:matches[0].start()])
                if remainder and not explicit_named_file:
                    uncovered.append({'source':rs,'reason':'artifact_name_binding_unresolved','relation_id':frame.id})
                    continue
            for m in matches:
                file_source={'quote':m.group(),'start':rs['start']+len(value[:m.start()].encode('utf-16-le'))//2,'end':rs['start']+len(value[:m.end()].encode('utf-16-le'))//2}
                f={'name':m.group(),'source':file_source,'relationId':frame.id,'guardSources':item['guard_sources']}
                (inputs if name=='input' else conditional if condition else outputs).append(f)
    # Coordinated forms such as “读取并向量化词表 x.parquet” may leave the
    # READ action incomplete while the filename remains explicit. Preserve the
    # source-backed file input without inventing the larger action semantics.
    read_pattern=re.compile(r'(?:读取|加载|导入|\b(?:read|load|import)s?\b)(?P<body>[^，,。；;\n]{1,500})',re.I)
    for match_read in read_pattern.finditer(text):
        a,b=match_read.start(),match_read.end();body=match_read['body']
        stop=re.search(r'(?:生成|输出|写入|导出|\b(?:write|create|generate|output|export)s?\b)',body,re.I)
        if stop:body=body[:stop.start()];b=match_read.start('body')+stop.start()
        if re.search(r'或|或者|\bor\b',body,re.I):continue
        if any(includes(record['actionSource'],source(text,a,b)) for record in prohibitions.get('records',[])):continue
        for match in FILE_PATTERN.finditer(body):
            fs=source(text,match_read.start('body')+match.start(),match_read.start('body')+match.end())
            if not any(item['name']==match.group() and item['source']['start']==fs['start'] for item in inputs):
                inputs.append({'name':match.group(),'source':fs,'relationId':None,'guardSources':[]})
    facts.extend(completions)
    # Explicit callable predicates already have checked guard/anaphora binding.
    # Preserve that relation and project it, rather than reparse its action tail.
    callable_relations=[]
    for rule in guards.get('rules',[]):
        if rule['modality'] in ['FORBID','NOT_REQUIRED']:continue
        for value in legacy['fields']['A']:
            if value['sources']==[rule['source']] and rule['predicate']['target'] in value['text']['zh-CN']:
                fact('A','guarded_invocation',value['text']['zh-CN'],value['text']['en'],value['sources'],rule['id'])
        callable_relations.append(rule)
    # A return status explicitly named as completion evidence is an output
    # assertion; a generated/mailed success record is NOT invented from it.
    for value in legacy['fields']['O']:
        if '返回' in value['text']['zh-CN'] and '成功' in value['text']['zh-CN']:
            fact('O','return_assertion',value['text']['zh-CN'],value['text']['en'],value['sources'])
    fields={k:[] for k in 'IOAPRVCB'};seen={k:set() for k in fields}
    for f in facts:
        key=(f.value_zh,tuple((s.start,s.end) for s in f.sources))
        if key in seen[f.field]:continue
        seen[f.field].add(key)
        fields[f.field].append({'text':{'zh-CN':f.value_zh,'en':f.value_en},'sources':[public(s) for s in f.sources],
                                'kind':f.kind,'relationId':f.relation_id or None})
    # Deduplicate identical source assertions from complementary adapters.
    for k in fields:
        fields[k]=list({x['text']['zh-CN']:x for x in fields[k]}.values())
    contract={'schema':'boundx-semantic-contract/v1','actions':[public(a) for a in actions],
              'callableRelations':callable_relations,'facts':[public(f) for f in facts],
              'uncovered':uncovered,'domainClassifications':domain_classifications,
              'completeInterpretation':False,'decision':None}
    findings=[]
    messages={
        'context_kept_as_unresolved_guard':('请明确这段前缀的作用','已保留后面的动作，但这段前缀尚未确定是执行者、条件还是其他限定。若它表示执行者，可写为“由……执行”；若是条件，请写明“当……时”。',
                                            'Clarify the role of this prefix','The following action is retained, but this prefix is not yet bound as an actor, condition or qualifier. State an executor with “by …”, or introduce a condition with “when …”.'),
        'role_or_scope_not_resolved':('动作的条件或对象尚未绑定','这段动作包含尚未解析的条件或对象关系。请分别写出核心动作、操作对象与生效条件，保留原有禁止项。',
                                       'Action scope needs clarification','This action contains an unresolved condition or argument. Identify its action, target and condition separately, retaining the existing prohibitions.'),
        'coordinated_argument_unresolved':('并列动作的对象尚未绑定','请分别写出每个并列动作操作哪个对象；当前没有把残缺的并列短语当成任务对象。',
                                           'Coordinated action arguments are unresolved','State which object belongs to each coordinated action. An incomplete coordination has not been treated as a target.'),
        'payload_reference_unresolved':('发送内容尚未绑定','识别到接收位置，但没有绑定要发送的内容。请明确写出向该位置发送哪个产物。',
                                        'Payload reference is unresolved','A destination was identified without a payload. State which artifact is sent there.'),
        'completion_antecedent_unresolved':('完成条件的回指尚未绑定','原文以“该任务/该阶段”回指前面的完成要求。请明确列出需要同时满足的完成断言；当前没有把这个回指词当成已计算的停止条件。',
                                            'Completion reference is unresolved','The completion statement refers back to the task or stage. Identify the assertions that must hold together; the reference itself is not a calculated stopping condition.'),
        'alternative_file_role':('请明确文件是备选还是全部需要','原文的文件由“或/or”连接。请说明是任选一个、按条件选择，还是全部需要；当前未把它们展开为多个必需输入或必交产物。',
                                 'Clarify alternative versus joint file requirements','The files are connected by an alternative. Specify one-of, condition-based selection, or all-of; they have not been expanded into separate required inputs or promised outputs.'),
        'artifact_name_binding_unresolved':('请区分产出文件与引用文件','这条产物描述包含文件名及其他修饰，尚未确定每个文件名的角色。建议明确写出“读取哪个文件、生成哪个文件”，保留已有条件。',
                                           'Separate produced files from referenced files','The artifact description contains file names and additional modifiers. Specify which file is read and which is produced, retaining the stated conditions.'),
        'domain_frame_ambiguous':('领域动作含义不唯一','同一触发词对应多个软件工程或 AI 动作框架。请补充被评审、处理或操作的对象类型；当前保留全部候选，不按词条顺序选择。',
                                  'Domain action is ambiguous','The trigger maps to multiple software or AI action frames. State the object type or more specific action; all candidates remain unresolved.'),
        'domain_required_role_missing':('领域动作缺少必要对象','已识别领域动作，但没有从原文绑定其必要论元。请明确动作直接作用于哪个仓库、文件、任务、数据、模型或服务。',
                                        'Domain action is missing a required role','A domain action was recognized without its required source argument. State the repository, file, task, data, model or service it directly operates on.')}
    for u in uncovered:
        if u['reason'] not in messages:continue
        title,zh,en_title,en=messages[u['reason']]
        findings.append({'code':u['reason'],'severity':'attention','title':{'zh-CN':title,'en':en_title},
                         'scenario':{'zh-CN':u['source']['quote'],'en':u['source']['quote']},'sources':[u['source']],
                         'suggestion':{'zh-CN':zh,'en':en},'decision':None})
    return {'fields':fields,'fileInputs':inputs,'fileOutputs':outputs,'conditionalFileOutputs':conditional,
            'externalInputs':legacy['externalInputs'],'contract':contract,'findings':findings}
