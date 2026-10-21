import {OUT,read,save} from './setup.mjs';
import {anchors} from './semantic-review.mjs';
const cases=read(`${OUT}/CORPUS-SELECTION.json`).cases;
const annotations=read(`${OUT}/review/r002/SEMANTIC-ASSERTION-LEDGER.json`).annotations;
const overlap=(s,a)=>s&&a&&s.start<a.end&&a.start<s.end;
const rows=[];
for(const arm of ['A','B'])for(const row of cases){const signals=read(`${OUT}/arm-${arm}/${row.id}/signals.json`),annotation=annotations.find(x=>x.id===row.id),checks=[];
 for(const frame of annotation.frames)for(const [role,object]of frame.args??[]){const ps=anchors(row.source,frame.p),os=anchors(row.source,object),evidence=[];
  for(const cl of signals.clauses){const ts=cl.tokens,predicates=ts.filter(t=>ps.some(p=>overlap(t,p))),objects=ts.filter(t=>os.some(o=>overlap(t,o)));
   for(const p of predicates)for(const o of objects){const pi=ts.indexOf(p),oi=ts.indexOf(o),path=[o.id];let at=oi,found=false;for(let step=0;step<4;step++){const token=ts[at];if(!token||token.head===at)break;if(token.head===pi){found=true;break;}if(step===0&&!/obj|subj|compound|nmod|conj|amod|dep/u.test(token.dep??''))break;at=token.head;path.push(ts[at]?.id);}if(found)evidence.push({channel:'DEP',clause_id:cl.id,predicate:p.id,argument:o.id,path});}
   for(const fr of cl.srl??[]){const p=fr.find(x=>x[1]==='PRED');if(!p||!ts.slice(p[2],p[3]).some(t=>ps.some(s=>overlap(t,s))))continue;for(const arg of fr.filter(x=>/^ARG[012]$/u.test(x[1])))if(ts.slice(arg[2],arg[3]).some(t=>os.some(s=>overlap(t,s))))evidence.push({channel:'SRL',clause_id:cl.id,predicate:p,argument:arg});}
  }
  checks.push({predicate:frame.p,argument:object,declared_role:role,present:evidence.length>0,evidence});
 }
 const tokens=signals.clauses.flatMap(c=>c.tokens),bad=tokens.filter(t=>[...row.source].slice(t.start,t.end).join('')!==t.text),gaps=[...row.source].map((p,i)=>({p,i})).filter(({p,i})=>!/\s|[，,。.!?！？；;]/u.test(p)&&!tokens.some(t=>t.start<=i&&i<t.end));
 rows.push({arm,id:row.id,root:row.root,present:checks.filter(x=>x.present).length,total:checks.length,checks,token_alignment:{total:tokens.length,exact:tokens.length-bad.length,bad,non_whitespace_non_delimiter_uncovered:gaps},clauses:signals.clauses.length});
}
const aggregates=Object.fromEntries(['A','B'].map(a=>{const local=rows.filter(r=>r.arm===a);return [a,{present:local.reduce((s,r)=>s+r.present,0),total:local.reduce((s,r)=>s+r.total,0),tokens:local.reduce((s,r)=>s+r.token_alignment.total,0),bad_token_alignments:local.reduce((s,r)=>s+r.token_alignment.bad.length,0),uncovered_codepoints:local.reduce((s,r)=>s+r.token_alignment.non_whitespace_non_delimiter_uncovered.length,0)}];}));
save(`${OUT}/NLP-SIGNAL-COMPARISON.json`,{method:'Local dependency-path (<=4 structural hops) or SRL ARG0/1/2 evidence for declared source predicate/argument. Diagnostic syntax support, NOT a semantic role certificate. Same assertions for both arms.',aggregates,rows});console.log(JSON.stringify(aggregates));
