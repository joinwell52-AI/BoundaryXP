import {analyze} from './linguistic.mjs';import {sourceDocument} from './source.mjs';import {warmSemantic} from './normalization.mjs';
export async function warmup(){const linguistic=await analyze(sourceDocument('准备。Ready.'));const semantic=await warmSemantic();return {linguistic:linguistic.models,semantic};}
