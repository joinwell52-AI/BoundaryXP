import fs from 'node:fs';
const additions={
 'research/7plus1-parser/llm-first-028/contracts/semantic-contract.md':'\n域备选资格必须有语义关系证据，不只是容器的FILE类型或出现距离。原文已把某类别定位在一个输入容器内时，另一个仅作为产生结果出现的文件，不自动成为该原始类别的另一个容器；派生产物不等于原始对象容器。只有来源另有同类成员域/容器关联，才可作为改变该范围的备选。明确回指结果产物本身、明确产物内容域或明确跨容器仍正常表达。唯一满足所指类别及容器关系的先行项须确定，不能以多个文件出现为由制造源歧义。\n',
 'research/7plus1-parser/llm-first-028/skills/boundx-semantic-parse/SKILL.md':'\n域备选不能仅按FILE身份或距离入选：先核对该类别与各容器在原文中的关系。一个仅被生成的派生产物不自动成为原始对象类别的容器，不能因此把有唯一语义先行项的回指改成竞争；只有源文支持相应成员域/容器关联才纳入。直接引用结果产物本身、明确结果内容域或明确跨容器的来源仍须保留。对每个备选给出关系来源，缺少这类支持就不能制造歧义。\n',
 'research/7plus1-parser/llm-first-028/skills/boundx-semantic-audit/SKILL.md':'\n逐备选检查类别—容器关系证据。不能因多个FILE共现而SUPPORT竞争；仅作为派生产物生成的文件，不自动成为原始类别的第二容器。来源只有一个与所指类别及域关系相符的先行项时，过度DOMAIN_CHOICE是错误，须CONTRADICT并要求来源重核；不得由审阅器直接改ID。明确指向产物本身或其内容域、明确跨容器仍正常保留，不能按输入/输出角色机械排除真实来源。\n'
};
for(const [p,add]of Object.entries(additions)){const t=fs.readFileSync(p,'utf8');if(t.includes(add.trim()))throw Error('ALREADY_APPLIED');fs.writeFileSync(p+'.032.tmp',t+add,{flag:'wx'});fs.renameSync(p+'.032.tmp',p);}
