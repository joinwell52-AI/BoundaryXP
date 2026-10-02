import fs from 'node:fs';import {out,runtime,write} from './common.mjs';
const p=runtime+'engine.mjs';let s=fs.readFileSync(p,'utf8');
if(!s.includes("buildSemanticOwnership(f,'PRE_ELIGIBILITY');finalizeDecodingTrace(f)"))throw Error('UNEXPECTED_ENGINE');
s=s.replace("buildSemanticOwnership(f,'PRE_ELIGIBILITY');finalizeDecodingTrace(f)","buildSemanticOwnership(f,'PRE_ELIGIBILITY');certifySourceBindings(f);f.tools.attachContext();buildSemanticOwnership(f,'PRE_CERTIFIED_BINDING');finalizeDecodingTrace(f)").replaceAll('0.3-7p-composition-012','0.3-7p-composition-013');write(p,s);
for(const name of ['export.mjs','semantic-ownership.mjs'])write(runtime+name,fs.readFileSync(runtime+name,'utf8').replaceAll('7P-COMPOSITION-012','7P-COMPOSITION-013').replaceAll('v0.3-7p-composition-012','v0.3-7p-composition-013'));
