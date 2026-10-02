const prefix='在 `tests/check_red.py`、`check_blue.py` 中各加一个测试点：\n```python\ndef test_preserves_index(tmp_path):\n    # 预存入 old/ITEM-{day}-149 （手工造一个文件）\n    # 调用 allocate，应该拿到 150 而不是 149\n```\n';
export const cases=[
 {id:'TEST_SCENARIO',text:prefix+'测试名字要明确包含 `preserves_index` 这样语义。',expect:{contracts:1,names:1,state:'STRUCTURALLY_ACCOUNTED'}},
 {id:'TEST_COMMENT_ONLY',text:prefix,expect:{contracts:1,names:0,state:'PARTIAL'}},
 {id:'TEST_TWO_NAMES',text:prefix+'测试名字要明确包含 `preserves_index` 或 `keeps_counter`。',expect:{contracts:1,names:0,state:'PARTIAL'}},
 {id:'TEST_OTHER_SECTION',text:prefix+'## 背景\n测试名字要明确包含 `unrelated_label`。',expect:{contracts:1,names:0,state:'PARTIAL'}}
];
