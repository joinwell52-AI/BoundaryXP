import {compileProposal} from './engine.mjs';
import {sourceDocument} from './source.mjs';
export function replay(trace){
 if(!Object.hasOwn(trace,'nlp_input'))throw Error('REPLAY_NLP_INPUT_NOT_RECORDED');
 return compileProposal(sourceDocument(trace.source.raw_text),trace.parser_proposal,trace.auditor_response,{nlp:trace.nlp_input,receipts:trace.provider_receipts});
}
