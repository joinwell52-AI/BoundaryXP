import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';
const workspace=fs.realpathSync(path.resolve('.')),home=fs.realpathSync(path.join(workspace,'.boundx/short-compiler-031-r1')),target=path.join(workspace,'.boundx/local-mathematical-entry-ui51-backup');
if(!home.startsWith(workspace+path.sep)||fs.existsSync(target))throw Error('UNSAFE_OR_EXISTING_BACKUP');
const config=JSON.parse(fs.readFileSync(path.join(home,'config.json'))),data=fs.realpathSync(config.data_dir);if(!data.startsWith(workspace+path.sep))throw Error('DATA_OUTSIDE_WORKSPACE');
fs.mkdirSync(target);for(const name of ['current.json','config.json'])fs.copyFileSync(path.join(home,name),path.join(target,name),fs.constants.COPYFILE_EXCL);fs.cpSync(data,path.join(target,'data'),{recursive:true,errorOnExist:true,force:false});
const hash=b=>createHash('sha256').update(b).digest('hex');const record={backup:target,source_home:home,source_data:data,current_sha256:hash(fs.readFileSync(path.join(target,'current.json'))),config_sha256:hash(fs.readFileSync(path.join(target,'config.json'))),existing_history_preserved:true,created_at:new Date().toISOString()};
fs.writeFileSync('docs/reports/7plus1/MATHEMATICAL-RESULT-CLOSURE-r01/BACKUP.json',JSON.stringify(record,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({backup:target,complete:true}));
