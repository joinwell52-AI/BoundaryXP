import test from 'node:test';import assert from 'node:assert/strict';
import {lexical} from '../research/7plus1-parser/v0.3-7p-closure-008/typed-literals.mjs';
import {sourceDocument} from '../research/7plus1-parser/p0-semantic-repair-r02/source.mjs';
for(const text of ['.cache/<key>.flag','work/','*.contract.json','.profile','out/{day}/','./private/'])test('008 hidden/glob/directory complete source '+text,()=>{const raw='禁止修改 `'+text+'`。',xs=lexical(sourceDocument(raw)),x=xs.find(x=>x.span.quote===text);assert(x);assert.equal([...raw].slice(x.span.start,x.span.end).join(''),text);assert(!xs.some(y=>y!==x&&y.span.start>=x.span.start&&y.span.end<=x.span.end));});
