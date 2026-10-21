// Explicit candidate operators only. No source, label or note interpretation.
export const propertyOperators=['EQ','NEQ','IN','NOT_IN','LT','LTE','GT','GTE','EMPTY','NONEMPTY','EXISTS','NOT_EXISTS','UNCHANGED','IMMEDIATE'];
export function propertyTestErrors(t){
 const errors=[];if(!t)return ['PROPERTY_TEST_MISSING'];
 const unary=['EMPTY','NONEMPTY','EXISTS','NOT_EXISTS','UNCHANGED','IMMEDIATE'];
 if(!propertyOperators.includes(t.operator))errors.push('PROPERTY_OPERATOR_UNSUPPORTED');
 if(t.operator==='IMMEDIATE'&&(t.event_id===null||t.target_id!==t.event_id||!Array.isArray(t.property_path)||t.property_path.length))errors.push('IMMEDIATE_EVENT_BINDING');
 if(unary.includes(t.operator)&&t.value!==null)errors.push('UNARY_TEST_HAS_VALUE');
 if(['IN','NOT_IN'].includes(t.operator)&&(!Array.isArray(t.value)||!t.value.length||new Set(t.value).size!==t.value.length))errors.push('TEST_ENUM_VALUE');
 if(['LT','LTE','GT','GTE'].includes(t.operator)&&(typeof t.value!=='number'||!Number.isFinite(t.value)))errors.push('TEST_NUMERIC_VALUE');
 if(['EQ','NEQ'].includes(t.operator)&&Array.isArray(t.value))errors.push('TEST_EQUALITY_VALUE');
 return errors;
}
export function evaluatePropertyTest(t,observed){
 if(propertyTestErrors(t).length||!observed||observed.target_id!==t.target_id||observed.event_id!==t.event_id||JSON.stringify(observed.property_path)!==JSON.stringify(t.property_path))return 'UNKNOWN';
 const truth=v=>v?'TRUE':'FALSE';
 if(t.operator==='IMMEDIATE')return observed.known===true&&typeof observed.immediate==='boolean'?truth(observed.immediate):'UNKNOWN';
 if(t.operator==='UNCHANGED')return typeof observed.unchanged==='boolean'?truth(observed.unchanged):'UNKNOWN';
 if(['EXISTS','NOT_EXISTS'].includes(t.operator))return typeof observed.exists==='boolean'?truth(t.operator==='EXISTS'?observed.exists:!observed.exists):'UNKNOWN';
 if(!Object.hasOwn(observed,'value')||observed.known!==true)return 'UNKNOWN';
 const v=observed.value;
 if(['EMPTY','NONEMPTY'].includes(t.operator)){
  if(typeof v!=='string'&&!Array.isArray(v))return 'UNKNOWN';return truth(t.operator==='EMPTY'?v.length===0:v.length>0);
 }
 if(['IN','NOT_IN'].includes(t.operator)){
  if(v!==null&&!['string','number','boolean'].includes(typeof v))return 'UNKNOWN';const hit=t.value.some(x=>Object.is(x,v));return truth(t.operator==='IN'?hit:!hit);
 }
 if(['EQ','NEQ'].includes(t.operator)){
  if(v!==null&&!['string','number','boolean'].includes(typeof v))return 'UNKNOWN';if(typeof v!==typeof t.value)return 'UNKNOWN';return truth(t.operator==='EQ'?Object.is(v,t.value):!Object.is(v,t.value));
 }
 if(typeof v!=='number'||!Number.isFinite(v))return 'UNKNOWN';
 return truth(({LT:()=>v<t.value,LTE:()=>v<=t.value,GT:()=>v>t.value,GTE:()=>v>=t.value})[t.operator]?.()??false);
}
