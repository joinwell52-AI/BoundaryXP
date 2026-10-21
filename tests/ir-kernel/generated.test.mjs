import test from 'node:test';import assert from 'node:assert/strict';import {fixture,expr,variable,req,E,V,rename} from './fixtures.mjs';
import {compileCore} from '../../src/bxp/ir-kernel/index.mjs';import {evaluateCore} from '../../src/bxp/ir-kernel/evaluate.mjs';import {queryCore} from '../../src/bxp/ir-kernel/queries.mjs';import {reference} from './reference/finite.mjs';import {solveBooleanConstraints} from '../../src/bxp/boolean-solver.mjs';
const rng=seed=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed;};
function generate(seed){const random=rng(seed),i=fixture();let index=0;const build=depth=>{const id='n'+index++,op=depth?['AND','OR','NOT','IMPLIES','IFF'][random()%5]:'BOOLEAN',args=depth?Array.from({length:op==='NOT'?1:2},()=>build(depth-1)):[];i.expressions.push(expr(id,op,args,depth?null:!!(random()%2)));return E(id);};const ref=build(4);i.requirements.push(req('r',ref));return {i,ref};}
test('K23 seeds 1..256: independent raw Boolean interpreter, Core, alpha/order and negative mutation',()=>{
 for(let seed=1;seed<=256;seed++){
  const {i,ref}=generate(seed),expected=reference(i,ref),c=compileCore(i);assert.equal(evaluateCore(c.core,ref),expected,'seed='+seed);
  const renamed=rename(i,'task','alpha-root');renamed.expressions.reverse();renamed.expressions.forEach(n=>n.source_refs=['s']);assert.equal(evaluateCore(compileCore(renamed).core,ref),expected,'alpha seed='+seed);
  const mutated=structuredClone(i);mutated.expressions.push(expr('mutation','NOT',[ref]));mutated.requirements[0].body=E('mutation');assert.equal(evaluateCore(compileCore(mutated).core,E('mutation')),!expected,'mutation seed='+seed);
 }
});
test('K23 seeds 1..12: old Boolean solver and local Z3 agree on shared fragment',async()=>{
 for(let seed=1;seed<=12;seed++){
  const {i,ref}=generate(seed);const x=i.expressions.find(n=>n.operator==='BOOLEAN');i.expressions.push(expr('bool-true','BOOLEAN',[],true),expr('bool-false','BOOLEAN',[],false),expr('bool-domain','SET',[E('bool-true'),E('bool-false')]));i.variables.push(variable('choice','BOOLEAN',E('bool-domain')));
  const target=i.expressions.find(n=>n.operator==='BOOLEAN'&&n.id!==x.id),replacement=V('choice');for(const n of i.expressions)if(n.id!=='bool-domain')n.arguments=n.arguments.map(r=>r.id===target.id?replacement:r);
  const nodes=new Map(i.expressions.map(n=>[n.id,n]));const old=r=>{if(r.kind==='VARIABLE')return {var:r.id};const n=nodes.get(r.id),a=n.arguments.map(old);if(n.operator==='BOOLEAN')return n.literal;if(n.operator==='IFF')return {all:[{implies:a},{implies:[a[1],a[0]]}]};return {[{AND:'all',OR:'any',NOT:'not',IMPLIES:'implies'}[n.operator]]:n.operator==='NOT'?a[0]:a};};
  const expected=solveBooleanConstraints(['choice'],[old(ref)]).result;const solved=await queryCore(compileCore(i));assert.equal(solved.result,expected==='satisfiable'?'SAT':'UNSAT','seed='+seed);if(solved.result==='SAT')assert.equal(solved.verification,'MODEL_CHECKED');
 }
});
