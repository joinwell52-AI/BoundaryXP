import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';import test from 'node:test';
const code=fs.readFileSync('research/7plus1-parser/v0.3-p2.1-generalization/web/native-app.js','utf8');
const functionCode=code.match(/const directTrace=[^\n]+/)[0]+'\n'+code.slice(code.indexOf('function directPanel('),code.indexOf('async function history'));
class Element{constructor(tag,text){this.tag=tag;this.text=text;this.children=[];}append(...x){this.children.push(...x);}replaceChildren(...x){this.children=x;}}
for(const pipeline of ['DECLARATIVE_BOUNDARY','LLM_DIRECT_CANDIDATE_IR','LLM_IR_AND_BOUNDARY_CALCULATION'])for(const kind of ['pending','diagnostics','retained','forbid','json','frames'])test(pipeline+' tab '+kind+' preserves records without legacy fields',()=>{
 const root=new Element('root');const r={pipeline:'LLM_DIRECT_CANDIDATE_IR',ir:{source_table:[{id:'s1',quote:'实际来源'}],events:[{id:'scope',kind:'TASK',layer:'MAIN',use:'CURRENT_TASK',source_refs:['s1']}],issues:[{reason:'IR疑点',source_refs:['s1']}]},audit:{issues:[{reason:'审阅错误'}],omissions:[{reason:'审阅遗漏'}]},technical:{rows:[{id:'x',status:'REJECTED'}],diagnostics:[{code:'SOURCE_ERROR'}]},canonical:{slots:{B:{entries:[{id:'b',text:'禁止边界'}]}},unresolved:[{id:'x',reason:'节点未决'}],gaps:[{reason:'计算缺口'}]}};
 r.pipeline=pipeline;
 const context={current:{result:r},session:{},highlight(){},el:(tag,text)=>new Element(tag,text),$:()=>root,renderCompilerProcess:(e)=>e.append(new Element('p','过程')),tab:null};vm.createContext(context);vm.runInContext(functionCode,context);context.panel(kind);assert.ok(root.children.length);
 const text=JSON.stringify(root);if(['pending','diagnostics'].includes(kind))for(const expected of ['IR疑点','审阅错误','审阅遗漏','SOURCE_ERROR','节点未决','计算缺口'])assert.ok(text.includes(expected),expected);if(kind==='retained')assert.ok(text.includes('实际来源'));
});
