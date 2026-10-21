import {OUT,read,save} from './setup.mjs';
import {anchors} from './semantic-review.mjs';
const corpus=read(`${OUT}/CORPUS-SELECTION.json`),ledger=read(`${OUT}/review/r002/SEMANTIC-ASSERTION-LEDGER.json`);
const overlap=(a,b)=>a&&b&&a.start<b.end&&b.start<a.end;
const base=s=>String(s).replace(/-\d+$/u,'').toLowerCase();
const nominal=/^(?:mod|domain|poss|name|op\d+|location|quant|unit|value)$/u;
// A read-only, conservative graph audit. Never builds/certifies BoundaryXP facts.
// A source mention is not a role edge. No default REQUIRED/FORBIDDEN is added.
export function alignedSentence(sentence,source){
 if(sentence.status!=='GRAPH_SAVED')return {status:sentence.status,nodes:[],edges:[],tops:[],request:sentence.request??null};
 const raw=sentence.raw_graph,request=sentence.request,joined=request.tokens.join(' '),points=[...joined],mapping=[];
 if(joined!==raw.input)throw Error('RAW_GRAPH_INPUT_DIFFERS_FROM_REQUEST');
 request.tokens.forEach((token,i)=>{if(i)mapping.push(null);const span=request.token_source_spans[i];if([...source].slice(span.start,span.end).join('')!==token)throw Error('TOKEN_SOURCE_ALIGNMENT');for(let j=0;j<[...token].length;j++)mapping.push(span.start+j);});
 const nodes=raw.nodes.map(n=>{
  const fragments=[],errors=[];
  for(const a of n.anchors??[]){
   if(!Number.isInteger(a.from)||!Number.isInteger(a.to)||a.from<0||a.to>points.length||a.from>=a.to){errors.push({anchor:a,reason:'INVALID_ANCHOR'});continue;}
   const offsets=mapping.slice(a.from,a.to).filter(x=>x!==null);let start=null,last=null;
   for(const o of offsets){if(last!==null&&o!==last+1){fragments.push({start,end:last+1,text:[...source].slice(start,last+1).join('')});start=null;}if(start===null)start=o;last=o;}
   if(start!==null)fragments.push({start,end:last+1,text:[...source].slice(start,last+1).join('')});
  }
  return {...n,key:sentence.clause_id+':'+n.id,fragments,alignment:errors.length?'INVALID':fragments.length?'EXACT':'UNANCHORED_ABSTRACT',errors};
 });
 const ids=new Set(nodes.map(n=>n.id));
 if(raw.edges.some(e=>!ids.has(e.source)||!ids.has(e.target)))throw Error('DANGLING_MRP_EDGE');
 return {clause_id:sentence.clause_id,status:'GRAPH_SAVED',nodes,edges:raw.edges,tops:raw.tops,request,original_input:raw.input};
}
export function auditCase(row,annotation){
 const raw=read(`${OUT}/arm-C/${row.id}/raw.json`),sentences=raw.sentences.map(s=>alignedSentence(s,row.source)),checks=[],required={nodes:{present:0,total:0},arguments:{present:0,total:0},scope_modality:{present:0,total:0}},wrong=[],layerPollution=[];
 const check=(dimension,claim,ok,evidence=[])=>checks.push({dimension,claim,status:ok?'PRESENT':'MISSING_OR_INCORRECT',evidence});
 function predicates(frame){return sentences.flatMap(g=>g.nodes.filter(n=>n.fragments.some(s=>anchors(row.source,frame.p).some(a=>overlap(s,a)))&&n.fragments.some(s=>base(n.label).includes(base(s.text))||base(s.text).includes(base(n.label)))).map(n=>({n,g})));}
 function layerEvidence(n,g,frame){
  const ancestors=[],queue=[{id:n.id,path:[]}],seen=new Set();
  while(queue.length){const a=queue.shift();if(seen.has(a.id)||a.path.length>6)continue;seen.add(a.id);for(const e of g.edges.filter(e=>e.target===a.id)){const parent=g.nodes.find(n=>n.id===e.source);ancestors.push({node:parent,path:[e,...a.path]});queue.push({id:e.source,path:[e,...a.path]});}}
  const conditional=ancestors.find(a=>a.path.some(e=>e.label==='condition'));
  const restricted=ancestors.find(a=>a.path.some(e=>['purpose','mod','domain'].includes(e.label)));
  const reachable=g.tops.includes(n.id)||ancestors.some(a=>g.tops.includes(a.node.id));
  if(frame.layer==='CONDITION_ANTECEDENT')return conditional?{ok:true,evidence:conditional.path}:{ok:false,evidence:[]};
  if(frame.layer==='MAIN')return {ok:reachable&&!conditional&&!restricted,evidence:ancestors.map(a=>({label:a.node.label,path:a.path}))};
  // Content/metalinguistic ownership requires an actual graph relation;
  // an anchored predicate in a new sentence is not enough.
  if(['OUTPUT_CONTENT','PROPOSITION_COMPLEMENT','PURPOSE_COMPLEMENT','DECLARATION','METALINGUISTIC','NOMINAL_QUALIFIER'].includes(frame.layer))return {ok:false,evidence:ancestors.map(a=>({label:a.node.label,path:a.path})),reason:'No demonstrated typed discourse/output ownership in raw sentence AMR'};
  return {ok:false,evidence:[]};
 }
 function argumentRegion(g,node,arg){
  const aa=anchors(row.source,arg),inRange=n=>n.fragments.some(s=>aa.some(a=>overlap(s,a))),seen=new Set(),queue=[node.id],edges=[];
  while(queue.length){const id=queue.shift();if(seen.has(id))continue;seen.add(id);for(const e of g.edges.filter(e=>e.source===id||e.target===id)){const other=e.source===id?e.target:e.source,n=g.nodes.find(n=>n.id===other);if(!n||!inRange(n)||!nominal.test(e.label))continue;edges.push(e);queue.push(other);}}
  const fragments=g.nodes.filter(n=>seen.has(n.id)).flatMap(n=>n.fragments),quote=String(Array.isArray(arg)?arg[0]:arg),needed=[...quote].map((c,i)=>({c,i})).filter(x=>!/[\s的中对由向给以按和及与、，,]/u.test(x.c));
  const complete=aa.some(a=>needed.every(({i})=>fragments.some(s=>s.start<=a.start+i&&s.end>a.start+i)));
  return {complete,fragments,edges,node_ids:[...seen]};
 }
 for(const frame of annotation.frames){
  const ps=predicates(frame),typed=ps.filter(({n,g})=>layerEvidence(n,g,frame).ok);
  required.nodes.total++;if(typed.length)required.nodes.present++;
  check('predicate_identity',String(frame.p),ps.length>0,ps.map(({n})=>({key:n.key,label:n.label,fragments:n.fragments})));
  check('predicate_layer',String(frame.p)+' '+frame.layer,typed.length>0,ps.map(({n,g})=>({key:n.key,...layerEvidence(n,g,frame)})));
  for(const [role,arg]of frame.args??[]){
   const regions=sentences.flatMap(g=>g.nodes.filter(n=>n.fragments.some(s=>anchors(row.source,arg).some(a=>overlap(s,a)))).map(n=>({g,n,region:argumentRegion(g,n,arg)}))).filter(x=>x.region.complete);
   required.nodes.total++;if(regions.length)required.nodes.present++;
   const allowed=role==='RECIPIENT'?['arg2','arg3','beneficiary']:['arg1','arg2'];
   const rs=typed.flatMap(({n,g})=>g.edges.filter(e=>e.source===n.id&&allowed.includes(e.label)&&regions.some(a=>a.g===g&&a.region.node_ids.includes(e.target))).map(e=>({graph:g.clause_id,edge:e,regions:regions.filter(a=>a.g===g&&a.region.node_ids.includes(e.target)).map(a=>a.region)})));
   required.arguments.total++;if(rs.length)required.arguments.present++;
   check(role==='RESULT'?'result':role==='RECIPIENT'?'recipient':'patient_theme',String(frame.p)+' → '+String(arg),rs.length>0,rs);
   const outgoing=typed.flatMap(({n,g})=>g.edges.filter(e=>e.source===n.id&&allowed.includes(e.label)).map(e=>({graph:g.clause_id,predicate:n,edge:e,argument:g.nodes.find(n=>n.id===e.target)})));
   const incompatible=outgoing.filter(x=>x.argument.fragments.length&&!x.argument.fragments.some(s=>anchors(row.source,arg).some(a=>overlap(s,a))));
   if(!rs.length&&incompatible.length&&outgoing.every(x=>!x.argument.fragments.some(s=>anchors(row.source,arg).some(a=>overlap(s,a)))))wrong.push({predicate:frame.p,required_role:role,expected_argument:arg,actual:incompatible});
  }
  if(frame.modal){
   required.scope_modality.total++;
   const signals=typed.flatMap(({n,g})=>{
    const direct=g.edges.filter(e=>e.source===n.id&&e.label==='polarity'&&g.nodes.find(x=>x.id===e.target)?.label==='-');
    const parents=[],queue=[{id:n.id,path:[]}],seen=new Set();
    while(queue.length){const x=queue.shift();if(seen.has(x.id)||x.path.length>6)continue;seen.add(x.id);for(const e of g.edges.filter(e=>e.target===x.id&&/^(?:arg[0123]|op\d+)$/u.test(e.label))){const p=g.nodes.find(x=>x.id===e.source);parents.push({e,p,path:[e,...x.path]});queue.push({id:e.source,path:[e,...x.path]});}}
    const explicit=parents.filter(({p})=>/^(?:必须|必需|需要|要求|禁止|允许|请|得|能|可以)(?:-\d+)?$/u.test(p?.label??''));
    if(frame.modal==='FORBIDDEN')return explicit.filter(({p})=>/禁止/u.test(p.label)||g.edges.some(e=>e.source===p.id&&e.label==='polarity'&&g.nodes.find(x=>x.id===e.target)?.label==='-')).map(x=>({kind:'explicit_negated_modal',...x}));
    if(frame.modal==='REQUIRED')return explicit.filter(({p})=>/必须|必需|需要|要求|请/u.test(p.label)&&!g.edges.some(e=>e.source===p.id&&e.label==='polarity')).map(x=>({kind:'explicit_requirement',...x}));
    if(frame.modal==='NOT_REQUIRED')return explicit.filter(({p})=>/需要|要求|必须/u.test(p.label)&&g.edges.some(e=>e.source===p.id&&e.label==='polarity')).map(x=>({kind:'not_required',...x}));
    return direct.length?[]:[];
   });
   if(signals.length)required.scope_modality.present++;
   check('modality_negation_scope',String(frame.p)+' '+frame.modal,signals.length>0,signals);
  }
  if(frame.condition){required.scope_modality.total++;const relations=typed.flatMap(({n,g})=>g.edges.filter(e=>e.source===n.id&&e.label==='condition').filter(e=>{const cond=g.nodes.find(x=>x.id===e.target);return cond?.fragments.some(s=>anchors(row.source,frame.condition).some(a=>overlap(s,a)));}).map(e=>({graph:g.clause_id,edge:e})));if(relations.length)required.scope_modality.present++;check('condition_ownership',String(frame.p)+' under '+frame.condition,relations.length>0,relations);}
  if(frame.layer!=='MAIN')for(const {n,g}of ps){const rawMain=g.tops.includes(n.id)||g.edges.some(e=>g.tops.includes(e.source)&&/^op\d+$/u.test(e.label)&&e.target===n.id);if(rawMain)layerPollution.push({predicate:frame.p,expected_layer:frame.layer,node:n,graph:g.clause_id,reason:'Embedded reviewed predicate appears as top/coordinate root in raw graph; not a certified BoundaryXP business action'});}
 }
 if(annotation.actor){const rs=sentences.flatMap(g=>g.edges.filter(e=>e.label==='arg0').filter(e=>g.nodes.find(n=>n.id===e.target)?.fragments.some(s=>anchors(row.source,annotation.actor).some(a=>overlap(s,a)))).map(e=>({graph:g.clause_id,edge:e})));check('actor_agent',annotation.actor,rs.length>0,rs);}
 const nodes=sentences.flatMap(g=>g.nodes),unanchored=nodes.filter(n=>n.alignment!=='EXACT');
 check('source_accountability','Every raw node has direct exact source evidence',!unanchored.length,unanchored.map(n=>({key:n.key,label:n.label,status:n.alignment})));
 const coordination=annotation.frames.some(p=>p.args?.length>1)||annotation.original_frame?.features.includes('coordination');
 if(coordination)check('coordination_shared_argument','All declared shared/local arguments retained',checks.filter(x=>['patient_theme','result'].includes(x.dimension)).every(x=>x.status==='PRESENT'),[]);
 if(annotation.ambiguity)check('coreference_reentrancy','Source ambiguity represented with explicit candidate alternatives',false,[]);
 else if(annotation.frames.some(f=>f.uniqueReference))check('coreference_reentrancy','Cross-sentence reviewed reference represented',false,[]);
 const dimensions=['predicate_identity','predicate_layer','actor_agent','patient_theme','result','recipient','condition_ownership','modality_negation_scope','coordination_shared_argument','coreference_reentrancy','source_accountability'];
 return {id:row.id,root:row.root,corpus:row.corpus,required,dimensions:Object.fromEntries(dimensions.map(d=>{const x=checks.filter(c=>c.dimension===d);return [d,{status:x.length?x.every(c=>c.status==='PRESENT')?'RECOVERED':'PARTIAL_OR_MISSING':'NOT_APPLICABLE_OR_NO_DECLARED_ASSERTION',checks:x}];})),wrong_bindings:wrong,raw_predicate_layer_pollution:layerPollution,false_promoted_business_predicates:null,reason_no_business_count:'AMR is not projected/certified into business ACTION. Raw layer pollution is counted separately.',alignment:{nodes:nodes.length,aligned:nodes.filter(n=>n.alignment==='EXACT').length,unanchored:unanchored.map(n=>({key:n.key,label:n.label,errors:n.errors}))},unsupported_sentences:sentences.filter(s=>s.status!=='GRAPH_SAVED').length,ambiguity_preserved:annotation.ambiguity?false:null,raw:`${OUT}/arm-C/${row.id}/raw.json`,aligned_sentences:sentences};
}
if(process.argv[1]?.endsWith('c-review.mjs')){
const rows=corpus.cases.map((r,i)=>auditCase(r,ledger.annotations[i])),required={};
for(const k of ['nodes','arguments','scope_modality']){required[k]={present:rows.reduce((n,r)=>n+r.required[k].present,0),total:rows.reduce((n,r)=>n+r.required[k].total,0)};required[k].recall=required[k].present/required[k].total;}
const summary={required,wrong_bindings:rows.reduce((n,r)=>n+r.wrong_bindings.length,0),raw_predicate_layer_pollution:rows.reduce((n,r)=>n+r.raw_predicate_layer_pollution.length,0),false_promoted_business_predicates:null,alignment:{nodes:rows.reduce((n,r)=>n+r.alignment.nodes,0),aligned:rows.reduce((n,r)=>n+r.alignment.aligned,0)},unsupported_sentences:rows.reduce((n,r)=>n+r.unsupported_sentences,0),ambiguity_preserved:0};
save(`${OUT}/review/r003/ARM-C.json`,{arm:'C',measurement:'Conservative raw-MRP structural recovery; no business projection; directed role edges and anchored nominal component spans required. Full typed discourse ownership absent is missing, not guessed. No implicit REQUIRED/FORBIDDEN injected. Explicit modal scope may traverse actual ARG/operator edges only. Wrong binding requires a nonoverlapping anchored target, not merely a missing qualifier.',supersedes:'review/r002/ARM-C.json; read-only measurement correction: partial nominal coverage is not wrong binding; preserve explicit graph operator paths for modal scope. No model/output/source/candidate rule changes.',status:'SOURCE_ASSERTIONS_PENDING_ADMIN_REVIEW',summary,rows});
console.log(JSON.stringify(summary));
}
