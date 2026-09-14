"""Source-linked partial constraint analysis. No model, no permission decisions.

Lexical patterns are versioned data. Numeric interval algebra, boundary probes,
approval truth tables and candidate branch topology are computed, not templates.
No claim that a partial parse constitutes a complete semantic interpretation.
"""
import json
import re
from decimal import Decimal
from itertools import product
from pathlib import Path
import importlib.util

import networkx as nx
import portion as P
import z3

RULES=json.loads(Path(__file__).with_name('source_patterns.json').read_text(encoding='utf-8'))
_spec=importlib.util.spec_from_file_location('boundx_structural_checks',Path(__file__).with_name('structural_checks.py'))
_struct=importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_struct)
_guard_spec=importlib.util.spec_from_file_location('boundx_guard_constraints',Path(__file__).with_name('guard_constraints.py'))
_guards=importlib.util.module_from_spec(_guard_spec)
_guard_spec.loader.exec_module(_guards)
_projection_spec=importlib.util.spec_from_file_location('boundx_task_projection',Path(__file__).with_name('task_projection.py'))
_projection=importlib.util.module_from_spec(_projection_spec)
_projection_spec.loader.exec_module(_projection)
_boundary_spec=importlib.util.spec_from_file_location('boundx_source_boundaries',Path(__file__).with_name('source_boundaries.py'))
_boundaries=importlib.util.module_from_spec(_boundary_spec)
_boundary_spec.loader.exec_module(_boundaries)
_metric_spec=importlib.util.spec_from_file_location('boundx_metric_binding',Path(__file__).with_name('metric_binding.py'))
_metrics=importlib.util.module_from_spec(_metric_spec)
_metric_spec.loader.exec_module(_metrics)
_actuation_spec=importlib.util.spec_from_file_location('boundx_actuation_constraints',Path(__file__).with_name('actuation_constraints.py'))
_actuation=importlib.util.module_from_spec(_actuation_spec)
_actuation_spec.loader.exec_module(_actuation)
_effect_spec=importlib.util.spec_from_file_location('boundx_effect_constraints',Path(__file__).with_name('effect_constraints.py'))
_effects=importlib.util.module_from_spec(_effect_spec)
_effect_spec.loader.exec_module(_effects)
_quantity_spec=importlib.util.spec_from_file_location('boundx_quantity_literals',Path(__file__).with_name('quantity_literals.py'))
_quantity=importlib.util.module_from_spec(_quantity_spec)
_quantity_spec.loader.exec_module(_quantity)
_unit_spec=importlib.util.spec_from_file_location('boundx_quantity_units',Path(__file__).with_name('quantity_units.py'))
_units=importlib.util.module_from_spec(_unit_spec)
_unit_spec.loader.exec_module(_units)
def rx(name):return RULES['markers'][name]
def found(pattern,text):return re.search(pattern,text,re.I)
def source(text,a,b):
    return {'quote':text[a:b],'start':len(text[:a].encode('utf-16-le'))//2,'end':len(text[:b].encode('utf-16-le'))//2}
def pair(zh,en):return {'zh-CN':zh,'en':en}
def note(code,src,zh,en):return {'code':code,'sources':[src],'suggestion':pair(zh,en),'decision':None}
def interval(op,n):
    return {'lt':lambda:P.open(-P.inf,n),'le':lambda:P.openclosed(-P.inf,n),
            'gt':lambda:P.open(n,P.inf),'ge':lambda:P.closedopen(n,P.inf),'eq':lambda:P.closed(n,n)}[op]()
def decimal_text(n):return format(n.normalize(),'f')
def pieces(text):
    # Commas inside 10,000 are not clause boundaries. Periods inside 0.1 / v2.4.1 stay intact.
    return list(re.finditer(r'[^，；;。!?！？\n]+(?:,(?=\d{3}\b)[^，；;。!?！？\n]*)?',text))
def clauses(text):
    starts=[0]
    protected=[m.span() for m in re.finditer(r'`[^`\n]*`|\[[^\]\n]*\]',text)]
    for m in re.finditer(r'[，；;。!?！？\n]|,(?!\d{3}(?:\D|$))|\.(?=\s+[A-Z]|$)',text):
        if not any(a<=m.start()<b for a,b in protected):starts.extend([m.start(),m.end()])
    starts.append(len(text));out=[]
    for a,b in zip(starts[::2],starts[1::2]):
        raw=text[a:b];left=len(raw)-len(raw.lstrip());right=len(raw.rstrip())
        if right>left:out.append((a+left,a+right))
    return out

def numeric_constraints(text,spans,diagnostics=None):
    relations={**RULES['relations'],**RULES['extraRelations'],'最长':'le','上限为':'le','限制在':'le','capped at':'le'}
    names=sorted(relations,key=len,reverse=True)
    units=_units.UNIT_PATTERN+'|立方米'
    number_end=r'(?=(?:\s*(?:'+units+r'))|(?![零〇一二两三四五六七八九十百千万亿点\d]|[.,]\d))'
    quantity=rf'(?P<number>{_quantity.TOKEN})'+number_end+r'\s*(?:个(?=小时|分钟))?(?P<unit>'+units+r')'
    prefixes=_units.alternatives(_units.DATA['prefix_currencies'],unit_boundary=False)
    rates=_units.alternatives(_units.PREFIX_RATES,unit_boundary=False)
    expr=re.compile(r'(?P<neg>禁止|严禁|不允许|prohibited to be|forbidden to be)?\s*(?P<op>'+ '|'.join(map(re.escape,names))+r')\s*(?P<currency>'+prefixes+r')?\s*(?P<rate>'+rates+r')?\s*'+quantity+r'?',re.I)
    postfix=re.compile(r'(?P<neg>)(?P<op>)(?P<currency>)(?P<rate>)'+quantity+r'\s*(?:以内|内|以下)',re.I)
    matches=list(expr.finditer(text))
    matches+= [m for m in postfix.finditer(text) if not any(p.start()<=m.start()<p.end() for p in matches)]
    matches.sort(key=lambda m:m.start());out=[]
    for m in matches:
        if len(out)>=80:raise ValueError('Numeric constraint count limit')
        if len(m['number'])>40:continue
        a,b=next(((a,b) for a,b in spans if a<=m.start()<b),(m.start(),m.end()))
        prefix=text[a:m.start()];op=relations[m['op'].lower()] if m['op'] else 'le'
        # "not less than" must not silently become "less than".
        if re.search(r'(?:not|不是|并非)\s*$',prefix,re.I):continue
        try:raw=_quantity.decimal_literal(m['number'])
        except ValueError:
            if diagnostics is not None:diagnostics.append(note('numeric_literal_unresolved',source(text,m.start(),m.end()),
                f'数值“{m["number"]}”未能唯一归约。请写出完整位值或阿拉伯数字；本项未送入数值求解。',
                f'The numeral “{m["number"]}” could not be resolved. Specify all places or use Arabic digits; this value was not sent to the solver.'))
            continue
        unit,factor=_units.resolve(m['unit'] or '');metric_core=None
        unit_sources=[source(text,*m.span('unit'))] if m['unit'] else []
        unit_origin='suffix' if m['unit'] else 'unresolved'
        if m['rate']:
            rate=_units.PREFIX_RATES[m['rate']]
            if m['unit']!=rate['suffix']:
                if diagnostics is not None:diagnostics.append(note('rate_unit_unresolved',source(text,a,b),
                    '每时间单位的频次或流量缺少匹配的分子单位。请明确写出完整单位；本项未送入区间计算。',
                    'The rate prefix has no matching numerator unit. Specify the complete rate unit; this value was not sent to interval calculation.'))
                continue
            unit,factor=rate['unit'],rate['factor'];unit_origin='prefix_rate'
            unit_sources.insert(0,source(text,*m.span('rate')))
        if m['currency']:
            currency,_=_units.resolve(m['currency'])
            if unit not in [currency,'unspecified']:
                if diagnostics is not None:diagnostics.append(note('currency_unit_conflict',source(text,m.start(),m.end()),
                    '该数值前后的币种或单位不一致。请核对原文；本项未进行换算或送入区间求解。',
                    'The currency prefix conflicts with the trailing unit. Clarify the original units; this value was not converted or sent to interval solving.'))
                continue
            unit,factor=currency,'1';unit_origin='currency_prefix'
            unit_sources.insert(0,source(text,*m.span('currency')))
        if not m['unit'] and not m['currency'] and not m['rate']:
            declared=_units.metric_unit(prefix)
            if declared:
                token,(x,y)=declared;unit,factor=_units.resolve(token)
                unit_sources=[source(text,a+x,a+y)];unit_origin='explicit_metric_unit'
                metric_core=re.sub(r'\(\s*\)|（\s*）','',prefix[:x]+prefix[y:])
        if m['neg']:
            inverse={'gt':'le','ge':'lt','lt':'ge','le':'gt'}
            if op not in inverse:continue
            op=inverse[op]
        if unit in ['dollar_unspecified','degree_unspecified'] and diagnostics is not None:
            diagnostics.append(note('unit_reference_unresolved',source(text,m.start(),m.end()),
                f'已保留数值 {decimal_text(raw)} 与原文单位“{m["unit"]}”。请明确币种、温标或角度单位；当前没有把它换算为 USD 或摄氏度。',
                f'Value {decimal_text(raw)} and source unit “{m["unit"]}” are retained. Specify the currency, temperature scale or angular unit; no conversion to USD or Celsius was inferred.'))
        if m['op']=='在' and (unit!='seconds' or not re.match(r'\s*(?:以内|内)',text[m.end():])):continue
        if unit=='unspecified' and diagnostics is not None:
            diagnostics.append(note('numeric_unit_unresolved',source(text,a,b),
                f'数值 {decimal_text(raw)} 的单位尚未确定。请补充完整单位；若它是无量纲指标，请明确指标定义。当前仅保留数值子条件，未与其他上下界合并。',
                f'The unit for {decimal_text(raw)} is unresolved. Specify a complete unit, or define the dimensionless metric. Only the numeric predicate is retained; it is not combined with other bounds.'))
        n=raw*Decimal(str(factor));j=interval(op,n);opposite=P.open(-P.inf,P.inf)-j
        signs={'lt':'<','le':'≤','gt':'>','ge':'≥','eq':'='};negated={'lt':'≥','le':'>','gt':'≤','ge':'<','eq':'≠'}
        temporal=found(rx('until'),prefix)
        conditional=found(rx('condition')+r'|除非|\bunless\b|(?:^当|\bwhen\b)',prefix)
        forbidden=bool(found(r'严禁|禁止|不允许|\bforbid(?:den)?\b|\bprohibit(?:ed)?\b',prefix))
        selector=bool(re.search(r'(?:中|among\b)[^，,。；;]{0,40}(?:复杂度|complexity)',prefix,re.I))
        kind='prohibition_filter' if forbidden else 'selector' if selector else 'condition' if conditional else 'goal' if temporal or m['op'].lower() in ['reaches','passes','达到'] else 'bound'
        global_limit=bool(found(rx('global_duration'),prefix)) and unit=='seconds'
        metric=re.sub('^(?:'+rx('condition')+r')\s*','',prefix,flags=re.I).strip(' ，,:：`')
        previous=next((v for v in reversed(out) if v['source']==source(text,a,b)),None)
        if previous:
            start16=previous['expressionSource']['end']
            gap=text.encode('utf-16-le')[start16*2:len(text[:m.start()].encode('utf-16-le'))].decode('utf-16-le')
            if re.fullmatch(r'\s*(?:且|并且|and)\s*(?:严格|strictly)?\s*',gap,re.I):metric=previous['metric']
        symbol=z3.Int('value') if unit=='count' else z3.Real('value');limit=z3.RealVal(str(n))
        pred={'lt':symbol<limit,'le':symbol<=limit,'gt':symbol>limit,'ge':symbol>=limit,'eq':symbol==limit}[op]
        step=Decimal(1) if unit=='count' else Decimal('0.01');probes=[]
        for sample in [n-step,n,n+step]:
            solver=z3.Solver();solver.set(timeout=250);solver.add(symbol==z3.RealVal(str(sample)),pred);state=solver.check()
            probes.append({'value':decimal_text(sample),'matches':True if state==z3.sat else False if state==z3.unsat else None,'solver':str(state)})
        out.append({'kind':kind,'metric':metric,'metricCore':metric_core or metric,'relation':op,'value':decimal_text(n),'originalValue':m['number'],
                    'unit':unit,'unitLabels':_units.labels(unit),'dimension':_units.dimension(unit),
                    'unitSources':unit_sources,'unitOrigin':unit_origin,'conversionFactor':str(factor),
                    'polarity':'forbidden_filter' if forbidden else 'candidate','domain':'integer' if unit=='count' else 'real','originalUnit':m['unit'] or '', 'global':global_limit,'source':source(text,a,b),
                    'expressionSource':source(text,m.start(),m.end()),'interval':str(j),'complement':str(opposite),
                    'displayInterval':'x '+signs[op]+' '+decimal_text(n)+' '+unit,'displayComplement':'x '+negated[op]+' '+decimal_text(n)+' '+unit,
                    'boundaryProbe':probes[1],'probes':probes,'probeStep':str(step),'probeNote':'Example inputs, not new task constraints.',
                    'summary':pair(f'“{metric or "本句指标"}”：{m.group().strip()}。阈值本身'+('满足此数值条件。' if probes[1]['matches'] is True else '不满足此数值条件。' if probes[1]['matches'] is False else '求解未完成。')+(' 这是禁项内的数值筛选条件，不是允许的下限。' if forbidden else ''),
                                   f'{metric or "Clause metric"}: {m.group().strip()}. The threshold itself '+('satisfies this numeric predicate.' if probes[1]['matches'] is True else 'does not satisfy this numeric predicate.' if probes[1]['matches'] is False else 'has not been resolved.')+(' This is a prohibition filter, not a permitted lower bound.' if forbidden else ''))})
    return out

def approvals(text,spans):
    result=[]
    patterns=[
      r'(?P<a>[A-Za-z][A-Za-z0-9_ ]*?)(?P<join>\s*(?:或|和|与|\bor\b|\band\b)\s*)(?P<b>[A-Za-z][A-Za-z0-9_ ]*?)(?:\s*的)?\s*(?:Token\s*|双重签名)?(?:授权|批准|确认|共同签名|approval|authorization)',
      r'未经(?P<a>[\u4e00-\u9fffA-Za-z0-9_ ]{2,30}?)(?P<join>\s*(?:或|和|与)\s*)(?P<b>[\u4e00-\u9fffA-Za-z0-9_ ]{2,30}?)(?:双人)?(?:线上)?(?:审批|签署放行认证|签字|授权)'
    ]
    matches=sorted((m for pattern in patterns for m in re.finditer(pattern,text,re.I)),key=lambda m:m.start())
    occupied=[]
    for m in matches:
        if any(a<=m.start()<b for a,b in occupied):continue
        occupied.append(m.span())
        a,b=next(((a,b) for a,b in spans if a<=m.start()<b),(m.start(),m.end()))
        operator='OR' if found(r'或|\bor\b',m['join']) else 'AND'
        symbols=[z3.Bool('authority_'+str(i)) for i in range(2)]
        predicate={'OR':z3.Or,'AND':z3.And}[operator](*symbols)
        truth=[]
        for vals in product([False,True],repeat=2):
            s=z3.Solver();s.set(timeout=250);s.add(*[x==v for x,v in zip(symbols,vals)],predicate);status=s.check()
            truth.append({'values':list(vals),'satisfies':True if status==z3.sat else False if status==z3.unsat else None})
        result.append({'operator':operator,'authorities':[m['a'].strip(),m['b'].strip()],'quorum':1 if operator=='OR' else 2,'source':source(text,a,b),'truthTable':truth,
                       'granted':None,'polarity':'candidate; outer negation not resolved','summary':pair(f'原句中的授权组合：{m["a"]} {"或" if operator=="OR" else "且"} {m["b"]}；四种组合已计算，外层否定与授权是否已取得不能据此确定。',
                       f'Approval expression: {m["a"]} {operator} {m["b"]}; four combinations checked. Outer negation and granted approval remain unresolved.')})
    return result

def branch_graph(text,spans,numbers):
    graph=nx.DiGraph();branches=[]
    for i,(a,b) in enumerate(spans):
        s=text[a:b];marker=found(rx('condition'),s)
        if not marker:continue
        condition=source(text,a,b);then=None;otherwise=None
        embedded=found(rx('then'),s[marker.end():])
        if embedded:
            split=a+marker.end()+embedded.start();condition=source(text,a,split);then=source(text,split+len(embedded.group()),b)
        elif i+1<len(spans) and not found(rx('condition')+'|'+rx('otherwise'),text[spans[i+1][0]:spans[i+1][1]]):
            x,y=spans[i+1];then=source(text,x,y)
        # Only an explicit otherwise attached before the next if is linked.
        for offset,(x,y) in enumerate(spans[i+1:],i+1):
            part=text[x:y]
            if found(rx('condition'),part):break
            if found(rx('otherwise'),part):
                if re.fullmatch(rx('otherwise'),part,re.I) and offset+1<len(spans):y=spans[offset+1][1]
                otherwise=source(text,x,y);break
        id='condition-'+str(len(branches)+1);graph.add_node(id)
        if then:graph.add_edge(id,id+'-true',guard=True)
        if otherwise:graph.add_edge(id,id+'-otherwise',guard=False)
        n=next((n for n in numbers if n['kind']=='condition' and n['expressionSource']['start']>=condition['start'] and n['expressionSource']['end']<=condition['end']),None)
        branches.append({'id':id,'condition':condition,'then':then,'otherwise':otherwise,
                         'trueInterval':n['interval'] if n else None,'falseInterval':n['complement'] if n else None,
                         'displayTrue':n['displayInterval'] if n else None,'displayFalse':n['displayComplement'] if n else None,
                         'numericProjectionOnly':True,'scope':'candidate; continuation beyond adjacent clause unresolved'})
    temporal=[]
    for a,b in spans:
        q=text[a:b]
        m=re.search(r'(?P<event>[^，；;。]{1,40}?)(?:完成后|通过后)(?P<action>.+)',q)
        if m and m['event'].strip() not in ['在','全部']:
            temporal.append({'source':source(text,a,b),'before':m['event']+('通过' if '通过后' in m.group() else '完成'),
                             'after':m['action'],'relation':'before','candidate':True})
            graph.add_edge('event:'+temporal[-1]['before'],'action:'+m['action'],guard='after')
    return {'branches':branches,'temporal':temporal,'nodes':sorted(graph.nodes),'edges':[[u,v,graph.edges[u,v]['guard']] for u,v in graph.edges],
            'scc':[sorted(c) for c in nx.strongly_connected_components(graph)],'terminationProven':False}

def weekly_times(text,spans):
    weekdays={'一':0,'二':1,'三':2,'四':3,'五':4,'六':5,'日':6,'天':6,
              'monday':0,'tuesday':1,'wednesday':2,'thursday':3,'friday':4,'saturday':5,'sunday':6}
    day=r'(?:周[一二三四五六日天]|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)'
    pattern=rf'(?P<day>{day})\s*(?P<h>\d{{1,2}}):(?P<m>\d{{2}})(?:\s*[-–—]\s*(?P<eh>\d{{1,2}}):(?P<em>\d{{2}}))?'
    records=[]
    for m in re.finditer(pattern,text,re.I):
        d=weekdays[m['day'][-1] if m['day'].startswith('周') else m['day'].lower()]
        h,minute=int(m['h']),int(m['m'])
        if h>24 or minute>59 or (h==24 and minute):continue
        a,b=next(((a,b) for a,b in spans if a<=m.start()<b),(m.start(),m.end()))
        start=d*1440+h*60+minute;end=None
        if m['eh']:
            eh,em=int(m['eh']),int(m['em'])
            if eh>24 or em>59 or (eh==24 and em):continue
            end=d*1440+eh*60+em
        records.append({'source':source(text,a,b),'timeSource':source(text,m.start(),m.end()),'startMinute':start,'endMinute':end,
                        'kind':'window' if end is not None else 'deadline_candidate','actionScope':text[a:b]})
    comparisons=[]
    for left in records:
        for right in records:
            if left['kind']=='deadline_candidate' and right['kind']=='window':
                comparisons.append({'left':left['timeSource'],'right':right['timeSource'],
                    'gapMinutes':right['startMinute']-left['startMinute'],
                    'sameActionAsserted':False,'conflict':None,
                    'assumption':'Same relative week and timezone; calendar dates not resolved.'})
    return {'records':records,'comparisons':comparisons}

def analyze_source(text):
    if len(text)>100000:raise ValueError('Source length limit')
    spans=clauses(text)
    if len(spans)>200:raise ValueError('Source clause count limit')
    number_diagnostics=[]
    numbers=numeric_constraints(text,spans,number_diagnostics);auth=approvals(text,spans);flow=branch_graph(text,spans,numbers)
    metric_bindings=_metrics.bindings(text,numbers)
    bans=_boundaries.prohibitions(text,spans,numbers,source)
    lists=_boundaries.explicit_lists(text,spans,source)
    memberships=_boundaries.membership_branches(text,spans,source)
    if len(spans)>200 or len(numbers)>80 or len(auth)>20:raise ValueError('Source constraint count limit')
    fields={k:[] for k in 'IOAP RVCB'.replace(' ','')};facts=[];advice=list(number_diagnostics)
    for k,pattern in RULES['roles'].items():
        fields[k]=[source(text,a,b) for a,b in spans if found(pattern,text[a:b])]
    fields['B']=[r['source'] for r in bans['records']]
    fields['A']=[s for s in fields['A'] if not any(_boundaries.contains(r['source'],s) for r in bans['records'])]
    fields['R']=[n['source'] for n in numbers if n['kind']=='bound' and n['unit']=='seconds']
    for n in numbers:facts.append({'type':'numeric','source':n['source'],'summary':n['summary']})
    for item in auth:facts.append({'type':'approval','source':item['source'],'summary':item['summary']})
    for item in flow['temporal']:facts.append({'type':'temporal_order','source':item['source'],'summary':pair(
        '候选前后关系：'+item['before']+' → '+item['after']+'；不推断未写出的中间步骤。',
        'Candidate precedence: '+item['before']+' → '+item['after']+'; no unstated intermediate steps inferred.')})
    times=weekly_times(text,spans)
    for item in times['records']:
        fields['R'].append(item['source'])
        facts.append({'type':'time_scope','source':item['source'],'summary':pair(
            f'识别时间约束“{item["timeSource"]["quote"]}”，保留其独立动作原句；未自动与其他动作的时限求交。',
            f'Time constraint “{item["timeSource"]["quote"]}” remains bound to its own source clause; no intersection with other action scopes is inferred.')})
    for c in times['comparisons']:facts.append({'type':'time_order','source':c['left'],'summary':pair(
        f'假设同周、同一时区：两处时间锚点相差 {c["gapMinutes"]} 分钟。推送与执行等不同动作不能仅因时段不同就判冲突；日期和时区仍待确认。',
        f'Assuming the same week and timezone, the anchors differ by {c["gapMinutes"]} minutes. Distinct action scopes are not a time conflict; dates/timezone remain unresolved.')})
    if times['records']:advice.append(note('calendar_context',times['records'][0]['source'],
        '已保留原文的星期与时刻。请明确对应日期及使用哪个时区，再把相对周时间转换成执行时间；工具不根据区域名称推定时区。',
        'Weekdays and times are preserved. Specify calendar dates and timezone before scheduling; region names do not supply a timezone.'))
    output_after=[source(text,a,b) for a,b in spans if found(r'完成后|\bafter completion\b',text[a:b]) and found(RULES['roles']['O'],text[a:b])]
    exits=[source(text,a,b) for a,b in spans if found(r'撤回|中止|\bwithdraw\b|\babort\b',text[a:b])]
    if output_after and exits:
        f=note('outcome_output_scope',output_after[0],
            f'“{output_after[0]["quote"]}”规定了完成后的产物，另有“{exits[0]["quote"]}”退出路径。请确认退出时是否同样交付该产物；当前不把成功路径要求自动扩展到失败路径。',
            f'“{output_after[0]["quote"]}” defines an output after completion; “{exits[0]["quote"]}” is another exit. Clarify whether that output is also required on this exit; success obligations are not automatically extended to failure.')
        f['sources'].append(exits[0]);advice.append(f)
    for index,(a,b) in enumerate(spans):
        q=text[a:b];src=source(text,a,b)
        context=text[spans[max(0,index-1)][0]:b]
        if found(rx('scope_unknown'),q):advice.append(note('selector_unknown',src,
            f'“{q}”没有给出区分适用与不适用对象的谓词。请说明具体筛选条件；当前不能计算最终对象集合或数量。',
            f'“{q}” does not specify which objects qualify. Clarify the selector; the final set and count remain unknown.'))
        if found(rx('time_reference'),q):advice.append(note('temporal_reference',src,
            f'“{q}”的时间指代尚未唯一绑定。请明确起止事件，避免把测试期间与测试后视为同一作用域。',
            f'The time reference in “{q}” has no unique binding. Specify start and end events; test-time and post-test scopes are distinct.'))
        if found(rx('repeat'),q):
            bounded=any(n['global'] for n in numbers) or bool(found(rx('retry_limit'),text)) or any(
                n['source']==src and n['kind']=='bound' and n['unit']=='count' and n['relation'] in ['lt','le','eq'] for n in numbers)
            if not bounded:advice.append(note('retry_bound_unknown',src,
                f'“{q}”包含重复执行，但未绑定最大次数或总时限。请明确何时放弃或转人工；恢复目标不保证一定发生，也不能据此断言必然死循环。',
                f'“{q}” repeats work without a bound identified by this parser. Define a retry/time limit or escalation; a recovery goal does not guarantee termination or prove livelock.'))
        if found(rx('otherwise'),context) and found(r'授权|批准|approval|authorization',q):advice.append(note('approval_continuation',src,
            f'“{q}”规定了授权前提，但批准、拒绝或等待超时后的动作尚未明确绑定。请分别说明是否继续前一分支动作、停止还是转人工。',
            f'“{q}” states an approval prerequisite. Actions after approval, refusal or timeout are not explicitly bound; specify continuation, stop or escalation.'))
        if found(r'无论.{0,25}(?:审批|授权)|regardless of.{0,25}approval',context) and found(r'擅自|unauthori[sz]ed',q):advice.append(note('prohibition_exception',source(text,spans[max(0,index-1)][0],b),
            f'“{q}”同时出现无论审批结果与“擅自”。请确认是绝对禁止，还是存在另行授权的例外；工具不自动选择。',
            f'“{q}” combines regardless-of-approval with unauthorized action. Clarify an absolute prohibition versus a separately authorized exception.'))
    # Extract mentioned/excluded identifiers without inventing an asset universe.
    mentions=sorted(set(m.group().strip('`') for m in re.finditer(RULES['roles']['I'],text)))
    exclusions=[]
    for m in re.finditer(r'除(?!非)(?P<body>[^。；;]+?)(?:之外|以外)|\bexcept\s+(?P<english>[^.;\n]+)',text,re.I):
        body=m['body'] or m['english'];ids=sorted(set(x.group().strip('`') for x in re.finditer(RULES['roles']['I'],body)))
        if ids:exclusions.append({'source':source(text,m.start(),m.end()),'excluded':ids,'formula':'U \\ E','universe':None,'cardinality':None})
    for e in exclusions:facts.append({'type':'exclusion','source':e['source'],'summary':pair('明确排除：'+', '.join(e['excluded'])+'。全集及其余过滤条件未完全确定，不能计算影响数量。','Explicit exclusions: '+', '.join(e['excluded'])+'. Universe and remaining filters are unresolved; affected count is unknown.')})
    # Show supplied output/action/protection instead of asking to fill them again.
    for key,zh,en in [('I','对象原句','Object clause'),('O','产物或状态变化','Output or state change'),('A','动作原句','Action clause'),('B','保护约束原句','Protection clause')]:
        for src in fields[key]:
            if key=='B' and any(n['source']==src and n['unit']=='seconds' for n in numbers):continue
            facts.append({'type':'source_'+key,'source':src,'summary':pair(zh+'：'+src['quote'],en+': '+src['quote'])})
    # Keep every clause visible; role/numeric matches never certify full coverage.
    slices=[{'source':source(text,a,b),'fields':[k for k,v in fields.items() if any(s['start']==source(text,a,b)['start'] for s in v)],
             'status':'partial'} for a,b in spans]
    for k in fields:fields[k]=list({(s['start'],s['end']):s for s in fields[k]}.values())
    structural=_struct.calculate(text,spans,numbers,source,interval,note,RULES['roles']['I'],lists,memberships,_metrics.comparisons(text,numbers))
    advice.extend(structural['findings']);facts.extend(structural['facts'])
    guards=_guards.analyze(text,source)
    advice.extend(guards['findings'])
    actuation=_actuation.analyze(text,spans,numbers,source)
    advice.extend(actuation['findings'])
    effects=_effects.analyze(text,source)
    advice.extend(effects['findings'])
    projection=_projection.project(text,source,numbers,guards,bans,lists,memberships,spans)
    advice.extend(projection['findings'])
    for m in re.finditer(r'(?:该|此|the)\s*(?:相似)?(?:节点|实体|对象|记录)',text,re.I):
        src=source(text,m.start(),m.end())
        advice.append(note('anaphora_binding_unresolved',src,
            '该指代词尚未唯一绑定到前文实体。请改用稳定实体 ID 或完整名称；在绑定前不执行合并、删除等不可逆计算。',
            'This reference is not uniquely bound to a preceding entity. Use a stable entity ID or full name; do not reduce merge/delete effects before binding.'))
    for m in re.finditer(r'(?P<start>\d{4}-\d{2}-\d{2})\s*(?:至|到|and|through|to|- )\s*(?P<end>\d{4}-\d{2}-\d{2})',text,re.I):
        src=source(text,m.start(),m.end())
        advice.append(note('finite_cardinality_unproven',src,
            '日期谓词给出了封闭时间范围，但没有给出源清单或每日样本上限，因此不能由日期区间推出输入集合基数有限。',
            'The date predicate bounds time, but no source inventory or per-day sample limit is stated; finite input cardinality does not follow from the date interval alone.'))
    extracted=sorted(k for k,values in projection['fields'].items() if values)
    required=list('IOAPRVCB')
    coverage={'required':required,'extracted':extracted,
              'notExtracted':sorted(set(required)-set(extracted)),
              'formula':'S_required \\ S_extracted',
              'meaning':'parser coverage only; absence is not proof the source omitted the element',
              'decision':None}
    return {'schema':'boundx-source-constraints/v1','fields':fields,'numbers':numbers,'approvals':auth,'flow':flow,'times':times,
            'guardAnalysis':guards,'projection':projection,'prohibitions':bans,'explicitLists':lists,
            'membershipBranches':memberships,'metricBindings':metric_bindings,'actuationAnalysis':actuation,
            'effectAnalysis':effects,
            'coverageAnalysis':coverage,
            'structuralCalculations':structural['calculations'],
            'sets':{'mentioned':mentions,'exclusions':exclusions,'universe':None,'cardinality':None},
            'facts':facts,'advice':advice,'clauses':slices,'decision':None,
            'summary':{'numericConstraints':len(numbers),'approvalExpressions':len(auth),'candidateBranches':len(flow['branches']),
                       'targetedQuestions':len(advice),'completeInterpretation':False}}
