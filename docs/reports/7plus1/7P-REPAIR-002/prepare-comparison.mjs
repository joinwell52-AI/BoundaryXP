import fs from'node:fs';
let s=fs.readFileSync('docs/reports/7plus1/7P-REPAIR-001/compare.mjs','utf8');
s=s.replace("const dir='docs/reports/7plus1/7P-REPAIR-001'","const dir='docs/reports/7plus1/7P-REPAIR-002'").replaceAll('docs/reports/7plus1/7P-STANDARD-003/COMPARISON.json','docs/reports/7plus1/7P-REPAIR-001/COMPARISON.json').replaceAll('docs/reports/7plus1/7P-STANDARD-003/SLOT-SUMMARY.json','docs/reports/7plus1/7P-REPAIR-001/SLOT-SUMMARY.json').replace("task:'7P-REPAIR-001'","task:'7P-REPAIR-002'");
const start=s.indexOf('function reviewNew('),end=s.indexOf('\nfor(const a of active.cases',start);
s=s.slice(0,start)+`const ledger=read(dir+'/SEMANTIC-REVIEW-LEDGER.json');
function reviewNew(id,slot,e,c,facts){const row=ledger.actual[e.canonical_entry_id];if(!row)throw Error('UNREVIEWED_RESOLVED '+id+' '+slot+' '+e.canonical_entry_id+' '+e.display_value);return row;}
`+s.slice(end);
const cstart=s.indexOf('  const cr='),cend=s.indexOf('\n  const findings=',cstart);
s=s.slice(0,cstart)+`  const cr=(expected.slots[slot].output_content_requirements??[]).map(entry=>{const key=id+':O:'+entry.requirement_id,review=ledger.output_content[key]??{finding:'MISSING',reason:'尚未证明完整内容语义、条件及归属；不按文字命中评分。',matching_requirement_ids:[]};for(const rid of review.matching_requirement_ids){const req=c.nlp_signals.semantic_decoding.discourse.output_content_requirements.find(r=>r.requirement_id===rid);if(!req?.owner_output_ids?.length||req.kind!=='SECTION_CONTENT_REQUIREMENT'||req.modality!=='REQUIRED')throw Error('CONTENT_WITHOUT_OWNERSHIP '+key);}return {entry_id:key,entry,...review};});`+s.slice(cend);
fs.writeFileSync('docs/reports/7plus1/7P-REPAIR-002/compare.mjs',s,{flag:'wx'});
