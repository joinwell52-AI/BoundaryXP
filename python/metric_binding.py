"""Bounded, inspectable binding of adjacent amount descriptions.

This is a source-mapping assumption, not an SMT proof of language equivalence.
Exact metric identities remain distinct unless the local evidence matches the
same action, transaction granularity and non-generic topic anchor.
"""
import json
import re
from pathlib import Path

P=json.loads(Path(__file__).with_name('boundary_patterns.json').read_text(encoding='utf-8'))
GRAMMAR=json.loads(Path(__file__).with_name('metric_patterns.json').read_text(encoding='utf-8'))

def clean_metric(value):
    value=re.sub(GRAMMAR['leading_connector'],'',value.strip(),flags=re.I)
    while re.search(GRAMMAR['tail'],value,re.I):value=re.sub(GRAMMAR['tail'],'',value,flags=re.I).strip()
    return value

def local_link(text,previous,current):
    if re.search(GRAMMAR['scope_change'],previous['metric']+' '+current['metric'],re.I):return False
    if previous['source']==current['source']:return True
    raw=text.encode('utf-16-le')
    gap=raw[previous['source']['end']*2:current['source']['start']*2].decode('utf-16-le')
    return bool(re.fullmatch(GRAMMAR['gap'],gap,re.I))

def repeated_head(previous,current):
    left,right=clean_metric(previous.get('metricCore',previous['metric'])),clean_metric(current.get('metricCore',current['metric']))
    if not left or not right:return None
    if left.casefold()==right.casefold():return left,'repeated_metric'
    # Only a shorter *following* noun phrase can inherit an earlier owner.
    # Two different qualified names, even with the same suffix, stay distinct.
    if not left.casefold().endswith(right.casefold()):return None
    if right.isascii():
        if not left[:-len(right)].endswith(' ') or len(right.split())<2:return None
    elif len(right)<4 and not (len(right)>=2 and re.match(GRAMMAR['short_ref_connector'],current['metric'],re.I)):
        return None
    return left,'abbreviated_metric_reference'

def signature(n):
    raw=re.sub(r'^(?:but|and)\s+','',n['metric'],flags=re.I);actions=list(re.finditer('|'.join(map(re.escape,P['amount_actions'])),raw,re.I))
    granularity=re.search(P['granularity'],raw,re.I)
    if n['kind']!='bound' or n['unit'] not in ['CNY','USD'] or len(actions)!=1 or not granularity:return None
    action=actions[0];topic=raw[:action.start()]
    topic=re.sub(P['granularity'],'',topic,flags=re.I).strip()
    # English normally places "per transaction" after the head measure.
    topic=re.sub(r'\b(?:amount|upper limit|lower limit|the|must|strictly)\b','',topic,flags=re.I).strip()
    return {'action':action.group().lower(),'grain':granularity.group().lower(),'topic':topic,
            'amount':bool(re.search(P['amount_measure'],raw,re.I)),
            'limit':bool(re.search(P['limit_label'],raw,re.I))}

def common_anchor(a,b):
    if re.search('[\u4e00-\u9fff]',a+b):
        # Require an identical leading topic, never fuzzy similarity or arbitrary
        # shared characters (e.g. different fee names ending in 费).
        prefix=''
        for x,y in zip(a,b):
            if x!=y:break
            prefix+=x
        return prefix if len(prefix)>=2 else None
    left=a.lower().split();right=b.lower().split()
    return a if left and left==right else None

def bindings(text,numbers):
    result=[]
    for i,n in enumerate(numbers):
        n['metricKey']='metric:'+str(i)
        n['metricDisplay']=clean_metric(n.get('metricCore',n['metric']))
        if i and n['kind']=='bound' and n.get('dimension'):
            previous=numbers[i-1]
            if previous['kind']=='bound' and n['unit']==previous['unit'] and local_link(text,previous,n):
                shared=repeated_head(previous,n)
                if shared:
                    name,method=shared
                    item={'method':method,'metric':name,'sources':[previous['source'],n['source']],
                          'status':'source_binding_assumption' if method=='abbreviated_metric_reference' else 'explicit_repeated_name',
                          'equivalenceProven':False}
                    n['metricKey']=previous['metricKey']
                    n['boundMetric']=previous['boundMetric']=previous.get('boundMetric',name)
                    result.append(item);n['metricBinding']=previous['metricBinding']=item
                    continue
                # Per-call Token budgets often spell the lower bound as
                # "context Token consumption" and the gateway upper bound as
                # "model-call Token limit". Bind only adjacent clauses where
                # both explicitly say Token and single-call; retain the
                # equivalence as an inspectable source assumption.
                if n['unit']=='tokens' and all(re.search(r'(?i)Token',x['metric']) and re.search(r'单次|per[- ]call|single call',x['metric'],re.I) for x in [previous,n]):
                    name='单次模型调用 Token 数量'
                    item={'method':'per_call_token_signature','metric':name,
                          'sources':[previous['source'],n['source']],
                          'status':'source_binding_assumption','equivalenceProven':False}
                    n['metricKey']=previous['metricKey']
                    n['boundMetric']=previous['boundMetric']=name
                    result.append(item);n['metricBinding']=previous['metricBinding']=item
                    continue
        s=signature(n)
        if not s or i==0:continue
        previous=numbers[i-1];p=signature(previous)
        if not p or n['unit']!=previous['unit'] or (s['action'],s['grain'])!=(p['action'],p['grain']):continue
        if not ((s['limit'] and p['amount']) or (p['limit'] and s['amount'])):continue
        anchor=common_anchor(p['topic'],s['topic'])
        if not anchor:continue
        # Only neighboring constraints with optional cited-basis parenthetical
        # clauses, in one sentence. Never merge stages, else branches or actors.
        if not local_link(text,previous,n):continue
        name=anchor+s['action']+('金额' if re.search('[\u4e00-\u9fff]',anchor) else ' amount')
        key='local_amount:'+str(previous['source']['start'])
        n['metricKey']=previous['metricKey']=key
        n['boundMetric']=previous['boundMetric']=name
        item={'method':'adjacent_amount_signature','metric':name,'action':s['action'],'granularity':s['grain'],
            'topicAnchor':anchor,'sources':[previous['source'],n['source']],
            'status':'source_binding_assumption','equivalenceProven':False}
        result.append(item);n['metricBinding']=previous['metricBinding']=item
    return result

def comparisons(text,numbers):
    """Keep a contrast-linked possible identity separate from actual bindings.

    A shared noun head and an explicit contrast justify asking whether these
    metrics are related. They never establish that relationship themselves.
    """
    candidates=[];raw=text.encode('utf-16-le')
    for left,right in zip(numbers,numbers[1:]):
        if left['kind']!='bound' or right['kind']!='bound' or not left.get('dimension'):continue
        if left['unit']!=right['unit'] or left['metricKey']==right['metricKey']:continue
        if not local_link(text,left,right):continue
        gap=raw[left['source']['end']*2:right['source']['start']*2].decode('utf-16-le')
        if not re.search(r'但|\bbut\b',gap+' '+right['metric'],re.I):continue
        a,b=left['metricDisplay'],right['metricDisplay']
        chinese=bool(re.search('[\u4e00-\u9fff]',a+b))
        av,bv=(list(a),list(b)) if chinese else (a.casefold().split(),b.casefold().split())
        tail=[]
        for x,y in zip(reversed(av),reversed(bv)):
            if x!=y:break
            tail.insert(0,x)
        if len(tail)<2:continue
        candidates.append({'left':left,'right':right,'sharedHead':('' if chinese else ' ').join(tail)})
    return candidates
