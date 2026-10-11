import fs from 'node:fs';import {spawnSync} from 'node:child_process';
const git=args=>{const r=spawnSync('git',args,{encoding:'utf8',windowsHide:true,maxBuffer:16*1024*1024});if(r.status!==0)throw Error(r.stderr);return r.stdout;};
if(git(['branch','--show-current']).trim()!=='review/7plus1-parser')throw Error('WRONG_BRANCH');
if(git(['diff','--cached','--name-only']).trim())throw Error('EXISTING_STAGED_CHANGES');
// Preserve unrelated pre-existing launcher edits in the working tree.
let launch=git(['show','HEAD:product/short-compiler/launch-installed.mjs']);
launch=launch.replace('const approvedVersions={',"const approvedVersions={\n '0.1.0-candidate.031-r1.2-ui.51':{compiler:'031-r1-c25',contract:'031-r1.1'},\n '0.1.0-candidate.031-r1.2-ui.49':{compiler:'031-r1-c23',contract:'031-r1.1'},\n '0.1.0-candidate.031-r1.2-ui.46':{compiler:'031-r1-c20',contract:'031-r1.1'},");
const hashed=spawnSync('git',['hash-object','-w','--stdin'],{input:launch,encoding:'utf8',windowsHide:true});if(hashed.status)throw Error(hashed.stderr);
git(['update-index','--cacheinfo','100644,'+hashed.stdout.trim()+',product/short-compiler/launch-installed.mjs']);
const own=fs.readdirSync('product/short-compiler').filter(n=>n.includes('mathematical')&&/\.(mjs|py|json)$/.test(n)).map(n=>'product/short-compiler/'+n);
git(['add','--','.gitattributes','docs/testing/7plus1/MANUAL-TEST-001.md','docs/testing/7plus1/MANUAL-TEST-001.txt','docs/reports/7plus1/MATHEMATICAL-RESULT-CLOSURE-r01',...own,'product/short-compiler/tests/mathematical-result-report.test.mjs','product/short-compiler/tests/mathematical-result-ui.test.mjs','product/short-compiler/tests/root-limit-contract.test.mjs']);
git(['add','-u','--','docs/testing/7plus1/MANUAL-TEST-001-standard-r01','docs/testing/7plus1/MANUAL-TEST-001-local-conditions-r01']);
const root='docs/reports/7plus1/MATHEMATICAL-RESULT-CLOSURE-r01',m=JSON.parse(fs.readFileSync(root+'/MANIFEST.json'));
for(const f of m.files){const r=spawnSync('git',['show',':'+root+'/'+f.path],{windowsHide:true,maxBuffer:16*1024*1024});if(r.status)throw Error('INDEX_MISSING:'+f.path);const {createHash}=await import('node:crypto');if(createHash('sha256').update(r.stdout).digest('hex')!==f.sha256)throw Error('INDEX_HASH_MISMATCH:'+f.path);}
console.log(JSON.stringify({staged_report_files:m.files.length,index_sha256_verified:true,unrelated_changes_preserved:true}));
