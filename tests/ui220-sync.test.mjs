import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';import path from 'node:path';import {createHash} from 'node:crypto';
import {buildCandidate} from '../product/short-compiler/build-candidate.mjs';
import {calculateWorkbenchMath} from '../src/bxp/workbench-math.mjs';
const root=process.cwd(),web=fs.readFileSync('research/7plus1-parser/v0.3-p2.1-generalization/web/workbench.js','utf8'),ctx=vm.createContext({});
vm.runInContext(web.slice(web.indexOf('function mathAnalysisRows('),web.indexOf('function renderMath(')),ctx);
test('ui220 package reproduces all frozen source hashes without installation or models',()=>{
 const output=path.join(root,'.boundx','ui220-sync-test-'+Date.now());const result=buildCandidate(output),m=JSON.parse(fs.readFileSync(path.join(output,'PRODUCT-MANIFEST.json')));
 assert.equal(result.files,404);assert.equal(result.manifest_sha256,'00661d15f2b0d6cdb94564124dcd97f2a0507d6da5eba61f68f0c1f8c744ad81');for(const f of m.files)assert.equal(createHash('sha256').update(fs.readFileSync(path.join(output,f.path))).digest('hex'),f.sha256,f.path);
 assert.throws(()=>buildCandidate(output),/IMMUTABLE/);
});
test('LLM analysis remains model-owned; unsupported PASS and unbound references do not become verification',()=>{
 const r={boundary:{clauses:[{id:'c1',source_valid:true}]},proposal:{math_analysis:[{id:'a',title:'次数',formula:'N=1+r;0≤r≤2',result:'1≤N≤3',reason:'首次及重试',clause_ids:['c1']}]}};
 assert.equal(ctx.mathAnalysisRows(r)[0].verified,false);assert.equal(ctx.mathAnalysisRows(r)[0].result,'1≤N≤3');
 r.proposal.math_analysis[0].result='PASS';assert.equal(ctx.mathAnalysisRows(r)[0].result,'待核对');
 r.proposal.math_analysis[0].clause_ids=['unknown'];assert.equal(ctx.mathAnalysisRows(r)[0].result,'待核对');
 assert.equal(ctx.mathAnalysisRows({boundary:{clauses:[{text:'ordinary clause'}]}}).length,0);
});
test('program set consistency stays scoped to finite fragment, not whole-task PASS',()=>{
 const m=calculateWorkbenchMath([{text:'S={a,b,c}; D⊆S; E⊆S; |D|=2; |E|=2; |D∩E|=1; D∪E=S'}]);
 assert.equal(m.set_result.solution_count,6);const row=ctx.mathAnalysisRows({workbench_math:m})[0];assert.equal(row.verified,true);assert.match(row.result,/片段/);
 assert.equal(ctx.mathAnalysisRows({workbench_math:{determinations:{consistency:{result:'PASS'}}}}).length,0);
});
