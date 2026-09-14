"""Independent prohibitions, explicit lists and finite membership branches.

Recognition of a stated prohibition does not depend on a callable ID. Its source
qualifiers remain intact; neither recognition nor set subtraction grants access.
"""
import json
import re
from pathlib import Path

PATTERNS=json.loads(Path(__file__).with_name('boundary_patterns.json').read_text(encoding='utf-8'))
IDENT=r'`?(?P<name>[A-Za-z][A-Za-z0-9_./-]*)`?'

def pattern(key):return re.compile(PATTERNS[key],re.I)

def contains(outer,inner):return outer['start']<=inner['start'] and inner['end']<=outer['end']

def prohibited_span(src,prohibitions):
    return any(contains(r['actionSource'],src) for r in prohibitions.get('records',[]))

def prohibitions(text,spans,numbers,source):
    records=[]
    for i,(a,b) in enumerate(spans):
        clause=text[a:b]
        for m in pattern('prohibition').finditer(clause):
            if pattern('negated_prohibition').search(clause[:m.start()]):continue
            marker=source(text,a+m.start(),a+m.end())
            # "不得超过 40 次" is a resource bound, not a forbidden action.
            if any(n['kind']=='bound' and contains(n['expressionSource'],marker) for n in numbers):continue
            start=a;guard=None
            if i:
                pa,pb=spans[i-1]
                if re.fullmatch(r'\s*[,，]\s*',text[pb:a]) and pattern('guard_prefix').search(text[pa:pb]):
                    start=pa;guard=source(text,pa,pb)
            if not guard and pattern('guard_prefix').search(clause[:m.start()]):guard=source(text,a,a+m.start())
            tail=clause[m.end():]
            unless=re.search(r'\bunless\s+approved\s+by\s+(?P<actor>[A-Za-z][A-Za-z0-9_ ]{1,60})\s*$',tail,re.I)
            if unless:guard=source(text,a+m.end()+unless.start(),a+m.end()+unless.end())
            exception=None
            if i+1<len(spans):
                na,nb=spans[i+1];next_clause=text[na:nb]
                if re.match(r'(?:但)?对于.+不在此限|(?:but\s+)?(?:except|excluding)\b',next_clause,re.I):
                    exception=source(text,na,nb)
            src=source(text,start,b)
            approval=pattern('approval_actor').search(guard['quote']) if guard else None
            approval_name=(approval['zh'] or approval['en']).strip() if approval else (unless['actor'].strip() if unless else None)
            records.append({'kind':'prohibition','modality':'FORBID','source':src,
                'actionSource':source(text,a+m.end(),b),'markerSource':marker,'guardSource':guard,
                'exceptionSource':exception,'approvalActor':approval_name,
                'predicate':None,'status':'stated_boundary','decision':None})
    return {'schema':'boundx-prohibitions/v1','records':records,'decision':None}

def list_items(text,start,source):
    """Consume a complete explicit list, never arbitrary identifier mentions."""
    opening=re.match(r'\s*\[\s*',text[start:]);pos=start+(opening.end() if opening else 0)
    items=[]
    while len(items)<200:
        m=re.match(r'\s*'+IDENT,text[pos:])
        if not m:return None
        items.append({'name':m['name'],'source':source(text,pos+m.start('name'),pos+m.end('name'))})
        pos+=m.end();join=pattern('list_join').match(text,pos)
        if not join:break
        if not re.match(r'\s*'+IDENT,text[join.end():]):break
        pos=join.end()
    tail=re.match(r'\s*\]',text[pos:]) if opening else None
    if opening and not tail:return None
    end=pos+tail.end() if tail else pos
    # A relative clause or "or" after the list makes it unsuitable as an
    # unconditional inventory declaration. Do not silently drop that suffix.
    if not re.match(r'\s*(?:[；;。.!?！？\n，,]|$)',text[end:]):return None
    return {'items':items,'end':end}

def explicit_lists(text,spans,source):
    records=[]
    for role,key in [('target','list_target'),('forbidden','list_forbidden')]:
        for m in pattern(key).finditer(text):
            a,b=next(((a,b) for a,b in spans if a<=m.start()<b),(m.start(),m.end()))
            prefix=text[a:m.start()]
            if re.search(r'若|如果|未经|除非|不是|并非|\b(?:if|unless|not)\b',prefix,re.I):continue
            parsed=list_items(text,m.end(),source)
            if parsed:
                records.append({'role':role,'values':sorted({x['name'] for x in parsed['items']}),
                    'items':parsed['items'],'source':source(text,m.start(),parsed['end']),'decision':None})
    return records

def membership_branches(text,spans,source):
    records=[]
    for m in pattern('membership').finditer(text):
        parsed=list_items(text,m.end()-1,source)
        if not parsed:continue
        a,b=next(((a,b) for a,b in spans if a<=m.start()<b),(m.start(),parsed['end']))
        following=[(x,y) for x,y in spans if x>=b]
        actions=[];otherwise=None
        for x,y in following:
            q=text[x:y]
            if pattern('otherwise').search(q):otherwise=source(text,x,y);break
            if re.search(r'若|如果|\bif\b',q,re.I):break
            if not actions and pattern('then').search(q):actions.append(source(text,x,y));continue
            gap=text[actions[-1]['end']:x] if actions else ''
            if actions and re.match(r'^(?:并|且|and\b)',q,re.I) and not re.search(r'[；;。.!?！？\n]',gap):
                actions.append(source(text,x,y));continue
            # An else can follow the consequence directly, but a separate
            # operation/resource clause ends this bounded branch scope.
            break
        if not actions:continue
        records.append({'condition':source(text,m.start(),parsed['end']),
            'subject':m['subject'].strip(),'label':m['label'].strip(),'members':sorted({i['name'] for i in parsed['items']}),
            'items':parsed['items'],'then':actions,'otherwise':otherwise,
            'operator':'membership','universe':None,'terminationProven':False,
            'coveredOutcomes':[True,False] if otherwise else [True],'possibleOutcomes':[True,False],'decision':None})
    return records
