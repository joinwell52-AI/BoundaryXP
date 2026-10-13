// Local version transport only. Never interprets task semantics or edits account configuration.
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import {spawnSync,spawn} from 'node:child_process';import {createHash} from 'node:crypto';
const args=process.argv.slice(2),operation=args[0],get=(flag,fallback)=>args.includes(flag)?args[args.indexOf(flag)+1]:fallback;
const source=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..'),home=path.resolve(get('--home','boundx-short-local'));
const hash=b=>createHash('sha256').update(b).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const atomic=(file,value)=>{fs.mkdirSync(path.dirname(file),{recursive:true});const temp=file+'.tmp';fs.writeFileSync(temp,JSON.stringify(value,null,2)+'\n',{flag:'wx'});fs.renameSync(temp,file);};
const verify=root=>{const m=read(path.join(root,'PRODUCT-MANIFEST.json'));for(const x of m.files){const p=path.resolve(root,x.path);if(!p.startsWith(root+path.sep)||hash(fs.readFileSync(p))!==x.sha256)throw Error('PRODUCT_DIGEST_MISMATCH:'+x.path);}return m;};
const currentFile=path.join(home,'current.json'),configFile=path.join(home,'config.json');
if(operation==='install'||operation==='upgrade'){
 const manifest=verify(source),target=path.join(home,'versions',manifest.version);if(fs.existsSync(target))throw Error('VERSION_ALREADY_INSTALLED');
 if(operation==='upgrade'){
  if(!args.includes('--confirmed-idle'))throw Error('UPGRADE_REQUIRES_CONFIRMED_IDLE: stop only the identified target instance after confirming no requests');
  const backup=path.join(home,'backups',new Date().toISOString().replaceAll(':','-'));fs.mkdirSync(backup,{recursive:true});
  for(const name of ['current.json','config.json'])if(fs.existsSync(path.join(home,name)))fs.cpSync(path.join(home,name),path.join(backup,name),{recursive:true,errorOnExist:true,force:false});
  const dataDir=fs.existsSync(configFile)?path.resolve(read(configFile).data_dir):path.join(home,'data');
  if(backup===dataDir||backup.startsWith(dataDir+path.sep))throw Error('BACKUP_PATH_WITHIN_DATA');
  if(fs.existsSync(dataDir))fs.cpSync(dataDir,path.join(backup,'data'),{recursive:true,errorOnExist:true,force:false});
  console.log('BACKUP '+backup);
 }
 fs.mkdirSync(target,{recursive:true});for(const x of manifest.files){const p=path.join(target,x.path);fs.mkdirSync(path.dirname(p),{recursive:true});fs.copyFileSync(path.join(source,x.path),p,fs.constants.COPYFILE_EXCL);}
 fs.copyFileSync(path.join(source,'PRODUCT-MANIFEST.json'),path.join(target,'PRODUCT-MANIFEST.json'));verify(target);
 const installed=spawnSync(process.platform==='win32'?'npm.cmd':'npm',['ci','--omit=dev','--ignore-scripts',...(args.includes('--offline')?['--offline','--no-audit','--no-fund']:[])],{cwd:target,stdio:'inherit',shell:process.platform==='win32',windowsHide:true});if(installed.status!==0)throw Error('DEPENDENCY_INSTALL_FAILED');
 if(!fs.existsSync(configFile))atomic(configFile,{port:Number(get('--port','58619')),data_dir:path.join(home,'data'),codex_binary:process.env.BOUNDX_CODEX_EXE??null,legacy_dir:null});
 atomic(currentFile,{version:manifest.version,previous:fs.existsSync(currentFile)?read(currentFile).version:null});console.log('INSTALLED '+manifest.version+' at '+home);
}else if(operation==='rollback'){
 if(!args.includes('--confirmed-idle'))throw Error('ROLLBACK_REQUIRES_CONFIRMED_IDLE');const current=read(currentFile);if(!current.previous)throw Error('NO_PREVIOUS_VERSION');verify(path.join(home,'versions',current.previous));atomic(currentFile,{version:current.previous,previous:current.version});console.log('ROLLED_BACK '+current.previous+'; history preserved without reparse');
}else if(operation==='start'){
 const current=read(currentFile),root=path.join(home,'versions',current.version),config=read(configFile);verify(root);
 const child=spawn(process.execPath,['product/short-compiler/ui.mjs'],{cwd:root,stdio:'inherit',windowsHide:true,env:{...process.env,BOUNDX_PARSER_PORT:String(config.port),BOUNDX_DATA_DIR:config.data_dir,BOUNDX_CODEX_EXE:config.codex_binary??process.env.BOUNDX_CODEX_EXE,BOUNDX_LEGACY_DIR:config.legacy_dir??process.env.BOUNDX_LEGACY_DIR}});
 console.log('TARGET_PID '+child.pid);process.on('SIGINT',()=>child.kill());child.on('exit',code=>{process.exitCode=code??1;});
}else throw Error('Usage: node product/short-compiler/deploy.mjs install|upgrade|start|rollback --home ABSOLUTE_PATH [--port 58619] [--confirmed-idle]');
