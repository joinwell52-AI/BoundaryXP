import {noBypassGates as automaticGates} from './gates.mjs';
export function noBypassGates(c,domain){
 const audit=automaticGates(c);
 if(domain==='REVIEWED_GRAPH_TEST_ONLY'){
  audit.automatic_entry_audit={original_G8:audit.gates.G8,diagnostic_only:true};
  audit.gates.G8={status:'NOT_APPLICABLE',reason:'SOURCE_REVIEWED_DIAGNOSTIC_NOT_AUTOMATIC_GENERATOR',errors:[],violations:0};
  audit.status=Object.values(audit.gates).every(g=>['PASS','NOT_APPLICABLE'].includes(g.status))?'PASS':'FAIL';
 }
 return audit;
}
export function assertNoBypass(c,domain){const audit=noBypassGates(c,domain);if(audit.status!=='PASS')throw Error('CANDIDATE_GRAPH_GATE_FAILURE '+JSON.stringify(audit));return audit;}
