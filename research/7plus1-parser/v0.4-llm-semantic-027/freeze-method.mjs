import fs from 'node:fs';
import {REPORT,ROOT,read,sha,save} from './util.mjs';
const implementation=read(REPORT+'/IMPLEMENTATION-v1.json');
for(const f of implementation.files)if(sha(fs.readFileSync(f.path))!==f.sha256)throw Error('IMPLEMENTATION_CHANGED_BEFORE_FREEZE '+f.path);
const development=read(REPORT+'/runs/development-v1-recovered/RESULTS.json'),evaluation=read(REPORT+'/evaluations/development-v1-recovered.json');
if(development.total!==245||evaluation.total!==245)throw Error('FULL_DEV_REQUIRED');
const selection=read(REPORT+'/POLICY-SELECTION.json');
const extraFiles=['engine-policy-v2.mjs','gamma-policy-v2.mjs','eligibility-policy-v2.mjs','boundary-ir-policy-v2.mjs','proof-policy-v2.mjs','cli-selected.mjs','batch-locked.mjs','providers/frozen-codex.mjs'].map(p=>({path:ROOT+'/'+p,sha256:sha(fs.readFileSync(ROOT+'/'+p))}));
const files=[...implementation.files,...extraFiles],evaluationFiles=['evaluator.mjs','evaluate-policy.mjs','freeze-method.mjs'].map(p=>({path:ROOT+'/'+p,sha256:sha(fs.readFileSync(ROOT+'/'+p))}));
const provider=read(REPORT+'/environment/PROVIDER-PROBE-r003.json').actual.receipt;
const providerConfiguration={executable:provider.executable,executable_sha256:provider.executable_sha256,version:provider.version,model_configuration:provider.model_configuration,served_model_identifier:'NOT_REPORTED_BY_CLI',hosted_weight_digest:'NOT_AVAILABLE'};
const environmentFiles=['package.json','package-lock.json','node_modules/ajv/package.json','docs/BoundaryXP-7plus1-定义原理语义编译与边界计算说明-v0.4.md','docs/tasks/7plus1/7P-LLM-SEMANTIC-COMPILER-027-LONG.md','docs/reports/7plus1/7P-ADMIN-ROOT-COMPILER-CLOSURE-024-LONG/source-intents.mjs','docs/reports/7plus1/7P-NATURAL-SEMANTIC-GENERALIZATION-025-LONG/natural-source-obligations-r02.mjs','docs/reports/7plus1/7P-NATURAL-SEMANTIC-GENERALIZATION-025-LONG/BLIND-200-FRAMES.json'].map(path=>({path,sha256:sha(fs.readFileSync(path))}));
save(REPORT+'/METHOD-ENVIRONMENT-FREEZE.json',{node_version:process.version,ajv_version:read('node_modules/ajv/package.json').version,files:environmentFiles,reference_files_offline_only:true,hosted_weights_sha256:'NOT_AVAILABLE',selected_provider_binary_and_configuration_frozen:true});
evaluationFiles.push({path:REPORT+'/METHOD-ENVIRONMENT-FREEZE.json',sha256:sha(fs.readFileSync(REPORT+'/METHOD-ENVIRONMENT-FREEZE.json'))});
save(REPORT+'/METHOD-FREEZE.json',{
 frozen:true,created_at:new Date().toISOString(),version:'v1-with-evaluated-finite-policy-variant',selected_policy:selection.selected_policy,
 provider_configuration:providerConfiguration,provider_configuration_sha256:sha(JSON.stringify(providerConfiguration)),files,evaluation_files:evaluationFiles,
 implementation_sha256:sha(JSON.stringify(files)),
 original_first_development_results_sha256:sha(fs.readFileSync(REPORT+'/runs/development-v1/RESULTS.json')),
 development_results_path:REPORT+'/runs/development-v1-recovered/RESULTS.json',
 development_results_sha256:sha(fs.readFileSync(REPORT+'/runs/development-v1-recovered/RESULTS.json')),
 development_evaluation_sha256:sha(fs.readFileSync(REPORT+'/evaluations/development-v1-recovered.json')),
 environment_recovery_disclosed:true,selection_sha256:sha(fs.readFileSync(REPORT+'/POLICY-SELECTION.json')),
 prompt_manifest_sha256:sha(fs.readFileSync(REPORT+'/PROMPT-MANIFEST.json')),schema_sha256:sha(fs.readFileSync(REPORT+'/SCHEMA.json')),
 selection_reason:'Only full-245 evaluated policy variant can be admitted, with no prior reference check regressions; no locked inputs consumed. Original infrastructure failures retained.',
 semantic_major_versions:{parser:1,auditor:1,gamma:2,eligibility_variants:2,policy_budget_charged:2},
 locked_first_run_not_started:true,method_changes_after_freeze_forbidden:true
});
console.log('METHOD_FROZEN');
