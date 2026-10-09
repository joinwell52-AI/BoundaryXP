// Apply two narrowly checked UTF-8 edits when Windows patch replacement fails.
import fs from 'node:fs';
const p='research/7plus1-parser/llm-first-028/engine.mjs';let t=fs.readFileSync(p,'utf8');
const replace=(from,to)=>{if(t.split(from).length!==2)throw Error('EDIT_ANCHOR_NOT_UNIQUE');t=t.replace(from,to);};
replace('resourceGuard=()=>{},productSnapshot=null}={})','resourceGuard=()=>{},productSnapshot=null,sourceLineage=null}={})');
replace('resourceGuard();const source=prepareSource(bytes);signal?.throwIfAborted();','resourceGuard();const source=prepareSource(bytes);signal?.throwIfAborted();\n if(sourceLineage&&(sourceLineage.source_sha256!==source.sha256||sourceLineage.parent_source_sha256===source.sha256))throw Error(\'INVALID_SOURCE_LINEAGE\');');
replace('const trace={product_snapshot:productSnapshot,source,proposal:','const trace={product_snapshot:productSnapshot,source_lineage:sourceLineage,source,proposal:');
const temporary=p+'.032-edit.tmp';fs.writeFileSync(temporary,t,{encoding:'utf8',flag:'wx'});fs.renameSync(temporary,p);console.log('LINEAGE_EDIT_APPLIED');
