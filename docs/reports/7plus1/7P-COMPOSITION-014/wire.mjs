import fs from 'node:fs';import {out,runtime,write,walk,digest} from './common.mjs';
const original='research/7plus1-parser/v0.3-7p-composition-013/';
write(out+'CLONE-BASELINE.json',{files:walk(original).map(p=>({original:p,clone:runtime+p.slice(original.length),original_sha256:digest(p),clone_sha256:digest(runtime+p.slice(original.length))}))});
let s=fs.readFileSync(runtime+'engine.mjs','utf8').replaceAll('0.3-7p-composition-013','0.3-7p-composition-014');
s=s.replace("import {certifyWholeFrames}","import {constructDistribution} from './distributive-construction.mjs';\nimport {certifyWholeFrames}").replace('certifyWholeFrames(f);',"constructDistribution(f);buildSemanticOwnership(f,'PRE_DISTRIBUTIVE_CERTIFICATION');certifyWholeFrames(f);");write(runtime+'engine.mjs',s);
