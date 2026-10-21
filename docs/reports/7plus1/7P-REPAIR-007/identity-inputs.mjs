const aggregate=(file,names)=>`修改 \`${file}\` 中 ${names.map(n=>'`'+n+'`').join(' / ')} ${names.length} 个方法。`;
const declaration=(file,name)=>`在 \`${file}\` 新增一个辅助函数：\n\n\`\`\`python\ndef ${name}(folder):\n    return folder\n\`\`\``;
const call=(name,callee='collect_entries',args='fresh_dir, base / "old"')=>`\`${name}\` 中调用为 \`${callee}(${args})\`。`;
const group=aggregate('src/catalog.py',['load_red','load_blue','load_green']);const decl=declaration('src/catalog.py','collect_entries');
export const identityCases=[
 ['THREE',group+'\n'+decl+'\n1. '+call('load_red')+'\n2. '+call('load_blue')+'\n3. '+call('load_green'),3,3,3,3],
 ['REVERSED',aggregate('src/pair.py',['north','south'])+'\n'+declaration('src/pair.py','collect_entries')+'\n1. '+call('south')+'\n2. '+call('north'),2,2,2,2],
 ['OTHER_OWNER',group+'\n## src/foreign.py\n'+call('load_red'),3,0,0,0],
 ['DUPLICATE',aggregate('src/catalog.py',['load_red','load_red'])+'\n'+call('load_red'),0,0,0,0],
 ['MULTI_CALL',decl+'\n1. '+call('load_red')+'\n2. '+call('load_blue'),0,0,2,0],
 ['FOREIGN_DECL','# Task One\n'+group+'\n'+decl+'\n'+call('load_red')+'\n# Task Two\n'+declaration('src/foreign.py','collect_entries'),3,1,1,1],
 ['EQUAL_DECL',group+'\n'+decl+'\n'+decl+'\n'+call('load_red'),3,1,0,0],
 ['CALL_BEFORE',group+'\n'+call('load_red')+'\n'+decl,3,1,1,1],
 ['ARGUMENTS',group+'\n'+decl+'\n'+call('load_blue','collect_entries','alpha_dir, beta_dir'),3,1,1,1],
 ['PATH',group+'\n'+decl+'\n'+call('load_green','collect_entries','root / "back,up", cold_dir'),3,1,1,1],
 ['DETERMINISM',group+'\n'+decl+'\n'+call('load_red'),3,1,1,1],
 ['ENGLISH','Modify methods `alpha` / `beta` in `src/letters.py`.\n'+declaration('src/letters.py','gather')+'\n1. In alpha, call gather(active, archived).\n2. In beta, call gather(active, archived).',2,2,2,2],
 ['UNRELATED_CODE',group+'\n'+call('load_red')+'\n\n```python\ndef collect_entries(folder):\n    return folder\n```',3,1,0,0],
 ['LOCAL',call('load_red'),0,0,0,0],
 ['NESTED','# Outer\n'+group+'\n'+decl+'\n## Inner\n'+aggregate('src/foreign.py',['load_red','other'])+'\n### src/foreign.py\n'+call('load_red'),5,1,0,0],
 ['COMPETING_OWNER',group+'\n'+aggregate('src/foreign.py',['load_red','other'])+'\n'+call('load_red'),5,0,0,0],
].map(([id,text,members,continuity,bindings,compositions])=>({id:'ID_'+id,text,expect:{members,continuity,bindings,compositions}}));
