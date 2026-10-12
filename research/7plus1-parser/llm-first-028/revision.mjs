// Technical feedback is generated from actual validator rows, never from source keywords.
const repairable={
 BAD_IDENTITY_ALTERNATIVE:['alternatives','Every identity alternative must reference another existing entity. ROOT is only a scope sentinel, not an entity alternative. Preserve genuine source ambiguity; do not invent an entity, choose a competing referent or discard an actual limitation to satisfy this contract.'],
 PROPERTY_TEST_ARGUMENT_OWNERSHIP:['test.target_id','The exact test target must be this event or its explicitly declared role endpoint. Do not borrow a neighboring object.'],
 PROPERTY_SCOPE_ARGUMENT_OWNERSHIP:['expression_id','Property scope must own each tested target through this scope or this event role; preserve the constraint rather than substituting another target.'],
 PROPERTY_TEST_SIGNATURE:['test','TEST requires target_id, event_id, property_path, operator and value, with no state or operands.'],
 OUTPUT_BEHAVIOR_OWNER_BINDING:['specifies_result_id','A CONTENT/MENTION_ONLY behavior explicitly references a RESULT claim of its owning producer event. Never promote product behavior to current execution.'],
 OUTPUT_BEHAVIOR_SOURCE_BINDING:['sources','Provide exact sources linking this behavior to its producing RESULT.'],
 GROUP_MEMBER_BINDING:['members','Declare only source-supported entity members of a GROUP; null means the membership is unspecified, not an empty set.'],
 STATE_EVENT_ARGUMENT_OWNERSHIP:['state.args','Bind state arguments to roles of this exact event, or a source-declared subset through GROUP.members. Do not substitute a broader group or borrow another event argument.'],
 EACH_QUANTITY_DOMAIN:['quantity.distribution','EACH needs a set-expression domain; MEMBERS(ITEM(group)) selects members, while ITEM(group) selects the group as a single item. Preserve the explicit per-member requirement.'],
 EACH_QUANTITY_DOMAIN_OWNERSHIP:['quantity.distribution.domain_id','The member domain must belong to the owning event/quantity target. Preserve exact source and do not import a neighboring result.'],
 EACH_COUNT_SCOPE_OWNERSHIP:['quantity.count_scope','The counting scope must be ROOT or an endpoint of this event/domain. Declaring a foreign count_scope cannot license importing its members.'],
 EACH_GROUP_ITEM_NOT_MEMBERS:['quantity.distribution.domain_id','ITEM(group) is a single group, not all its members. Use MEMBERS(ITEM(group)) for source-stated per-member requirements, or a source-supported finite member set.'],
 AGGREGATE_QUANTITY_HAS_MEMBER_DOMAIN:['quantity.distribution','An aggregate quantity has domain_id=null. Do not turn per-member limits into a total.'],
 MEMBERS_GROUP_SIGNATURE:['operands','MEMBERS takes exactly one ITEM expression referring to an explicit GROUP. It is a set domain, never Boolean ALL.'],
 PLAN_QUANTITY_TARGET:['quantity.target_id','WORK_PLAN is an explicit execution-plan count bound to its owning event, not a resource quota.'],
 ID_NOT_UNIQUE:['id','The global identity is duplicated. Use collection-qualified mechanical mappings; renaming is not semantic retirement. Never choose an untyped ambiguous reference.'],
 DANGLING_REQUIRED_DEPENDENCY:['requires','Bind to an existing unique node with exact source support; retain every required limitation.'],
 BAD_SCOPE_TARGET:['scope_id','Bind the explicit scope to an existing unique node; do not broaden or delete the scope.'],
 BAD_STRUCTURAL_OWNER:['owner_id','Bind the declared owner to an existing event or ROOT; do not borrow a neighboring event.'],
 ARTIFACT_USE_SIGNATURE:['artifact_use','Bind a consumer event/entity to a producer RESULT and consumer ROLE. Inapplicable fields are null; preserve timing separately.'],
 ARTIFACT_PRODUCER_BINDING:['artifact_use.producer_result_id','Reference the source-supported RESULT of this exact artifact/version; never infer from a path or choose among competing producers.'],
 ARTIFACT_CONSUMER_BINDING:['artifact_use.consumer_role_id','Reference the same event/entity OBJECT/INPUT_OBJECT/DELIVERABLE use.'],
 ARTIFACT_SELF_USE:['artifact_use','An event cannot consume its own future result.'],
 ARTIFACT_USE_SOURCE_ENDPOINTS:['sources','Provide exact source evidence for both RESULT and consumer ROLE endpoints.'],
 ARTIFACT_USE_FIELD_MISPLACED:['artifact_use','Non-null only on ARTIFACT_USE claims.'],
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
export function technicalRevisionFeedback(checks,g,identity=null){
 const feedback=checks.rows.flatMap(row=>row.errors.filter(e=>repairable[e.code]).map(e=>{
  const x=g[row.collection]?.find(x=>x.id===row.id),[property,requirement]=repairable[e.code];
  return {code:e.code,subject_id:row.id,field_path:`${row.collection}[${row.id}]${property?'.'+property:''}`,actual:{event_id:x?.event_id??null,entity_id:x?.entity_id??null,scope_id:x?.scope_id??null,quantity:x?.quantity??null,constraint_ids:x?.constraint_ids??null,detail:e.detail},requirement};
 }));
 for(const reference of identity?.unresolved??[])feedback.push({...reference,field_path:reference.path,
  requirement:'Select an explicit typed reference only if the source supports it. These are competing identities, not interchangeable aliases. Patch the owning node or coverage item; do not retire a node or drop a constraint.',selects_replacement:false});
 for(const d of checks.diagnostics.filter(x=>['COVERAGE_INVALID','ISSUE_DANGLING_REFERENCE'].includes(x.code)))feedback.push({code:d.code,detail:d,requirement:'Repair the declared reference using source-supported identities. Preserve sources and coverage gaps; do not remove the requirement.'});
 return feedback;
}

// An audit can identify an unsupported binding without claiming to know the
// correct replacement. Give that structured finding the same single revision
// budget as contradictions; never choose a replacement in the compiler.
export function auditBindingRevisionFeedback(checks,g,audit){
 const items=[...g.entities,...g.events,...g.claims,...g.expressions];
 const index=new Map(items.map(x=>[x.id,x]));
 const rows=new Map(checks.rows.map(x=>[x.id,x]));
 const references=x=>[...(x.requires??[]),x.event_id,x.entity_id,x.expression_id,x.scope_id,x.owner_id,
  ...(x.constraint_ids??[]),...(x.operands??[]),...(x.state?.args??[]),x.state?.event_id,
  x.artifact_use?.producer_result_id,x.artifact_use?.consumer_role_id,x.quantity?.target_id,x.quantity?.count_scope,
  x.quantity?.distribution?.domain_id,...(x.members??[])].filter(id=>id&&id!=='ROOT');
 const closure=ids=>{const seen=new Set(),pending=[...ids];while(pending.length){const id=pending.pop();if(seen.has(id))continue;seen.add(id);const x=index.get(id);if(x)pending.push(...references(x));}return seen;};
 return audit.issues.filter(issue=>{
  if(!['BINDING','QUANTITY'].includes(issue.issue_kind)||!issue.subject_ids.length)return false;
  if(!checks.audit_sources?.some(x=>x.subject_id===issue.id))return false;
  if(!issue.subject_ids.every(id=>index.has(id)&&rows.get(id)?.errors.length===0
   &&audit.reviews.some(r=>r.subject_id===id&&r.verdict==='UNCERTAIN')))return false;
  if(checks.diagnostics.some(d=>d.id===issue.id||issue.subject_ids.includes(d.id)))return false;
  const relevant=closure([...issue.subject_ids,...issue.context_refs]);
  if(g.entities.some(x=>relevant.has(x.id)&&x.alternatives.length>1))return false;
  if(g.issues.some(x=>x.kind==='AMBIGUITY'&&x.subject_ids.some(id=>relevant.has(id))))return false;
  return true;
 }).map(issue=>({code:'AUDIT_BINDING_UNSUPPORTED',issue_id:issue.id,subject_ids:issue.subject_ids,
  field_path:issue.field_path,context_refs:issue.context_refs,sources:issue.sources,reason:issue.reason,
  requirement:'Recheck this unsupported binding against the source. Do not invent a replacement or discard conditions/limits. Preserve genuine ambiguity locally and retain independently supported semantics.',
  selects_replacement:false}));
}
