import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {prepareSource,sha256} from './source.mjs';
const packageRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const root=path.join(packageRoot,'fixtures/7plus1/real-gold-60-inputs');
export function sourceExamples(){
 const file=path.join(root,'MANIFEST.json');if(!fs.existsSync(file))return [];
 const m=JSON.parse(fs.readFileSync(file,'utf8'));
 if(m.format!=='boundx-real-gold-source-inputs/v1'||m.count!==60||m.answers_included!==false||m.cases.length!==60)throw Error('SOURCE_EXAMPLES_MANIFEST_INVALID');
 if(new Set(m.cases.map(c=>c.id)).size!==60)throw Error('SOURCE_EXAMPLES_DUPLICATE_ID');
 for(const c of m.cases)if(!/^REAL-GOLD-0(?:[0-5][0-9]|60)$/.test(c.id)||c.id==='REAL-GOLD-000'||c.file!==c.id+'/source.md'||!/^rev\d+$/.test(c.active_revision)||c.status!=='HISTORICAL_CANDIDATE_NOT_CURRENT_GOLD')throw Error('SOURCE_EXAMPLES_ENTRY_INVALID');
 return m.cases;
}
export function loadSourceExample(id){
 const entry=sourceExamples().find(c=>c.id===id);if(!entry)throw Error('SOURCE_EXAMPLE_NOT_FOUND');
 const file=fs.realpathSync(path.join(root,entry.file));if(!file.startsWith(fs.realpathSync(root)+path.sep))throw Error('SOURCE_EXAMPLE_OUTSIDE_ROOT');
 const bytes=fs.readFileSync(file);if(sha256(bytes)!==entry.source_sha256||bytes.length!==entry.bytes)throw Error('SOURCE_EXAMPLE_DIGEST_MISMATCH');
 const source=prepareSource(bytes);if(source.codepoints!==entry.codepoints)throw Error('SOURCE_EXAMPLE_LENGTH_MISMATCH');
 return {...entry,text:source.text,base64:bytes.toString('base64'),filename:id+'-'+entry.active_revision+'.md'};
}
