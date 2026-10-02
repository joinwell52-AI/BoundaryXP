// r01's arbitrary same-head expectation was disproved by retained OC-AMB; r01
// input and output bytes are preserved. This new set states the corrected rule.
export const cases=[
 {id:'OWNED_SHARED_EXPLICIT',text:'编写 `pine.md` 与 `oak.md` 文档。\n## 两份文档共用正文\n必须生成 `future.csv`。',ownership:'OUTPUT_SET',owners:2},
 {id:'OWNED_SAME_HEAD_UNSPECIFIED',text:'编写 `pine.md` 与 `oak.md` 文档。\n## 正文\n必须生成 `future.csv`。',ownership:'UNRESOLVED_OUTPUT_SET',owners:0},
 {id:'OWNED_WRONG_COUNT',text:'编写 `birch.md` 文档。\n## 两份文档共用正文\n禁止修改 `future.json`。',ownership:'UNRESOLVED_OUTPUT_SET',owners:0},
 {id:'OWNED_LOCALE',text:'编写 `cedar.zh.md` 与 `cedar.en.md` 文档。\n## 正文\n必须生成 `later.json`。',ownership:'OUTPUT_SET',owners:2}
];
