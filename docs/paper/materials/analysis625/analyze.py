"""Classify all frozen cases by submitted mathematical objects, not by verdict."""
from pathlib import Path
from collections import Counter,defaultdict
import argparse,csv,hashlib,io,json
R=Path(__file__).resolve().parent;E=R.parent/'evidence-r18'
read=lambda p:json.loads(p.read_text(encoding='utf-8'))
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
FAMILY={'boolean_implication':'logic','set_subset':'identity_set','equal':'identity_set','dependency':'dependency','budget':'quantity','interval_subset':'quantity','interval_composition':'quantity'}
def analyze():
 d=read(E/'STATISTICS-VERIFIED.json');rows=[];items=[];groups=defaultdict(list);full_inputs=defaultdict(list);cases_by_op=defaultdict(set);ops=Counter();primary=Counter();cross=defaultdict(Counter);targets=Counter();target_cases=defaultdict(set);axes=Counter();axis_width=Counter();status=Counter();unknown_labels=Counter();combinations=Counter();nodes=Counter();queries=Counter()
 for original in d['rows']:
  name=original['id'];pf=E/'projects'/(name+'.json');rf=E/'results'/(name+'.json')
  assert sha(pf)==original['project_sha256'] and sha(rf)==original['result_sha256']
  p=read(pf);x=read(rf);texts={n['id']:n['text'].strip() for n in p['nodes']}
  signature=sorted((n['text'].strip(),texts.get(n.get('parent_id'),'EXTERNAL:'+str(n.get('parent_id'))),n.get('context_mode'),n.get('parent_basis')) for n in p['nodes'])
  sig=hashlib.sha256(json.dumps(signature,ensure_ascii=False,separators=(',',':')).encode()).hexdigest();groups[sig].append(name)
  input_sig=hashlib.sha256(json.dumps(x['joint_input'],sort_keys=True,ensure_ascii=False,separators=(',',':')).encode()).hexdigest();full_inputs[input_sig].append(name)
  kinds=set();families=set();axes_case=set();multi_target=0;scopes=set();item_ids=[]
  for c in x['verification']['checks']:
   op=c['operation'];kind=op['kind'];assert kind in FAMILY,kind
   kinds.add(kind);families.add(FAMILY[kind]);ops[kind]+=1;cases_by_op[kind].add(name)
   target=c.get('assessment_target','MISSING');targets[target]+=1;target_cases[target].add(name);scopes.add(target)
   aa=set(c.get('axes',[]));axes.update(aa);axis_width[len(aa)]+=1;axes_case.update(aa)
   nt=len(c.get('target_node_ids',[]));multi_target+=nt>1;status[c['result']['status']]+=1
   if 'combination' in op:combinations[op['combination']]+=1
   item_ids.append(c['id']);items.append({'case_id':name,'query_id':c['id'],'kind':kind,'family':FAMILY[kind],'target':target,'axes':sorted(aa),'target_node_count':nt,'subject':c['subject'],'evidence_ids':c.get('evidence_ids',[]),'result':c['result'],'comparison':c.get('expected_comparison'),'calculation_status':c.get('calculation_status'),'reference_errors':c.get('reference_errors',[])})
  nonlogic=families-{'logic'};category='logic_only' if not nonlogic else next(iter(nonlogic)) if len(nonlogic)==1 else 'mixed'
  unknowns=x['proposal'].get('unknowns',[])
  if unknowns:unknown_labels[original['llm']]+=1
  primary[category]+=1;cross[category][original['llm']]+=1;nodes[original['nodes']]+=1;queries[len(item_ids)]+=1
  rows.append({'id':name,'batch':original['batch'],'language_batch':'English' if original['batch'] in {'EN20','ENG20'} else 'Chinese','nodes':original['nodes'],'query_count':len(item_ids),'primary_family':category,'families':sorted(families),'operator_kinds':sorted(kinds),'targets':sorted(scopes),'axes':sorted(axes_case),'multi_target_queries':multi_target,'unknown_entry_count':len(unknowns),'unknowns':unknowns,'annotation':original['annotation'],'llm':original['llm'],'calculator':original['calculator'],'source_structure_sha256':sig,'project_sha256':original['project_sha256'],'result_sha256':original['result_sha256'],'project_path':'../evidence-r18/projects/'+name+'.json','result_path':'../evidence-r18/results/'+name+'.json'})
 assert len(rows)==625 and sum(ops.values())==3469 and sum(nodes.elements())==3219
 assert dict(primary)=={'dependency':41,'quantity':156,'logic_only':269,'mixed':45,'identity_set':114}
 assert sum(n*v for n,v in axis_width.items())==sum(axes.values())
 repeated=[{'source_structure_sha256':k,'ids':v} for k,v in groups.items() if len(v)>1]
 assert len(groups)==518 and len(repeated)==57 and len(full_inputs)==518
 out={'source_statistics_sha256':sha(E/'STATISTICS-VERIFIED.json'),'classification_basis':'Submitted operation kinds and explicit target/axes fields. Primary class ignores ubiquitous logical side checks; two or more nonlogical families form mixed. Not an independent semantic coverage annotation.','groups':625,'task_nodes':3219,'queries':3469,'language_batches':dict(Counter(r['language_batch'] for r in rows)),'primary_families':dict(primary),'primary_by_verdict':{k:dict(v) for k,v in cross.items()},'operators':dict(ops),'cases_by_operator':{k:len(v) for k,v in cases_by_op.items()},'targets':dict(targets),'cases_by_target':{k:len(v) for k,v in target_cases.items()},'axes':dict(axes),'axes_per_query':dict(axis_width),'multiple_axes_queries':sum(v for k,v in axis_width.items() if k>1),'multiple_target_queries':sum(r['multi_target_queries'] for r in rows),'queries_by_result':dict(status),'cases_with_unknown_entries':dict(unknown_labels),'combination_operators':dict(combinations),'node_count_distribution':dict(nodes),'query_count_distribution':dict(queries),'source_structure_groups':518,'repeated_source_groups':repeated,'identity_scope':'Case IDs remain 625 distinct current projects; source grouping uses exact trimmed texts, parent texts, context mode and parent basis. It is not semantic equivalence or proof of independent sampling.','rows':rows,'items':items,'model_calls':0,'live_service_access':False}
 byid={r['id']:r for r in rows};repeated_rows=[[byid[n] for n in v] for v in groups.values() if len(v)>1]
 out['exact_serialized_joint_input_groups']=len(full_inputs)
 out['repeat_group_variation']={'groups':len(repeated_rows),'different_overall_answers':sum(len({r['llm'] for r in v})>1 for v in repeated_rows),'different_operator_sets':sum(len({tuple(r['operator_kinds']) for r in v})>1 for v in repeated_rows),'different_query_counts':sum(len({r['query_count'] for r in v})>1 for v in repeated_rows)}
 return out
def write_csv(out):
 buf=io.StringIO(newline='');fields=['id','batch','language_batch','nodes','query_count','primary_family','operator_kinds','targets','unknown_entry_count','annotation','llm','calculator','source_structure_sha256'];w=csv.DictWriter(buf,fieldnames=fields,lineterminator='\n');w.writeheader()
 for row in out['rows']:w.writerow({k:json.dumps(row[k],ensure_ascii=False) if isinstance(row[k],list) else row[k] for k in fields})
 return buf.getvalue()
if __name__=='__main__':
 ap=argparse.ArgumentParser();ap.add_argument('--record',action='store_true');args=ap.parse_args();out=json.loads(json.dumps(analyze(),ensure_ascii=False));csv_text=write_csv(out)
 if args.record:
  (R/'classification.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');(R/'cases.csv').write_text(csv_text,encoding='utf-8-sig',newline='')
 else:
  assert read(R/'classification.json')==out
  assert (R/'cases.csv').read_text(encoding='utf-8-sig')==csv_text
 print(json.dumps({k:v for k,v in out.items() if k not in {'rows','items','repeated_source_groups'}},ensure_ascii=False))
