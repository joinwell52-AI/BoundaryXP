// Historical direct-IR response fixtures keep their original interface.
// Current boundary-rule responses are covered separately in boundary-rules.test.mjs.
import {directIRKernelBundle} from '../../research/7plus1-parser/llm-first-028/direct-ir-kernel-resources.mjs';
import {parseDirectIR as parse} from '../../research/7plus1-parser/llm-first-028/direct-ir-engine.mjs';
export const legacyBoundaryBundle=(phase,options)=>directIRKernelBundle(phase,{...options,boundaryRules:false});
export const parseLegacyIR=(source,options)=>parse(source,{bundleFactory:legacyBoundaryBundle,...options});
