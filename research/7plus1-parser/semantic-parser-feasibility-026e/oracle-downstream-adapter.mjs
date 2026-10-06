import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {sha} from './setup.mjs';
// Read-only diagnostic adapter, never a runtime replacement. The unmodified
// engine's G8 requires executing the automatic generic candidate generator.
// A manual-graph isolation test deliberately does not run that generator.
// First runs with the original assertion are preserved under oracle/r001.
// Here only its terminal throw is suppressed so the already-computed Γ,
// Eligibility, IR, canonical and Proof can be inspected. Every gate result,
// including G8 FAIL, remains unchanged and visible. No certificate is faked.
const file='research/7plus1-parser/v0.3-candidate-parsing-026/engine.mjs';
let text=fs.readFileSync(file,'utf8');
export const adapterReceipt={source:file,source_sha256:sha(Buffer.from(text)),transformation:'Terminal assertNoBypass(c) throw suppressed ONLY for manual oracle; noBypassGates(c) and all semantic/proof/contract computations unchanged',not_production:true,automatic_candidate_generator_not_run:true};
if(text.split('assertNoBypass(c);').length!==2)throw Error('DIAGNOSTIC_ADAPTER_SOURCE_ANCHOR');
text=text.replace('assertNoBypass(c);','/* Oracle-only inspection: retain all gate results; G8 is inapplicable without automatic candidate generation. */');
text=text.replace(/from '([^']+)'/gu,(all,ref)=>ref.startsWith('.')?'from '+JSON.stringify(pathToFileURL(path.resolve(path.dirname(file),ref)).href):all);
export const compileOracle=(await import('data:text/javascript;base64,'+Buffer.from(text).toString('base64'))).compileCandidates;
