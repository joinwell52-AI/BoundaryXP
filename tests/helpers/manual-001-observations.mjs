// Human mechanism observations from the immutable standard, never real execution
// or input to a model. Uses typed IDs solely in this standard test fixture.
const ref=(kind,id)=>({kind,id});
export function normalObservations(ir){
 const times={organize:[0,2],check_app:[2,4],check_env:[2,4],make_dev:[4,6],make_ops:[4,6],submit_dev:[6,8],submit_ops:[6,8],review:[9,11],make_summary:[12,14],deliver_summary:[14,16]};
 const ready={app:0,envfile:0,devreport:6,opsreport:6,summary:14};
 const events=Object.entries(times).map(([event_id,[start,end]])=>{
  const e=ir.events.find(e=>e.id===event_id),uses=ir.requirements.filter(r=>r.kind==='DATA_USE'&&r.data_use.consumer.id===event_id).map(r=>({...structuredClone(r.data_use),use_at:(start+end)/2,available_at:ready[r.data_use.object.id],available:true}));
  return {event_id,owner_id:e.owner_id,operation:e.operation,occurred:true,roles:{...Object.fromEntries(e.roles.map(r=>[r.role,structuredClone(r.value)])),ENVIRONMENT:ref('ENTITY','testenv')},start,end,uses,external_inputs:uses.filter(u=>u.origin==='EXTERNAL').map(u=>u.object)};
 });
 const states=Object.fromEntries(Object.entries({dev_submitted:8,ops_submitted:8,review_passed:11,summary_delivered:16,task_completed:16}).map(([id,established_at])=>[id,{value:true,established_at}]));
 states.risk_found={value:false};states.stopped={value:false};
 return {events,states,quantities:{duration:{value:16,unit:'分钟',target_id:'ROOT'}},time_unit:'分钟',closed_world:{events:true,inputs:true}};
}
