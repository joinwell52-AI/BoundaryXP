import fs from 'node:fs';
import {createHash} from 'node:crypto';
const base=new URL('.',import.meta.url),old=new URL('../v0.3-p2.2-meeting-repair/',base);
const frozen=JSON.parse(fs.readFileSync(new URL('IMPLEMENTATION-FROZEN-r03.json',old)));
for(const [name,digest] of Object.entries(frozen.files)){
 const b=fs.readFileSync(new URL(name,old));if(createHash('sha256').update(b).digest('hex')!==digest)throw Error('SEALED_RUNTIME_CHANGED '+name);
 fs.mkdirSync(new URL('.',new URL(name,base)),{recursive:true});fs.writeFileSync(new URL(name,base),b,{flag:'wx'});
}
for(const name of ['MEETING-INPUT.txt','FIXED-INPUTS.json','MUTATION-INPUTS.json','ORIGINAL-RUNTIME-FROZEN.json','BASELINE-NLP.json','meeting-assertions.mjs','verify-semantics.mjs','final-replay.mjs','run-regression.mjs','export.mjs']){
 if(!fs.existsSync(new URL(name,base)))fs.copyFileSync(new URL(name,old),new URL(name,base),fs.constants.COPYFILE_EXCL);
}
for(const ext of ['json','md','html'])fs.copyFileSync(new URL('replay-r03/MEETING.'+ext,old),new URL('BEFORE-MEETING.'+ext,base),fs.constants.COPYFILE_EXCL);
fs.copyFileSync(new URL('MANIFEST.json',old),new URL('PREVIOUS-MANIFEST.json',base),fs.constants.COPYFILE_EXCL);
fs.copyFileSync(new URL('SEAL.md',old),new URL('PREVIOUS-SEAL.md',base),fs.constants.COPYFILE_EXCL);
console.log('Copied verified runtime',Object.keys(frozen.files).length);
