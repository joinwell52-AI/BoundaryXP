import {id,uniq} from './identity.mjs';
import {scalar} from './semantic-decoder.mjs';
// Local grammar builds a proposal, never a slot. Protected operands, explicit
// set syntax, the predicate's own SRL/dependency layer and ownership are required.
export function constructDistribution(f){
 const audit={version:'7P-COMPOSITION-014-R4',frames:[],consumed_before:'WHOLE_FRAME_CERTIFICATION'};f.semantic_decoding.distributive_construction=audit;
 const cp=[...f.source.raw_text],slice=(s,e)=>cp.slice(s,e).join(''),sp=n=>f.source_spans.find(s=>s.span_id===n?.source_span_ids[0]);
 const set=body=>{const x={expr_id:id(f.source.sha256,'distributed-set',body),...body};if(!f.expressions.set_expr_nodes.some(s=>s.expr_id===x.expr_id))f.expressions.set_expr_nodes.push(x);return x.expr_id;};
 const covered=new Set();
 for(const a of f.analyses){
  const cl=a.cl,tokens=cl.tokens,operators=tokens.filter(t=>/^(各|各自|分别|each|every)$/iu.test(t.text));if(!operators.length)continue;
  const op=operators[0],pi=op.head,p=tokens[pi],srl=(cl.srl??[]).find(row=>row.some(x=>x[1]==='PRED'&&x[2]<=pi&&x[3]>pi));
  // Existing explicit owned-code declarations already have a typed insertion
  // certificate. A new local parser must not overwrite that complete producer.
  if(f.semantic_decoding.frame_certification.test_insertions.some(t=>t.state==='CERTIFIED'&&a.events.some(e=>e.node_id===t.event_node_id)))continue;
  if(!srl?.some(x=>['ARGM-LOC','ARGM-DIR','ARG2'].includes(x[1])&&/^(在|对)/u.test(tokens[x[2]]?.text??''))&&!/(?:在|对)\s*(?:这些|上述|那些)/u.test(cl.span.quote)&&!/(?:到|\bto\b|\bin\b|\bfor\b)/iu.test(cl.span.quote))continue;
  let e=a.events.find(e=>e.metadata.token_id===p?.id);
  if(!e&&p&&/^(VV|VERB)$/u.test(p.pos)&&/^(root|ROOT)$/u.test(p.dep)&&srl?.some(x=>x[1]==='ARG1')){e=f.tools.node(cl,'EVENT',p.start,p.end,{sense:p.lemma??p.text,owner:cl.id,token_id:p.id,modality:'UNSTATED',discourse:a.discourse});a.events.push(e);}
  // English EACH is often an object of a preposition rather than an adverb.
  if(!e&&/^(each|every)$/iu.test(op.text)){e=a.events.find(n=>{const t=tokens.find(t=>t.id===n.metadata.token_id);return t&&/^(root|ROOT)$/u.test(t.dep);});}
  if(!e||covered.has(e.node_id))continue;covered.add(e.node_id);
  const d=a.discourse;
  const content=f.semantic_decoding.discourse.output_content_requirements.filter(r=>r.clause_id===cl.id&&r.ownership_status==='UNIQUE_OUTPUT'&&r.owner_output_ids?.length);
  if(d.kind==='OUTPUT_CONTENT'&&new Set(content.map(r=>JSON.stringify(r.owner_output_ids))).size===1){for(const r of content)r.semantic_node_ids=uniq([...r.semantic_node_ids,e.node_id]);}
  let owner=f.semantic_ownership.get(e.node_id);
  if(d.kind==='OUTPUT_CONTENT'&&content.length&&new Set(content.map(r=>JSON.stringify(r.owner_output_ids))).size===1&&owner?.status==='AMBIGUOUS'){
   const witness=f.semantic_ownership.get(content[0].semantic_node_ids.find(i=>f.semantic_ownership.get(i)?.status==='UNIQUE'));
   if(witness)owner={...witness,node_id:e.node_id,owning_proposition_id:cl.id};
  }
  const rec={record_id:id(f.source.sha256,'distribution',e.node_id),predicate_node_id:e.node_id,status:'UNRESOLVED',operator:'EACH',operator_source_span_id:f.tools.span(op.start,op.end),semantic_owner_id:owner?.semantic_owner_id??null,owner_category:owner?.owner_category??null,syntactic_layer_id:owner?.syntactic_layer_id??null,attachment_path:owner?.attachment_path??[],source_span_ids:[a.sid],member_node_ids:[],quantity:null,reasons:[]};audit.frames.push(rec);
  if(['BACKGROUND','RATIONALE','EXAMPLE','CODE','QUOTE'].includes(d.kind)||/曾|已经|\balready\b|\bpreviously\b/iu.test(cl.span.quote)){rec.status='INERT';rec.reasons.push('NOT_CURRENT_DIRECTIVE');continue;}
  if(owner?.status!=='UNIQUE'||!['MAIN','CONDITION_CONSEQUENT'].includes(owner.predicate_layer)){rec.reasons.push('OWNER_OR_LAYER_NOT_UNIQUE');continue;}
  // Only the existing source block/structure path can extend a comma-split
  // enumeration. An arbitrary adjacent clause is never consulted.
  const block=d.source_span,localStart=cl.span.start,localEnd=block?.end??cl.span.end;
  const loc=srl?.find(x=>['ARGM-LOC','ARGM-DIR','ARG2'].includes(x[1])&&/^(在|对)/u.test(tokens[x[2]]?.text??''));
  let begin=loc?tokens[loc[2]].end:null,end=loc?tokens[loc[3]-1].end:null;
  const suffix=slice(sp(e).end,localEnd),english=/\b(?:each|every)(?:\s+of)?\s+/iu.exec(suffix),reverse=/(?:到|to|in|for)\s+/iu.exec(suffix);
  if(begin===null&&english){begin=sp(e).end+[...suffix.slice(0,english.index+english[0].length)].length;end=localEnd;}
  if(begin===null&&reverse){begin=sp(e).end+[...suffix.slice(0,reverse.index+reverse[0].length)].length;end=localEnd;}
  const literals=begin===null?[]:f.nlp_signals.literals.filter(l=>['FILE','PATH','IDENTIFIER'].includes(l.type)&&l.span.start>=begin&&l.span.end<=end).filter(l=>!f.nlp_signals.literals.some(q=>q!==l&&q.span.start<=l.span.start&&q.span.end>=l.span.end&&(q.span.start<l.span.start||q.span.end>l.span.end)));
  let members=literals.map(l=>f.semantic_nodes.find(n=>n.node_type==='ENTITY'&&sp(n)?.start===l.span.start&&sp(n)?.end===l.span.end));
  for(let i=0;i<literals.length;i++){const l=literals[i];if(l.span.end===localEnd&&/\.[A-Za-z0-9]+\.$/u.test(l.span.quote)){
   const ac=f.analyses.find(x=>x.cl.span.start<=l.span.start&&x.cl.span.end>=l.span.end)??a;
   members[i]=f.tools.node(ac.cl,'ENTITY',l.span.start,l.span.end-1,{discourse:ac.discourse,literal_tag:'FILEPATH',source_literal_id:l.id,producer_mechanism:'SENTENCE_FINAL_PUNCTUATION_SEPARATION'});
  }}
  // A plain nominal enumeration is licensed by the bounded SRL argument and
  // conjunction delimiters; an identifier recognizer is not required for nouns.
  if(!literals.length&&loc){
   const lt=tokens.slice(loc[2]+1,loc[3]);let stop=lt.findIndex(t=>/^(CD|NUM|LC)$/u.test(t.pos));if(stop<0)stop=lt.length;
   const mt=lt.slice(0,stop),words=mt.filter(t=>/^(NN|NR|NOUN|PROPN)$/u.test(t.pos));
   if(words.length>1&&mt.every(t=>words.includes(t)||/^(、|,|，|和|与|and)$/iu.test(t.text))){
    members=words.map(t=>f.tools.node(cl,'ENTITY',t.start,t.end,{token_id:t.id,discourse:d,argument_role:'MEMBER',producer_mechanism:'SRL_BOUNDED_NOMINAL_ENUMERATION'}));
    for(const t of words)literals.push({span:{start:t.start,end:t.end,quote:t.text},type:'NOMINAL'});
   }
  }
  let literalComplete=literals.length>0&&members.every(Boolean);
  if(literalComplete){
   const sorted=[...literals].sort((x,y)=>x.span.start-y.span.start);
   literalComplete=sorted.every((l,i)=>!i||/^[\s`,，、]*(?:(?:和|与|及|以及|and)\s*)?$/iu.test(slice(sorted[i-1].span.end,l.span.start)));
   const tail=slice(sorted.at(-1).span.end,end).replace(/[\s。.;；`]/gu,'');
   const declared=/^([一二两三四五六七八九十]|\d+)个(?:模块|文件)$/u.exec(tail);
   if(declared&&scalar(declared[1])!==members.length){literalComplete=false;rec.reasons.push('DECLARED_SET_CARDINALITY_CONFLICT');}
   else if(tail&&!declared&&!/^(?:中|内|files?|modules?)$/iu.test(tail)){literalComplete=false;rec.reasons.push('UNSUPPORTED_SET_SYNTAX');}
  }
  const old=f.expression_plans.get(e.node_id)??{};
  if(!literalComplete){members=[];rec.reasons.push('EXPLICIT_MEMBER_SET_UNAVAILABLE');}
  if(members.some(n=>{const o=f.semantic_ownership.get(n.node_id),ac=f.analyses.find(x=>x.cl.id===n.metadata.clause_id);return o?o.semantic_owner_id!==owner.semantic_owner_id:ac?.discourse.structure_id!==d.structure_id;})){members=[];rec.reasons.push('MEMBER_OWNER_CONFLICT');}
  // Exclusion is local syntax over the explicit finite set, preserving its
  // source witness; it does not select a nearby matching entity in another owner.
  const exclusion=/除\s*([^\s]+)\s*外/u.exec(slice(loc?tokens[loc[3]-1].end:localStart,op.start));
  let excluded=[];if(exclusion){excluded=members.filter(n=>n.surface===exclusion[1]);if(excluded.length!==1){members=[];rec.reasons.push('EXCLUSION_NOT_UNIQUE');}else members=members.filter(n=>!excluded.includes(n));rec.exclusion_source_span_id=f.tools.span((loc?tokens[loc[3]-1].end:localStart)+[...slice(loc?tokens[loc[3]-1].end:localStart,op.start).slice(0,exclusion.index)].length,op.start);}
  rec.member_node_ids=members.map(n=>n.node_id);rec.excluded_member_node_ids=excluded.map(n=>n.node_id);
  const arg=srl?.find(x=>x[1]==='ARG1'),argStart=arg?tokens[arg[2]].start:tokens.find(t=>t.dep==='dobj'&&t.head===tokens.findIndex(t=>t.id===e.metadata.token_id))?.start,argEnd=arg?tokens[arg[3]-1].end:argStart!==undefined?tokens.find(t=>t.dep==='dobj'&&t.head===tokens.findIndex(t=>t.id===e.metadata.token_id))?.end:undefined;
  let obj=null,nums=[];const englishObject=tokens.find(t=>t.dep==='dobj'&&t.head===tokens.findIndex(t=>t.id===e.metadata.token_id));
  const numericStart=!arg&&englishObject?tokens.filter(t=>t.head===tokens.indexOf(englishObject)&&t.dep==='nummod').map(t=>t.start):[];
  const actualArgStart=numericStart.length?Math.min(argStart,...numericStart):argStart;
  if(actualArgStart!==undefined&&argEnd!==undefined){
   const objectEnd=reverse&&begin!==null?Math.min(argEnd,sp(e).end+[...suffix.slice(0,reverse.index)].length):argEnd;
   nums=tokens.filter(t=>t.start>=actualArgStart&&t.end<=objectEnd&&/^(CD|NUM)$/u.test(t.pos));
   let os=actualArgStart;while(os<objectEnd&&/\s/u.test(cp[os]))os++;
   obj=f.semantic_nodes.find(n=>n.node_type==='ENTITY'&&sp(n)?.start===os&&sp(n)?.end===objectEnd)??f.tools.node(cl,'ENTITY',os,objectEnd,{discourse:d,owner:e.node_id,argument_role:'RESULT'});
  }
  const numbers=nums.map(t=>scalar(t.text.toLowerCase()));rec.quantity=numbers.length===1&&Number.isFinite(numbers[0])?numbers[0]:null;
  if(!obj)rec.reasons.push('OBJECT_IDENTITY_MISSING');if(rec.quantity===null)rec.reasons.push(nums.length>1?'QUANTITY_CONFLICT':'PER_MEMBER_QUANTITY_MISSING');
  const prefix=slice(localStart,sp(e).start),prefixWithoutLoc=loc?prefix.replace(slice(tokens[loc[2]].start,tokens[loc[3]-1].end),''):prefix;
  const command=/^\s*(?:请|please)\s*/iu.test(prefix)||/^(?:root|ROOT)$/u.test(tokens.find(t=>t.id===e.metadata.token_id)?.dep??'')&&!tokens.some(t=>t.dep==='nsubj'&&t.start<sp(e).start&&!members.some(n=>t.start>=sp(n).start&&t.end<=sp(n).end))&&/^\s*(?:各|各自|分别|each|every)?\s*$/iu.test(prefixWithoutLoc);
  if(e.metadata.modality==='UNSTATED'&&command){e.metadata.modality='REQUIRED';e.metadata.modality_rule='STRUCTURALLY_BOUNDED_DISTRIBUTIVE_IMPERATIVE';e.metadata.modality_source_span_ids=[a.sid,rec.operator_source_span_id];delete e.metadata.modality_unresolved;}
  if(!['REQUIRED','PERMITTED','FORBIDDEN'].includes(e.metadata.modality))rec.reasons.push('MODALITY_NOT_LICENSED');
  const evidence=uniq([a.sid,...e.source_span_ids,rec.operator_source_span_id,...members.flatMap(n=>n.source_span_ids),...(obj?.source_span_ids??[]),...(rec.exclusion_source_span_id?[rec.exclusion_source_span_id]:[])]);rec.source_span_ids=evidence;
  // Known incomplete distribution is retained even when quantity or antecedent
  // cannot close. It cannot be certified as an aggregate ALL operation.
  if(!members.length||!obj||rec.reasons.some(r=>r!=='PER_MEMBER_QUANTITY_MISSING')){
   rec.unresolved_ref=f.tools.unknown(cl,'UNRESOLVED_QUANTIFICATION','DISTRIBUTIVE_FRAME_INCOMPLETE: '+rec.reasons.join(', '),[e.node_id,...rec.member_node_ids]);f.expression_plans.set(e.node_id,{...old,unresolved_ref:rec.unresolved_ref});e.metadata.distribution={operator:'EACH',file_node_ids:rec.member_node_ids,count_per_member:rec.quantity,source_span_ids:evidence,status:'PARTIAL'};continue;
  }
  const previous=f.relations.filter(r=>r.head_node_id===e.node_id&&r.state!=='REJECTED'&&['AGENT','PATIENT','THEME','RESULT'].includes(r.relation_type));
  for(const r of previous){const n=f.semantic_nodes.find(n=>n.node_id===r.tail_node_id);if(members.includes(n)||excluded.includes(n)||n&&sp(n)?.start>=localStart&&sp(n)?.end<=localEnd&&r.relation_type!=='AGENT'){r.state='REJECTED';r.rule_refs=uniq([...r.rule_refs,'SUPERSEDED_BY_COMPLETE_DISTRIBUTIVE_ARGUMENTS']);}}
  const rs=members.map(n=>{const r=f.tools.relation(cl,'PATIENT',e,n,evidence);r.state='RESOLVED';delete r.unresolved_ref;r.rule_refs=uniq([...r.rule_refs,'EXPLICIT_DISTRIBUTIVE_MEMBER']);return r;});
  const result=f.tools.relation(cl,'RESULT',e,obj,evidence);result.state='RESOLVED';delete result.unresolved_ref;result.rule_refs=uniq([...result.rule_refs,'EXPLICIT_DISTRIBUTIVE_RESULT']);
  const leaves=members.map((n,i)=>set({kind:'ITEM',entity_node_id:n.node_id,source_span_ids:n.source_span_ids,relation_ids:[rs[i].relation_id]})),scope=set({kind:'UNION',operand_expr_ids:leaves,source_span_ids:evidence,relation_ids:rs.map(r=>r.relation_id)});
  let qid=null;if(rec.quantity!==null){const v=f.tools.node(cl,'VALUE',nums[0].start,nums[0].end,{sense:'SCALAR',token_id:nums[0].id,discourse:d,quantity_classification:{resource_eligible:false,kind:'OUTPUT_COUNT_PER_MEMBER'}});const q={expr_id:id(f.source.sha256,'per-member-quantity',e.node_id,scope,rec.quantity),metric:'COUNT',target_node_ids:[obj.node_id],lower_bound:{value:rec.quantity,inclusive:true},upper_bound:{value:rec.quantity,inclusive:true},unit:'items_per_member',value_node_ids:[v.node_id],source_span_ids:uniq([...evidence,...v.source_span_ids]),relation_ids:[result.relation_id]};f.expressions.quantity_expr_nodes.push(q);qid=q.expr_id;}
  rec.scope_expr_id=scope;rec.quantity_expr_id=qid;rec.result_node_id=obj.node_id;rec.relation_ids=[...rs.map(r=>r.relation_id),result.relation_id];rec.status=rec.quantity===null?'UNRESOLVED':'CONSTRUCTED';
  e.metadata.distribution={operator:'EACH',file_node_ids:rec.member_node_ids,member_node_ids:rec.member_node_ids,count_per_member:rec.quantity,member_set_expr_id:scope,quantity_expr_id:qid,result_node_id:obj.node_id,source_span_ids:evidence,structural_path:rec.attachment_path,status:rec.status};
  for(const r of content){r.semantic_node_ids=uniq([...r.semantic_node_ids,e.node_id,...rec.member_node_ids,obj.node_id,...(qid?f.expressions.quantity_expr_nodes.find(q=>q.expr_id===qid).value_node_ids:[])]);r.relation_ids=uniq([...r.relation_ids,...rec.relation_ids]);r.quantity_expr_ids=uniq([...r.quantity_expr_ids,...(qid?[qid]:[])]);}
  f.expression_plans.set(e.node_id,{...old,scope_expr_id:scope,...(qid?{quantity_expr_id:qid}:{}),...(rec.quantity===null?{unresolved_ref:f.tools.unknown(cl,'UNRESOLVED_QUANTIFICATION','PER_MEMBER_QUANTITY_MISSING',[e.node_id])}:{})});a.handled=true;
 }
 return f;
}
