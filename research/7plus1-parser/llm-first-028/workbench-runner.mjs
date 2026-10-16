import fs from 'node:fs';import path from 'node:path';
import {parseBoundaryReport,boundaryReportBundle} from './boundary-report.mjs';
import {sha256} from './source.mjs';
import {indexBoundary} from '../../../src/bxp/workbench-model.mjs';
import {callCodex,probeCodex} from './provider.mjs';
import {prepareSource} from './source.mjs';
import {selectDictionaries,dictionaryIdentity,dictionaryInstructions,verifyDictionarySnapshot} from './dictionaries.mjs';
const skillFile=phase=>new URL(`workbench-skills/${phase}/SKILL.md`,import.meta.url);
const files=['generate','review','compare','compare-review'];
export function workbenchResources(){return {format:'workbench-clause-index/1',resources:files.map(p=>({path:p,sha256:sha256(fs.readFileSync(skillFile(p)))})),profiles:['SKILL','SKILL1'].flatMap(parseMethod=>['parse','audit'].map(phase=>boundaryReportBundle(phase,{parseMethod}).sha256)),method:sha256(fs.readFileSync(new URL('boundary-report-method.md',import.meta.url))),adapter:sha256(fs.readFileSync(new URL('workbench-runner.mjs',import.meta.url))),core:sha256(fs.readFileSync(new URL('../../../src/bxp/workbench-comparison.mjs',import.meta.url))),index:sha256(fs.readFileSync(new URL('../../../src/bxp/workbench-model.mjs',import.meta.url)))};}
// Only resources used to interpret/review a node affect its semantic cache.
// Comparison, rendering and package manifest changes must not regenerate the tree.
export function nodeResourceIdentity(resources,settings={}){
 const offset=settings.parse_method==='SKILL1'?2:0;
 return {format:resources.format,resources:resources.resources.filter(r=>['generate','review'].includes(r.path)),profiles:resources.profiles.slice(offset,offset+2),method:resources.method,index:resources.index,dictionaries:resources.dictionaries};
}
export function readModelJSON(text){
 const value=JSON.parse(text.trim().replace(/^```(?:json)?\s*/,'').replace(/\s*```$/,''));
 if(!value||typeof value!=='object'||Array.isArray(value))throw Error('MODEL_INDEX_OBJECT_REQUIRED');return value;
}
const bundleFactory=(kind,context)=>(phase,options)=>{
 const base=boundaryReportBundle(phase,options),name=kind==='compare'?(phase==='parse'?'compare':'compare-review'):(phase==='parse'?'generate':'review');
 const resources=[...base.resources.filter(r=>kind!=='compare'||r.path==='boundary-report-method.md'),{path:`workbench-skills/${name}/SKILL.md`,text:fs.readFileSync(skillFile(name),'utf8')}].map(r=>({...r,sha256:sha256(r.text)}));
 let text=resources.map(r=>r.text).join('\n\n')+'\n本次工作台采用最后所述的紧凑JSON条款/审阅接口，保留前述Skill的全部边界语义要求。';if(context)text+='\n<PARENT_CONTEXT_DATA>\n'+JSON.stringify(context)+'\n</PARENT_CONTEXT_DATA>';
 return {...base,name:'boundx-workbench-'+name,resources,text,sha256:sha256(text),resource_profile:'WORKBENCH_'+name};
};
export async function executeWorkbench({kind,input,output,settings,signal,onProgress,resourceGuard,productSnapshot,call}){
 const text=kind==='node'?input.text:JSON.stringify(input);
 const trace=await parseBoundaryReport(Buffer.from(text,'utf8'),{output,model:settings.model,reasoning:settings.reasoning,parseMethod:settings.parse_method??'SKILL',dictionaries:settings.dictionaries??{},signal,onProgress,resourceGuard,productSnapshot,call,bundleFactory:bundleFactory(kind,input.context)});
 let proposal,review,interface_error=null;
 try{proposal=readModelJSON(trace.report);review=readModelJSON(trace.review);}catch(e){interface_error=e.message;}
 if(kind==='node'&&(!review||!['NO_ISSUES_FOUND','ISSUES_FOUND'].includes(review.status)||!Array.isArray(review.issues)))interface_error??='REVIEW_INTERFACE_INVALID';
 if(kind==='compare'&&(!review||!Array.isArray(review.accepted_check_ids)||!Array.isArray(review.issues)))interface_error??='COMPARE_REVIEW_INTERFACE_INVALID';
 return {kind,proposal,review,interface_error,boundary:kind==='node'?indexBoundary(proposal,text):null,trace_path:path.join(output,'trace.json'),report:trace.report,review_text:trace.review,model_calls:trace.model_calls,dictionary_lookups:trace.dictionary_lookups,dictionaries:trace.dictionaries,dictionary_scan:trace.dictionary_scan,created_at:new Date().toISOString()};
}
export async function reviewWorkbenchComparison({input,previous,output,settings,signal,resourceGuard=()=>{},onProgress=()=>{},call=callCodex}){
 if(!previous?.proposal||!previous.report)throw Error('SAVED_COMPARISON_REQUIRED');
 if(fs.existsSync(output))throw Error('OUTPUT_ALREADY_EXISTS');fs.mkdirSync(output,{recursive:true});
 const source=prepareSource(Buffer.from(JSON.stringify(input))),snapshot=selectDictionaries(settings.dictionaries??{}),base=bundleFactory('compare',null)('audit',{parseMethod:settings.parse_method??'SKILL'}),text=base.text+dictionaryInstructions(snapshot),bundle={...base,text,sha256:sha256(text),dictionary_snapshot:snapshot};
 fs.writeFileSync(path.join(output,'source.txt'),source.text);fs.writeFileSync(path.join(output,'proposal.json'),JSON.stringify(previous.proposal,null,2));
 resourceGuard();onProgress({stage:'AUDITING_SAVED_COMPARISON'});
 const result=await call({bundle,source,candidate:{text:previous.report,sha256:sha256(previous.report)},directory:path.join(output,'audit-call'),probe:probeCodex(),model:settings.model,reasoning:settings.reasoning,signal,timeoutMs:null,requestBudget:null});
 if(!result.receipt.thread_id||(previous.model_calls?.parse??[]).some(r=>r.thread_id===result.receipt.thread_id))throw Error('AUDIT_SESSION_NOT_INDEPENDENT');
 resourceGuard();verifyDictionarySnapshot(snapshot);const review=readModelJSON(result.value);
 if(!Array.isArray(review.accepted_check_ids)||!Array.isArray(review.issues))throw Error('COMPARE_REVIEW_INTERFACE_INVALID');
 const value={kind:'compare',proposal:previous.proposal,review,report:previous.report,review_text:result.value,interface_error:null,previous_result:previous.input_sha256,model_calls:{parse:[],audit:result.attempts},dictionaries:dictionaryIdentity(snapshot),created_at:new Date().toISOString()};
 fs.writeFileSync(path.join(output,'review-result.json'),JSON.stringify(value,null,2));return value;
}
