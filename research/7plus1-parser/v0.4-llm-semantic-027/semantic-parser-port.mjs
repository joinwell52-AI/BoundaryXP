import fs from 'node:fs';
import Ajv from 'ajv';
import {ROOT,sha,read} from './util.mjs';
import {proposalSchema,auditSchema,signatures} from './contracts.mjs';
import {CodexProvider} from './providers/codex.mjs';
const ajv=new Ajv({allErrors:true,strict:true}),parserCheck=ajv.compile(proposalSchema),auditCheck=ajv.compile(auditSchema);
const parserPrompt=fs.readFileSync(`${ROOT}/prompts/parser-v1.md`,'utf8'),auditPrompt=fs.readFileSync(`${ROOT}/prompts/auditor-v1.md`,'utf8');
export class SemanticParserPort{
 constructor(provider){if(!provider?.call)throw Error('SEMANTIC_PARSER_PORT_REQUIRED');this.provider=provider;}
 async parse(source,typed_spans,structure,receipt){
  const payload={raw_text:source.raw_text,document_id:source.document_id,source_regions:source.regions,typed_spans,structure,relation_signatures:signatures};
  const response=await this.provider.call(parserPrompt+'\nSOURCE_DATA_JSON\n'+JSON.stringify(payload),proposalSchema,receipt);
  if(!parserCheck(response.value)){const e=Error('PARSER_SCHEMA_INVALID');e.details=parserCheck.errors;throw e;}
  return {proposal:response.value,receipt:response.receipt};
 }
 async audit(source,candidate_graph,receipt){
  const payload={raw_text:source.raw_text,candidate_graph:{...candidate_graph,source_regions:source.regions},relation_signatures:signatures};
  const response=await this.provider.call(auditPrompt+'\nAUDIT_DATA_JSON\n'+JSON.stringify(payload),auditSchema,receipt);
  if(!auditCheck(response.value)){const e=Error('AUDITOR_SCHEMA_INVALID');e.details=auditCheck.errors;throw e;}
  return {audit:response.value,receipt:response.receipt};
 }
}
export class ReplayProvider{
 constructor(responses){this.name='replay';this.responses=[...responses];}
 async call(prompt,schema){const next=this.responses.shift();if(!next)throw Error('REPLAY_EXHAUSTED');if(next.request_sha256&&next.request_sha256!==sha(Buffer.from(prompt)))throw Error('REPLAY_REQUEST_MISMATCH');return {value:structuredClone(next.value),receipt:{provider:this.name,original_receipt:next.receipt??null,model_call:false}};}
}
export class MockProvider extends ReplayProvider{constructor(responses){super(responses);this.name='mock-for-tests';}}
export function createPort(options={}){return new SemanticParserPort(options.provider??new CodexProvider(options));}
export const promptDigests={parser:sha(Buffer.from(parserPrompt)),auditor:sha(Buffer.from(auditPrompt)),schema:sha(JSON.stringify(proposalSchema)),audit_schema:sha(JSON.stringify(auditSchema))};
