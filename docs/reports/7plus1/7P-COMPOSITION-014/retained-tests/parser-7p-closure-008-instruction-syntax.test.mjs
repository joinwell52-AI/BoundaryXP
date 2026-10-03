import test from 'node:test';import assert from 'node:assert/strict';
import {imperativePrefix} from '../../../../../research/7plus1-parser/v0.3-7p-composition-014/instruction-syntax.mjs';
import {annotateDocument} from '../../../../../research/7plus1-parser/v0.3-7p-composition-014/discourse.mjs';
import {sourceDocument} from '../../../../../research/7plus1-parser/p0-semantic-repair-r02/source.mjs';
test('008 explicit imperative source prefixes only',()=>{for(const s of ['', '- ', '12. ', '4) **', 'and ','则 '])assert(imperativePrefix(s));for(const s of ['The report ', '此前 ','如果 ', 'Example: ','said "'])assert(!imperativePrefix(s));});
test('008 heading emphasis preserves out-of-scope structural semantics',()=>{const d=annotateDocument(sourceDocument('## 本任务**不**修改的范围\n- 模块。\n## Required\n- Run checks.\n'));assert.equal(d.annotations[1].kind,'OUT_OF_SCOPE');assert.equal(d.annotations.at(-1).kind,'DELIVERABLE_SPEC');});
