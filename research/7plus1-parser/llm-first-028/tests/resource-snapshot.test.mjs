import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import os from 'node:os';
import {lockProduct} from '../../../../product/short-compiler/resources.mjs';import {sha256,prepareSource} from '../source.mjs';import {parse7Plus1} from '../engine.mjs';import {contractVersion} from '../contracts/schema.mjs';
test('Full product guard detects mutation between parse and audit, with no second call or final acceptance',async()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'boundx-resource-test-')),resource=path.join(root,'resource.txt');fs.writeFileSync(resource,'frozen');fs.writeFileSync(path.join(root,'PRODUCT-MANIFEST.json'),JSON.stringify({version:'synthetic',compiler_revision:'unit',contract:contractVersion,files:[{path:'resource.txt',sha256:sha256(fs.readFileSync(resource))}]}));
 const lock=lockProduct(root),source=prepareSource(Buffer.from('资源快照测试')),g={contract_version:contractVersion,entities:[],events:[],claims:[],expressions:[],issues:[],coverage:[]};let calls=0;
 await assert.rejects(parse7Plus1(Buffer.from(source.text),{output:path.join(root,'run'),probe:{unit:true},resourceGuard:lock.verify,productSnapshot:lock.snapshot,call:async()=>{calls++;fs.writeFileSync(resource,'changed');return{value:g,receipt:{thread_id:'unit'},attempts:[]};}}),/INSTALLED_RESOURCE_CHANGED/);
 assert.equal(calls,1);assert.ok(!fs.existsSync(path.join(root,'run/trace.json')));assert.ok(fs.existsSync(path.join(root,'run/revision-0/proposal.json')));
});
test('Changing a version pointer never changes an already-locked resource root',()=>{
 const parent=fs.mkdtempSync(path.join(os.tmpdir(),'boundx-pointer-test-'));for(const version of ['v1','v2']){const root=path.join(parent,version);fs.mkdirSync(root);fs.writeFileSync(path.join(root,'value'),version);fs.writeFileSync(path.join(root,'PRODUCT-MANIFEST.json'),JSON.stringify({version,files:[{path:'value',sha256:sha256(Buffer.from(version))}]}));}
 fs.writeFileSync(path.join(parent,'current.json'),JSON.stringify({version:'v1'}));const lock=lockProduct(path.join(parent,'v1'));fs.writeFileSync(path.join(parent,'current.json'),JSON.stringify({version:'v2'}));assert.equal(lock.verify().product_version,'v1');assert.equal(fs.readFileSync(path.join(lock.root,'value'),'utf8'),'v1');
});
