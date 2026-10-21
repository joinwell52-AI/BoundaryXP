import test from 'node:test';import assert from 'node:assert/strict';
import {installedPlan,existingEntry,launchInstalled,installedHome,expectedVersion,expectedCompiler} from 'file:///D:/boundx/product/short-compiler/launch-installed.mjs';
// Pure transport probes: no listener, no real child, no model and no installation edits.
test('restored fixed entry uses the complete immutable installation path',()=>{
 const p=installedPlan();assert.equal(p.config.port,58618);assert.ok(p.root.startsWith(installedHome));assert.equal(p.snapshot.product_version,expectedVersion);
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
 const current=installedPlan();
 let count=0;const spawnImpl=()=>{count++;return{};};
 const result=await launchInstalled({probe:async()=>({state:'SAME_INSTALLED_VERSION'}),spawnImpl,log:()=>{}});
 assert.equal(result.already_running,true);assert.equal(count,0);
 await assert.rejects(launchInstalled({probe:async()=>({state:'OTHER_OR_UNKNOWN'}),spawnImpl,log:()=>{}}),/PORT_IN_USE_OR_UNVERIFIED/);
 assert.equal(count,0);assert.ok(current.args[0].startsWith(current.root));
});
