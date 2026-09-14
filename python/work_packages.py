"""Explicit Markdown WP scopes. No scheduling or inferred dependency edges."""
import re
from copy import deepcopy

WP_ID=r'WP(?:[1-9][0-9]*|(?:-[A-Z][A-Z0-9]*){1,3}-[0-9]{1,5})'
HEADER=re.compile(r'^ {0,3}(#{1,6})\s+('+WP_ID+r')(?=\s|[:：—-]|$).*$',re.I)
ANY_HEADER=re.compile(r'^ {0,3}(#{1,6})\s+')
BRACKET_HEADER=re.compile(r'^\s*【(?:阶段[^/\]】]{1,12}/)?(?P<id>'+WP_ID+r')[:：][^】]+】',re.I)
NAMED_BRACKET_HEADER=re.compile(r'^\s*【阶段[^:：】]{1,12}[:：][^】\r\n]*?[（(](?P<id>'+WP_ID+r')[）)]】',re.I)
INLINE_STAGE_HEADER=re.compile(r'(?:(?<=^)|(?<=[。；;\n]))\s*阶段[一二三四五六七八九十0-9]+\s*[:：]')

def evidence(text,start,end):
    return {'start':start,
            'end':end,'quote':text[start:end]}

def partition(text):
    headers=[];offset=0;fence=None;other=[]
    for line in text.splitlines(keepends=True):
        token=re.match(r'^ {0,3}(`{3,}|~{3,})(.*)$',line.rstrip('\r\n'))
        if token:
            mark=token[1]
            if fence is None:fence=(mark[0],len(mark))
            elif mark[0]==fence[0] and len(mark)>=fence[1] and not token[2].strip():fence=None
        elif fence is None:
            match=HEADER.match(line.rstrip('\r\n'))
            bracket=BRACKET_HEADER.match(line) or NAMED_BRACKET_HEADER.match(line)
            if match:headers.append({'id':match[2].upper(),'level':len(match[1]),'start':offset,'body':offset+len(line)})
            elif bracket:headers.append({'id':bracket['id'].upper(),'level':2,'start':offset,'body':offset+bracket.end()})
            elif ANY_HEADER.match(line):other.append((offset,len(ANY_HEADER.match(line)[1])))
        offset+=len(line)
    if not headers:
        inline=list(INLINE_STAGE_HEADER.finditer(text))
        if len(inline)>=2:
            headers=[{'id':'WP-STAGE-'+str(i+1),'level':2,'start':m.start(),'body':m.end()} for i,m in enumerate(inline)]
        else:return None
    issues=[]
    if len(headers)>12:issues.append('work_package_limit')
    if len({h['id'] for h in headers})!=len(headers):issues.append('duplicate_work_package_id')
    if len({h['level'] for h in headers})!=1:issues.append('nested_work_package_scope')
    if any(pos>headers[0]['start'] and level<=headers[0]['level'] for pos,level in other):issues.append('ambiguous_non_wp_heading')
    for i,h in enumerate(headers):h['end']=headers[i+1]['start'] if i+1<len(headers) else len(text)
    preamble=text[:headers[0]['start']]
    if sum(len(preamble)+1+h['end']-h['body'] for h in headers)>60000:issues.append('expanded_scope_limit')
    return {'headers':headers,'preamble':preamble,'issues':issues}

def remap(value,original,prefix,body_start,stage_id):
    """Map every evidence quote from effective scope to original Unicode code-point offsets."""
    prefix_units=len(prefix)
    body_units=body_start
    if isinstance(value,list):return [remap(x,original,prefix,body_start,stage_id) for x in value]
    if not isinstance(value,dict):return value
    result={k:remap(v,original,prefix,body_start,stage_id) for k,v in value.items()}
    if {'start','end','quote'}<=value.keys():
        a,b=value['start'],value['end']
        if b<=prefix_units:scope='inherited_preamble'
        elif a>=prefix_units+1:
            a=body_units+a-prefix_units-1;b=body_units+b-prefix_units-1;scope='local'
        else:raise ValueError('Evidence crosses a scope join')
        if original[a:b]!=value['quote']:raise ValueError('Evidence mapping mismatch')
        result.update(start=a,end=b,scope=scope,stageId=stage_id)
    return result

def notice(code,src,zh,en):
    return {'code':code,'sources':[src],'suggestion':{'zh-CN':zh,'en':en},'decision':None}

def aggregate_engines(scoped):
    result=[]
    for name,library in [('sets','portion'),('logic','z3-solver'),('graph','networkx')]:
        scopes=[e for e in scoped if e['name']==name]
        result.append({'name':name,'library':library,'status':'partial' if scopes else 'incomplete',
                       'calculations':[],'sourceCalculations':[],'scopes':scopes,
                       'findings':[dict(f,stageId=e['stageId']) for e in scopes for f in e['findings']],
                       'decision':None})
    return result

def handover(text,stages):
    calculations=[];findings=[];providers=[];conditional_providers=[]
    for stage in stages:
        projection=(stage.get('result') or {}).get('sourceAnalysis',{}) or {}
        projection=projection.get('projection',{})
        for item in projection.get('fileOutputs',[]):providers.append({'stage':stage['id'],**item})
        for item in projection.get('conditionalFileOutputs',[]):conditional_providers.append({'stage':stage['id'],**item})
    for stage in stages:
        analysis=(stage.get('result') or {}).get('sourceAnalysis') or {}
        projection=analysis.get('projection',{})
        external={x['name'] for x in projection.get('externalInputs',[])}
        seen=set()
        for item in projection.get('fileInputs',[]):
            if item['name'] in seen:continue
            seen.add(item['name'])
            supplied={x['name'] for x in providers};missing=sorted({item['name']}-(supplied|external))
            sources=[x for x in providers if x['name']==item['name']]
            conditional=[x for x in conditional_providers if x['name']==item['name']]
            calc={'operation':'declared_file_source_difference','input':[item['name']],
                  'declaredOutputs':sorted(supplied),'declaredExternalInputs':sorted(external),
                  'missing':missing,'toStage':stage['id'],'producerCandidates':sources,
                  'conditionalProducerCandidates':conditional,
                  'dependencyVerified':False,'source':item['source'],'decision':None}
            calculations.append(calc)
            if missing and conditional:
                f=notice('io_conditional_supply',item['source'],
                    f'{stage["id"]} 需要 {item["name"]}，但目前只有带条件的生成声明。请明确读取前必须满足哪些生成条件，以及条件不成立时该阶段如何结束或取得文件。',
                    f'{stage["id"]} needs {item["name"]}, but only conditional production is declared. Specify which guards must hold before reading and what happens when they do not.')
                f.update(severity='attention',title={'zh-CN':'文件供给仍取决于前置条件','en':'File supply is conditional'},
                    scenario={'zh-CN':'所需文件：'+item['name']+'；生成条件：'+'；'.join(s['quote'] for p in conditional for s in p['guardSources']),
                              'en':'Required file: '+item['name']+'; production conditions: '+'; '.join(s['quote'] for p in conditional for s in p['guardSources'])},
                    to_stage=stage['id'],proof=dict(calc,operation='conditional_file_supply'),
                    sources=[item['source']]+[s for p in conditional for s in p['guardSources']]+[p['source'] for p in conditional])
                findings.append(f)
            elif missing:
                compared=[s['id'] for s in stages if s['id']!=stage['id']]
                f=notice('io_handover_deficit',item['source'],
                    f'{stage["id"]} 需要 {item["name"]}，但任务中没有识别到该文件的产出或外部输入声明。请明确提供方；如由其他工作包生成，请补充该包的文件交付要求及依赖关系。',
                    f'{stage["id"]} needs {item["name"]}, but no file output or external-input declaration was identified. Specify its provider; if another WP produces it, declare that deliverable and dependency.')
                f.update(severity='attention',title={'zh-CN':stage['id']+' 的输入文件缺少已声明来源','en':'Missing declared file source for '+stage['id']},
                         scenario={'zh-CN':'所需文件：'+item['name']+'；识别到的同名产出：无；已声明外部来源：无。','en':'Required file: '+item['name']+'; matching declared output: none; declared external source: none.'},
                         missing_input=item['name'],to_stage=stage['id'],from_stage=None,compared_stages=compared,proof=calc)
                findings.append(f)
            elif sources and item['name'] not in external:
                findings.append(notice('io_dependency_unresolved',item['source'],
                    f'已找到 {item["name"]} 的产出声明，但尚未验证它能在 {stage["id"]} 读取前交付。请明确工作包依赖、文件版本及可用条件。',
                    f'A producer declaration exists for {item["name"]}; availability before {stage["id"]} reads it is unverified. Specify dependency, version and availability.'))
    return {'calculations':calculations,'findings':findings}

def compute_packages(text,layout,compute_single):
    pipeline={'schema':'boundx-admin-pipeline/v1','status':'partial','stages':[],
              'globalTopology':{'edges':[],'dependenciesKnown':False,'terminationProven':False},
              'issues':layout['issues'],'businessDecision':None}
    if layout['issues']:
        return {'schema':'boundx-admin-engines/v1','text':text,'pipeline':pipeline,'sourceAnalysis':None,
                'sourceAnalysisError':{'code':'unsupported_work_package_scope','issues':layout['issues']},
                'engines':aggregate_engines([]),'ir':[],'uncovered':[],'businessDecision':None,'confirmation':None}
    combined=None;engines=[];records=[];uncovered=[];versions={}
    for header in layout['headers']:
        body=text[header['body']:header['end']];prefix=layout['preamble'];src=evidence(text,header['body'],header['end'])
        references=set(re.findall(r'(?<![\w-])'+WP_ID+r'(?![\w-])',prefix+'\n'+body,re.I))
        references={x.upper() for x in references}-{header['id']}
        # A cross-WP guard cannot be silently discarded to make a local action unconditional.
        if references:
            findings=[notice('cross_wp_scope_unresolved',src,
                '本工作包引用其他 WP，跨包条件尚未绑定；暂不作局部相容性结论，请明确依赖及条件作用范围。',
                'This package references other WPs. Cross-package guards are unresolved; clarify dependencies and scope before local compatibility checks.')]
            pipeline['stages'].append({'id':header['id'],'status':'incomplete','source':src,'result':None,'findings':findings})
            uncovered.append({'source':src,'reason':'cross_wp_scope_unresolved'})
            continue
        result=remap(compute_single(prefix+'\n'+body),text,prefix,header['body'],header['id'])
        # Keep the real full source as coordinate base, never expose a synthetic text as evidence base.
        result['text']=text;versions=result.get('versions',versions)
        stage={'id':header['id'],'status':'partial','source':src,'result':result,'findings':[]}
        pipeline['stages'].append(stage)
        for engine in result['engines']:
            engine['stageId']=header['id'];engines.append(engine)
        records.extend(result['ir']);uncovered.extend(result['uncovered'])
        analysis=result.get('sourceAnalysis')
        if analysis:
            if combined is None:combined=deepcopy(analysis)
            else:
                for key in ['numbers','approvals','facts','advice','clauses']:combined[key].extend(analysis[key])
                for key in combined['fields']:combined['fields'][key].extend(analysis['fields'][key])
                for key in combined['projection']['fields']:
                    combined['projection']['fields'][key].extend(analysis['projection']['fields'][key])
                combined['flow']['branches'].extend(analysis['flow']['branches'])
    if combined:
        # Aggregated display is not a globally solved graph, interval or population.
        combined['flow'].update(nodes=[],edges=[],temporal=[],terminationProven=False)
        combined['structuralCalculations']={'sets':[],'graph':[]}
        combined['summary'].update(completeInterpretation=False,numericConstraints=len(combined['numbers']),
                                   approvalExpressions=len(combined['approvals']),candidateBranches=len(combined['flow']['branches']))
        for stage in pipeline['stages']:combined['advice'].extend(stage['findings'])
        combined['advice'].append(notice('wp_composition_unverified',evidence(text,0,len(text)),
            '已按显式 WP 分开计算并保留前言约束。编号不代表顺序；跨包交付、预算与父子边界一致性尚未验证。',
            'Explicit WPs were checked separately with preamble constraints retained. Numbering does not define order; handovers, budgets and parent-child consistency remain unverified.'))
    io=handover(text,pipeline['stages']);pipeline['handover']=io
    # A trailing all-stage prohibition remains visible globally even when its
    # full predicate cannot be reduced by the local grammar.
    global_sources=[evidence(text,m.start(),m.end()) for m in re.finditer(r'(?:全过程|全流程|所有阶段)[^，,。；;\n]*(?:禁止|严禁|不得)[^，,。；;\n]*',text)]
    pipeline['globalConstraints']=global_sources
    for stage in pipeline['stages']:
        stage['findings'].extend(f for f in io['findings'] if f.get('to_stage')==stage['id'] or any(s['start']>=stage['source']['start'] and s['end']<=stage['source']['end'] for s in f['sources']))
        if stage.get('result') and stage['result'].get('sourceAnalysis'):
            analysis=stage['result']['sourceAnalysis']
            analysis['fields']['B'].extend(s for s in global_sources if s not in analysis['fields']['B'])
    if combined:
        combined['advice'].extend(io['findings'])
        extracted=sorted(k for k,values in combined['projection']['fields'].items() if values)
        if global_sources and 'B' not in extracted:extracted.append('B');extracted.sort()
        required=list('IOAPRVCB')
        combined['coverageAnalysis']={'required':required,'extracted':extracted,
            'notExtracted':sorted(set(required)-set(extracted)),
            'formula':'S_required \\ S_extracted',
            'meaning':'parser coverage only; absence is not proof the source omitted the element',
            'decision':None}
    return {'schema':'boundx-admin-engines/v1','text':text,'versions':versions,'pipeline':pipeline,
            'sourceAnalysis':combined,'sourceAnalysisError':None if combined else {'code':'work_package_analysis_incomplete'},
            'engines':aggregate_engines(engines),'ir':records,'uncovered':uncovered,'businessDecision':None,'confirmation':None,
            'limitation':'Partial local WP checks. Preamble inherited conservatively; no global compatibility or termination proof.'}
