import fs from 'node:fs';
import {createHash} from 'node:crypto';
const dir='docs/reports/7plus1/7P-CLOSURE-008/phase-a';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const digest=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const put=(name,v)=>fs.writeFileSync(dir+'/'+name,JSON.stringify(v,null,2)+'\n');
const map=read(dir+'/REMAINING-GAP-MAP.json');
// These are offline review decisions, never imported by the parser. They refine
// the initial inventory against stage captures and the source document.
const corrections={
 'SWAI-002:I1':'C03','SWAI-002:I3':'C03','SWAI-002:I2':'C04',
 'SWAI-002:O8':'C04','SWAI-003:O2':'C04','SWAI-003:A1':'C04',
 'SWAI-003:A5':'C04','SWAI-003:O7':'C04',
 'SWAI-003:A2':'C05','SWAI-003:B2':'C04','SWAI-003:B4':'C04',
 'SWAI-003:B5':'C04','SWAI-003:B6':'C04','SWAI-004:O4':'C04',
 'SWAI-006:O2':'C04','SWAI-006:A5':'C04',
 'SWAI-007:I1':'C04','SWAI-007:I2':'C04','SWAI-007:I3':'C04',
 'SWAI-007:I5':'C04','SWAI-007:A0':'C06',
 'SWAI-008:I5':'C04','SWAI-008:I6':'C04','SWAI-008:I9':'C03',
 'SWAI-009:I2':'C04','SWAI-009:I4':'C03','SWAI-009:I5':'C03',
 'SWAI-009:O2':'C04','SWAI-009:O4':'C04','SWAI-009:O5':'C04',
 'SWAI-009:A2':'C04','SWAI-009:A3':'C04','SWAI-009:A4':'C04',
 'SWAI-009:A5':'C04','SWAI-009:A6':'C04',
 'SWAI-010:I0':'C09','SWAI-010:I2':'C04','SWAI-010:I3':'C03',
 'SWAI-010:I4':'C03','SWAI-010:I5':'C03','SWAI-010:O4':'C04',
 'SWAI-010:O6':'C04','SWAI-010:O7':'C04','SWAI-010:A2':'C04',
 'SWAI-010:A3':'C04','SWAI-010:A4':'C04','SWAI-010:A5':'C04',
 'SWAI-010:A6':'C04','SWAI-010:B0':'C08'
};
const definitions={
 C01:{stage:'DECLARED_BEHAVIOR_SEMANTICS_AND_ARGUMENT_INSTANTIATION',reason:'身份层明确输出 helper_body_semantics=NOT_INTERPRETED，且 CALL_DECLARATION.declared_behavior.interpreted=false。形参结构、文件枚举关系、实参实例化均不存在；identity 已认证，因此不是身份缺口。',code:'cross-instruction-identity.mjs',check:'OWNED_DECLARATION_SEMANTICS_ABSENT'},
 C02:{stage:'OWNED_CONTENT_INTERPRETATION',reason:'Frame Certification 保留 EACH/count/code_span，但 test_insertions 只保存 example_symbol_spans，没有注释前置状态、预期/排除结果或命名约束。保留代码字节不等于解释测试合同。',code:'frame-certification.mjs',check:'TEST_CONTRACT_NOT_COMPOSED'},
 C03:{stage:'SPAN_OR_TYPED_LITERAL',reason:'源技术对象/限定符被切成局部候选，或虽补回完整端点但关系仍指向旧片段。必须检查 exact span 与实际论元身份，不能用渲染文本或邻近完整节点补齐。',code:'frontend.mjs',check:'PROTECTED_SPAN_OR_ARGUMENT_IDENTITY_NOT_COMPLETE'},
 C04:{stage:'INSTRUCTION_CANDIDATE_AND_MODALITY_CERTIFICATION',reason:'结构保存了明确交付/实施/验收条款，但 local EVENT 为 UNSTATED、无 EVENT，或仅有 acceptance STATE；当前候选过滤不消费 TABLE/ACCEPTANCE。缺少义务及对象/结果 frame，先于 Eligibility 排除。不得把全部验收状态自动变成动作。',code:'candidate-recall.mjs',check:'NO_COMPLETE_ADMISSIBLE_INSTRUCTION_FRAME'},
 C05:{stage:'DISCOURSE_AND_LOCAL_LAYER_OWNERSHIP',reason:'带格式标记的 out-of-scope 标题未识别，或局部问题/说明与治理任务未分层；源结构上的拥有者与实际 domain/当前执行含义不同。问题中的待调查动作不能直接当作已授权执行。',code:'discourse.mjs',check:'DOMAIN_OR_QUESTION_FRAME_OWNERSHIP_MISMATCH'},
 C06:{stage:'QUALIFIED_OBJECT_AND_MEMBER_RELATIONS',reason:'原文给出文件—成员/区域或对象集合，当前端点只有文件、成员、目录或零散局部片段，没有可追溯组成和受治理集合。完整原文存在于结构，不足以替代 semantic relation/scope。',code:'graph-closure.mjs',check:'QUALIFIED_TARGET_SCOPE_NOT_CLOSED'},
 C07:{stage:'LOCAL_MODAL_CONDITION_OR_RESTRICTION_RELATION',reason:'局部否定/条件/限制缺少正确 predicate-owner、scope 或 condition expression。包含条件文字的证据 span 不等于 condition_expr；已存在 FORBIDDEN 也不能证明它绑定正确目标/分支。',code:'semantic-decoder.mjs',check:'MODAL_OR_CONDITION_FRAME_NOT_PRESERVED'},
 C08:{stage:'OUTPUT_CONTENT_OWNERSHIP_AND_TYPED_GRAPH',reason:'finalDiscourse 只对全局 RESULT 集合求 owner，当前内容 graph 为 partial 或缺内部动作/对象/条件。多个双语交付物不是任意选一个 owner 的理由；须按已有结构证明拥有关系。',code:'discourse.mjs',check:'CONTENT_COMPONENTS_OR_UNIQUE_STRUCTURAL_OWNER_MISSING'},
 C09:{stage:'REFERENCE_BASIS_AND_QUALIFIER_RELATION',reason:'裸 REFERENCE、定位数字或历史编号不形成完整 BASIS/CONFORMS_TO/受限定引用。SUPERSEDES 元数据已有，但当前 Canonical 未保留其完整历史状态。对象引用和依据角色必须分别证明。',code:'structured-recovery.mjs',check:'QUALIFIED_BASIS_OR_TEMPORAL_REFERENCE_INCOMPLETE'},
 C10:{stage:'RECIPIENT_ENDPOINT_AND_RELATION',reason:'给接收者的显式源结构或报告 to 字段没有生成 RECIPIENT 端点/关系；不能从 sender/岗位推导权限。文件名必须按有明确语法合同的角色字段解释，而不是按人名补槽。',code:'edge-closure.mjs',check:'RECIPIENT_RELATION_ABSENT'},
 C11:{stage:'COMPLETION_AND_WORKFLOW_RELATION',reason:'完成/提交/测试绿/工作轮次信息没有形成完整治理状态组合及条件关系，或被局部 STATE 替代。须证明逻辑方向，禁止把禁止红测试提交无条件扩写成充分完成条件。',code:'structured-recovery.mjs',check:'WORKFLOW_CONDITION_OR_COMPLETION_COMPOSITION_INCOMPLETE'},
 C12:{stage:'COVERAGE_DEPENDENCY',reason:'Slot status 由真实未解释源区和未决关系传播。上游尚不闭合时 PARSER_COVERAGE_FAILURE 是如实结果，当前没有证据证明独立的 status 计算错误。不得为对齐 expected 清除覆盖失败。',code:'coverage-locality.mjs',check:'UPSTREAM_GAP_BLOCKS_SLOT_CLOSURE'},
 C13:{stage:'SOURCE_EVIDENCE_REVIEW',reason:'原文中该文件的出现是历史背景或明确禁止修改；没有唯一当前 read/check/process 关系。不能把仅禁止对象自动投影为 I。保留人工标准不变，等待 ADMIN 判断当前 I 期望是否有额外合法源依据。',code:'graph-queries.mjs',check:'CURRENT_INPUT_ROLE_NOT_UNIQUELY_ESTABLISHED'}
};
const originalClusters=read(dir+'/ROOT-CAUSE-CLUSTERS.json').clusters;
const contentWitness={
 'SWAI-009':['§1 · 环境检查','§2 · 升级到目标版本','§3 · 边界声明','anti-pattern 清单','§4 · 初始化','§5 · 初始化后验证','fcop_audit(scope','每完成一步','碰到不确定','任何 `init_*`'],
 'SWAI-010':['不锁版本号','每完成一步','§3 · 边界声明','§4 · 初始化','§5 · 初始化后','§6 · 体检','P0 ≠ 0','工具返回 OK **不等于**','不要瞎猜 API','不准**自决整改']
};
for(const u of map.units){
 if(!u.evidence.source_witnesses){const source=fs.readFileSync('fixtures/7plus1/standard/'+u.case_id+'/source.md','utf8'),index=Number(u.expected.requirement_id.slice(-2))-1,w=contentWitness[u.case_id][index],at=source.indexOf(w);if(at<0)throw Error('CONTENT_WITNESS_ABSENT '+u.unit_id);const start=[...source.slice(0,at)].length;u.evidence.source_witnesses=[{start,end:start+[...w].length,text:w}];u.evidence.source_path='fixtures/7plus1/standard/'+u.case_id+'/source.md';}
 if(!u.blocker_id)continue;
 if(corrections[u.unit_id])u.cluster_id=corrections[u.unit_id];
 const d=definitions[u.cluster_id];
 Object.assign(u,{earliest_divergence:d.stage,cause:d.reason,classification:u.cluster_id==='C13'?'INSUFFICIENT_SOURCE_EVIDENCE':'IMPLEMENTATION_GAP',causal_certainty:'SOURCE_AND_STAGE_REVIEW',causal_check:d.check,root_code_path:'research/7plus1-parser/v0.3-7p-repair-007/'+d.code,causal_boundary:'Recorded earliest missing required component, not a claim that every downstream component has been exhaustively repaired.',additional_dependencies:[],planned_implementation:u.cluster_id!=='C13'});
 if(u.cluster_id==='C12')u.planned_implementation=false;
}
for(const b of map.blockers){const u=map.units.find(u=>u.blocker_id===b.blocker_id);if(u){Object.assign(b,u);continue;}if(b.cluster_id==='C13')b.cluster_id='C08';const d=definitions[b.cluster_id];Object.assign(b,{earliest_divergence:d.stage,cause:d.reason+' '+(b.cause??''),classification:'IMPLEMENTATION_GAP',causal_check:d.check,causal_certainty:b.cluster_id==='C12'?'CONFIRMED_UPSTREAM_DEPENDENCY':'PRIOR_SEMANTIC_REVIEW_PLUS_STAGE_CHAIN',root_code_path:'research/7plus1-parser/v0.3-7p-repair-007/'+d.code,planned_implementation:b.cluster_id!=='C12'});}
const clusters=originalClusters.map(c=>({...c,...definitions[c.cluster_id],affected_cases:[...new Set(map.blockers.filter(b=>b.cluster_id===c.cluster_id).map(b=>b.case_id))],affected_required_entries:map.units.filter(u=>u.cluster_id===c.cluster_id).map(u=>u.unit_id),blocker_ids:map.blockers.filter(b=>b.cluster_id===c.cluster_id).map(b=>b.blocker_id),classification:c.cluster_id==='C13'?'INSUFFICIENT_SOURCE_EVIDENCE':'IMPLEMENTATION_GAP',status:c.cluster_id==='C12'?'DEPENDENT_STATUS_PROPAGATION':c.cluster_id==='C13'?'NO_INFERENCE_REPAIR_AUTHORIZED':'PLANNED_CLASS_LEVEL_REPAIR',not_downstream_reason:definitions[c.cluster_id].reason,method_extension_authorized:false}));
map.warning='Causal review records the earliest missing component at the recorded stage boundary. Source doubts remain distinct from implementation gaps. No method limitation is confirmed.';
map.review_revision='phase-a-final';
put('REMAINING-GAP-MAP.json',map);put('ROOT-CAUSE-CLUSTERS.json',{clusters});
put('STAGE-FIRST-DIVERGENCES.json',{status:'CAUSAL_REVIEW_RECORDED',confirmed_inherited:read('docs/reports/7plus1/7P-REPAIR-007/FIRST-DIVERGENCE.json'),units:map.blockers.map(b=>({blocker_id:b.blocker_id,stage:b.earliest_divergence,cluster_id:b.cluster_id,check:b.causal_check,root_code_path:b.root_code_path,evidence_ref:'REMAINING-GAP-MAP.json#'+b.blocker_id,certainty:b.causal_certainty}))});
put('METHOD-COVERAGE-DECISIONS.json',{frozen_method:'docs/BoundaryXP-7plus1-定义原理语义编译与边界计算说明-v0.3.md',sha256:digest('docs/BoundaryXP-7plus1-定义原理语义编译与边界计算说明-v0.3.md'),confirmed_method_limitations:[],source_evidence_doubts:map.units.filter(u=>u.classification==='INSUFFICIENT_SOURCE_EVIDENCE').map(u=>u.unit_id),clusters:clusters.map(c=>({cluster_id:c.cluster_id,classification:c.classification,basis:c.basis,planned_repair:c.status,permitted:c.cluster_id==='C01'?'Recover stable formals; bind unique actual arguments; bounded owned static syntax only; existing ENTITY/EVENT/PATIENT/THEME/RESULT/CONJUNCTION/COREFERENCE/SCOPE expressions. No execution or helper-name semantics.':c.reason,method_extension_authorized:false}))});
const checks={nine_cases:map.cases.length===9,all_incomplete_entries_have_blockers:map.units.filter(u=>u.comparison_finding!=='MATCH').every(u=>map.blockers.some(b=>b.blocker_id===u.blocker_id)),all_blockers_clustered:map.blockers.every(b=>clusters.some(c=>c.cluster_id===b.cluster_id)),planned_clusters_have_frozen_method_basis:clusters.filter(c=>c.status==='PLANNED_CLASS_LEVEL_REPAIR').every(c=>c.basis.length>0),current_divergence_classified:clusters.find(c=>c.cluster_id==='C01').classification==='IMPLEMENTATION_GAP',saved_signal_baseline_equal:read(dir+'/STAGE-CAPTURE-RESULTS.json').status==='PASS',parser_modified:false};
put('PHASE-A-GATE.json',{status:Object.entries(checks).every(([k,v])=>k==='parser_modified'?!v:v)?'PASS':'FAIL',checks,required_units:map.units.length,blockers:map.blockers.length,scope:'Diagnostic seal authorizes class-level investigation; it is not semantic certification.',independent_models_rerun:false});
console.log({checks,clusters:clusters.map(c=>[c.cluster_id,c.blocker_ids.length])});
