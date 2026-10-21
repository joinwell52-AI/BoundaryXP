// Offline post-freeze semantic review. These judgments never enter runtime.
import fs from'node:fs';
const d='docs/reports/7plus1/7P-REPAIR-007',p=d+'/SEMANTIC-REVIEW-LEDGER.json',v=JSON.parse(fs.readFileSync(p));
v.actual['p1:52632fa9dffa8346cae86238']={decision:'PARTIAL_SUPPORT',expected_entry_refs:['SWAI-001:O1'],reason:'更新对象与其三个成员、各成员调用和唯一 helper 声明已闭合。IR 仍没有声明行为的 basenames/file enumeration 及形参到目录实参的类型化语义，不能完整证明三个 writer 的 union-scan 交付。'};
v.actual['p1:0d25b95a38e20f1e3fc501d4']={decision:'PARTIAL_SUPPORT',expected_entry_refs:['SWAI-001:A1','SWAI-001:A2','SWAI-001:A3'],reason:'主修改对象已有三个显式成员 UNION，三个成员各自拥有调用、参数与声明身份。身份、明确调用不等于三个 writer 的文件集合并集扫描意义；helper 代码体保留为 owned content，尚无类型化枚举行为和实参绑定。没有按答案补语义，因此仍为部分支持。'};
fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
