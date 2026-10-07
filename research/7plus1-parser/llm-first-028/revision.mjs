// Technical feedback is generated from actual validator rows, never from source keywords.
const repairable={
 CONTENT_QUANTITY_RESULT_TARGET:['quantity.target_id','OUTPUT_CONTENT.target_id must identify a RESULT/DELIVERABLE of the same event. Preserve metric, value, unit, count_scope and all source requirements.'],
 EXECUTION_QUANTITY_TARGET:['quantity.target_id','EXECUTION_LIMIT.target_id must be the owning event_id.'],
 QUANTITY_OWNERSHIP:['quantity.target_id','Quantity target must belong to the stated event and event.constraint_ids must cite this claim. Do not choose among multiple results without source support.'],
 CONSTRAINT_BINDING_MISSING:['constraint_ids','Each cited constraint must exist and bind back to this event.'],
 CONSTRAINT_REVERSE_BINDING_MISSING:['event_id','Owning event.constraint_ids must include this constraint.'],
 DUPLICATE_CONSTRAINT:['constraint_ids','Constraint ids must be unique.'],
 ROLE_SIGNATURE:['','ROLE requires event_id, entity_id and role, with inapplicable fields null.'],
 CONDITION_SIGNATURE:['','CONDITION/TEMPORAL requires event and expression with inapplicable fields null.'],
 CONDITION_DIRECTION:['direction','CONDITION.direction must preserve source necessity/sufficiency/IFF.'],
 TEMPORAL_DIRECTION:['direction','TEMPORAL.direction is ORDER and temporal must be explicit.'],
 QUANTITY_SIGNATURE:['quantity','Quantity requires owning event, typed quantity and null inapplicable fields.'],
 ROOT_TRANSITION_SIGNATURE:['scope_id','Root completion/stop must target ROOT with event_id null and a typed expression/direction.'],
 SCOPE_SIGNATURE:['expression_id','Scope requires a typed expression with inapplicable fields null.'],
 STATE_EVENT_REFERENCE:['state.event_id','State event reference must cite an existing event, or be null if source does not identify one.'],
 STATE_ARGUMENT_REFERENCE:['state.args','State arguments must be existing typed IDs, preserving unresolved identities.'],
 BAD_ENTITY_REFERENCE:['entity_id','Role/entity reference must cite an existing entity.'],
 BAD_EVENT_REFERENCE:['event_id','Event reference must cite an existing event.'],
 BAD_EXPRESSION_REFERENCE:['expression_id','Expression reference must cite an existing expression.'],
 EXPRESSION_OPERAND:['operands','Logical/set operands must reference existing expressions.'],
 EXPRESSION_ARITY:['operands','Preserve source operator: NOT=1, EXCEPT=2, other composite operators>=2.'],
 ITEM_SIGNATURE:['operands','ITEM has exactly one entity operand and no state.'],
 STATE_SIGNATURE:['state','STATE has typed state and no operands.'],
 SOURCE_LINK_ERROR:['sources','Use exact nonempty source quotes and correct occurrence. Never invent a contiguous quote.']
};
export function technicalRevisionFeedback(checks,g){
 const index=new Map([...g.entities,...g.events,...g.claims,...g.expressions].map(x=>[x.id,x]));
 return checks.rows.flatMap(row=>row.errors.filter(e=>repairable[e.code]).map(e=>{
  const x=index.get(row.id),[property,requirement]=repairable[e.code];
  return {code:e.code,subject_id:row.id,field_path:`${row.collection}[${row.id}]${property?'.'+property:''}`,actual:{event_id:x?.event_id??null,entity_id:x?.entity_id??null,scope_id:x?.scope_id??null,quantity:x?.quantity??null,constraint_ids:x?.constraint_ids??null,detail:e.detail},requirement};
 }));
}
