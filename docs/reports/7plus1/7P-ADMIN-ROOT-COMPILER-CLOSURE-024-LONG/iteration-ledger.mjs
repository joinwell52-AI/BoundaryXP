import fs from 'node:fs';
import {OUT,write} from './audit-tools.mjs';
// Read existing immutable first outputs; never replace a replay or infer
// semantic success from its process/contract status.
const dir=OUT+'/development';
const rows=fs.readdirSync(dir).filter(x=>/^r\d{2}$/u.test(x)).sort().map(revision=>{
 const base=dir+'/'+revision,results=JSON.parse(fs.readFileSync(base+'/RESULTS.json','utf8'));
 return {revision,implementation_snapshot:'development/'+revision+'/IMPLEMENTATION.json',
  first_outputs:'development/'+revision+'/RESULTS.json',total:results.total,outputs:results.outputs,
  runtime_errors:results.errors,cached_nlp:true,actual_semantic_models_used:false,
  source_equivalent_closure:'NOT_YET_ACCEPTED',final_acceptance:false};
});
const name=process.argv[2];if(!/^r\d{2}$/u.test(name))throw Error('LEDGER_REVISION_REQUIRED');
write('iteration-ledgers/'+name+'.json',{task:'7P-ADMIN-ROOT-COMPILER-CLOSURE-024-LONG',rows,
 note:'Runtime output counts are not source-semantic closure counts. Failed first outputs remain preserved. No Natural100 inputs or answers were used.'});
console.log(JSON.stringify({ledger:name,iterations:rows.length}));
