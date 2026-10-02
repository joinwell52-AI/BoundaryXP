export const cases=[
 {id:'OWNED_SHARED_ARBITRARY',text:'编写 `pine.md` 与 `oak.md` 文档。\n## 正文\n必须生成 `future.csv`。',ownership:'OUTPUT_SET',owners:2},
 {id:'OWNED_SINGLE',text:'编写 `birch.md` 文档。\n## 正文\n禁止修改 `future.json`。',ownership:'UNIQUE_OUTPUT',owners:1},
 {id:'OWNED_INDEPENDENT',text:'编写 `maple.md` 文档。\n编写 `cedar.md` 文档。\n## 正文\n必须生成 `later.txt`。',ownership:'UNRESOLVED_OUTPUT_SET',owners:0},
 {id:'OWNED_UNNAMED',text:'## 正文\n必须生成 `later.json`。',ownership:null,owners:0}
];
