const entity=['ENTITY','UNKNOWN_REFERENT'],event=['EVENT','DISCOURSE'],state=['STATE','CONDITION'],any=['ENTITY','EVENT','STATE','VALUE','REFERENCE','CONDITION','DISCOURSE','UNKNOWN_REFERENT'];
const spec=(head,tail,cardinality='many')=>({head_node_types:head,tail_node_types:tail,directionality:'HEAD_TO_TAIL',cardinality_hints:cardinality,allowed_unresolved_states:['UNRESOLVED','REJECTED']});
export const RELATION_CONTRACT=Object.freeze({
 AGENT:spec([...event,...state],entity),PATIENT:spec(['EVENT'],entity),THEME:spec(['EVENT'],entity),RESULT:spec(['EVENT'],entity),RECIPIENT:spec(['EVENT'],entity),LOCATION:spec(event,entity),
 BASIS:spec(event,['REFERENCE']),CONFORMS_TO:spec(event,['REFERENCE']),SCOPE_MEMBER:spec(event,entity),LIMIT:spec(['EVENT','STATE','DISCOURSE'],['VALUE']),CONDITION_OF:spec(state,event),COMPLETION_OF:spec(state,event),STOP_OF:spec(['EVENT'],event),APPROVAL_OF:spec(state,['EVENT']),
 FORBIDS:spec(['EVENT'],entity),RESTRICTS:spec(['EVENT'],entity),COREFERENCE:spec(entity,entity,'unique compatible antecedent'),CONJUNCTION:spec(any,any),SEQUENCE:spec(['EVENT'],['EVENT'])
});
export function relationTypeAudit(context){const nodes=new Map(context.semantic_nodes.map(n=>[n.node_id,n]));const invalid=context.relations.filter(r=>{const s=RELATION_CONTRACT[r.relation_type];return !s||!s.head_node_types.includes(nodes.get(r.head_node_id)?.node_type)||!s.tail_node_types.includes(nodes.get(r.tail_node_id)?.node_type);});return {status:invalid.length?'FAIL':'PASS',illegal_relation_type_signatures:invalid.length,invalid};}
