import fs from'node:fs';import{spawn}from'node:child_process';
const [label,...args]=process.argv.slice(2),dir='docs/reports/7plus1/7P-CLOSURE-008/logs';fs.mkdirSync(dir,{recursive:true});
const file=dir+'/'+label+'.log',stream=fs.createWriteStream(file,{flags:'wx'}),start=Date.now();
const run=spawn(process.execPath,args,{cwd:process.cwd(),windowsHide:true,stdio:['ignore','pipe','pipe']});let output='';
for(const io of [run.stdout,run.stderr])io.on('data',b=>{stream.write(b);output+=b.toString('utf8');});
run.on('close',code=>{stream.end();const last=output.split(/\r?\n/).slice(-12).join('\n');fs.writeFileSync(dir+'/'+label+'.json',JSON.stringify({label,args,exit_code:code,elapsed_ms:Date.now()-start,log:file,tail:last},null,2)+'\n',{flag:'wx'});console.log(last);process.exitCode=code??1;});
