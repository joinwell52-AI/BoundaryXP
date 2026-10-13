// Complete immutable package from this checkout, never from a prior installation.
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath,pathToFileURL} from 'node:url';import {execFileSync} from 'node:child_process';import {createHash} from 'node:crypto';
import {lockProduct} from './resources.mjs';
export const candidateVersion='0.1.0-candidate.031-r1.2-ui.83';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..'),hash=b=>createHash('sha256').update(b).digest('hex');
const tree=directory=>fs.readdirSync(path.join(root,directory),{withFileTypes:true}).flatMap(e=>e.isDirectory()?tree(directory+'/'+e.name):e.isFile()?[directory+'/'+e.name]:[]);
export function buildCandidate(output=path.join(root,'.boundx/products',candidateVersion)){
 const target=path.resolve(output);if(fs.existsSync(target))throw Error('IMMUTABLE_CANDIDATE_EXISTS');
 const core='research/7plus1-parser/llm-first-028',web='research/7plus1-parser/v0.3-p2.1-generalization/web';
 const paths=[...tree(core).filter(p=>!p.slice(core.length+1).startsWith('tests/')),...tree('src/bxp'),...tree('protocol/schemas'),...['SEMANTICS.md','candidate-ir.schema.json','candidate-ir-audit.schema.json','LANGUAGE-CAPABILITIES.json'].map(p=>'docs/ir-kernel/'+p),...['index.html','native-app.js','process-view.js','direct-ir-process.js','calculation-view.js','style.css'].map(p=>web+'/'+p),...['cli.mjs','deploy.mjs','resources.mjs','ui.mjs','verify.mjs','verify-candidate.mjs','launch-installed.mjs','cli-installed.mjs','CLOUD-CANDIDATE.md'].map(p=>'product/short-compiler/'+p),'package.json','package-lock.json','LICENSE'];
 const files=[...new Set(paths)].sort();for(const file of files)if(!fs.statSync(path.join(root,file)).isFile())throw Error('FULL_SOURCE_MISSING:'+file);
 const schema=JSON.parse(fs.readFileSync(path.join(root,'docs/ir-kernel/candidate-ir.schema.json')));
 const compiler=fs.readFileSync(path.join(root,core,'engine.mjs'),'utf8').match(/compilerRevision='([^']+)'/)?.[1];if(!compiler)throw Error('BUILD_COMPILER_IDENTITY_MISSING');
 // Documentation/evidence-only commits do not change a frozen runtime package.
 const sourcePaths=[...files,'product/short-compiler/build-candidate.mjs','review-assets/7plus1/real-gold-60/adjudications-r02'];
 const sourceRevision=execFileSync('git',['log','-1','--format=%H','--',...sourcePaths],{cwd:root,encoding:'utf8'}).trim();
 const sourceTime=execFileSync('git',['show','-s','--format=%cI',sourceRevision],{cwd:root,encoding:'utf8'}).trim();
 const changed=execFileSync('git',['status','--porcelain','--',...files],{cwd:root,encoding:'utf8'}).trim();
 fs.mkdirSync(target,{recursive:true});for(const file of files){const destination=path.join(target,file);fs.mkdirSync(path.dirname(destination),{recursive:true});fs.copyFileSync(path.join(root,file),destination,fs.constants.COPYFILE_EXCL);}
 // The prior local package had a generated source-only example directory which
 // was not tracked. Rebuild it from frozen repository source bytes, never Gold.
 const sourceRoot=path.join(root,'review-assets/7plus1/real-gold-60/adjudications-r02');
 const active=JSON.parse(fs.readFileSync(path.join(sourceRoot,'ACTIVE-REVISIONS.json'))),cases=[];
 if(Object.keys(active.revisions).length!==60)throw Error('SOURCE_EXAMPLES_ACTIVE_COUNT');
 for(const [id,revision]of Object.entries(active.revisions).sort()){
  if(!/^REAL-GOLD-\d{3}$/.test(id)||!/^rev\d+$/.test(revision))throw Error('SOURCE_EXAMPLES_ID');
  const base=path.join(sourceRoot,id,revision),m=JSON.parse(fs.readFileSync(path.join(base,'MANIFEST.json')));
  const file=fs.realpathSync(path.join(base,m.source_file));if(!m.source_file.startsWith('source/')||!file.startsWith(fs.realpathSync(path.join(base,'source'))+path.sep))throw Error('SOURCE_EXAMPLES_OUTSIDE_SOURCE');
  const bytes=fs.readFileSync(file);if(hash(bytes)!==m.source_sha256)throw Error('SOURCE_EXAMPLE_DIGEST_MISMATCH:'+id);
  const relative='fixtures/7plus1/real-gold-60-inputs/'+id+'/source.md',destination=path.join(target,relative);fs.mkdirSync(path.dirname(destination),{recursive:true});fs.writeFileSync(destination,bytes,{flag:'wx'});files.push(relative);
  cases.push({id,active_revision:revision,file:id+'/source.md',source_sha256:hash(bytes),bytes:bytes.length,codepoints:[...bytes.toString('utf8')].length,status:'HISTORICAL_CANDIDATE_NOT_CURRENT_GOLD'});
 }
 const exampleManifest='fixtures/7plus1/real-gold-60-inputs/MANIFEST.json';fs.writeFileSync(path.join(target,exampleManifest),JSON.stringify({format:'boundx-real-gold-source-inputs/v1',count:60,answers_included:false,cases},null,2)+'\n',{flag:'wx'});files.push(exampleManifest);files.sort();
 for(const file of ['package.json','package-lock.json']){const destination=path.join(target,file),pkg=JSON.parse(fs.readFileSync(destination));pkg.version=candidateVersion;if(pkg.packages?.['']){pkg.packages[''].version=candidateVersion;delete pkg.packages[''].bin;}if(file==='package.json'){pkg.private=true;delete pkg.exports;delete pkg.bin;pkg.scripts={'7plus1':'node product/short-compiler/cli.mjs','7plus1:ui':'node product/short-compiler/ui.mjs','verify':'node product/short-compiler/verify.mjs'};}fs.writeFileSync(destination,JSON.stringify(pkg,null,2)+'\n');}
 const manifest={format:'boundx-short-compiler-product/1',version:candidateVersion,compiler_revision:compiler,contract:schema.properties.contract_version.const,created_at:sourceTime,source_revision:sourceRevision,source_runtime_clean:!changed,build_entry:'product/short-compiler/build-candidate.mjs',model_resources_changed:true,model_validation_scope:'PRIOR_PROFILE_FROZEN_RESPONSES_ONLY_NEW_SKILL_LIVE_VALIDATION_PENDING',public_release:false,product_acceptance:'WAITING_ADMIN_REVIEW',support_profile:'完整ADMIN原文；容量1MiB；明确身份与时点的自报观测；未知不判满足',known_limitations:['冻结响应回放仅验证消费者；修订后Skill的真实首次解析、新会话审阅及重复验证待本地完成','实际观测为用户自报；缺身份、时点、阶段或单位保持UNKNOWN','开放事件域仅验证所提供的完整记录或构造见证，不认证任意未来执行','未支持的实例、有限量词与连续局部数值组合保留具体缺口'],files:files.map(file=>({path:file,sha256:hash(fs.readFileSync(path.join(target,file)))}))};
 manifest.model_resources_changed=true;
 manifest.model_validation_scope='IR_KERNEL_2_0_OFFLINE_VERIFIED_REAL_MODEL_ACCEPTANCE_NOT_RUN';
 manifest.support_profile='统一IR内核2.0候选；有限明确域、精确数值与时间；原Skill/skill1配合同版接口适配';
 manifest.known_limitations=['2.0真实解析与独立审阅验收尚未运行，技术接受不证明原文理解正确','开放事件域全域SAT、动态枚举与符号实例索引、旧隐式模式仍有支持限制','定性立即不换算为零秒；条件或非必需总耗时联合求解尚未支持','历史1.4记录保持原样，不自动升级或重新计算'];
 fs.writeFileSync(path.join(target,'PRODUCT-MANIFEST.json'),JSON.stringify(manifest,null,2)+'\n',{flag:'wx'});const lock=lockProduct(target);lock.verify();return {version:candidateVersion,target,compiler,contract:manifest.contract,files:files.length,source_revision:sourceRevision,source_runtime_clean:!changed,manifest_sha256:lock.snapshot.manifest_sha256};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)console.log(JSON.stringify(buildCandidate(process.argv[2])));
