import fs from 'node:fs';
import path from 'node:path';
import {lockProduct} from './resources.mjs';
const base=path.resolve('.boundx/short-compiler-031-r1/versions/0.1.0-candidate.031-r1.2-ui.38');
const work=path.resolve('.boundx/local-condition-repair-r01/work');
const report=path.resolve('docs/reports/7plus1/LOCAL-CONDITION-REPAIR-r01');
const lock=lockProduct(base);lock.verify();
if(lock.snapshot.manifest_sha256!=='d9e91260eb046cb3811467705b09ef68c1c1d65b4856ee7dbef98782f485a32e')throw Error('WRONG_BASE');
if(fs.existsSync(work)||fs.existsSync(report))throw Error('FIRST_RESULTS_EXIST');
fs.mkdirSync(report,{recursive:true});
for(const item of lock.snapshot.files){const target=path.join(work,item.path);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(path.join(base,item.path),target,fs.constants.COPYFILE_EXCL);}
fs.cpSync(path.join(base,'node_modules'),path.join(work,'node_modules'),{recursive:true,errorOnExist:true,force:false});
fs.copyFileSync(path.join(base,'PRODUCT-MANIFEST.json'),path.join(report,'BASELINE-MANIFEST.json'),fs.constants.COPYFILE_EXCL);
console.log(JSON.stringify({base,work,report,model_calls:0}));
