export {loadCandidate} from './load.mjs';export {bindAndTypecheck} from './bind.mjs';export {normalize} from './normalize.mjs';
import {loadCandidate} from './load.mjs';import {bindAndTypecheck} from './bind.mjs';import {normalize} from './normalize.mjs';
export const compileCore=(input,options={})=>normalize(bindAndTypecheck(loadCandidate(input,options),options));
