import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash,randomUUID} from 'node:crypto';
const root=new URL('./',import.meta.url),base='http://127.0.0.1:58618',hash=b=>createHash('sha256').update(b).digest('hex');
const refroot='D:/boundx/.boundx/real-gold-60-review/REAL-GOLD-60-REVIEW-20260918-r01/adjudications-r02';
const [action,num]=process.argv.slice(2),n=Number(num),label=String(n).padStart(3,'0');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,x)=>fs.writeFileSync(new URL(p,root),JSON.stringify(x,null,2)+'\n');
const get=async p=>{const r=await fetch(base+p);assert.equal(r.status,200);return r.json()};
if(action==='init'){
 assert.ok(!fs.existsSync(new URL('INVENTORY.json',root)));
 const catalog=await get('/api/examples'),session=await get('/api/session');
 assert.equal(catalog.count,60);
 const rows=[];
 for(const c of catalog.cases){
  const dir=refroot+'/'+c.id+'/'+c.active_revision,m=read(dir+'/MANIFEST.json'),s=fs.readFileSync(dir+'/'+m.source_file);
  assert.equal(hash(s),c.source_sha256);assert.equal(m.source_sha256,c.source_sha256);assert.equal(m.admin_gold_frozen,false);
  const refs=Object.fromEntries(['MANIFEST.json','GOLD.zh-CN.md','GOLD.json','REVIEW.json'].map(f=>[f,hash(fs.readFileSync(dir+'/'+f))]));
  rows.push({...c,reference_directory:dir,reference_hashes:refs,admin_gold_frozen:false});
 }
 write('INVENTORY.json',rows);write('FREEZE.json',{created_at:new Date().toISOString(),budget:144,model:'gpt-6-astra',reasoning:'medium',method:'SKILL',product_snapshot:session.product_snapshot});console.log('60 originals and references verified; no model calls');
}else{
 assert.ok(n>=1&&n<=60);
 const file=new URL(label+'.json',root),save=x=>fs.writeFileSync(file,JSON.stringify(x,null,2)+'\n'),inventory=read(new URL('INVENTORY.json',root)),item=inventory.find(x=>x.id==='REAL-GOLD-'+label);
 if(action==='reference'){
  const m=read(item.reference_directory+'/MANIFEST.json');
  console.log(fs.readFileSync(item.reference_directory+'/'+m.source_file,'utf8'));
  const gold=fs.readFileSync(item.reference_directory+'/GOLD.zh-CN.md','utf8');
  console.log('\nHUMAN REFERENCE\n'+gold);
 }else if(action==='start'){
  assert.ok(!fs.existsSync(file),'Already submitted; never duplicate');
  const prior=[];
  for(let i=1;i<n;i++){const l=String(i).padStart(3,'0'),p=read(new URL(l+'.json',root));assert.equal(p.status,'COMPLETED');assert.ok(fs.existsSync(new URL(l+'-comparison.md',root)));prior.push(p)}
  const spent=prior.reduce((s,p)=>s+p.conservative_requests,0);
  assert.ok(spent+6<=144,'Reserve whole server request guard before starting');
  assert.ok(!(await get('/api/runs')).some(r=>['QUEUED','RUNNING','CANCELLING'].includes(r.status)));
  const session=await get('/api/session'),frozen=read(new URL('FREEZE.json',root));
  assert.equal(session.product_snapshot.manifest_sha256,frozen.product_snapshot.manifest_sha256);
  const source=await get('/api/examples/'+item.id),bytes=Buffer.from(source.base64,'base64');
  assert.equal(hash(bytes),item.source_sha256);
  for(const [f,h] of Object.entries(item.reference_hashes))assert.equal(hash(fs.readFileSync(item.reference_directory+'/'+f)),h);
  const record={case:item.id,revision:item.active_revision,request_id:randomUUID(),source_sha256:hash(bytes),source_codepoints:item.codepoints,reference_hashes:item.reference_hashes,status:'SUBMITTING',model:'gpt-6-astra',reasoning:'medium',method:'SKILL',manifest_sha256:session.product_snapshot.manifest_sha256,prior_conservative:spent};save(record);
  const res=await fetch(base+'/api/parse',{method:'POST',headers:{'content-type':'application/json',cookie:'boundx_session='+session.token,'x-boundx-session':session.token},body:JSON.stringify({base64:source.base64,filename:source.filename,request_id:record.request_id,model:record.model,reasoning:record.reasoning,parse_method:record.method})});
  const data=await res.json();if(res.status!==202){record.status='SUBMISSION_ERROR';record.error=data;save(record);throw Error(JSON.stringify(data))}
  Object.assign(record,{run_id:data.run_id,status:data.status,created_at:data.created_at});save(record);console.log(JSON.stringify(record));
 }else if(action==='collect'){
  const record=read(file),data=await get('/api/runs/'+record.run_id),dir='D:/boundx/.boundx/short-compiler-031-r1/data/runs/'+record.run_id;
  const phases=['parse','audit'],receipts=phases.map(p=>{const f=dir+'/revision-0/'+p+'-call/receipt-0.json';return fs.existsSync(f)?read(f):null});
  const started=phases.map(p=>fs.existsSync(dir+'/revision-0/'+p+'-call/request-0.json'));
  Object.assign(record,{status:data.status,stage:data.stage,error:data.error??null,parse_ms:receipts[0]?.elapsed_ms??null,audit_ms:receipts[1]?.elapsed_ms??null,outer_started:started.filter(Boolean).length,unfinished_reservations:started.filter((s,i)=>s&&!receipts[i]).length,conservative_requests:receipts.reduce((s,r)=>s+(r?.conservative_request_count??0),0),billable_requests:null});
  if(data.ended_at){record.ended_at=data.ended_at;record.total_ms=Date.parse(data.ended_at)-Date.parse(data.created_at);record.other_ms=receipts.every(Boolean)?record.total_ms-record.parse_ms-record.audit_ms:null;record.usage=receipts.map(r=>r?.usage??null);record.observed_internal_retries=receipts.reduce((s,r)=>s+(r?.observed_internal_retries??0),0)}
  for(const [i,phase] of phases.entries()){
   const f=dir+'/revision-0/'+phase+'-call/response-0.txt',target=new URL(label+'-'+phase+'.md',root);
   if(fs.existsSync(f)&&receipts[i]?.exit_code===0){const text=fs.readFileSync(f,'utf8');record[phase+'_sha256']=hash(text);if(!fs.existsSync(target))fs.writeFileSync(target,text,{flag:'wx'});else assert.equal(hash(fs.readFileSync(target)),hash(text))}
   if(receipts[i])write(label+'-'+phase+'-receipt.json',receipts[i]);
  }
  if(data.result){
   assert.equal(hash(data.source_text),record.source_sha256);
   assert.equal(data.result.report,fs.readFileSync(new URL(label+'-parse.md',root),'utf8'));assert.equal(data.result.canonical.report,data.result.report);
   assert.equal(data.result.review,fs.readFileSync(new URL(label+'-audit.md',root),'utf8'));assert.ok(receipts[0].thread_id!==receipts[1].thread_id);record.independent_sessions=true;record.exports=[];
   for(const suffix of ['json','export','trace.md','trace.html','trace.json','calculations.json']){const r=await fetch(base+'/api/runs/'+record.run_id+'/'+suffix);assert.equal(r.status,200);const bytes=Buffer.from(await r.arrayBuffer());if(suffix==='json')assert.equal(JSON.parse(bytes).report,data.result.report);if(suffix==='export')assert.equal(bytes.toString(),data.result.chinese);record.exports.push({suffix,status:r.status,sha256:hash(bytes)})}
  }
  save(record);console.log(JSON.stringify(record,null,2));
  if(data.ended_at)for(const phase of phases){const f=new URL(label+'-'+phase+'.md',root);if(fs.existsSync(f))console.log('\n'+phase+'\n'+fs.readFileSync(f,'utf8'))}
 }else throw Error('Unknown action');
}

