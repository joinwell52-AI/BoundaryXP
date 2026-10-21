import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import {createHash} from 'node:crypto';import {spawnSync} from 'node:child_process';
const root=fileURLToPath(new URL('../',import.meta.url)),out=path.resolve(process.argv[2]);if(fs.existsSync(out))throw Error('CANDIDATE_DIRECTORY_ALREADY_EXISTS');fs.mkdirSync(out,{recursive:true});
const files=['package.json','package-lock.json','src','protocol/schemas','research/7plus1-parser/llm-first-028','scripts/ir-kernel.mjs','scripts/ir-kernel-evidence.mjs','tests/ir-kernel','docs/ir-kernel'];
for(const rel of files){const from=path.join(root,rel),to=path.join(out,rel);fs.mkdirSync(path.dirname(to),{recursive:true});fs.cpSync(from,to,{recursive:true});}
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]),hash=x=>createHash('sha256').update(x).digest('hex');
const manifest={format:'boundx-isolated-kernel-package/1',kernel_version:'kernel/1.0-candidate.1',product_acceptance:'NOT_RUN',contract:'candidate-ir/2.0',not_a_58618_upgrade:true,files:walk(out).map(f=>({path:path.relative(out,f).replaceAll('\\','/'),sha256:hash(fs.readFileSync(f))}))};fs.writeFileSync(path.join(out,'KERNEL-MANIFEST.json'),JSON.stringify(manifest,null,2)+'\n');
const npmCli=process.env.npm_execpath??path.join(path.dirname(process.execPath),'node_modules/npm/bin/npm-cli.js');
if(!fs.existsSync(npmCli))throw Error('NPM_CLI_NOT_FOUND:'+npmCli);
const install=spawnSync(process.execPath,[npmCli,'ci','--offline','--ignore-scripts','--no-audit','--no-fund'],{cwd:out,windowsHide:true,encoding:'utf8',maxBuffer:8*1024*1024,timeout:120000});fs.writeFileSync(path.join(out,'OFFLINE-INSTALL.log'),(install.stdout??'')+(install.stderr??''));
if(install.status!==0)throw Error('OFFLINE_INSTALL_FAILED:'+install.status);
console.log(JSON.stringify({directory:out,files:manifest.files.length,offline_install_exit:install.status,node:process.version,manifest_sha256:hash(fs.readFileSync(path.join(out,'KERNEL-MANIFEST.json')))}));
