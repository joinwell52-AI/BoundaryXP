import fs from 'node:fs';import {out,runtime,write,digest,walk} from './common.mjs';
for(const name of ['owner-role','compatibility']){
 const old='tests/parser-7p-composition-012-'+name+'.test.mjs',target='tests/parser-7p-composition-013-'+name+'.test.mjs';if(fs.existsSync(target))throw Error('EXISTING_TEST');
 let s=fs.readFileSync(old,'utf8').replaceAll('v0.3-7p-composition-012','v0.3-7p-composition-013').replaceAll('7P-COMPOSITION-012','7P-COMPOSITION-013');if(name==='owner-role')s=s.replace('/acceptance-checks.mjs','/binding-checks.mjs');
 write(target,s);
}
write(out+'TEST-IMPLEMENTATION-FREEZE.json',{frozen_at:new Date().toISOString(),runtime_files:walk(runtime).map(path=>({path,sha256:digest(path)})),tests:fs.readdirSync('tests').filter(n=>n.startsWith('parser-7p-composition-013-')).map(n=>({path:'tests/'+n,sha256:digest('tests/'+n)})),all_mechanism_inputs_frozen_before_STANDARD:true});
