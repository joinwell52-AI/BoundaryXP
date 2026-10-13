import test from 'node:test';import assert from 'node:assert/strict';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import {createHash} from 'node:crypto';
import {installedPlan,existingEntry,launchInstalled,installedHome,expectedVersion,expectedCompiler} from '../launch-installed.mjs';
// Pure transport probes: no listener, no real child, no model and no installation edits.
const home=fs.mkdtempSync(path.join(os.tmpdir(),'boundx-entry-test-')),version='0.1.0-candidate.031-r1.2-ui.82';
const root=path.join(home,'versions',version);fs.mkdirSync(root,{recursive:true});
fs.writeFileSync(path.join(root,'test-core.txt'),'frozen');
fs.writeFileSync(path.join(root,'PRODUCT-MANIFEST.json'),JSON.stringify({version,compiler_revision:'direct-ir-r05.5-test',contract:'candidate-ir/1.4',files:[{path:'test-core.txt',sha256:createHash('sha256').update('frozen').digest('hex')}]}));
fs.writeFileSync(path.join(home,'current.json'),JSON.stringify({version}));
fs.writeFileSync(path.join(home,'config.json'),JSON.stringify({port:58618}));
test.after(()=>fs.rmSync(home,{recursive:true,force:true}));
test('restored fixed entry uses the complete immutable installation path',()=>{
 const p=installedPlan(home);assert.equal(p.config.port,58618);assert.ok(p.root.startsWith(home));assert.equal(p.snapshot.product_version,version);
});
const plan={url:'http://127.0.0.1:58618/',snapshot:{manifest_sha256:'frozen',contract:'031-r1.1'}};
const session={product_snapshot:{manifest_sha256:'frozen',product_version:expectedVersion},compiler_revision:expectedCompiler,contract:'031-r1.1',token:'never logged'};
test('duplicate entry recognizes the same full snapshot, never a version label alone',async()=>{
 assert.equal((await existingEntry(plan,async()=>({ok:true,json:async()=>session}))).state,'SAME_INSTALLED_VERSION');
 for(const s of [{...session,contract:'new-contract'},{...session,compiler_revision:'new-core'},{...session,product_snapshot:{...session.product_snapshot,manifest_sha256:'other'}}]){
  assert.equal((await existingEntry(plan,async()=>({ok:true,json:async()=>s}))).state,'OTHER_OR_UNKNOWN');
 }
});
test('only connection refusal is free; HTTP failures and timeout do not trigger alternate launch',async()=>{
 assert.equal((await existingEntry(plan,async()=>{throw Object.assign(new Error('no listener'),{cause:{code:'ECONNREFUSED'}});})).state,'FREE');
 assert.equal((await existingEntry(plan,async()=>({ok:false,status:400}))).state,'OTHER_OR_UNKNOWN');
 assert.equal((await existingEntry(plan,async()=>{throw new Error('timeout');})).state,'OTHER_OR_UNKNOWN');
});
test('transport cannot spawn for unknown occupant; duplicate makes zero spawn calls',async()=>{
 const current=installedPlan(home);
 let count=0;const spawnImpl=()=>{count++;return{};};
 const result=await launchInstalled({home,probe:async()=>({state:'SAME_INSTALLED_VERSION'}),spawnImpl,log:()=>{}});
 assert.equal(result.already_running,true);assert.equal(count,0);
 await assert.rejects(launchInstalled({home,probe:async()=>({state:'OTHER_OR_UNKNOWN'}),spawnImpl,log:()=>{}}),/PORT_IN_USE_OR_UNVERIFIED/);
 assert.equal(count,0);assert.ok(current.args[0].startsWith(current.root));
});
