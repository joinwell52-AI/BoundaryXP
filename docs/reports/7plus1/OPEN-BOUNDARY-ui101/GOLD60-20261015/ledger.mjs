import fs from 'node:fs';
const root=new URL('./',import.meta.url),read=f=>JSON.parse(fs.readFileSync(new URL(f,root),'utf8'));
const cases=read('INVENTORY.json').map(c=>{const l=c.id.slice(-3),f=l+'.json';if(!fs.existsSync(new URL(f,root)))return {case:c.id,status:'NOT_RUN'};const r=read(f);return {...r,unfinished_reservations:r.unfinished_reservations??(['QUEUED','RUNNING','SUBMITTING'].includes(r.status)?2:0),comparison_saved:fs.existsSync(new URL(l+'-comparison.md',root))}});
const total=k=>cases.reduce((s,c)=>s+(c[k]??0),0);
const ledger={updated_at:new Date().toISOString(),authorized_cap:144,prior_batch_conservative:22,prior_batch_unchanged:true,normal_planned_outer_calls:120,completed:cases.filter(c=>c.status==='COMPLETED').length,failed:cases.filter(c=>['FAILED','SUBMISSION_ERROR','CANCELLED'].includes(c.status)).length,not_run:cases.filter(c=>c.status==='NOT_RUN').length,outer_started:total('outer_started'),observed_internal_retries:total('observed_internal_retries'),completed_receipt_conservative:total('conservative_requests'),unfinished_reservations:total('unfinished_reservations'),billable_requests:null,cases};
ledger.remaining_after_known_and_reservations=144-ledger.completed_receipt_conservative-ledger.unfinished_reservations;
fs.writeFileSync(new URL('LEDGER.json',root),JSON.stringify(ledger,null,2)+'\n');
console.log(JSON.stringify({...ledger,cases:undefined}));
