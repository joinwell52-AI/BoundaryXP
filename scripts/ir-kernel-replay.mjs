import fs from 'node:fs';import path from 'node:path';import {compileCore} from '../src/bxp/ir-kernel/index.mjs';import {inferQueryCapability} from '../src/bxp/ir-kernel/capabilities.mjs';import {digest} from '../src/bxp/ir-kernel/load.mjs';import {diagnostic} from '../src/bxp/ir-kernel/diagnostics.mjs';
const [baselineFile,output]=process.argv.slice(2),baseline=JSON.parse(fs.readFileSync(baselineFile,'utf8'));if(fs.existsSync(output))throw Error('OUTPUT_ALREADY_EXISTS');fs.mkdirSync(output,{recursive:true});const results=[];
for(const t of baseline.traces){
 const bytes=fs.readFileSync(t.copy);if(digest(bytes)!==t.sha256)throw Error('FROZEN_TRACE_CHANGED');const trace=JSON.parse(bytes),r={sample:t.sample,trace_sha256:t.sha256,raw_ir_sha256:digest(JSON.stringify(trace.ir)),original_status:trace.boundary_calculations?.status,original_audit_issues:trace.audit?.issues?.length??0,original_omissions:trace.audit?.omissions?.length??0,original_coverage_gaps:(trace.ir.coverage??[]).filter(x=>x.status!=='EXPRESSED')};
 try{const c=compileCore(trace.ir),cap=inferQueryCapability(c.core,{});r.binding='VALID';r.capability=cap.status;r.diagnostics=cap.diagnostics??[];r.semantic_gaps=c.semantic_gaps;fs.writeFileSync(path.join(output,t.sample+'-'+t.sha256.slice(0,10)+'-core.json'),JSON.stringify(c,null,2)+'\n');}
 catch(e){r.binding='FAILED';r.diagnostics=[diagnostic(e)];}
 results.push(r);
}
const report={format:'boundx-frozen-ir-kernel-replay/1',results,tested_model_calls:0,raw_bytes_unchanged:true,does_not_replace_legacy_results:true};fs.writeFileSync(path.join(output,'REPLAY-RESULTS.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
