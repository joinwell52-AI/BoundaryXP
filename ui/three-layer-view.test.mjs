import test from 'node:test';
import assert from 'node:assert/strict';
import { renderThreeLayerReport } from './bxp-view.mjs';
import {readFileSync} from 'node:fs';
import {evaluateBxpTask} from '../src/bxp/index.mjs';
import {renderThreeLayers} from '../src/product/assembler.mjs';

class ViewNode {
 constructor(ownerDocument,tag){this.ownerDocument=ownerDocument;this.tag=tag;this.textContent='';this.children=[];}
 append(...children){this.children.push(...children);}
 replaceChildren(){this.children=[];}
 all(){return [this,...this.children.flatMap(child=>child.all())];}
 get text(){return this.textContent+this.children.map(child=>child.text).join('\n');}
}
test('three-layer view renders sections and folded evidence without executing source HTML',()=>{
 const document={createElement:tag=>new ViewNode(document,tag)},host=new ViewNode(document,'div');
 const report='### 任务边界检查\n- **【Layer 1：原文证据】**\n  > <img src=x onerror=alert(1)> **原文**\n- **【Layer 2：标准 7+1 结构化映射】**\n  - **I (输入范围)**：已明确\n    - 输入.txt\n      - 原文证据 / Evidence：task [0,2) — "原文"\n- **【Layer 3：计算结果与建议】**\n    - **Diff [-O]**：未提供';
 renderThreeLayerReport(host,report);
 assert.equal(host.all().filter(node=>node.tag==='section').length,3);
 assert.equal(host.all().filter(node=>node.tag==='details').length,1);
 assert.ok(host.all().some(node=>node.tag==='strong'&&node.text==='Diff [-O]'));
 assert.ok(host.all().some(node=>node.tag==='blockquote'&&node.text.includes('**原文**')));
 assert.ok(!host.all().some(node=>['img','script'].includes(node.tag)));
 assert.doesNotMatch(host.text,/###|\*\*I \(/);
 renderThreeLayerReport(host,'尚未计算 / Not computed');
 assert.equal(host.all().filter(node=>node.tag==='section').length,0);
 assert.match(host.text,/Not computed/);
});

test('real Core envelope yields eight concise slots and evidence trace without mutating results',()=>{
 const document={createElement:tag=>new ViewNode(document,tag)},host=new ViewNode(document,'div');
 const task=JSON.parse(readFileSync(new URL('../examples/bxp/zh-CN-complete.json',import.meta.url),'utf8'));
 const first=task.elements.I.entries[0];
 task.extensions={'org.boundx.producer':{producer:{model_id:'test-model'},provenance:[{element:'I',entry_id:first.id,interpretation:'模型解释，不是原文',semantic_refs:[{scope:'boundx',pack_id:'test-pack',version:'1.0.0',digest:'a'.repeat(64),entry_id:'example-entry'}]}]}};
 const evaluation={computed:true,task,result:evaluateBxpTask(task),clarifications:[]};
 const before=JSON.stringify(evaluation);
 renderThreeLayerReport(host,renderThreeLayers(task.source.text,evaluation),undefined,evaluation);
 assert.equal(host.all().filter(node=>node.className==='report-slot').length,8);
 assert.equal(host.all().filter(node=>node.tag==='section').length,3);
 const trace=host.all().find(node=>node.className==='extraction-trace');
 assert.ok(trace);assert.match(trace.text,/test-model/);assert.match(trace.text,/test-pack@1.0.0/);
 assert.ok(trace.text.includes(first.evidence[0].quote));assert.match(trace.text,/模型解释，不是原文/);
 assert.equal(JSON.stringify(evaluation),before);
 const visible=node=>node.tag==='details'?'':node.textContent+node.children.map(visible).join('\n');
 assert.doesNotMatch(visible(host),/intervals：|constraint_ids|Entry kind|validation=/);
 assert.ok(visible(host).includes(first.text));
});

test('copy action uses the provided source callback and reports completion',async()=>{
 const document={createElement:tag=>new ViewNode(document,tag)},host=new ViewNode(document,'div');let copied=false;
 renderThreeLayerReport(host,'- **【Layer 1：原文证据】**\n  > 原文',async()=>{copied=true;});
 const button=host.all().find(node=>node.tag==='button');await button.onclick();
 assert.equal(copied,true);assert.match(button.text,/Copied/);
});
