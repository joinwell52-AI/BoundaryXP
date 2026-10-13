import Ajv from 'ajv';import {candidateSchema,operators} from './schema.mjs';
const schemaCheck=new Ajv({strict:false,allErrors:true}).compile(candidateSchema);
export function validateCandidateIR(ir,source){
 if(!schemaCheck(ir))return {ok:false,errors:schemaCheck.errors.map(e=>({code:'SCHEMA',path:e.instancePath,message:e.message})),semantic_acceptance:false,downstream_connected:false};
 const errors=[],index=new Map(),groups={entities:'ENTITY',variables:'VARIABLE',events:'EVENT',states:'STATE',expressions:'EXPRESSION',requirements:'REQUIREMENT'};
 const fail=(code,id,detail)=>errors.push({code,id,detail});
 for(const [collection,kind]of Object.entries(groups))for(const node of ir[collection]){if(index.has(node.id))fail('DUPLICATE_ID',node.id);index.set(node.id,{kind,node});}
 const sources=new Map();for(const s of ir.source_table){if(sources.has(s.id))fail('DUPLICATE_SOURCE',s.id);sources.set(s.id,s);let position=-1;for(let n=0;n<s.occurrence;n++){position=source.indexOf(s.quote,position+1);if(position<0)break;}if(position<0)fail('SOURCE_QUOTE_MISMATCH',s.id);}
 const target=r=>{const x=index.get(r.id);if(!x||x.kind!==r.kind)fail('TYPED_REFERENCE',r.id,{declared:r.kind,actual:x?.kind??null});return x?.node;};
 const inspect=x=>{if(Array.isArray(x)){x.forEach(inspect);return;}if(!x||typeof x!=='object')return;if(Object.keys(x).length===2&&'id'in x&&'kind'in x){target(x);return;}for(const [k,v]of Object.entries(x)){if(k==='source_refs'){for(const id of v)if(!sources.has(id))fail('SOURCE_REFERENCE',id);}else inspect(v);}};inspect(ir);
 for(const e of ir.entities){if(e.kind!=='GROUP'&&e.members.length)fail('NONGROUP_MEMBERS',e.id);for(const r of e.members)if(r.kind!=='ENTITY')fail('GROUP_MEMBER_TYPE',e.id);}
 for(const e of ir.events)if(e.operation==='OTHER'&&e.operation_extent==='EXACT')fail('OTHER_NOT_EXACT',e.id);
 const expressionType=(r,seen=new Set())=>{const x=target(r);if(!x)return 'UNKNOWN';if(r.kind==='VARIABLE')return x.type;if(r.kind==='ENTITY')return 'OBJECT';if(r.kind==='STATE')return 'STATE';if(r.kind==='EVENT')return 'EVENT';if(r.kind!=='EXPRESSION')return 'UNKNOWN';if(seen.has(r.id)){fail('EXPRESSION_CYCLE',r.id);return 'UNKNOWN';}const [type,min,max]=operators[x.operator];if(x.arguments.length<min||max!==null&&x.arguments.length>max)fail('OPERATOR_ARITY',x.id);const ts=x.arguments.map(a=>expressionType(a,new Set([...seen,r.id])));
  if(['AND','OR','NOT','IMPLIES','IFF'].includes(x.operator)&&ts.some(t=>t!=='BOOLEAN'))fail('BOOLEAN_TYPE',x.id);
  if(x.operator==='GROUP_MEMBERS'&&(x.arguments[0]?.kind!=='ENTITY'||target(x.arguments[0])?.kind!=='GROUP'))fail('GROUP_MEMBERS_DIRECT_GROUP',x.id);
  if(['UNION','INTERSECTION','DIFFERENCE','SUBSET'].includes(x.operator)&&ts.some(t=>t!=='SET'))fail('SET_TYPE',x.id);
  if(x.operator==='CARDINALITY'&&ts[0]!=='SET')fail('CARDINALITY_TYPE',x.id);
  if(x.operator==='MEMBER'){const domain=target(x.arguments[1]);const numeric=['NUMBER','INTEGER','REAL'].includes(ts[0])&&ts[1]==='DOMAIN'&&['REAL_INTERVAL','INTEGER_RANGE'].includes(domain?.operator);const object=ts[0]==='OBJECT'&&ts[1]==='SET';if(!numeric&&!object)fail('MEMBERSHIP_TYPE',x.id);}
  if(['FORALL','EXISTS'].includes(x.operator)){if(x.bound_variable?.kind!=='VARIABLE'||!['SET','DOMAIN','EVENT_DOMAIN'].includes(ts[0])||ts[1]!=='BOOLEAN')fail('QUANTIFIER_BINDING',x.id);if(ts[0]==='EVENT_DOMAIN'&&target(x.bound_variable)?.type!=='EVENT')fail('EVENT_QUANTIFIER_VARIABLE',x.id);}else if(x.bound_variable!==null)fail('UNEXPECTED_BINDER',x.id);
  if(x.operator==='TASK_EVENTS'&&(x.arguments[0]?.kind!=='EVENT'||target(x.arguments[0])?.kind!=='TASK'))fail('TASK_EVENT_DOMAIN_OWNER',x.id);
  if(x.operator==='TASK_EXTERNAL_INPUTS'&&(x.arguments[0]?.kind!=='EVENT'||target(x.arguments[0])?.kind!=='TASK'))fail('TASK_INPUT_SET_OWNER',x.id);
  if(x.operator==='BOOLEAN'&&typeof x.literal!=='boolean'||x.operator==='NUMBER'&&typeof x.literal!=='number')fail('LITERAL_TYPE',x.id);
  if(!['BOOLEAN','NUMBER'].includes(x.operator)&&x.literal!==null)fail('UNEXPECTED_LITERAL',x.id);
  if(['REAL_INTERVAL','INTEGER_RANGE','LT','LTE','GT','GTE','ADD'].includes(x.operator)&&ts.some(t=>!['NUMBER','INTEGER','REAL','TIME'].includes(t)))fail('NUMERIC_TYPE',x.id);
  if(x.operator==='TRUE_AT_START'&&(ts[0]!=='STATE'||ts[1]!=='EVENT'))fail('START_STATE_TYPE',x.id);
  if(x.operator==='IMMEDIATE_AFTER'&&(ts[0]!=='STATE'||ts[1]!=='EVENT'))fail('IMMEDIATE_STATE_EVENT_TYPE',x.id);
  if(x.operator==='EVENT_INSTANCE'&&(x.arguments[0]?.kind!=='EVENT'||target(x.arguments[0])?.kind!=='TEMPLATE'||!['INTEGER','NUMBER'].includes(ts[1])))fail('INSTANCE_TYPE',x.id);
  if(x.operator==='STATE_VALUE'&&ts[0]!=='STATE'||x.operator==='EVENT_OCCURRED'&&ts[0]!=='EVENT')fail('STATE_EVENT_TYPE',x.id);
  if(['EVENT_START','EVENT_END','OBJECT_OF','RECIPIENT_OF','ENVIRONMENT_OF','PREVIOUS_INSTANCE'].includes(x.operator)&&ts[0]!=='EVENT')fail('EVENT_ARGUMENT_TYPE',x.id);
  if(x.operator==='STATE_ESTABLISHED'&&ts[0]!=='STATE')fail('STATE_TIME_TYPE',x.id);
  if(x.operator==='BEFORE'&&ts.some(t=>t!=='TIME'))fail('BEFORE_TIME_TYPE',x.id);
  if(x.operator==='EQ'&&ts.length===2&&ts[0]!==ts[1]&&!ts.every(t=>['NUMBER','INTEGER','REAL','TIME'].includes(t)))fail('EQUALITY_TYPE',x.id);
  return type;};
 for(const e of ir.expressions)expressionType({kind:'EXPRESSION',id:e.id});
 for(const v of ir.variables){if(v.domain.kind!=='EXPRESSION')fail('DOMAIN_REFERENCE',v.id);const t=expressionType(v.domain);if(!['SET','DOMAIN','EVENT_DOMAIN'].includes(t))fail('VARIABLE_DOMAIN_TYPE',v.id);if(v.type==='EVENT'&&t!=='EVENT_DOMAIN')fail('EVENT_VARIABLE_DOMAIN',v.id);}
 for(const r of ir.requirements){if(r.body.kind!=='EXPRESSION'||expressionType(r.body)!=='BOOLEAN')fail('REQUIREMENT_BOOLEAN_BODY',r.id);if(r.applicability&&(r.applicability.kind!=='EXPRESSION'||expressionType(r.applicability)!=='BOOLEAN'))fail('APPLICABILITY_TYPE',r.id);if(r.kind==='DATA_USE'?!r.data_use:r.data_use!==null)fail('DATA_USE_PAYLOAD',r.id);}
 const contains=(ref,id,seen=new Set())=>{if(ref.kind!=='ENTITY'||seen.has(ref.id))return false;const n=target(ref);return ref.id===id||n?.kind==='GROUP'&&n.members.some(x=>contains(x,id,new Set([...seen,ref.id])));};
 for(const r of ir.requirements.filter(r=>['EVENT_NORM','STOP'].includes(r.kind)))if(!r.subject||expressionType(r.subject)!=='EVENT')fail('EVENT_NORM_SUBJECT_REQUIRED',r.id);
 const eventNode=ref=>ref.kind==='EVENT'?target(ref):ref.kind==='EXPRESSION'&&target(ref)?.operator==='EVENT_INSTANCE'?target(target(ref).arguments[0]):null;
 // Variable identity must match exactly; overlapping domains do not establish identity.
 const dataBinding=(value,object)=>object.kind==='VARIABLE'?value.kind==='VARIABLE'&&value.id===object.id:contains(value,object.id);
 for(const r of ir.requirements.filter(x=>x.kind==='DATA_USE')){const d=r.data_use;if(d.object.kind!=='ENTITY'&&!(d.object.kind==='VARIABLE'&&target(d.object)?.type==='OBJECT')){fail('DATA_OBJECT_TYPE',r.id);continue;}const consumer=eventNode(d.consumer);if(!consumer||consumer.kind==='TASK')fail('DATA_CONSUMER_EVENT',r.id);else if(!consumer.roles.some(role=>['OBJECT','INPUT_OBJECT','BASIS','DELIVERABLE','CONTENT'].includes(role.role)&&dataBinding(role.value,d.object)))fail('DATA_CONSUMER_OBJECT_BINDING',r.id);
  if(d.origin==='EXTERNAL'&&d.producer)fail('EXTERNAL_DATA_HAS_TASK_PRODUCER',r.id);
  if(d.producer){const producer=eventNode(d.producer);if(!producer?.roles.some(role=>role.role==='RESULT'&&dataBinding(role.value,d.object)))fail('DATA_PRODUCER_OBJECT_BINDING',r.id);}
 }
 const units=(r,seen=new Set())=>{if(seen.has(r.id))return null;const n=target(r);if(!n)return null;if(r.kind==='VARIABLE')return units(n.domain,new Set([...seen,r.id]));if(r.kind!=='EXPRESSION')return null;if(['NUMBER','REAL_INTERVAL','INTEGER_RANGE'].includes(n.operator))return n.unit;if(n.operator==='CARDINALITY')return null;if(n.operator==='ADD')return units(n.arguments[0],new Set([...seen,r.id]));return null;};
 for(const x of ir.expressions){if(['REAL_INTERVAL','INTEGER_RANGE','ADD','LT','LTE','GT','GTE','EQ'].includes(x.operator)){const numeric=x.arguments.filter(a=>['NUMBER','INTEGER','REAL'].includes(expressionType(a)));const us=numeric.map(a=>units(a));if(new Set(us).size>1)fail('UNIT_MISMATCH',x.id,{units:us});if(['REAL_INTERVAL','INTEGER_RANGE'].includes(x.operator)&&us.some(u=>u!==x.unit))fail('DOMAIN_UNIT_MISMATCH',x.id);}
  if(x.operator==='INTEGER_RANGE'&&x.arguments.some(a=>a.kind==='EXPRESSION'&&target(a)?.operator==='NUMBER'&&!Number.isSafeInteger(target(a).literal)))fail('INTEGER_ENDPOINT',x.id);
  if(x.operator==='MEMBER'&&['NUMBER','INTEGER','REAL'].includes(expressionType(x.arguments[0]))&&units(x.arguments[0])!==units(x.arguments[1]))fail('UNIT_MISMATCH',x.id);
 }
 const validOwner=id=>id==='ROOT'||index.has(id);
 for(const e of ir.events)if(!validOwner(e.owner_id))fail('EVENT_OWNER_REFERENCE',e.id);
 for(const v of ir.variables)if(!validOwner(v.scope_id))fail('VARIABLE_SCOPE_REFERENCE',v.id);
 for(const r of ir.requirements)if(!validOwner(r.scope_id))fail('REQUIREMENT_SCOPE_REFERENCE',r.id);
 return {ok:errors.length===0,errors,semantic_acceptance:false,downstream_connected:false,source_validation:'EXACT_QUOTE_ONLY_NOT_INTERPRETATION_PROOF'};
}
