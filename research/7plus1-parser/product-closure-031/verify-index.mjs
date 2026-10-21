// Verify Git will preserve every sealed raw byte, including original prompt line endings.
import fs from 'node:fs';import {execFileSync} from 'node:child_process';import {sha256} from '../llm-first-028/source.mjs';
const prefix='docs/reports/7plus1/7P-SHORT-COMPILER-PRODUCT-CLOSURE-031-LONG/',manifest=JSON.parse(fs.readFileSync(prefix+'MANIFEST.json')),files=[...manifest.files.map(x=>({path:prefix+x.path,sha256:x.sha256})),...['MANIFEST.json','SHA256SUMS','SEAL.json'].map(x=>({path:prefix+x,sha256:sha256(fs.readFileSync(prefix+x))}))];
const response=execFileSync('git',['cat-file','--batch'],{input:files.map(x=>':'+x.path).join('\n')+'\n',maxBuffer:256*1024*1024});let offset=0;
for(const file of files){const end=response.indexOf(10,offset),header=response.subarray(offset,end).toString('utf8'),match=header.match(/^\S+ blob (\d+)$/);if(!match)throw Error('MISSING_INDEX_BLOB:'+file.path+':'+header);const size=Number(match[1]),body=response.subarray(end+1,end+1+size);if(sha256(body)!==file.sha256)throw Error('INDEX_NORMALIZED_SEALED_BYTES:'+file.path);offset=end+1+size+1;}
console.log(JSON.stringify({index_sealed_bytes_verified:files.length,status:'PASS'}));
