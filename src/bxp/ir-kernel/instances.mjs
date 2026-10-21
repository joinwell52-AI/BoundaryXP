import {resolveEventTerm} from '../../../research/7plus1-parser/llm-first-028/direct-ir-event-identity.mjs';
import {fail} from './diagnostics.mjs';
export function instanceDefinition(core,id){const seq=core.sequences.find(s=>id.startsWith(s.template.id+'@')&&/^\d+$/.test(id.slice(s.template.id.length+1)));return seq?core.nodes[seq.template.id]:undefined;}
export function resolveInstance(core,ref,evaluate,bindings={}){
 try{
  const value=resolveEventTerm(ref,{node:r=>core.nodes[r.id],number:r=>Number(evaluate(r)),variable:r=>{const v=bindings[r.id];if(typeof v?.event!=='string')return v;const m=v.event.match(/^(.*)@(\d+)$/);return {key:v.event,event:core.nodes[m?.[1]??v.event]??{id:v.event,kind:'ACTION'},...(m?{index:Number(m[2])}:{})};},indexBase:id=>core.sequences.find(s=>s.template.id===id)?.index_base??0});
  const sequence=core.sequences.find(s=>s.template.id===value.event.id);
  if(sequence&&(value.index<sequence.index_base||value.index>=sequence.index_base+sequence.max_instances))fail('INSTANCE_OUTSIDE_DECLARED_SEQUENCE',ref.id,null,'CAPABILITY');
  return {event:value.key};
 }catch(e){if(e.diagnostic)throw e;fail(e.message.split(':')[0],ref.id,null,'CAPABILITY');}
}
