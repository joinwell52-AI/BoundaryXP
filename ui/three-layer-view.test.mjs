import test from 'node:test';
import assert from 'node:assert/strict';
import { renderThreeLayerReport } from './bxp-view.mjs';

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
