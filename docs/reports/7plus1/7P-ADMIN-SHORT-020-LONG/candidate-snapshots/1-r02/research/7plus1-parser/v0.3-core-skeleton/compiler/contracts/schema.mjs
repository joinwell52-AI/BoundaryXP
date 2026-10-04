import Ajv from 'ajv';
export const CONTRACT_VERSION='0.3';
const str={type:'string',minLength:1},text={type:'string'},num={type:'number'},ids={type:'array',items:str,uniqueItems:true},strings={type:'array',items:text},ref=n=>({$ref:'#/$defs/'+n}),arr=n=>({type:'array',items:ref(n)}),enumeration=values=>({type:'string',enum:values.split(' ')});
const obj=(properties,required=Object.keys(properties))=>({type:'object',properties,required,additionalProperties:false});
const variant=(key,value,properties)=>obj({[key]:{const:value},...properties});
export const definitions={
 EvidenceTier:enumeration('HARD STRONG AMBIGUOUS CONTRADICTED'),
 SourceSpan:obj({span_id:str,start:{type:'integer',minimum:0},end:{type:'integer',minimum:0},text}),
 SpanCandidateType:enumeration('ENTITY EVENT STATE VALUE REFERENCE CONDITION DISCOURSE UNKNOWN'),
 SpanCandidateStatus:enumeration('CANDIDATE SELECTED SUPPRESSED UNRESOLVED'),
 LiteralTag:enumeration('FILEPATH URI VERSION COMMIT TICKET ADR POLICY REFERENCE NUMBER PERCENT DURATION DATETIME PERSON ROLE SYSTEM SERVICE'),
 SpanCandidate:obj({span_candidate_id:str,source_span_id:str,candidate_type:ref('SpanCandidateType'),literal_tag:ref('LiteralTag'),status:ref('SpanCandidateStatus'),evidence_tier:ref('EvidenceTier'),confidence_score:num,provider_refs:ids,diagnostic_refs:ids},['span_candidate_id','source_span_id','candidate_type','status','evidence_tier','provider_refs','diagnostic_refs']),
 SpanLatticeEdgeType:enumeration('CONTAINS OVERLAPS COMPETES_WITH CAN_COEXIST'),
 SpanLatticeEdge:obj({edge_id:str,edge_type:ref('SpanLatticeEdgeType'),from_span_candidate_id:str,to_span_candidate_id:str}),
 SpanLattice:obj({source_id:str,candidates:arr('SpanCandidate'),edges:arr('SpanLatticeEdge')}),
 SemanticNodeType:enumeration('ENTITY EVENT STATE VALUE REFERENCE CONDITION DISCOURSE UNKNOWN_REFERENT'),
 SemanticNode:obj({node_id:str,node_type:ref('SemanticNodeType'),surface:text,normalized:{type:['string','null']},span_candidate_ids:ids,source_span_ids:ids,evidence_tier:ref('EvidenceTier'),state:enumeration('RESOLVED UNRESOLVED'),unresolved_ref:str,metadata:{type:'object'}},['node_id','node_type','surface','span_candidate_ids','source_span_ids','evidence_tier','state','metadata']),
 RelationType:enumeration('AGENT PATIENT THEME RESULT RECIPIENT LOCATION BASIS CONFORMS_TO SCOPE_MEMBER LIMIT CONDITION_OF COMPLETION_OF STOP_OF APPROVAL_OF FORBIDS RESTRICTS COREFERENCE CONJUNCTION SEQUENCE'),
 DecodedRelation:obj({relation_id:str,clause_id:str,relation_type:ref('RelationType'),head_node_id:str,tail_node_id:str,evidence_span_ids:ids,evidence_tier:ref('EvidenceTier'),state:enumeration('RESOLVED UNRESOLVED REJECTED'),unresolved_ref:str,confidence_score:num,model_signal_refs:ids,rule_refs:ids},['relation_id','clause_id','relation_type','head_node_id','tail_node_id','evidence_span_ids','evidence_tier','state','model_signal_refs','rule_refs']),
 RelationBundle:obj({bundle_id:str,clause_ids:ids,relation_ids:ids,bundle_state:enumeration('RESOLVED PARTIALLY_RESOLVED UNRESOLVED'),unresolved_refs:ids}),
 UnresolvedKind:enumeration('UNRESOLVED_AMBIGUOUS UNRESOLVED_COREFERENCE UNRESOLVED_SCOPE UNRESOLVED_RELATION UNRESOLVED_QUANTIFICATION'),
 UnresolvedRecord:obj({unresolved_id:str,kind:ref('UnresolvedKind'),related_span_candidate_ids:ids,related_node_ids:ids,related_relation_ids:ids,related_clause_ids:ids,reason:str,human_question:text,evidence_tier:ref('EvidenceTier')},['unresolved_id','kind','related_span_candidate_ids','related_node_ids','related_relation_ids','related_clause_ids','reason','evidence_tier']),
 SetExpr:{oneOf:[variant('type','ITEM',{entity_node_id:str}),variant('type','ALL',{base_entity_node_id:str}),variant('type','ANY',{base_entity_node_id:str}),...['UNION','INTERSECTION'].map(v=>variant('type',v,{operands:arr('SetExpr')})),variant('type','EXCEPT',{base:ref('SetExpr'),excluded:ref('SetExpr')})]},
 ConditionExpr:{oneOf:[variant('op','STATE_REF',{state_node_id:str}),variant('op','RELATION_REF',{relation_id:str}),variant('op','BOUNDARY_FACT_REF',{boundary_fact_id:str}),...['AND','OR'].map(v=>variant('op',v,{operands:arr('ConditionExpr')})),variant('op','NOT',{operand:ref('ConditionExpr')})]},
 QuantityOperator:enumeration('EQ LT LTE GT GTE'),
 QuantityExpr:obj({op:ref('QuantityOperator'),value:{type:['number','string']},unit:text,value_node_id:str},['op','value','value_node_id']),
 BoundaryFactType:enumeration('TASK_OBJECT DELIVERABLE ACTION PARTICIPANT RESOURCE BASELINE COMPLETION STOP FORBID RESTRICT AUX_CONDITION AUX_SEQUENCE AUX_QUANTITY'),
 BoundaryFact:obj({boundary_fact_id:str,fact_type:ref('BoundaryFactType'),state:enumeration('RESOLVED UNRESOLVED'),unresolved_ref:str,subject_node_ids:ids,predicate_node_id:str,object_node_ids:ids,participant_node_ids:ids,scope:ref('SetExpr'),condition:ref('ConditionExpr'),quantity:ref('QuantityExpr'),relation_ids:ids,node_ids:ids,source_span_ids:ids,eligibility_decision_id:str},['boundary_fact_id','fact_type','state','subject_node_ids','object_node_ids','participant_node_ids','relation_ids','node_ids','source_span_ids','eligibility_decision_id']),
 BoundaryAST:obj({boundary_ast_id:str,facts:arr('BoundaryFact'),unresolved_refs:ids,status:enumeration('RESOLVED PARTIALLY_RESOLVED UNRESOLVED')}),
 CanonicalSlot:enumeration('I O A P R V C B'),
 CanonicalEntry:obj({canonical_entry_id:str,slot:ref('CanonicalSlot'),boundary_fact_ids:ids,state:enumeration('RESOLVED UNRESOLVED'),display_value:text,condition:ref('ConditionExpr'),scope:ref('SetExpr'),quantity:ref('QuantityExpr'),source_span_ids:ids},['canonical_entry_id','slot','boundary_fact_ids','state','display_value','source_span_ids']),
 ProofNode:{oneOf:Object.entries({CANONICAL_ENTRY:'canonical_entry_id',BOUNDARY_FACT:'boundary_fact_id',RELATION:'relation_id',SEMANTIC_NODE:'semantic_node_id',SPAN_CANDIDATE:'span_candidate_id',SOURCE_SPAN:'source_span_id'}).map(([kind,key])=>variant('kind',kind,{id:str,[key]:str}))},
 ProofEdgeType:enumeration('PROJECTS_TO COMPILES_FROM DECODED_FROM ASSEMBLED_FROM EXTRACTED_FROM'),
 ProofEdge:obj({edge_id:str,edge_type:ref('ProofEdgeType'),from_id:str,to_id:str}),
 ProofDAG:obj({proof_dag_id:str,nodes:arr('ProofNode'),edges:arr('ProofEdge')}),
 NotImplementedStage:obj({status:{const:'NOT_IMPLEMENTED'},reason:str}),
 CompilerExecutionContext:obj({metadata:obj({run_id:str,compiler_version:str,created_at:str,source_sha256:str}),source:{},structure:{},nlp_signals:{},span_lattice:{anyOf:[ref('SpanLattice'),ref('NotImplementedStage')]},semantic_nodes:{anyOf:[arr('SemanticNode'),ref('NotImplementedStage')]},relation_bundles:{anyOf:[arr('RelationBundle'),ref('NotImplementedStage')]},unresolved:arr('UnresolvedRecord'),boundary_ast:{anyOf:[ref('BoundaryAST'),ref('NotImplementedStage')]},canonical_7plus1:{},proof_dag:{anyOf:[ref('ProofDAG'),ref('NotImplementedStage')]},diagnostics:{type:'array'},performance:{type:'object',additionalProperties:{type:['number','null']}}})
};
export const schemaFor=name=>{if(!definitions[name])throw Error('UNKNOWN_CONTRACT '+name);return {$schema:'http://json-schema.org/draft-07/schema#',$id:'urn:boundx:parser:0.3:'+name,'x-contract-version':CONTRACT_VERSION,$ref:'#/$defs/'+name,$defs:definitions};};
const ajv=new Ajv({strict:false,allErrors:true}),validators=new Map();
export function validateContract(name,data){if(!validators.has(name))validators.set(name,ajv.compile(schemaFor(name)));const fn=validators.get(name);return {valid:fn(data),errors:structuredClone(fn.errors??[])};}
export function assertContract(name,data){const result=validateContract(name,data);if(!result.valid)throw Error('CONTRACT_INVALID '+name+' '+JSON.stringify(result.errors));return data;}
export function makeContract(name,data){return structuredClone(assertContract(name,data));}
export function serialize(name,data){assertContract(name,data);return JSON.stringify({schema_id:schemaFor(name).$id,contract_version:CONTRACT_VERSION,data});}
export function deserialize(name,serialized){const envelope=JSON.parse(serialized);if(envelope.schema_id!==schemaFor(name).$id||envelope.contract_version!==CONTRACT_VERSION||Object.keys(envelope).sort().join()!=='contract_version,data,schema_id')throw Error('CONTRACT_VERSION_OR_SCHEMA_MISMATCH');return assertContract(name,envelope.data);}
export function notImplemented(reason){return assertContract('NotImplementedStage',{status:'NOT_IMPLEMENTED',reason});}
