import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import vm from 'node:vm';import Ajv from 'ajv';
import {v2} from './domain-fixtures.mjs';import {expr,req,E} from './fixtures.mjs';
import {parseDirectIR} from '../../research/7plus1-parser/llm-first-028/direct-ir-engine.mjs';
import {directIRBundle} from '../../research/7plus1-parser/llm-first-028/direct-ir-bundle.mjs';
import {revisionBundle,applyIRPatch} from '../../research/7plus1-parser/llm-first-028/direct-ir-revision.mjs';
import {createServer} from '../../research/7plus1-parser/llm-first-028/service.mjs';import {sha256} from '../../research/7plus1-parser/llm-first-028/source.mjs';
const audit=ir=>({format:'boundx-candidate-ir-audit/1',contract_version:ir.contract_version,source_table:ir.source_table,reviews:Object.entries({entities:'ENTITY',variables:'VARIABLE',events:'EVENT',states:'STATE',expressions:'EXPRESSION',requirements:'REQUIREMENT'}).flatMap(([key,kind])=>ir[key].map(n=>({target:{kind,id:n.id},field_path:'',verdict:'SUPPORT',context_refs:[],source_refs:['s'],reason:'Offline fixture'}))),issues:[],omissions:[]});
test('installed 2.0 profile traverses parse/audit/technical/Core/calculation and exports without live models',async()=>{
 const ir=v2();ir.expressions.push(expr('yes','BOOLEAN',[],true));ir.requirements.push(req('r',E('yes')));const output=fs.mkdtempSync(path.join(os.tmpdir(),'boundx-ui83-')),calls=[];
 const result=await parseDirectIR(Buffer.from(ir.source_table[0].quote),{output,probe:{},productSnapshot:{contract:'candidate-ir/2.0'},call:async o=>{assert.equal(o.bundle.schema.properties.contract_version.const,'candidate-ir/2.0');assert.equal(o.bundle.transport_version,'DIRECT_CANDIDATE_IR_R01');calls.push(o.bundle.phase);return {value:o.bundle.phase==='parse'?ir:audit(ir),receipt:{thread_id:'offline-'+o.bundle.phase},attempts:[{thread_id:'offline-'+o.bundle.phase}]};}});
 assert.deepEqual(calls,['parse','audit']);assert.equal(result.boundary_calculations.result,'SAT');assert.equal(result.boundary_calculations.verification,'MODEL_CHECKED');assert.ok(result.kernel_core.source_map.r);assert.ok(Object.values(result.canonical.slots).flatMap(s=>s.entries).some(e=>e.text));assert.ok(fs.existsSync(path.join(output,'core.json')));assert.equal(JSON.parse(fs.readFileSync(path.join(output,'trace.json'))).ir.contract_version,'candidate-ir/2.0');
});
test('2.0 revision uses the same schema version and cannot replace root identity',()=>{
 const ir=v2(),bundle=revisionBundle(directIRBundle('parse',{contractVersion:'candidate-ir/2.0'})),p={...structuredClone(ir),format:'boundx-candidate-ir-patch/1',base_ir_sha256:sha256(JSON.stringify(ir)),reason:'No-op',removed_nodes:[],coverage_updates:[],boundary_calculation:null};for(const k of ['source_table','entities','events','states','variables','expressions','requirements','issues','coverage','sequences'])p[k]=[];
 assert.equal(new Ajv({strict:false}).compile(bundle.schema)(p),true);assert.deepEqual(applyIRPatch(ir,p).ir,ir);p.root_task={kind:'EVENT',id:'other'};assert.throws(()=>applyIRPatch(ir,p),/PATCH_ROOT_CHANGED/);
});
test('session advertises installed 2.0 resources without opening a listening socket',async()=>{
 const server=createServer({dataRoot:fs.mkdtempSync(path.join(os.tmpdir(),'boundx-ui83-session-')),productSnapshot:{contract:'candidate-ir/2.0'},catalog:{default_model:'offline',default_reasoning:'medium',models:[]}});
 const data=await new Promise(resolve=>server.emit('request',{headers:{host:'127.0.0.1:58618'},socket:{localPort:58618},method:'GET',url:'/api/session'},{setHeader(){},writeHead(status){assert.equal(status,200);},end(body){resolve(JSON.parse(body));}}));
 assert.equal(data.contract,'candidate-ir/2.0');assert.equal(data.resource_profile,'IR_LLM_BOUNDARY_R03');assert.equal(data.request_profile,'LLM_BOUNDARY_CALCULATION_R03');assert.equal(data.comparison_resources.SKILL1.resource_profile,'SEMANTICS_FIRST_R02_LLM_BOUNDARY_R03');assert.equal(server.listening,false);
});
test('kernel calculation and technical-failure shapes both render in the existing UI',()=>{
 class Element{constructor(tag,text){this.tag=tag;this.text=text;this.children=[];}append(...items){this.children.push(...items);}replaceChildren(...items){this.children=items;}}
 const code=fs.readFileSync('research/7plus1-parser/v0.3-p2.1-generalization/web/calculation-view.js','utf8').replace('export function renderBoundaryCalculations','function renderBoundaryCalculations');
 const context={document:{createElement:tag=>new Element(tag)}};vm.createContext(context);vm.runInContext(code,context);
 for(const result of ['SAT','NOT_RUN']){const root=new Element('root');context.renderBoundaryCalculations(root,{boundary_calculations:{format:'boundx-kernel-result/1',compile_status:result==='SAT'?'SUPPORTED':'FAILED',result,verification:'NOT_RUN',diagnostics:[{code:'EXPLICIT_TEST_DIAGNOSTIC'}],gaps:[]}});assert.ok(JSON.stringify(root).includes('EXPLICIT_TEST_DIAGNOSTIC'));}
});
