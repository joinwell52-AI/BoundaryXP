import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createLocale,translate,registerPair,selectCopy,catalog} from './i18n.mjs';
import {pairedCopy} from './paired-copy.mjs';
import {completeTask} from './advice.mjs';
import {packLabel} from './pack-labels.mjs';
for(const pair of pairedCopy)registerPair(...pair);
test('settings copy and industry names show only the selected language',()=>{
 for(const [zh,en] of [['设置','Settings'],['输入任务原文','Enter task text'],['自定义API','Custom API']]){
  assert.equal(translate(zh+' / '+en,'zh-CN'),zh);
  assert.equal(translate(zh+' / '+en,'en'),en);
 }
 assert.equal(packLabel({pack_id:'software-ai',version:'0.2.0'},'en'),'Software & AI · 0.2.0');
 assert.equal(packLabel({pack_id:'software-ai',version:'0.2.0'},'zh-CN'),'软件与人工智能 · 0.2.0');
});
test('a localized node is not rebound to its initial rendered language',()=>{
 const locale=createLocale('en'),node={isConnected:true,textContent:''};
 locale.bind(node,language=>selectCopy('语义包设置','Semantic package settings',language));
 assert.equal(locale.hasBinding(node),true);
 locale.set('zh-CN');assert.equal(node.textContent,'语义包设置');
 locale.set('en');assert.equal(node.textContent,'Semantic package settings');
});
test('language selection displays one copy and supports switching back',()=>{
 const locale=createLocale(),node={isConnected:true,textContent:''};locale.bind(node,l=>selectCopy('中文建议','English advice',l));assert.equal(node.textContent,'中文建议');locale.set('en');assert.equal(node.textContent,'English advice');locale.set('zh-CN');assert.equal(node.textContent,'中文建议');assert.throws(()=>locale.set('xx'));
 assert.equal(translate('3　结论与建议 / Advice','zh-CN'),'3　结论与建议');assert.equal(translate('3　结论与建议 / Advice','en'),'Advice');
});
test('localization leaves source text untouched and discards detached bindings',()=>{
 const source='检查系统 / User-defined source';assert.equal(translate(source,'en'),source);
 const locale=createLocale(),node={isConnected:false,textContent:''};locale.bind(node,()=> 'first');node.textContent='detached';locale.set('en');assert.equal(node.textContent,'detached');
});
test('complete task preserves source and uses only the selected language for additions',()=>{
 const task={text:'Inspect system. Report to ADMIN.',parameters:{I:'Inspect system.',O:'Report to ADMIN.'}};
 const before=JSON.stringify(task),zh=completeTask(task),en=completeTask(task,'en');
 assert(zh.startsWith(task.text));assert(en.startsWith(task.text));assert(zh.includes('建议补充的要求'));assert(!zh.includes('Proposed additional requirements'));assert(en.includes('Proposed additional requirements'));assert(!/[\u4e00-\u9fff]/u.test(en));assert.equal(JSON.stringify(task),before);
 const complete={...task,text:task.text+' Do not modify source code.',parameters:Object.fromEntries(['I','O','A','P','R','V','C'].map(k=>[k,'specified']))};assert.equal(completeTask(complete,'en'),complete.text);
});
test('static interface Chinese copy has an English catalog entry, apart from branding and selector autonyms',()=>{
 const html=readFileSync(new URL('./index.html',import.meta.url),'utf8');
 const text=[...html.matchAll(/>([^<>]+)</g)].map(m=>m[1].trim()).filter(s=>/[\u4e00-\u9fff]/u.test(s));
 const untranslated=text.filter(s=>!['界','界痕','中文','界痕 · BoundaryXP'].includes(s)&&translate(s,'en')===s);
 assert.deepEqual(untranslated,[]);
 for(const [zh,en] of catalog){assert(en.trim());assert(!/[\u4e00-\u9fff]/u.test(en),zh);}
});
