import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash,randomUUID} from 'node:crypto';
const root=new URL('./',import.meta.url),base='http://127.0.0.1:58618',hash=b=>createHash('sha256').update(b).digest('hex');
const [action,num]=process.argv.slice(2),n=Number(num),label=String(n).padStart(3,'0');
assert.ok(n>=1&&n<=10);
const file=new URL(label+'.json',root),read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const save=x=>fs.writeFileSync(file,JSON.stringify(x,null,2)+'\n');
const get=async p=>{const r=await fetch(base+p);assert.equal(r.status,200);return r.json()};
if(action==='start'){
 assert.ok(!fs.existsSync(file),'Case already started; do not duplicate');
 const prior=[];for(let i=1;i<n;i++){const p=read(new URL(String(i).padStart(3,'0')+'.json',root));assert.equal(p.status,'COMPLETED');assert.ok(fs.existsSync(new URL(String(i).padStart(3,'0')+'-comparison.md',root)),'Compare previous source before next request');prior.push(p)}
 assert.ok(prior.reduce((s,p)=>s+p.conservative_requests,0)+2<=22,'Batch budget');
 const runs=await get('/api/runs');assert.ok(!runs.some(r=>['QUEUED','RUNNING','CANCELLING'].includes(r.status)),'Existing active run');
 const session=await get('/api/session');assert.equal(session.product_snapshot.manifest_sha256,'bb7c1bc2b09443c8e44290cb9a8b8655b827febf35599b6858e710394de5df33');
 const source=fs.readFileSync('D:/boundx/docs/testing/7plus1/MANUAL-TEST-'+label+'.txt');
 const md=fs.readFileSync('D:/boundx/docs/testing/7plus1/MANUAL-TEST-'+label+'.md');
 const record={case:label,request_id:randomUUID(),source_sha256:hash(source),standard_sha256:hash(md),status:'SUBMITTING',model:'gpt-6-astra',reasoning:'medium',method:'SKILL',manifest_sha256:session.product_snapshot.manifest_sha256};save(record);
 const res=await fetch(base+'/api/parse',{method:'POST',headers:{'content-type':'application/json',cookie:'boundx_session='+session.token,'x-boundx-session':session.token},body:JSON.stringify({base64:source.toString('base64'),filename:'MANUAL-TEST-'+label+'.txt',request_id:record.request_id,model:record.model,reasoning:record.reasoning,parse_method:record.method})});
 const data=await res.json();if(res.status!==202){record.status='SUBMISSION_ERROR';record.error=data;save(record);throw Error(JSON.stringify(data))}
 Object.assign(record,{run_id:data.run_id,status:data.status,created_at:data.created_at});save(record);console.log(JSON.stringify(record));
}else if(action==='collect'){
 const record=read(file),data=await get('/api/runs/'+record.run_id);
 const dir='D:/boundx/.boundx/short-compiler-031-r1/data/runs/'+record.run_id;
 const receipts=['parse','audit'].map(p=>{const f=dir+'/revision-0/'+p+'-call/receipt-0.json';return fs.existsSync(f)?read(f):null});
 Object.assign(record,{status:data.status,stage:data.stage,error:data.error??null,parse_ms:receipts[0]?.elapsed_ms??null,audit_ms:receipts[1]?.elapsed_ms??null,conservative_requests:receipts.reduce((s,r)=>s+(r?.conservative_request_count??0),0)});
 if(data.ended_at){record.ended_at=data.ended_at;record.total_ms=Date.parse(data.ended_at)-Date.parse(data.created_at);record.other_ms=receipts.every(Boolean)?record.total_ms-record.parse_ms-record.audit_ms:null;record.usage=receipts.map(r=>r?.usage??null);record.observed_internal_retries=receipts.reduce((s,r)=>s+(r?.observed_internal_retries??0),0);}
 for(const [phase,i] of [['parse',0],['audit',1]]){const f=dir+'/revision-0/'+phase+'-call/response-0.txt';if(fs.existsSync(f)&&receipts[i]?.exit_code===0){const text=fs.readFileSync(f,'utf8');record[phase+'_sha256']=hash(text);const target=new URL(label+'-'+phase+'.md',root);if(!fs.existsSync(target))fs.writeFileSync(target,text,{flag:'wx'});}}
 if(data.result){assert.equal(hash(data.source_text),record.source_sha256);assert.equal(data.result.report,fs.readFileSync(new URL(label+'-parse.md',root),'utf8'));assert.equal(data.result.canonical.report,data.result.report);assert.equal(data.result.review,fs.readFileSync(new URL(label+'-audit.md',root),'utf8'));assert.ok(receipts[0].thread_id!==receipts[1].thread_id);record.independent_sessions=true;record.exports=[];for(const suffix of ['json','export','trace.md','trace.html','trace.json','calculations.json']){const r=await fetch(base+'/api/runs/'+record.run_id+'/'+suffix);assert.equal(r.status,200);const bytes=Buffer.from(await r.arrayBuffer());if(suffix==='json')assert.equal(JSON.parse(bytes).report,data.result.report);if(suffix==='export')assert.equal(bytes.toString(),data.result.chinese);record.exports.push({suffix,status:r.status,sha256:hash(bytes)})}}
 save(record);console.log(JSON.stringify(record,null,2));
 for(const phase of ['parse','audit']){const f=new URL(label+'-'+phase+'.md',root);if(fs.existsSync(f))console.log('\n'+phase+'\n'+fs.readFileSync(f,'utf8'))}
}else throw Error('Unknown action');
