import fs from 'node:fs';import {out,write,digest} from './common.mjs';
const prev='docs/reports/7plus1/7P-COMPOSITION-013/',rows=[];
for(const name of fs.readdirSync(out+'retained-tests/')){
 const p=out+'retained-tests/'+name;let s=fs.readFileSync(p,'utf8');
 if(name.startsWith('parser-7p-composition-013-'))s=s.replaceAll("'../research/","'../../../../../research/");
 if(name==='parser-7p-composition-013-whole.test.mjs'){
  const old="if(x.expected_mechanism_contract==='EACH_THREE_FILES'){const a=rows.find(a=>a.reasons.includes('distribution_if_explicit'));assert(a&&a.status==='PARTIAL');assert(!c.boundary_ir.facts.some(f=>f.predicate_node_id===a.predicate_node_id&&f.state==='RESOLVED'));}";
  const next="if(x.expected_mechanism_contract==='EACH_THREE_FILES'){const a=rows.find(a=>a.distribution?.operator==='EACH');assert(a&&a.status==='CERTIFIED');assert.equal(a.member_node_ids.length,3);assert.equal(a.distribution.count_per_member,1);assert(c.boundary_ir.facts.some(f=>f.predicate_node_id===a.predicate_node_id&&f.state==='RESOLVED'&&f.fact_type==='ACTION'&&f.quantity_expr_id===a.quantity_expr_id));}";
  if(!s.includes(old)&&!s.includes(next))throw Error('OLD_FAILURE_ASSERT_NOT_FOUND');s=s.replace(old,next);rows.push({path:p,old_013_assertion:'UNIMPLEMENTED_EACH_MUST_REMAIN_PARTIAL',classification:'SUPERSEDED_IMPLEMENTATION_LIMITATION',replacement:'Frozen unchanged NG18 expected EACH_THREE_FILES, complete 3 members + count 1 + ACTION quantity evidence',old_source_sha256:digest('tests/'+name)});
 }
 write(p,s);
}
write(out+'RETAINED-TEST-RETARGET.json',{old_assertions_preserved:true,semantic_expected_mechanism_unchanged:true,obsolete_limitations:rows,old_tests_not_modified:true});
// Include the 103 accepted focused assertions on the real new engine.
for(const name of fs.readdirSync(out+'retained-tests/').filter(n=>n.startsWith('parser-7p-composition-013-'))){const original=out+'retained-tests/'+name;write('tests/'+name.replace('013','014'),fs.readFileSync(original,'utf8').replaceAll("'../../../../../research/","'../research/"));}
