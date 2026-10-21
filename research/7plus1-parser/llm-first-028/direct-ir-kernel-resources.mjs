// Same Skills, IR and Core; the active online profile only declares boundaries.
import fs from 'node:fs';import {fileURLToPath} from 'node:url';import path from 'node:path';import {sha256} from './source.mjs';
import {modelRegistry} from '../../../src/bxp/ir-kernel/contract-registry.mjs';
import {boundarySchema,boundaryProfile} from './declarative-boundary.mjs';
import {rulesSchema,rulesAuditSchema} from './boundary-rules.mjs';
const here=path.dirname(fileURLToPath(import.meta.url));
// Solver support labels are runtime capabilities, not a second modelling rule.
// Keep every operator's signature, arity and binder semantics unchanged.
export const boundaryOperatorRegistry=Object.fromEntries(Object.entries(modelRegistry).map(([op,{support,...semantics}])=>[op,semantics]));
export function directIRKernelBundle(phase,{parseMethod='SKILL',boundaryRules=true}={}){
 if(!['parse','audit'].includes(phase)||!['SKILL','SKILL1'].includes(parseMethod))throw Error('KERNEL_RESOURCE_SELECTION');
 const file=!boundaryRules?`contracts/candidate-ir-v1/legacy-skills/${parseMethod==='SKILL1'?'skill1':'skill'}/boundx-semantic-${phase}/SKILL.md`:parseMethod==='SKILL1'?`skill-profiles/semantics-first-r02/boundx-semantic-${phase}/SKILL.md`:`skills/boundx-semantic-${phase}/SKILL.md`;
 const sourceFile=boundaryRules?`contracts/boundary-rules-r01/${parseMethod==='SKILL1'?'skill1':'skill'}/boundx-semantic-${phase}/SKILL.md`:file;
 const original=fs.readFileSync(path.join(here,sourceFile),'utf8'),adapted=original.replaceAll('candidate-ir/1.4','candidate-ir/2.0').replaceAll('contracts/candidate-ir-v1/CONTRACT.md','docs/ir-kernel/CONTRACT.md');
 if(boundaryRules){
  const resources=[{path:file,text:original,original_sha256:sha256(original)},{path:'docs/ir-kernel/BOUNDARY-RULES.md',text:fs.readFileSync(new URL('../../../docs/ir-kernel/BOUNDARY-RULES.md',import.meta.url),'utf8')}].map(r=>({...r,sha256:sha256(r.text)}));
  const text=resources.map(r=>`<RESOURCE path="${r.path}">\n${r.text}\n</RESOURCE>`).join('\n');
  return {phase,name:'boundx-semantic-'+phase,contract_version:'candidate-ir/2.0',schema:phase==='parse'?rulesSchema:rulesAuditSchema,resources,text,sha256:sha256(text),parse_method:parseMethod,enabled_by_default:false,real_model_acceptance:'NOT_RUN',mode:'INLINE_BUNDLE',transport_version:'DIRECT_CANDIDATE_IR_R01',request_profile:boundaryProfile,boundary_rules:true,resource_profile:parseMethod==='SKILL1'?'SEMANTICS_FIRST_R02_BOUNDARY_RULES_R01':'BOUNDARY_RULES_R01',schema_delivery:{mode:'CLI_OUTPUT_SCHEMA_ONLY',schema_path:'runtime/boundary-rules-'+phase+'.schema.json'}};
 }
 const resources=[{path:file,text:adapted,original_sha256:sha256(original)},...['CONTRACT.md','DECLARATIVE-BOUNDARY.md'].map(name=>({path:'docs/ir-kernel/'+name,text:fs.readFileSync(new URL('../../../docs/ir-kernel/'+name,import.meta.url),'utf8')})),{path:'kernel/operator-registry.json',text:JSON.stringify(boundaryOperatorRegistry)}].map(r=>({...r,sha256:sha256(r.text)}));
 const text=resources.map(r=>`<RESOURCE path="${r.path}">\n${r.text}\n</RESOURCE>`).join('\n');
 return {phase,name:'boundx-semantic-'+phase,contract_version:'candidate-ir/2.0',schema:boundarySchema(phase),resources,text,sha256:sha256(text),parse_method:parseMethod,enabled_by_default:false,real_model_acceptance:'NOT_RUN',mode:'INLINE_BUNDLE',transport_version:'DIRECT_CANDIDATE_IR_R01',request_profile:boundaryProfile,resource_profile:parseMethod==='SKILL1'?'SEMANTICS_FIRST_R02_DECLARATIVE_R02':'IR_DECLARATIVE_BOUNDARY_R02',schema_delivery:{mode:'CLI_OUTPUT_SCHEMA_ONLY',schema_path:'runtime/'+(phase==='parse'?'declarative-boundary':'declarative-audit')+'.schema.json'}};
}
