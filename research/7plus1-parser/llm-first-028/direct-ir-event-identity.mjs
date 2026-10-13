// Shared EVENT-valued term semantics. Callers supply typed nodes, numeric values
// and bound variables; no source text, labels or operation guessing is used.
export function resolveEventTerm(ref,{node,number,variable,register=()=>{}}) {
 const resolve=(r,seen=new Set())=>{
  if(seen.has(r.kind+':'+r.id))throw Error('EVENT_TERM_CYCLE:'+r.id);
  const next=new Set([...seen,r.kind+':'+r.id]);let value;
  if(r.kind==='VARIABLE'){
   const bound=variable(r);if(bound==null)throw Error('EVENT_VARIABLE_UNBOUND:'+r.id);
   value=bound.event?bound:resolve(typeof bound==='string'?{kind:'EVENT',id:bound}:bound,next);
  }else if(r.kind==='EVENT'){
   const event=node(r);if(event.kind==='TEMPLATE')throw Error('TEMPLATE_INSTANCE_REQUIRED:'+event.id);
   value={key:event.id,event};
  }else if(r.kind==='EXPRESSION'){
   const x=node(r);
   if(x.operator==='EVENT_INSTANCE'){
    const template=node(x.arguments[0]),index=number(x.arguments[1]);
    if(template.kind!=='TEMPLATE'||!Number.isSafeInteger(index)||index<0)throw Error('INSTANCE_INDEX_NOT_FIXED_NONNEGATIVE_INTEGER');
    value={key:template.id+'@'+index,event:template,index};
   }else if(x.operator==='PREVIOUS_INSTANCE'){
    const previous=resolve(x.arguments[0],next);
    if(previous.index===undefined||previous.index===0)throw Error('PREVIOUS_INSTANCE_OUTSIDE_SEQUENCE');
    value={key:previous.event.id+'@'+(previous.index-1),event:previous.event,index:previous.index-1};
   }else throw Error('NOT_EVENT_EXPRESSION:'+r.id);
  }else throw Error('NOT_EVENT_EXPRESSION:'+r.id);
  register(value);return value;
 };
 return resolve(ref);
}
