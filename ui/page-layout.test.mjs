import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const app=readFileSync(new URL('./app.js',import.meta.url),'utf8');
test('industry cases opens separately without replacing task input',()=>{
 const control={},opened=[];
 const handler=app.split('\n').find(line=>line.startsWith("$('example').onclick="));
 vm.runInNewContext(handler,{$:()=>control,window:{open:(...args)=>opened.push(args)}});
 control.onclick();
 assert.deepEqual(opened,[['/cases','_blank','noopener']]);
 assert.doesNotMatch(app,/const exampleText=/);
});
test('main workflow excludes obsolete panels and exposes maintenance only in advanced settings',()=>{
 const html=readFileSync(new URL('./index.html',import.meta.url),'utf8');
 assert.doesNotMatch(html,/<aside role="note">/);
 assert.match(app,/legacyWorkspace.hidden=true;legacyWorkspace.inert=true/);
 assert.match(app,/packageLink.href='\/admin#advanced'/);
 assert.match(app,/\$\('settings'\).hidden=location.hash!=='#settings'/);
});
