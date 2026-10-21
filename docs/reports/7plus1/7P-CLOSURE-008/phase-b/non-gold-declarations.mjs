const definition=(name='gather_names')=>`def ${name}(*folders):
    """Yield basenames of files under all given directories."""
    for folder in folders:
        if not folder.is_dir():
            continue
        for item in folder.iterdir():
            if item.is_file():
                yield item.name
`;
const source=(body,call='gather_names(warm_dir, root / "cold")')=>'修改 `src/letters.py` 中 `alpha` / `beta` 两个方法。\n在 `src/letters.py` 新增一个辅助函数：\n```python\n'+body+'```\n`alpha` 中调用为 `'+call+'`。';
export const cases=[
 {id:'STATIC_VARIADIC',text:source(definition()),expect:{bindings:1,instantiations:1,collections:2}},
 {id:'STATIC_RENAMED',text:source(definition('list_labels'),'list_labels(left_dir, depot / "retired")'),expect:{bindings:1,instantiations:1,collections:2}},
 {id:'STATIC_THREE',text:source(definition(),'gather_names(a_dir, b_dir, c_dir)'),expect:{bindings:1,instantiations:1,collections:3}},
 {id:'STATIC_RETURN_ONLY',text:source('def gather_names(folder):\n    return folder\n','gather_names(only_dir)'),expect:{bindings:1,instantiations:0,collections:0}},
 {id:'STATIC_ARITY',text:source('def gather_names(folder):\n    return folder\n'),expect:{bindings:0,instantiations:0,collections:0}},
 {id:'STATIC_WRONG_FILTER',text:source(definition().replace('item.is_file()','item.is_dir()')),expect:{bindings:1,instantiations:0,collections:0}},
 {id:'STATIC_EARLY_RETURN',text:source(definition().replace('yield item.name','return item.name')),expect:{bindings:1,instantiations:0,collections:0}},
 {id:'STATIC_NO_CONTRACT',text:source(definition().replace('Yield basenames of files under all given directories.','This helper has a suggestive name.')),expect:{bindings:1,instantiations:0,collections:0}},
 {id:'STATIC_SIDE_EFFECT',text:source(definition().replace('for folder in folders:','send_network_request()\n    for folder in folders:')),expect:{bindings:1,instantiations:0,collections:0}},
 {id:'STATIC_DECORATOR',text:source('@runtime_wrapper\n'+definition()),expect:{bindings:0,instantiations:0,collections:0}},
 {id:'STATIC_EMPTY_DOMAIN',text:source(definition(),'gather_names()'),expect:{bindings:1,instantiations:0,collections:0}},
 {id:'STATIC_TWO_OWNERS',text:source(definition())+'\n`beta` 中调用为 `gather_names(other_dir, base / "older")`。',expect:{bindings:2,instantiations:2,collections:4}}
];
