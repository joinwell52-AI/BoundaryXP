// Contract-driven classification. No source/label/note inspection and no rewrite of IR.
// EXPLICIT ACTION remains one event identity; TASK_SCOPE prohibition is a pattern.
export function isProhibitionPattern(requirement,event){
 return requirement.kind==='EVENT_NORM'&&requirement.modality==='FORBIDDEN'&&
  event?.use==='CURRENT_TASK'&&event.layer==='MAIN'&&
  (event.kind==='TEMPLATE'||event.kind==='ACTION'&&event.actor_domain==='TASK_SCOPE');
}
