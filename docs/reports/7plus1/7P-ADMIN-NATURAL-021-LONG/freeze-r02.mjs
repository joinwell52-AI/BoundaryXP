import {OUT,write,digest,read} from './common.mjs';
const controls=[
 ['OWN-P1','OWNERSHIP','POSITIVE','TEAM901 生成 pearl.md，文档必须写明“删除仅是风险分类”。',{output:'pearl.md',owned_content:'删除仅是风险分类',no_quote_execution:true}],
 ['OWN-P2','OWNERSHIP','POSITIVE','Create quartz.md. The document must contain “Do not reboot”.',{output:'quartz.md',owned_content:'Do not reboot',no_quote_execution:true}],
 ['OWN-P3','OWNERSHIP','POSITIVE','TEAM902 生成 ruby.md，报告中必须记录“已批准试验”。',{output:'ruby.md',owned_content:'已批准试验',no_quote_execution:true}],
 ['OWN-N1','OWNERSHIP','NEGATIVE','文档必须写明“不得修改 copper.csv”。',{no_execution:true,allow_owner_unresolved:true}],
 ['OWN-N2','OWNERSHIP','NEGATIVE','TEAM903 生成 jade.md。不得删除 jade.md。',{output:'jade.md',forbid:'删除'}],
 ['OWN-U1','OWNERSHIP','AMBIGUITY','TEAM904 生成 garnet.md 与 opal.md。文档必须记录“操作受限”。',{unresolved:true,no_owned_guess:true}],
 ['REF-P1','REFERENCE_FRONTIER','POSITIVE','TEAM905 生成 cobalt.md，随后将该报告提交给 TEAM906。',{output:'cobalt.md',transfer:'cobalt.md'}],
 ['REF-P2','REFERENCE_FRONTIER','POSITIVE','TEAM907 读取 jade.csv，生成 jade-review.md。',{inputs:['jade.csv'],output:'jade-review.md'}],
 ['REF-P3','REFERENCE_FRONTIER','POSITIVE','TEAM908 生成 silver.md 并交给 TEAM909。',{output:'silver.md',transfer:'silver.md'}],
 ['REF-N1','REFERENCE_FRONTIER','NEGATIVE','TEAM910 生成报告，随后说明该报告的状态。',{no_arbitrary_selection:true}],
 ['REF-N2','REFERENCE_FRONTIER','NEGATIVE','TEAM911 检查 raw.csv，生成 status.md。',{inputs:['raw.csv'],output:'status.md'}],
 ['REF-U1','REFERENCE_FRONTIER','AMBIGUITY','TEAM912 生成 drift-a.md 与 drift-b.md，随后复核该报告。',{unresolved:true,no_guessed_review:true}],
 ['ROLE-P1','ROLE_NEGATION','POSITIVE','TEAM913 读取 crystal.csv 并生成 crystal.md。TEAM913 不负责审批。',{inputs:['crystal.csv'],output:'crystal.md',negative_role:'APPROVER'}],
 ['ROLE-P2','ROLE_NEGATION','POSITIVE','Eva reads clay.csv and creates clay.md. Eva is not an approver.',{inputs:['clay.csv'],output:'clay.md',negative_role:'APPROVER'}],
 ['ROLE-P3','ROLE_NEGATION','POSITIVE','TEAM914 读取 ash.csv，生成 ash.md。TEAM914 不参与复核。',{inputs:['ash.csv'],output:'ash.md',negative_role:'REVIEWER'}],
 ['ROLE-N1','ROLE_NEGATION','NEGATIVE','TEAM915 读取 gravel.csv 并生成 gravel.md。',{inputs:['gravel.csv'],output:'gravel.md',no_negative_role:true}],
 ['ROLE-N2','ROLE_NEGATION','NEGATIVE','TEAM916 生成 granite.md。文档中写明“作者不负责审批”。',{output:'granite.md',no_negative_role:true,no_quote_execution:true}],
 ['ROLE-U1','ROLE_NEGATION','AMBIGUITY','TEAM917 和 TEAM918 生成审阅材料。该负责人不负责审批。',{unresolved:true,no_negative_role_guess:true}]
].map(([id,mechanism,kind,source,expect])=>({id,mechanism,kind,source,expect}));
write(OUT+'development/r02/CONTROLS.json',{controls});write(OUT+'development/r02/CONTROL-FREEZE.json',{frozen_at:new Date().toISOString(),sha256:digest(OUT+'development/r02/CONTROLS.json'),total:18,each_mechanism:{positive:3,negative:2,ambiguity:1}});
write(OUT+'development/r02/HYPOTHESIS.json',{hypothesis:'An explicit negative role declaration is not execution; output-owned text is not execution; a declared unresolved referent must prevent certification of every dependent root fact. A common final certification frontier will enforce these distinctions without modifying projection.',primary_semantic_gate:'Full same-case source-supported natural Canonical 7+1 closure',minimum_expected_delta:5,prior_round:OUT+'development/r01/ALL-RESULTS.json',falsification:'Local safety improvements without >=5 newly closed same-case natural tasks or any new unsupported control result',stop_rule:'Two consecutive rounds below the predeclared substantive primary improvement stop the current repair line for architecture review, v0.3 section 54.',source_changes:false,oracle_changes:false,projection_changes:false});
console.log('R02_CONTROLS_FROZEN');
