import fs from 'node:fs';
let patch='*** Begin Patch\n';
for(const name of process.argv.slice(2)){
 const source='research/7plus1-parser/v0.3-admin-natural-021/'+name+'.mjs';
 let text=fs.readFileSync(source,'utf8');
 text=text.replace(/\.\.\/v0\.3-/g,'../../v0.3-');
 // Existing local syntax support becomes a hypothesis, never a certified relation.
 text=text.replace(/\b(r|rr|rel|relation|x)\.state(\s*(?:===|!==|=)\s*)'RESOLVED'/g,"$1.state$2'SUPPORTED'").replace(/state:'CERTIFIED'/g,"state:'CANDIDATE_SUPPORTED'");
 patch+='*** Add File: D:/boundx/research/7plus1-parser/v0.3-admin-root-024/migration/'+name+'.mjs\n'+text.split('\n').map(l=>'+'+l).join('\n')+'\n';
}
patch+='*** End Patch';console.log(JSON.stringify({patch}));
