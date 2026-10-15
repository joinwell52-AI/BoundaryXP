// Open boundary reports use the existing provider, login and serial sessions.
// No semantic parser, rule whitelist, automatic rewrite or solver is inserted here.
import fs from 'node:fs';import path from 'node:path';
import {prepareSource,sha256} from './source.mjs';
import {callCodex,probeCodex} from './provider.mjs';
import {modelSignal} from './observability.mjs';
import {selectDictionaries,dictionaryIdentity,dictionaryInstructions,verifyDictionarySnapshot,scanDictionaries,dictionaryScanInstructions} from './dictionaries.mjs';
export const reportProfile='BOUNDARY_REPORT_R01';
export function boundaryReportBundle(phase,{parseMethod='SKILL'}={}){
 if(!['parse','audit'].includes(phase)||!['SKILL','SKILL1'].includes(parseMethod))throw Error('INVALID_REPORT_RESOURCE_SELECTION');
 const file=(parseMethod==='SKILL1'?'skill-profiles/semantics-first-r02/':'skills/')+`boundx-semantic-${phase}/SKILL.md`;
 const resources=[file,'boundary-report-method.md'].map(p=>{const text=fs.readFileSync(new URL(p,import.meta.url),'utf8');return {path:p,text,sha256:sha256(text)};});
 const text=resources.map(r=>`<RESOURCE path="${r.path}">\n${r.text}\n</RESOURCE>`).join('\n');
 return {phase,name:'boundx-semantic-'+phase,contract_version:'candidate-ir/2.0',parse_method:parseMethod,mode:'INLINE_BUNDLE',schema:null,resources,text,sha256:sha256(text),transport_version:reportProfile,request_profile:reportProfile,resource_profile:parseMethod+'_OPEN_BOUNDARY_R01',schema_delivery:{mode:'NONE_SKILL_GUIDED_REPORT'},real_model_acceptance:'NOT_RUN'};
}
const write=(dir,name,value)=>fs.writeFileSync(path.join(dir,name),JSON.stringify(value,null,2)+'\n');
export async function parseBoundaryReport(bytes,{output,probe,model='gpt-6.1-sol',reasoning='medium',parseMethod='SKILL',dictionaries={},signal,onProgress=()=>{},timeoutMs=null,call=callCodex,maxModelRequests=2,resourceGuard=()=>{},productSnapshot=null,bundleFactory=boundaryReportBundle}={}){
 parseMethod??='SKILL';
 if(!output)throw Error('OUTPUT_DIRECTORY_REQUIRED');
 if(!Number.isSafeInteger(maxModelRequests)||maxModelRequests<2)throw Error('MODEL_REQUEST_BUDGET_EXHAUSTED');
 if(fs.existsSync(path.join(output,'source.txt')))throw Error('OUTPUT_ALREADY_EXISTS');
 resourceGuard();signal?.throwIfAborted();fs.mkdirSync(output,{recursive:true});
 const snapshot=selectDictionaries(dictionaries),selection=dictionaryIdentity(snapshot);
 const source=prepareSource(bytes),scan=scanDictionaries(snapshot,source.text);
 const withDictionary=phase=>{const b=bundleFactory(phase,{parseMethod}),text=b.text+dictionaryInstructions(snapshot)+dictionaryScanInstructions(scan);return {...b,text,sha256:sha256(text),dictionary_snapshot:snapshot};};
 const parse=withDictionary('parse'),audit=withDictionary('audit'),fingerprint=sha256(parse.sha256+audit.sha256);
 write(output,'dictionary-scan.json',scan);
 write(output,'dictionary-selection.json',selection);write(output,'dictionary-snapshot.json',snapshot);
 fs.writeFileSync(path.join(output,'source.txt'),bytes);write(output,'source.json',source);
 write(output,'selected-resources.json',{parse_method:parseMethod,request_profile:reportProfile,resource_profile:parse.resource_profile,sha256:fingerprint,resources:{parse:parse.resources.map(({text,...r})=>r),audit:audit.resources.map(({text,...r})=>r)}});
 onProgress({stage:'PREPARING',revision:0});probe??=probeCodex();write(output,'environment.json',probe);
 const dir=path.join(output,'revision-0');fs.mkdirSync(dir);
 const requestBudget={remaining:maxModelRequests},telemetry=phase=>({onEvent:event=>{const s=modelSignal(event);if(s)onProgress({stage:phase==='parse'?'PARSING':'AUDITING',phase,revision:0,...s});},onActivity:p=>onProgress({stage:phase==='parse'?'PARSING':'AUDITING',phase,revision:0,...p})});
 const invoke=async(phase,bundle,candidate)=>{
  resourceGuard();signal?.throwIfAborted();onProgress({stage:phase==='parse'?'PARSING':'AUDITING',revision:0});
  const response=await call({bundle,source,candidate,directory:path.join(dir,phase+'-call'),probe,model,reasoning,signal,timeoutMs,requestBudget,...telemetry(phase)});
  if(typeof response.value!=='string'||!response.value.trim())throw Error('MODEL_REPORT_EMPTY');
  return response;
 };
 const parsed=await invoke('parse',parse,null),proposal={text:parsed.value,sha256:sha256(parsed.value)};
 write(dir,'proposal.json',proposal);fs.writeFileSync(path.join(dir,'boundary-report.md'),parsed.value);
 onProgress({stage:'PARSING',revision:0,signal:'PARSE_READY'});
 const reviewed=await invoke('audit',audit,{text:parsed.value,sha256:proposal.sha256}),review={text:reviewed.value,sha256:sha256(reviewed.value),reviewed_report_sha256:proposal.sha256};
 write(dir,'audit.json',review);fs.writeFileSync(path.join(dir,'boundary-review.md'),reviewed.value);
 onProgress({stage:'AUDITING',revision:0,signal:'AUDIT_READY'});
 const independent=!!parsed.receipt.thread_id&&!!reviewed.receipt.thread_id&&parsed.receipt.thread_id!==reviewed.receipt.thread_id;
 if(!independent)throw Error('AUDIT_SESSION_NOT_INDEPENDENT');
 resourceGuard();signal?.throwIfAborted();
 verifyDictionarySnapshot(snapshot);
 if(sha256(withDictionary('parse').sha256+withDictionary('audit').sha256)!==fingerprint)throw Error('METHOD_CHANGED_DURING_RUN');
 onProgress({stage:'VALIDATING',revision:0});
 const technical={technical_ok:true,scope:'RECEIPT_AND_IDENTITY_ONLY',independent_sessions:true,resource_binding_sha256:fingerprint,source_sha256:source.sha256,report_sha256:proposal.sha256,review_sha256:review.sha256,semantic_completeness:'NOT_PROGRAM_VERIFIED',mathematical_correctness:'NOT_PROGRAM_VERIFIED',errors:[],diagnostics:[]};
 write(dir,'technical-validation.json',technical);onProgress({stage:'VALIDATING',revision:0,signal:'TECHNICAL_READY'});
 const canonical={format:'boundx-boundary-report/1',report:parsed.value,report_sha256:proposal.sha256,source_sha256:source.sha256,semantic_acceptance:'NOT_PROGRAM_VERIFIED',slots:{},unresolved:[],gaps:[],issue_inventory:'SEE_LLM_REPORT_AND_REVIEW_NOT_MACHINE_CLASSIFIED',business_decision:null,execution_authorization:null};
 const boundary_calculations={status:'LLM_REPORT_RECORDED',program_verification:'NOT_PERFORMED',report_sha256:proposal.sha256,note:'必要计算保留在LLM原报告中；程序未复算，不读取自然语言猜测结果。'};
 const chinese=parsed.value+'\n\n---\n\n## 独立LLM审阅（保留原文）\n\n'+reviewed.value+'\n\n---\n\n程序已核对回执、版本绑定及独立会话；未自动证明边界完整性或计算正确性。尚未核验PM规划。\n';
 const final={format:'boundx-boundary-report-trace/1',pipeline:reportProfile,request_profile:reportProfile,resource_profile:parse.resource_profile,parse_method:parseMethod,product_snapshot:productSnapshot,source,proposal,audit:review,technical,canonical,chinese,boundary_calculations,model_calls:{parse:parsed.attempts,audit:reviewed.attempts},revision:0,report:parsed.value,review:reviewed.value,model_resource_digests:[...parse.resources,...audit.resources].map(({path,sha256})=>({path,sha256})),business_decision:null,execution_authorization:null};
 final.dictionaries=selection;
 final.dictionary_scan=scan;
 final.chinese+='\n程序语义库扫描：命中 '+scan.matches.length+' 处，涉及 '+scan.entries.length+' 个候选词条。扫描仅提示查询入口，不代表词义确认；完整位置和版本见 dictionary_scan。\n';
 final.dictionary_lookups={parse:parsed.attempts.flatMap(r=>r.dictionary_lookups??[]),audit:reviewed.attempts.flatMap(r=>r.dictionary_lookups??[])};
 final.chinese+='\n## 本次字典\n\n'+(selection.packs.map(p=>`${p.layer}：${p.label}；${p.id}；SHA256 ${p.sha256}`).join('\n\n')||'未启用')+'\n\n生成实际查询 '+final.dictionary_lookups.parse.length+' 次；审阅实际查询 '+final.dictionary_lookups.audit.length+' 次。选中不代表实际查阅。\n';
 write(output,'final-audit-binding.json',{source_sha256:source.sha256,report_sha256:proposal.sha256,review_sha256:review.sha256,parse_session:parsed.receipt.thread_id,audit_session:reviewed.receipt.thread_id});
 onProgress({stage:'COMPILING',revision:0});
 for(const [name,value]of Object.entries({'trace.json':final,'7plus1.json':canonical,'boundary-calculations.json':boundary_calculations}))write(output,name,value);
 fs.writeFileSync(path.join(output,'7plus1.zh.md'),final.chinese);
 write(output,'run-summary.json',{pipeline:reportProfile,request_profile:reportProfile,parse_method:parseMethod,resource_profile:parse.resource_profile,real_calls:parsed.attempts.length+reviewed.attempts.length,requested_model:model,requested_reasoning:reasoning,source_sha256:source.sha256,revision_count:0,semantic_acceptance_is_not_proven:true});
 onProgress({stage:'COMPILING',revision:0,signal:'COMPILE_READY'});return final;
}
