// Deliberately independent: reads raw typed IR, no production bind/normalize/evaluate.
export function reference(raw,ref,env={}){
 const nodes=new Map([...raw.expressions,...raw.entities,...raw.variables].map(n=>[n.id,n]));
 const evalRef=(r,b)=>{if(r.kind==='VARIABLE')return b[r.id];if(r.kind==='ENTITY')return r.id;const n=nodes.get(r.id),a=n.arguments,go=r=>evalRef(r,b);
  switch(n.operator){
   case 'BOOLEAN':return n.literal;case 'NUMBER':return n.literal;case 'SET':return [...new Set(a.map(go))];
   case 'GROUP_MEMBERS':return nodes.get(a[0].id).members.map(go);
   case 'INTEGER_RANGE':return Array.from({length:go(a[1])-go(a[0])+1},(_,i)=>i+go(a[0]));
   case 'AND':return a.every(go);case 'OR':return a.some(go);case 'NOT':return !go(a[0]);case 'IMPLIES':return !go(a[0])||go(a[1]);case 'IFF':case 'EQ':return go(a[0])===go(a[1]);
   case 'GTE':return go(a[0])>=go(a[1]);case 'LT':return go(a[0])<go(a[1]);case 'CARDINALITY':return go(a[0]).length;
   case 'FORALL':return go(a[0]).every(v=>evalRef(a[1],{...b,[n.bound_variable.id]:v}));
   case 'EXISTS':return go(a[0]).some(v=>evalRef(a[1],{...b,[n.bound_variable.id]:v}));
   default:throw Error('REFERENCE_FRAGMENT:'+n.operator);
  }
 };return evalRef(ref,env);
}
