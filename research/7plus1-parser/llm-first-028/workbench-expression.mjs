// Mechanical expansion of the existing workbench-formal/1 interface.
// No semantic inference, arithmetic, comparison, or model calls.
export function expandExpressions(candidate){
 if(!candidate?.clauses?.some(c=>Object.hasOwn(c,'expr')))return candidate;
 if(candidate.formal)throw Error('AMBIGUOUS_EXPRESSION_AND_FORMAL');
 // Clause identifiers are mechanical labels, not model semantics. Assign only
 // missing identifiers before expansion; existing identifiers are never changed.
 const used=new Set(candidate.clauses.map(c=>c.id).filter(x=>typeof x==='string'&&x.trim()));
 let serial=1;candidate={...candidate,clauses:candidate.clauses.map(c=>{if(typeof c.id==='string'&&c.id.trim())return c;while(used.has('c'+serial))serial++;const id='c'+serial++;used.add(id);return {...c,id};})};
 const constraints=[],coverage=[],relations=[];
 const clauses=candidate.clauses.map(c=>{
  if(c.expr!==undefined&&!Array.isArray(c.expr))throw Error('EXPR_ARRAY_REQUIRED');
  const ids=[];
  for(const [i,raw] of (c.expr??[]).entries()){
   if(!raw||typeof raw!=='object'||['verdict','status','operation','result'].some(k=>Object.hasOwn(raw,k)))throw Error('EXPR_CONSTRAINT_REQUIRED');
   const v=structuredClone(raw);v.id=`${c.id}.${i+1}`;v.clause_ids=[c.id];v.label??=v.key;
   if(v.type==='quantity'){v.lower??=null;v.upper??=null;v.instance??=v.key;}
   if(v.type==='order'){v.edges??=[];v.removed??=[];}
   ids.push(v.id);constraints.push(v);
  }
  coverage.push({clause_id:c.id,kind:c.kind??(ids.length?'STRUCTURED':'UNSUPPORTED'),constraint_ids:ids,reason:c.reason??(ids.length?'结构对应本条原文':'本条尚未提供等价结构')});
  for(const e of c.relations??[])relations.push({...structuredClone(e),clause_ids:[c.id]});
  const {expr,relations:ignored,kind,reason,...clause}=c;
  return {...clause,text:typeof c.text==='string'?c.text:(c.quotes??[]).map(q=>q.quote).join('；')};
 });
 return {...candidate,clauses,formal:{version:'workbench-formal/1',constraints,coverage,relations}};
}
