import fs from 'node:fs';import {runtime,write} from './common.mjs';
const p=runtime+'engine.mjs',s=fs.readFileSync(p,'utf8'),before="buildSemanticOwnership(f,'PRE_CERTIFIED_BINDING');finalizeDecodingTrace(f)";
if(!s.includes(before))throw Error('UNEXPECTED_ENGINE');write(p,s.replace(before,"buildSemanticOwnership(f,'PRE_CERTIFIED_BINDING');certifyWholeFrames(f);finalizeDecodingTrace(f)"));
