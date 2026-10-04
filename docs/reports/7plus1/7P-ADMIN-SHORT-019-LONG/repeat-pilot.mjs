import assert from 'node:assert/strict';
import {OUT,read,write,digest,signature} from './common.mjs';
import {parse7Plus1} from '../../../../research/7plus1-parser/v0.3-admin-short-019/engine.mjs';
import {closeNlp} from '../../../../research/7plus1-parser/v0.3-7p-composition-014/linguistic.mjs';
const freeze=read(OUT+'CANDIDATE-FREEZE-r02.json');
for(const f of freeze.files)assert.equal(digest(f.path),f.sha256);
const suite=read(OUT+'SHADOW-SUITE.json');
const cases=suite.cases??suite.controls??suite.variants;
assert.equal(cases.length,100);
const rows=[];
try{for(const c of cases){const a=await parse7Plus1(c.source),b=await parse7Plus1(c.source),sa=signature(a),sb=signature(b);write(OUT+'repeat-pilot-final/'+c.id+'/first-trace.json',a);write(OUT+'repeat-pilot-final/'+c.id+'/second-trace.json',b);rows.push({id:c.id,status:sa===sb?'EXACT':'DIFFERENT',first_signature:sa,second_signature:sb});console.log(c.id,rows.at(-1).status);}}finally{closeNlp();}
assert.ok(freeze.files.every(f=>digest(f.path)===f.sha256));
write(OUT+'repeat-pilot-final/RESULTS.json',{status:rows.every(r=>r.status==='EXACT')?'EXACT':'DIFFERENT',candidate_freeze_sha256:digest(OUT+'CANDIDATE-FREEZE-r02.json'),reason:'Also rerun all provisional pilot inputs twice after final freeze; the superseded candidate output is preserved and is not compared as the final candidate baseline.',rows});
