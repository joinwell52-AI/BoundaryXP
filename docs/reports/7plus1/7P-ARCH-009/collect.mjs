import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
export const out='docs/reports/7plus1/7P-ARCH-009/';
export const old='docs/reports/7plus1/7P-CLOSURE-008/';
export const runtime='research/7plus1-parser/v0.3-7p-closure-008/';
export const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
export const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
export const write=(p,x)=>{if(fs.existsSync(out+'SEAL.md')&&!(p==='SEAL-VERIFICATION.json'&&!fs.existsSync(out+p)))throw Error('SEALED_DIAGNOSTIC_NO_OVERWRITE');if(p==='BASELINE.json'&&fs.existsSync(out+p))throw Error('START_BASELINE_NO_OVERWRITE');fs.writeFileSync(out+p,typeof x==='string'?x:JSON.stringify(x,null,2)+'\n','utf8');};
export const walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(p+e.name+'/'):[p+e.name]);
export const git=(...args)=>execFileSync('git',args,{encoding:'utf8',maxBuffer:128*1024*1024}).trim();
if(process.argv[1]?.endsWith('collect.mjs')){
 const tracked=git('ls-files','-z').split('\0').filter(Boolean).filter(p=>!p.startsWith(out));
 const extra=walk(runtime).concat(walk('fixtures/7plus1/'),walk('docs/reports/7plus1/')).filter(p=>!p.startsWith(out));
 const protectedPaths=[...new Set([...tracked,...extra])].sort();
 const records=protectedPaths.map(p=>fs.existsSync(p)?{path:p,sha256:sha(fs.readFileSync(p)),bytes:fs.statSync(p).size}:{path:p,missing_at_start:true});
 write('BASELINE.json',{task:'7P-ARCH-009',head:git('rev-parse','HEAD'),branch:git('branch','--show-current'),previous_sealed_head:'68d28da5c2f5db614867d1fa4ad8d0d3fb3ec53b',created_at:new Date().toISOString(),package_version:read('package.json').version,protected_files:records,worktree_status_sha256:sha(git('status','--porcelain=v1','--untracked-files=no')),note:'Includes pre-existing modifications and deletions; those are preserved, not normalized to HEAD. No secret contents collected.'});
 const books=walk('docs/tasks/7plus1/').filter(p=>p.endsWith('.md'));
 const reports=Array.from({length:8},(_,i)=>'docs/reports/7plus1/'+(i===7?'7P-CLOSURE-008':'7P-REPAIR-'+String(i+1).padStart(3,'0'))+'/REPORT.md');
 const evidence=['FINAL-OUTCOME.json','FIRST-DIVERGENCE.json','BEFORE-AFTER.json','FAILURES.json','PERFORMANCE.json','DETERMINISM.json','phase-a/REMAINING-GAP-MAP.json','phase-a/ROOT-CAUSE-CLUSTERS.json','phase-b/PHASE-B-GATE.json','phase-c/PHASE-C-GATE.json',...Array.from({length:11},(_,i)=>'phase-b/C'+String(i+2).padStart(2,'0')+'-AUDIT.json')].map(p=>old+p);
 const tracePaths=['REF-001',...read(old+'COMPARISON.json').cases.map(c=>c.sample_id)].map(id=>old+'replay-r03/'+id+'/trace.json');
 const inputs=[...books,...reports,...evidence,...tracePaths,'docs/BoundX-7plus1-定义原理语义编译与边界计算说明-v0.3.md',...walk(runtime).filter(p=>/\.(mjs|py|ts)$/.test(p))];
 write('READING-INVENTORY.json',inputs.map(p=>{const b=fs.readFileSync(p);if(p.endsWith('.json'))JSON.parse(b);return {path:p,bytes:b.length,sha256:sha(b),mode:p.includes('trace.json')?'Full JSON parse and all-node/relation/fact inventory; compact semantic review, not verbatim model-score prose reading':'Full file read; relevant content independently reviewed'};}));
 for(const p of tracePaths){const t=read(p),c=t.compiler_v03; const id=p.split('/').at(-2);write('trace-views/'+id+'.json',{source:c.source,structure:c.structure,semantic_nodes:c.semantic_nodes,relations:c.relations,relation_bundles:c.relation_bundles,eligibility:c.eligibility_decisions,boundary_ir:c.boundary_ir,canonical:c.canonical_7plus1,unresolved:c.unresolved,diagnostics:c.diagnostics,decoding:c.nlp_signals.semantic_decoding});}
 console.log(JSON.stringify({protected:records.length,read_files:inputs.length,trace_views:tracePaths.length}));
}
