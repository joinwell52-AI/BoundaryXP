// Typed boundary declarations -> existing candidate-ir/2.0. No text inference.
import Ajv from 'ajv';
import {v2Schema} from '../../../src/bxp/ir-kernel/contract-registry.mjs';
import {sha256} from './source.mjs';
const str={type:'string',minLength:1}, nullable=s=>({anyOf:[s,{type:'null'}]}), list=s=>({type:'array',items:s});
const obj=p=>({type:'object',additionalProperties:false,properties:p,required:Object.keys(p)});
const en=values=>({type:'string',enum:values});
const ids=list(str), source={source_refs:{...ids,minItems:1}}, named={id:str,...source,label:str};
const role=obj({role:v2Schema.properties.events.items.properties.roles.items.properties.role,value:str});
const match=obj({operation:nullable(v2Schema.properties.events.items.properties.operation),actors:ids,objects:ids,recipients:ids});
const condition={$ref:'#/$defs/condition'};
const gateCondition={$ref:'#/$defs/gateCondition'};
const common={id:str,...source,scope:str};
const rule=(type,p)=>obj({...common,type:{const:type},...p});
export const rulesFormat='boundx-boundary-rules/1';
export const rulesAuditFormat='boundx-boundary-rules-audit/1';
export const rulesSchema={...obj({format:{const:rulesFormat},
  sources:list(obj({id:str,quote:str,occurrence:{type:'integer',minimum:1}})),
  tasks:{...list(obj({...named,parent:nullable(str),roles:list(role)})),minItems:1},
  objects:list(obj({...named,kind:v2Schema.properties.entities.items.properties.kind,scope:str,members:ids})),
  actions:list(obj({...named,scope:str,operation:v2Schema.properties.events.items.properties.operation,roles:list(role)})),
  states:list(obj({...named,kind:en(['SUCCESS','FAILURE','RECEIPT','CONTROL_EFFECT','EXTERNAL']),subject:nullable(str),arguments:ids})),
  rules:{type:'array',items:{anyOf:[
    rule('INPUT_SCOPE',{members:ids}),rule('ENVIRONMENT',{environment:str}),
    rule('NORM',{action:str,modality:en(['REQUIRED','PERMITTED','NOT_REQUIRED']),when:nullable(condition)}),
    rule('FORBID',{match,during_state:nullable(str)}),
    rule('GATE',{match,condition:gateCondition}),
    rule('CHOICE',{action:str,actor:str,options:{...ids,minItems:1},excluded:ids,locked:{const:true},first_required:{type:'boolean'}}),
    rule('RETRY',{action:str,max_extra:{type:'integer',minimum:0,maximum:9999},previous_failure_required:{type:'boolean'},match}),
    rule('DATA_USE',{object:str,consumer:str,producer:nullable(str),availability:en(['AT_USE','COMPLETE_RESULT']),origin:en(['EXTERNAL','INTERNAL'])}),
    rule('DURATION',{lower:str,upper:str,lower_inclusive:{type:'boolean'},upper_inclusive:{type:'boolean'},unit:en(['second','minute','hour'])}),
    rule('COMPLETION',{condition}),
    rule('RESPONSE',{trigger:str,action:str,immediate:{type:'boolean'}}),
    rule('CONTROL_EFFECT',{action:str,state:str}),
  ]}},
  gaps:list(obj({id:str,...source,reason:str})),
}),$defs:{condition:{anyOf:[obj({state:str}),obj({completed:str}),obj({all:{...list(condition),minItems:1}}),obj({any:{...list(condition),minItems:1}}),obj({not:condition})]},gateCondition:{anyOf:[obj({state:str}),obj({all:{...list(gateCondition),minItems:1}}),obj({any:{...list(gateCondition),minItems:1}})]}}};
export const rulesAuditSchema=obj({format:{const:rulesAuditFormat},candidate_sha256:str,examined_sources:ids,
  verdicts:list(obj({id:str,verdict:en(['SUPPORT','CONTRADICT','UNDECIDED']),reason:str})),
  omissions:list(obj({...source,reason:str})),
});
const ajv=new Ajv({strict:false,allErrors:true}),validate=ajv.compile(rulesSchema),validateAudit=ajv.compile(rulesAuditSchema);
const stable=x=>Array.isArray(x)?x.map(stable):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,stable(x[k])])):x;
const digest=x=>sha256(JSON.stringify(stable(x)));
export function lowerBoundaryRules(wire){
  if(!validate(wire))throw Error('BOUNDARY_RULE_SCHEMA:'+JSON.stringify(validate.errors));
  const w=structuredClone(wire),groups={},by=new Map(),kind=new Map(),reserved=new Set();
  const declare=(id,k)=>{if(reserved.has(id)||id.includes('~'))throw Error('BOUNDARY_RULE_ID:'+id);reserved.add(id);kind.set(id,k);};
  for(const s of w.sources)declare(s.id,'SOURCE');
  for(const [key,k]of [['tasks','EVENT'],['objects','ENTITY'],['actions','EVENT'],['states','STATE'],['rules','RULE'],['gaps','GAP']])for(const row of w[key]){declare(row.id,k);by.set(row.id,row);groups[row.id]=[];for(const s of row.source_refs)if(kind.get(s)!=='SOURCE')throw Error('BOUNDARY_RULE_SOURCE:'+s);}
  const roots=w.tasks.filter(t=>t.parent===null);if(roots.length!==1)throw Error('BOUNDARY_RULE_ROOT');const root=roots[0].id;
  const ir={format:'boundx-candidate-ir/1',contract_version:'candidate-ir/2.0',source_table:w.sources,entities:[],variables:[],events:[],states:[],expressions:[],requirements:[],issues:[],coverage:[],root_task:{kind:'EVENT',id:root},sequences:[]};
  const choices=w.rules.filter(r=>r.type==='CHOICE'),retries=w.rules.filter(r=>r.type==='RETRY');
  for(const r of choices)kind.set(r.id,'VARIABLE');
  const ref=(id,expected)=>{const k=kind.get(id);if(!['ENTITY','VARIABLE','EVENT','STATE'].includes(k)||expected&&k!==expected)throw Error('BOUNDARY_RULE_REFERENCE:'+id);return {kind:k,id};};
  const scope=id=>{if(!w.tasks.some(t=>t.id===id))throw Error('BOUNDARY_RULE_SCOPE:'+id);return id;};
  let owner=null,counter=0;
  const context=row=>{owner=row;counter=0;};
  const add=(collection,node)=>{ir[collection].push(node);groups[owner.id].push({kind:({entities:'ENTITY',variables:'VARIABLE',events:'EVENT',states:'STATE',expressions:'EXPRESSION',requirements:'REQUIREMENT'})[collection],id:node.id});return groups[owner.id].at(-1);};
  const auto=()=>owner.id+'~'+(++counter);
  const expr=(operator,args=[],literal=null,unit=null,bound_variable=null)=>add('expressions',{id:auto(),source_refs:owner.source_refs,operator,arguments:args,literal,unit,bound_variable});
  const variable=(type,domain,binding_mode,ownerRef=null,id=auto())=>add('variables',{id,source_refs:owner.source_refs,label:owner.id,type,domain,binding_mode,scope_id:scope(owner.scope),owner:ownerRef});
  const state=(stateKind,subject,arguments_=[],id=auto())=>add('states',{id,source_refs:owner.source_refs,label:owner.id,kind:stateKind,subject,arguments:arguments_});
  const req=(type,views,body,{subject={kind:'EVENT',id:owner.scope},modality='REQUIRED',when=null,data=null}={})=>add('requirements',{id:auto(),source_refs:owner.source_refs,kind:type,views,scope_id:scope(owner.scope),modality,subject,applicability:when,body,data_use:data,note:''});
  const n=(value,unit=null)=>expr('NUMBER',[],String(value),unit),and=xs=>xs.length===1?xs[0]:expr('AND',xs);
  const conditionExpr=(c,event=null)=>{
    if(c.state)return event?expr('TRUE_AT_START',[ref(c.state,'STATE'),event]):expr('STATE_VALUE',[ref(c.state,'STATE')]);
    if(c.completed){if(event)throw Error('BOUNDARY_GATE_REQUIRES_STATE');return expr('EVENT_COMPLETED',[ref(c.completed,'EVENT')]);}
    if(c.all)return and(c.all.map(x=>conditionExpr(x,event)));
    if(c.any)return expr('OR',c.any.map(x=>conditionExpr(x,event)));
    // A negated established-at-start test does not mean a false state at start.
    if(c.not){if(event)throw Error('BOUNDARY_NEGATED_GATE_UNSUPPORTED');return expr('NOT',[conditionExpr(c.not)]);}
    throw Error('BOUNDARY_CONDITION');
  };
  const domain=()=>expr('TASK_EVENTS',[ref(owner.scope,'EVENT')]);
  const eventVar=dom=>variable('EVENT',dom,'INSTANCE_LOCAL');
  const matches=(m,v)=>{
    const parts=[expr('EVENT_OCCURRED',[v])];
    if(m.operation!==null)parts.push(expr('EQ',[expr('OPERATION_OF',[v]),expr('SYMBOL',[],m.operation)]));
    for(const [ids,op]of [[m.actors,'ACTORS_OF'],[m.objects,'TARGETS_OF'],[m.recipients,'RECIPIENTS_OF']])if(ids.length){const set=expr(op,[v]);const terms=ids.map(id=>expr('MEMBER',[ref(id),set]));parts.push(terms.length===1?terms[0]:expr('OR',terms));}
    return and(parts);
  };
  const roles=row=>row.roles.map(r=>({role:r.role,value:ref(r.value),source_refs:row.source_refs}));
  for(const row of w.objects){context(row);add('entities',{id:row.id,source_refs:row.source_refs,label:row.label,kind:row.kind,instance_scope:scope(row.scope),members:row.members.map(id=>ref(id,'ENTITY'))});}
  for(const row of w.tasks){context(row);add('events',{id:row.id,source_refs:row.source_refs,label:row.label,kind:'TASK',layer:'MAIN',use:'CURRENT_TASK',owner_id:row.parent===null?row.id:scope(row.parent),operation:'OTHER',operation_extent:'OPEN',actor_domain:'EXPLICIT',roles:roles(row)});}
  const templateActions=new Set(retries.map(r=>r.action));
  if(templateActions.size!==retries.length)throw Error('BOUNDARY_DUPLICATE_RETRY');
  for(const row of w.actions){context(row);add('events',{id:row.id,source_refs:row.source_refs,label:row.label,kind:templateActions.has(row.id)?'TEMPLATE':'ACTION',layer:'MAIN',use:'CURRENT_TASK',owner_id:scope(row.scope),operation:row.operation,operation_extent:row.operation==='OTHER'?'OPEN':'EXACT',actor_domain:row.roles.some(r=>['PERFORMER','REVIEWER','ORGANIZER'].includes(r.role))?'EXPLICIT':'TASK_SCOPE',roles:roles(row)});}
  for(const row of w.states){context({...row,scope:root});const subject=row.subject===null?null:ref(row.subject);add('states',{id:row.id,source_refs:row.source_refs,label:row.label,kind:row.kind,subject,arguments:row.arguments.map(id=>ref(id))});
    if(['SUCCESS','FAILURE','RECEIPT'].includes(row.kind)&&subject?.kind!=='EVENT')throw Error('BOUNDARY_STATE_EVENT');
    if(row.kind==='SUCCESS')req('CONSTRAINT',['A','C'],expr('IFF',[expr('STATE_VALUE',[ref(row.id)]),expr('EVENT_SUCCEEDED',[subject])]),{subject:ref(row.id)});
    if(row.kind==='RECEIPT'){if(row.arguments.length!==2)throw Error('BOUNDARY_RECEIPT_ARGUMENTS');req('CONSTRAINT',['I','P'],expr('IFF',[expr('STATE_VALUE',[ref(row.id)]),expr('RECEIVED_COMPLETE',[...row.arguments.map(id=>ref(id)),subject])]),{subject:ref(row.id)});}
  }
  for(const r of w.rules){context(r);scope(r.scope);const task=ref(r.scope,'EVENT');
    if(r.type==='INPUT_SCOPE')req('CONSTRAINT',['I'],expr('SUBSET',[expr('TASK_EXTERNAL_INPUTS',[task]),expr('SET',r.members.map(id=>ref(id,'ENTITY')))]));
    else if(r.type==='ENVIRONMENT'){const dom=domain(),v=eventVar(dom);req('CONSTRAINT',['R'],expr('FORALL',[dom,expr('IMPLIES',[expr('EVENT_OCCURRED',[v]),expr('EQ',[expr('ENVIRONMENT_OF',[v]),ref(r.environment,'ENTITY')])])],null,null,v));}
    else if(r.type==='NORM'){const event=templateActions.has(r.action)?expr('EVENT_INSTANCE',[ref(r.action,'EVENT'),n(1)]):ref(r.action,'EVENT');req('EVENT_NORM',['A','P','O'],expr('EVENT_COMPLETED',[event]),{subject:event,modality:r.modality,when:r.when?conditionExpr(r.when):null});}
    else if(r.type==='FORBID'){const dom=domain(),v=eventVar(dom);let predicate=matches(r.match,v);if(r.during_state)predicate=and([predicate,expr('ACTIVE_WHILE',[v,ref(r.during_state,'STATE')])]);req('CONSTRAINT',['B'],expr('EXISTS',[dom,predicate],null,null,v),{modality:'FORBIDDEN'});}
    else if(r.type==='GATE'){const dom=domain(),v=eventVar(dom);req('CONSTRAINT',['A','B'],expr('FORALL',[dom,expr('IMPLIES',[matches(r.match,v),conditionExpr(r.condition,v)])],null,null,v));}
    else if(r.type==='CHOICE'){
      if(!r.options.length)throw Error('BOUNDARY_EMPTY_CHOICE_DOMAIN');const action=by.get(r.action);if(!w.actions.includes(action)||action.scope!==r.scope)throw Error('BOUNDARY_CHOICE_ACTION');
      if(!action.roles.some(x=>x.role==='OBJECT'&&x.value===r.id)||!action.roles.some(x=>x.role==='PERFORMER'&&x.value===r.actor))throw Error('BOUNDARY_CHOICE_BINDING');
      if(!r.locked)throw Error('BOUNDARY_NONFIXED_CHOICE_UNSUPPORTED');
      const allowed=expr('DIFFERENCE',[expr('SET',r.options.map(id=>ref(id,'ENTITY'))),expr('SET',r.excluded.map(id=>ref(id,'ENTITY')))]);
      const choice=variable('OBJECT',allowed,'TASK_FIXED',ref(r.actor,'ENTITY'),r.id);req('CONSTRAINT',['I','R'],expr('MEMBER',[choice,allowed]),{subject:choice});
      if(r.first_required){const first=templateActions.has(r.action)?expr('EVENT_INSTANCE',[ref(r.action),n(1)]):ref(r.action);req('EVENT_NORM',['A','P'],expr('EVENT_OCCURRED',[first]),{subject:first});}
      const dom=domain(),v=eventVar(dom),selected=expr('SELECT_EVENTS',[dom,matches({operation:action.operation,actors:[r.actor],objects:r.options,recipients:[]},v)],null,null,v);
      req('CONSTRAINT',['I','B'],expr('FORALL',[selected,expr('EQ',[expr('TARGETS_OF',[v]),expr('SET',[choice])])],null,null,v));
    }
    else if(r.type==='RETRY'){
      const action=by.get(r.action);if(!w.actions.includes(action)||action.scope!==r.scope)throw Error('BOUNDARY_RETRY_ACTION');
      const count=r.max_extra+1,range=expr('INTEGER_RANGE',[n(1),n(count)]),i=variable('INTEGER',range,'INSTANCE_LOCAL',ref(r.action));
      const instance=expr('EVENT_INSTANCE',[ref(r.action),i]);
      ir.sequences.push({template:ref(r.action),task,index_base:1,max_instances:count,coverage:'BOUNDED_DECLARATION',source_refs:r.source_refs});
      const dom=domain(),v=eventVar(dom),selected=expr('SELECT_EVENTS',[dom,matches(r.match,v)],null,null,v);
      req('CONSTRAINT',['R'],expr('LTE',[expr('COUNT_STARTED',[selected]),n(count)]));
      req('CONSTRAINT',['A','R'],expr('FORALL',[selected,expr('EXISTS',[range,expr('EQ',[v,instance])],null,null,i)],null,null,v));
      if(r.max_extra&&r.previous_failure_required){const failure=state('FAILURE',expr('PREVIOUS_INSTANCE',[instance]));const gate=expr('FORALL',[expr('INTEGER_RANGE',[n(2),n(count)]),expr('IMPLIES',[expr('EVENT_OCCURRED',[instance]),expr('TRUE_AT_START',[failure,instance])])],null,null,i);req('CONSTRAINT',['A','B'],gate);req('EVENT_NORM',['A','R'],gate,{subject:ref(r.action),modality:'PERMITTED'});}
      else if(r.max_extra)req('EVENT_NORM',['A','R'],expr('BOOLEAN',[],true),{subject:ref(r.action),modality:'PERMITTED'});
    }
    else if(r.type==='DATA_USE')req('DATA_USE',['I','O'],expr('BOOLEAN',[],true),{subject:ref(r.consumer,'EVENT'),data:{object:ref(r.object),consumer:ref(r.consumer,'EVENT'),producer:r.producer===null?null:ref(r.producer,'EVENT'),origin:r.origin,availability:r.availability}});
    else if(r.type==='DURATION'){const lo=n(r.lower,r.unit),hi=n(r.upper,r.unit),v=variable('REAL',expr('REAL_INTERVAL',[lo,hi]),'OBSERVATION',task);req('TOTAL_DURATION',['R'],and([expr(r.lower_inclusive?'GTE':'GT',[v,lo]),expr(r.upper_inclusive?'LTE':'LT',[v,hi])]),{subject:v});}
    else if(r.type==='COMPLETION'){const s=state('COMPLETION',task);req('COMPLETION',['C'],expr('IFF',[expr('STATE_VALUE',[s]),conditionExpr(r.condition)]),{subject:s});}
    else if(r.type==='RESPONSE'){const trigger=ref(r.trigger,'STATE'),action=ref(r.action,'EVENT');req('EVENT_NORM',['A','C'],expr('EVENT_COMPLETED',[action]),{subject:action,when:expr('STATE_VALUE',[trigger])});if(r.immediate)req('CONSTRAINT',['C'],expr('IMMEDIATE_AFTER',[trigger,action]),{subject:action});}
    else if(r.type==='CONTROL_EFFECT'){const action=ref(r.action,'EVENT'),s=ref(r.state,'STATE');req('CONSTRAINT',['C'],and([expr('LTE',[expr('EVENT_START',[action]),expr('STATE_ESTABLISHED',[s])]),expr('LTE',[expr('STATE_ESTABLISHED',[s]),expr('EVENT_END',[action])])]),{subject:action});}
    else throw Error('BOUNDARY_RULE_TYPE');
  }
  for(const g of w.gaps)ir.issues.push({id:g.id,source_refs:g.source_refs,kind:'EXPRESSION_GAP',targets:[],field_path:'',alternatives:[],reason:g.reason});
  for(const s of w.sources){const entries=[...by.values()].filter(row=>row.source_refs.includes(s.id)),gap=w.gaps.filter(g=>g.source_refs.includes(s.id));ir.coverage.push({source_refs:[s.id],node_refs:entries.flatMap(row=>groups[row.id]),status:gap.length||!entries.length?'GAP':'EXPRESSED',reason:gap.map(g=>g.reason).join('; ')||'Typed boundary declarations'});}
  return {ir,groups};
}
export const rulesReviewInput=wire=>({...wire,audit_binding:{candidate_sha256:digest(wire)}});
export function expandRulesAudit(value,candidate){
  if(!validateAudit(value))throw Error('BOUNDARY_RULE_AUDIT_SCHEMA:'+JSON.stringify(validateAudit.errors));
  const {audit_binding,technical_precheck,...wire}=candidate;
  if(value.candidate_sha256!==digest(wire)||value.candidate_sha256!==audit_binding?.candidate_sha256)throw Error('BOUNDARY_RULE_AUDIT_DIGEST');
  const {ir,groups}=lowerBoundaryRules(wire),sourceIds=new Set(wire.sources.map(s=>s.id)),seen=new Set(),reviews=[];
  if(value.examined_sources.some(id=>!sourceIds.has(id))||new Set(value.examined_sources).size!==value.examined_sources.length)throw Error('BOUNDARY_RULE_AUDIT_SOURCE');
  for(const row of value.verdicts){if(!groups[row.id]||seen.has(row.id))throw Error('BOUNDARY_RULE_AUDIT_TARGET');seen.add(row.id);const source_refs=[...wire.tasks,...wire.objects,...wire.actions,...wire.states,...wire.rules,...wire.gaps].find(r=>r.id===row.id).source_refs;
    for(const target of groups[row.id])reviews.push({target,field_path:'',verdict:row.verdict,context_refs:[],source_refs,reason:row.reason});
    if(row.verdict==='SUPPORT')for(const sequence of ir.sequences.filter(s=>s.source_refs.every(id=>source_refs.includes(id))&&wire.rules.find(r=>r.id===row.id)?.type==='RETRY'))reviews.push({target:sequence.template,field_path:'sequence',verdict:'SUPPORT',context_refs:[],source_refs,reason:row.reason});
  }
  const omissions=value.omissions.map(o=>({...o,affected_views:[],repairability:'REPAIRABLE'}));
  for(const s of sourceIds)if(!value.examined_sources.includes(s))omissions.push({source_refs:[s],affected_views:[],reason:'Source not examined',repairability:'REPAIRABLE'});
  for(const [id,targets]of Object.entries(groups))if(targets.length&&!seen.has(id))omissions.push({source_refs:[...wire.tasks,...wire.objects,...wire.actions,...wire.states,...wire.rules].find(r=>r.id===id).source_refs,affected_views:[],reason:'Boundary not examined: '+id,repairability:'REPAIRABLE'});
  return {format:'boundx-candidate-ir-audit/1',contract_version:'candidate-ir/2.0',source_table:ir.source_table,reviews,issues:[],omissions};
}
