import test from 'node:test';import assert from 'node:assert/strict';
import {lexical} from '../../../../../research/7plus1-parser/v0.3-7p-composition-011/typed-literals.mjs';
import {sourceDocument} from '../../../../../research/7plus1-parser/p0-semantic-repair-r02/source.mjs';
for(const value of ['src/cedar/render.py','rules/contracts/*.schema.json','out/<kind>/snapshot-{date}.md','file:///C:/records/a.json','custom+test://host/item','D:\\work\\rules\\base.toml','../assets/test-case.json'])test('008 exact complete protected literal '+value,()=>{
 const text='检查 '+value+' 后继续。',l=lexical(sourceDocument(text)),found=l.find(l=>l.span.quote===value);assert(found);assert.equal([...text].slice(found.span.start,found.span.end).join(''),value);assert(!l.some(x=>x!==found&&x.span.start>=found.span.start&&x.span.end<=found.span.end));
});
test('008 prose slash coordination is not invented as a filepath',()=>{assert(!lexical(sourceDocument('task/report/issue')).some(l=>l.type==='PATH'));});
