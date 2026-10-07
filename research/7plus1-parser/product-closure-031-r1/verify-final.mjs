// Check sealed evidence against both disk SHA-256 and exact Git index blob bytes.
import fs from 'node:fs';import {createHash} from 'node:crypto';import {execFileSync} from 'node:child_process';
const p='docs/reports/7plus1/7P-SHORT-COMPILER-PRODUCT-CLOSURE-031-R1-LONG/',m=JSON.parse(fs.readFileSync(p+'MANIFEST.json')),seal=JSON.parse(fs.readFileSync(p+'SEAL.json')),sha=b=>createHash('sha256').update(b).digest('hex');
if(sha(fs.readFileSync(p+'MANIFEST.json'))!==seal.manifest_sha256||sha(fs.readFileSync(p+'SHA256SUMS'))!==seal.sha256sums_sha256)throw Error('SEAL_DRIFT');
const idx=execFileSync('git',['-c','core.quotepath=false','ls-files','--stage','--',p],{encoding:'utf8',maxBuffer:4*1024*1024}),map=new Map(idx.trim().split('\n').map(s=>{const[a,b]=s.split('\t');return[b,a.split(' ')[1]];}));
for(const x of [...m.files,...['MANIFEST.json','SHA256SUMS','SEAL.json'].map(path=>({path}))]){
 const file=p+x.path,b=fs.readFileSync(file);if(x.sha256&&sha(b)!==x.sha256)throw Error('FILE_DRIFT:'+file);
 const oid=createHash('sha1').update(Buffer.from('blob '+b.length+'\0')).update(b).digest('hex');if(map.get(file)!==oid)throw Error('STAGED_BYTES_DRIFT:'+file);
}
const names=execFileSync('git',['diff','--cached','--name-only'],{encoding:'utf8'}).trim().split('\n').filter(Boolean);
if(names.some(s=>!s.startsWith(p)&&s!=='docs/tasks/7plus1/CURRENT-TASK.md'&&!s.startsWith('research/7plus1-parser/product-closure-031-r1/')))throw Error('UNRELATED_STAGED_FILES');
console.log(JSON.stringify({manifest_files:m.files.length,git_index_bytes:'PASS',scoped_staging:'PASS',staged_files:names.length,seal_sha256:sha(fs.readFileSync(p+'SEAL.json'))}));
