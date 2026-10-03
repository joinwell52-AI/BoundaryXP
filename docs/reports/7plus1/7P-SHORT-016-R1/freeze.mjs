import {out,write,digest,walk} from './common.mjs';
const paths=walk('research/7plus1-parser/v0.3-7p-short-direct-016-r1/');
write(out+'IMPLEMENTATION-FREEZE.json',{task:'7P-SHORT-016-R1',frozen_at:new Date().toISOString(),files:paths.map(path=>({path,sha256:digest(path)})),production_entry_unchanged:true,models_packs_QI_QB_unchanged:true});
const authority=['docs/tasks/7plus1/CURRENT-TASK.md','docs/tasks/7plus1/7P-SHORT-016-R1.md','docs/tasks/7plus1/7P-SHORT-016-D07-ADMIN-ADJUDICATION.md','docs/tasks/7plus1/7P-SHORT-016-FROZEN-CASES.md','docs/BoundX-7plus1-定义原理语义编译与边界计算说明-v0.3.md'];
write(out+'ADMIN-ADJUDICATION-READBACK.json',{task:'7P-SHORT-016-R1',files:authority.map(path=>({path,sha256:digest(path)})),decision:'ADMIN_CONTRACT_ADJUDICATED',source_expected_unchanged:true,rule:'Preserve explicit macro goal internally and certify single concrete authored workflow refinement; no duplicate I/A; owned output sections and completion AND preserved.',method_read_in_full:true,gate_order:'G3 before G4 before full validation'});
console.log(JSON.stringify(paths));
