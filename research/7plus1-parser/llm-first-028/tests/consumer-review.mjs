import fs from 'node:fs';
import path from 'node:path';
import {contractVersion} from '../contracts/schema.mjs';
import {technicalValidate} from '../validate.mjs';
import {compileBoundary} from '../compile.mjs';
import {deliveryCases} from './delivery-cases.mjs';
import {evaluateDelivery} from './delivery-evaluate.mjs';
import {writeJSON} from '../engine.mjs';
const report=path.resolve('docs/reports/7plus1/7P-SHORT-COMPILER-DELIVERY-029-LONG'),output=path.join(report,'consumer-only');fs.mkdirSync(output);const rows=[];
for(const id of ['T02','T04','T07','T10']){
 const previous=JSON.parse(fs.readFileSync(path.join(report,'first',id,'run/trace.json'),'utf8')),g=structuredClone(previous.proposal),a=structuredClone(previous.audit);
 // Explicit test-only version adaptation: semantic fields unchanged, not compatible Skill replay.
 g.contract_version=a.contract_version=contractVersion;const technical=technicalValidate(previous.source,g,a),compiled=compileBoundary(previous.source,g,a,technical);
 const trace={source:previous.source,proposal:g,audit:a,technical,...compiled,execution_mode:'CONSUMER_ONLY_VERSION_ADAPTED_EXPERIMENT',real_calls:0,not_final_semantic_validation:true,original_contract:previous.proposal.contract_version};
 const result=evaluateDelivery(deliveryCases.find(c=>c.id===id),trace);writeJSON(path.join(output,id+'.json'),{trace,evaluation:result});rows.push({id,end_to_end:result.end_to_end,failures:result.failures.map(f=>f.name),before_unresolved:previous.canonical.unresolved.length,after_unresolved:trace.canonical.unresolved.length});
}
writeJSON(path.join(output,'RESULTS.json'),rows);console.log(rows);
