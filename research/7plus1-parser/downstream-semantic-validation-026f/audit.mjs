import {OUT as TASK_OUT,read,save} from './util.mjs';
const OUT=TASK_OUT,automaticRoot=process.argv[2]?`${OUT}/${process.argv[2]}`:OUT;
import {auditProof} from './proof-audit.mjs';
const rows=[];
for(const row of read(`${OUT}/INPUT-FREEZE.json`).rows){const t=read(`${OUT}/runs/${process.argv[2]?'trial-r004':'trial-r003'}/${row.id}/trace.json`),audit=auditProof(t);save(`${automaticRoot}/proof/${row.id}.json`,audit);rows.push({id:row.id,group:row.group,gaps:audit.gap_count,resolved_facts:audit.resolved_facts});}
for(const row of read(`${automaticRoot}/AUTOMATIC-MATRIX.json`).rows.filter(r=>r.status==='OUTPUT_SAVED')){const t=read(`${automaticRoot}/automatic/trial/${row.corpus}/${row.id}/trace.json`),audit=auditProof(t);rows.push({id:row.id,group:row.corpus,gaps:audit.gap_count,resolved_facts:audit.resolved_facts,details:audit.gaps});}
save(`${automaticRoot}/PROOF-AUDIT.json`,{rows,total_gap_count:rows.reduce((n,r)=>n+r.gaps,0)});console.log('Proof gaps',rows.reduce((n,r)=>n+r.gaps,0));
