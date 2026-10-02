import Ajv from 'ajv';
import {definitions as original} from '../../../v0.3-core-skeleton/compiler/contracts/schema.mjs';
export const CONTRACT_VERSION='0.3-p2-coverage';
const str={type:'string',minLength:1},text={type:'string'},ids={type:'array',items:str,uniqueItems:true},ref=n=>({$ref:'#/$defs/'+n}),arr=n=>({type:'array',items:ref(n)}),en=s=>({type:'string',enum:s.split(' ')}),obj=(properties,required=Object.keys(properties))=>({type:'object',properties,required,additionalProperties:false}),variant=(key,value,p)=>obj({[key]:{const:value},...p}),stage=n=>({anyOf:[ref(n),ref('NotImplementedStage')]}),arrayStage=n=>({anyOf:[arr(n),ref('NotImplementedStage')]}),prov={expr_id:str,source_span_ids:ids,relation_ids:ids};
export const definitions=structuredClone(original);
for(const name of ['SetExpr','ConditionExpr','QuantityOperator','QuantityExpr','BoundaryAST'])delete definitions[name];
Object.assign(definitions,{
 StructureNodeKind:en('ROOT HEADING PARAGRAPH CLAUSE LIST LIST_ITEM TABLE TABLE_ROW TABLE_CELL'),
 StructureNode:obj({structure_node_id:str,kind:ref('StructureNodeKind'),parent_id:str,child_ids:ids,source_span_ids:ids,ordinal:{type:'integer',minimum:0}},['structure_node_id','kind','child_ids','source_span_ids']),
 Clause:obj({clause_id:str,structure_node_id:str,source_span_ids:ids,parent_clause_id:str,child_clause_ids:ids,clause_kind:en('DECLARATIVE CONDITIONAL NEGATIVE SEQUENTIAL LIST_ITEM OTHER')},['clause_id','structure_node_id','source_span_ids','child_clause_ids','clause_kind']),
 StructureTree:obj({root_structure_node_id:str,nodes:arr('StructureNode'),clauses:arr('Clause')}),
 EligibilityDisposition:en('BOUNDARY AUXILIARY OUTSIDE_ENVELOPE UNRESOLVED COVERAGE_FAILURE'),
 EligibilityReasonCode:en('EXPLICIT_TASK_SCOPE POSITIVE_ACTION_TARGET EXPLICIT_DELIVERABLE PARTICIPATION_RELATION RESOURCE_LIMIT NORMATIVE_BASIS COMPLETION_OR_STOP FORBIDDEN_OR_RESTRICTED AUXILIARY_CONDITION AUXILIARY_SEQUENCE AUXILIARY_QUANTITY OUTSIDE_BOUNDARY_ENVELOPE INSUFFICIENT_SEMANTIC_EVIDENCE PARSER_COVERAGE_FAILURE'),
 EligibilityDecision:obj({eligibility_decision_id:str,disposition:ref('EligibilityDisposition'),candidate_relation_ids:ids,candidate_node_ids:ids,proposed_fact_type:ref('BoundaryFactType'),reason_code:ref('EligibilityReasonCode'),unresolved_ref:str,source_span_ids:ids},['eligibility_decision_id','disposition','candidate_relation_ids','candidate_node_ids','reason_code','source_span_ids']),
 SetExprNode:{oneOf:[variant('kind','ITEM',{...prov,entity_node_id:str}),...['ALL','ANY'].map(k=>variant('kind',k,{...prov,base_entity_node_id:str})),...['UNION','INTERSECTION'].map(k=>variant('kind',k,{...prov,operand_expr_ids:ids})),variant('kind','EXCEPT',{...prov,base_expr_id:str,excluded_expr_id:str})]},
 ConditionExprNode:{oneOf:[variant('op','STATE_REF',{...prov,state_node_id:str}),variant('op','RELATION_REF',{...prov,relation_id:str}),variant('op','BOUNDARY_FACT_REF',{...prov,boundary_fact_id:str}),...['AND','OR'].map(k=>variant('op',k,{...prov,operand_expr_ids:ids})),variant('op','NOT',{...prov,operand_expr_id:str})]},
 QuantityMetric:en('COUNT TIME BUDGET SIZE PERCENT RATE OTHER'),
 QuantityExprNode:obj({...prov,metric:ref('QuantityMetric'),target_node_ids:ids,lower_bound:obj({inclusive:{type:'boolean'},value:{type:['number','string']}}),upper_bound:obj({inclusive:{type:'boolean'},value:{type:['number','string']}}),unit:text,value_node_ids:ids},['expr_id','metric','target_node_ids','value_node_ids','source_span_ids','relation_ids']),
 BoundaryIR:obj({boundary_ir_id:str,facts:arr('BoundaryFact'),set_expr_nodes:arr('SetExprNode'),condition_expr_nodes:arr('ConditionExprNode'),quantity_expr_nodes:arr('QuantityExprNode'),unresolved_refs:ids,status:en('RESOLVED PARTIALLY_RESOLVED UNRESOLVED')}),
 SlotStatus:en('RESOLVED UNRESOLVED ABSENT PARSER_COVERAGE_FAILURE'),
 CanonicalSlotResult:obj({slot:ref('CanonicalSlot'),status:ref('SlotStatus'),entries:arr('CanonicalEntry')}),
 Canonical7Plus1:obj({projection_id:str,...Object.fromEntries('IOAP RVCB'.replaceAll(' ','').split('').map(s=>[s,ref('CanonicalSlotResult')]))}),
 CoverageDisposition:en('BOUNDARY AUXILIARY OUTSIDE_ENVELOPE UNRESOLVED NON_TASK_TEXT COVERAGE_FAILURE'),
 CoverageRecord:obj({coverage_record_id:str,structure_node_id:str,clause_id:str,source_span_ids:ids,disposition:ref('CoverageDisposition'),eligibility_decision_ids:ids,boundary_fact_ids:ids,unresolved_refs:ids,reason:str},['coverage_record_id','source_span_ids','disposition','eligibility_decision_ids','boundary_fact_ids','unresolved_refs','reason'])
});
Object.assign(definitions.CoverageRecord.properties,{
 affected_slots:{type:'array',items:ref('CanonicalSlot'),uniqueItems:true},
 impact_kind:en('MAY_ADD_ENTRY MAY_CHANGE_ENTRY MAY_CHANGE_CONDITION MAY_CHANGE_SCOPE MAY_CHANGE_STATUS'),
 impact_evidence:{type:'object'}
});
definitions.CoverageRecord.required.push('affected_slots','impact_kind','impact_evidence');
for(const name of ['BoundaryFact','CanonicalEntry']){
 const d=definitions[name];for(const key of ['scope','condition','quantity']){delete d.properties[key];d.properties[key+'_expr_id']=str;}
}
export const proofFields={CANONICAL_ENTRY:'canonical_entry_id',BOUNDARY_FACT:'boundary_fact_id',RELATION:'relation_id',SEMANTIC_NODE:'semantic_node_id',SPAN_CANDIDATE:'span_candidate_id',SOURCE_SPAN:'source_span_id',STRUCTURE_NODE:'structure_node_id',CLAUSE:'clause_id',ELIGIBILITY_DECISION:'eligibility_decision_id',SET_EXPR:'expr_id',CONDITION_EXPR:'expr_id',QUANTITY_EXPR:'expr_id',COVERAGE_RECORD:'coverage_record_id',CANONICAL_SLOT_RESULT:'canonical_slot_result_id'};
definitions.ProofNode={oneOf:Object.entries(proofFields).map(([kind,key])=>variant('kind',kind,{id:str,[key]:str}))};
const c=definitions.CompilerExecutionContext.properties;
delete c.boundary_ast;c.structure=stage('StructureTree');c.relations=arrayStage('DecodedRelation');c.eligibility_decisions=arrayStage('EligibilityDecision');c.coverage=arrayStage('CoverageRecord');c.boundary_ir=stage('BoundaryIR');c.canonical_7plus1=stage('Canonical7Plus1');definitions.CompilerExecutionContext.required=Object.keys(c);
export const schemaFor=name=>{if(!definitions[name])throw Error('UNKNOWN_CONTRACT '+name);return {$schema:'http://json-schema.org/draft-07/schema#',$id:'urn:boundx:parser:'+CONTRACT_VERSION+':'+name,'x-contract-version':CONTRACT_VERSION,$ref:'#/$defs/'+name,$defs:definitions};};
const ajv=new Ajv({strict:false,allErrors:true}),validators=new Map();
export function validateContract(name,data){if(!validators.has(name))validators.set(name,ajv.compile(schemaFor(name)));const fn=validators.get(name);return {valid:fn(data),errors:structuredClone(fn.errors??[])};}
export function assertContract(name,data){const v=validateContract(name,data);if(!v.valid)throw Error('CONTRACT_INVALID '+name+' '+JSON.stringify(v.errors));return data;}
export const makeContract=(name,data)=>structuredClone(assertContract(name,data));
export const serialize=(name,data)=>JSON.stringify({schema_id:schemaFor(name).$id,contract_version:CONTRACT_VERSION,data:assertContract(name,data)});
export function deserialize(name,s){const e=JSON.parse(s);if(e.schema_id!==schemaFor(name).$id||e.contract_version!==CONTRACT_VERSION||Object.keys(e).sort().join()!=='contract_version,data,schema_id')throw Error('CONTRACT_VERSION_OR_SCHEMA_MISMATCH');return assertContract(name,e.data);}
export const notImplemented=reason=>assertContract('NotImplementedStage',{status:'NOT_IMPLEMENTED',reason});
