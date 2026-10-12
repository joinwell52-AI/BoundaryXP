// Typed finite-domain membership only. No source text, lexical guesses or permission grant.
export function evaluateScopeMembership(allowed,requested,{identityKnown=true}={}){
 if(!Array.isArray(allowed)||!Array.isArray(requested))throw Error('SCOPE_DOMAIN_SIGNATURE');
 if(!identityKnown||requested.some(x=>typeof x!=='string'||!x))return {result:'UNKNOWN',outside:[],execution_authorization:null};
 const domain=new Set(allowed),outside=[...new Set(requested.filter(x=>!domain.has(x)))].sort();
 return {result:outside.length?'VIOLATION':'SATISFIED',outside,execution_authorization:null};
}
export function finiteDomainAssignment(domains,boolean,guardValue){
 const groups=new Map(),values={};
 for(const d of domains){if(d.guard&&guardValue(d.guard,boolean)!==true)continue;
  const key=d.variable_id??d.id,prior=groups.get(key);groups.set(key,prior?prior.filter(x=>d.allowed.includes(x)):[...d.allowed]);
 }
 for(const [id,allowed] of groups){if(!allowed.length)return null;values[id]=allowed.sort()[0];}
 return values;
}
