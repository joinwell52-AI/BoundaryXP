// Offline evaluation asset. Never imported by Parser runtime.
import {createHash} from 'node:crypto';
export const sha256=x=>createHash('sha256').update(x).digest('hex');
export const distribution={total:200,zh:80,en:60,mixed:60,ambiguities:20};
function random(seed){let i=0;return n=>parseInt(sha256(seed+':'+i++).slice(0,8),16)%n;}
const inventories={
 nouns:[['队列清单','queue inventory'],['连接记录','connection records'],['权限映射','permission mapping'],['节点快照','node snapshots'],['事件清单','event inventory'],['构建摘要','build summary'],['校验记录','validation records'],['存储索引','storage index']],
 people:[['协调员','coordinator'],['复核组','review team'],['安全主管','security lead'],['资料组','records team']],
 checks:[['核查','inspect'],['审阅','review'],['核验','verify'],['检查','check']],
 files:['queue','connection','permission','snapshot','event','build','validation','storage'],
 contexts:[['隔离环境','isolated environment'],['预发布环境','staging environment'],['测试集群','test cluster']],
 names:['Avery','Morgan','Rowan','Casey','Quinn','Taylor','Reese','Jordan']
};
export function constructFrame(position,seed){
 const rnd=random(seed+':frame:'+position),family=position%10,language=position<80?'zh':position<140?'en':'mixed';
 const pick=a=>a[rnd(a.length)],noun=pick(inventories.nouns),check=pick(inventories.checks),context=pick(inventories.contexts),actor=pick(inventories.names),reviewer=pick(inventories.names.filter(x=>x!==actor)),recipient=pick(inventories.names),file=pick(inventories.files)+'-'+(rnd(9000)+1000)+'.csv',other=pick(inventories.files)+'-'+(rnd(9000)+10000)+'.json',output='audit-'+(rnd(900000)+100000)+'.md',n=rnd(7)+2,time=rnd(35)+11;
 const frame={position,language,family,entities:{actor,reviewer,recipient,file,other,output,noun,context},events:[],relations:[],expressions:[],ambiguity:null,features:new Set(['organization','participant','modality'])};
 const event=(key,predicate,args={},modality='REQUIRED',condition=null)=>{frame.events.push({key,predicate,args,modality,condition});return key;};
 const expr=(key,kind,body)=>{frame.expressions.push({key,kind,...body});return key;};
 const relation=(type,head,tail,attrs={})=>frame.relations.push({type,head,tail,...attrs});
 event('organize',['组织','organize'],{actor,target:'task'});relation('AGENT','organize',actor,{role:'PERFORMER',organization:true});
 if(family!==9&&family!==1){event('check',check,{actor,object:file,location:context});relation('PATIENT','check',file);}
 if(family===0){event('compare',['比较','compare'],{object:other});relation('PATIENT','compare',other);relation('CONJUNCTION','check','compare');frame.features.add('coordination');}
 if(family===1){frame.features.add('passive');event('read',['读取','read'],{object:file});event('inspect',['查看','inspect'],{object:other},'PERMITTED');frame.features.add('coordination');}
 if(family===2){const gate=expr('approval','APPROVAL',{actor:reviewer,object:'request'});Object.assign(frame.events.find(e=>e.key==='check'),{condition:gate,modality:'PERMITTED'});relation('APPROVAL_OF',reviewer,'request');frame.features.add('condition');}
 if(family===3){const condition=expr('difference','STATE',{object:file,state:'differences_exist'});event('produce',['生成','create'],{object:output},'REQUIRED',condition);event('exemption',['生成','create'],{object:output},'NOT_REQUIRED',expr('no-difference','NOT',{operand:condition}));frame.features.add('condition');}
 if(family===4){expr('budget','QUANTITY',{metric:'attempt_count',target:'check',operator:'LTE',value:n,unit:'attempt'});const done=expr('done','AND',{operands:[expr('success','QUANTIFIED_STATE',{target:'check',operator:'GTE',value:n-1,state:'success'}),expr('exists','STATE',{object:output,state:'exists'})]});relation('COMPLETION_OF',done,'task');frame.features.add('condition');frame.features.add('quantity');}
 if(family===5){event('content',['包含','contain'],{object:['风险','验证步骤']},'REQUIRED');relation('PART_OF','content',output,{domain:'OUTPUT_CONTENT'});frame.features.add('content');frame.features.add('quantity');frame.features.add('coordination');}
 if(family===6){event('review',['复核','review'],{actor:reviewer,object:output});event('send',['提交','send'],{actor,object:output,recipient});relation('RECIPIENT','send',recipient);relation('NEGATIVE_ROLE',recipient,'APPROVER');frame.features.add('coreference');frame.features.add('coordination');}
 if(family===7){expr('scope','EXCEPT',{base:context,excluded:['生产环境','production environment']});relation('RESTRICTS','check','scope');frame.features.add('scope');frame.features.add('coreference');frame.features.add('passive');}
 if(family===8){event('modify',['修改','modify'],{object:file},'FORBIDDEN');event('restore',['恢复','recover'],{object:noun},'FORBIDDEN');frame.features.add('passive');frame.features.add('coordination');}
 if(family!==3&&family!==9)event('produce',['形成','deliver'],{object:output});
 if([0,1,2,4,6,7,8].includes(family)){expr('time','QUANTITY',{target:'task',metric:'duration',operator:'LTE',value:time,unit:'minute'});relation('LIMIT','task','time');frame.features.add('quantity');}
 if([0,1,2,4,7,8].includes(family)){event('send',['提交','send'],{object:output,recipient});frame.features.add('coreference');}
 if(family===9){frame.features.add('ambiguity');frame.features.add('coreference');frame.features.add('condition');const variant=Math.floor(position/10)%3;
  if(variant===0){event('read',['读取','read'],{objects:[file,other]});event('review',['复核','review'],{object:'UNKNOWN_REFERENT'});frame.ambiguity={type:'UNRESOLVED_COREFERENCE',referent:'report',alternatives:[file,other],reason:'No unique source antecedent'};}
  else if(variant===1){event('check',check,{object:file});relation('BASIS','task','POLICY-'+(rnd(100)+40));frame.ambiguity={type:'UNRESOLVED_RELATION',referent:'basis_version',alternatives:['v'+n+'.1','v'+n+'.2'],reason:'Source leaves applicable version unspecified'};}
  else{event('read',['读取','read'],{object:file},'PERMITTED','UNRESOLVED_APPROVAL');frame.ambiguity={type:'UNRESOLVED_SCOPE',referent:'approval_connector',alternatives:[{op:'ANY',actors:[actor,reviewer]},{op:'ALL',actors:[actor,reviewer]}],reason:'Source explicitly leaves joint versus individual approval unspecified'};}
 }
 frame.n=n;frame.time=time;frame.features=[...frame.features];return frame;
}
export function realize(frame,seed){
 const rnd=random(seed+':realize:'+frame.position),e=frame.entities,l=frame.language==='en'?1:0,mixed=frame.language==='mixed',verb=frame.events.find(x=>x.key==='check')?.predicate??['核查','inspect'],f=frame.family;
 const noun=e.noun[l],env=e.context[l],review= mixed?'review':'复核',send=mixed?'send':'提交';
 let source=l?`${e.actor} must coordinate the task: ${verb[1]} ${e.file} in ${env}.`:`本任务由 ${e.actor} 负责组织：${mixed?verb[1]:verb[0]} ${env} 中的 ${e.file}。`;
 const output=l?`Deliver ${e.output}.`:`形成 ${e.output}。`,time=l?`The whole task must finish within ${frame.time} minutes.`:`整个任务须在 ${frame.time} 分钟内完成。`;
 if(f===0)source+=l?` Compare ${e.other} as well.`:`并比较 ${e.other}。`;
 if(f===1)source=l?`${e.actor} must arrange that ${e.file} is read and ${e.other} may be inspected in ${env}.`:`由 ${e.actor} 组织，${e.file} 必须被读取，${e.other} 可以被查看；执行环境为 ${env}。`;
 if(f===2)source=l?`${e.actor} must organize the task. Only after ${e.reviewer} approves the request may ${verb[1]} ${e.file} in ${env} begin.`:`由 ${e.actor} 组织。只有 ${e.reviewer} 批准请求后，才允许${verb[0]} ${env} 中的 ${e.file}。`;
 if(f===3)source+=l?` If differences exist in ${e.file}, create ${e.output}; otherwise ${e.output} need not be created.`:`若 ${e.file} 存在差异，必须生成 ${e.output}；否则无需生成 ${e.output}。`;
 if(f===4)source+=l?` Attempt the check at most ${frame.n} times. Completion requires at least ${frame.n-1} successful checks and existence of the report.`:`检查最多尝试 ${frame.n} 次；至少 ${frame.n-1} 次检查成功且报告已存在时才完成。`;
 if(f!==3&&f!==9)source+=' '+output;
 if(f===5)source+=l?' The document must contain sections “Risks” and “Verification steps”.':'文档必须包含“风险”和“验证步骤”两个章节。';
 if(f===6)source+=l?` ${e.reviewer} must review the report; ${e.actor} must send it to ${e.recipient}. ${e.recipient} is not an approver.`:`${e.reviewer} 必须${review}该报告；${e.actor} 必须将该报告${send}给 ${e.recipient}。${e.recipient} 不负责审批。`;
 if(f===7)source+=l?' The scope is limited to the stated environment; production resources are excluded.':'仅限上述环境，生产环境明确排除在范围外。';
 if(f===8)source+=l?` Neither modification of ${e.file} nor recovery of any ${noun} is allowed.`:`不得修改 ${e.file} 或恢复任何${noun}。`;
 if([0,1,2,4,6,7,8].includes(f))source+=' '+time;
 if([0,1,2,4,7,8].includes(f))source+=l?` Send the final report to ${e.recipient}.`:`将最终报告提交给 ${e.recipient}。`;
 if(f===9){const a=frame.ambiguity; if(a.referent==='report')source=l?`${e.actor} must organize reading ${e.file} and ${e.other}, then review “that report”. The source does not identify which file the report refers to.`:`${e.actor} 组织读取 ${e.file} 和 ${e.other}，随后要求复核“该报告”。原文没有指定该报告指哪份文件。`;
  else if(a.referent==='basis_version'){const b=frame.relations.find(x=>x.type==='BASIS').tail;source=l?`${e.actor} must organize a ${verb[1]} of ${e.file} under ${b} ${a.alternatives.join(' or ')}. The applicable version is not specified.`:`${e.actor} 组织按 ${b} ${a.alternatives.join(' 或 ')} ${verb[0]} ${e.file}，未指定采用哪一版本。`;}
  else source=l?`${e.actor} must organize the task. Reading ${e.file} is allowed only after ${e.actor} or ${e.reviewer} approves, but individual versus joint approval is explicitly unspecified.`:`${e.actor} 组织任务。仅在 ${e.actor} 或 ${e.reviewer} 批准后才允许读取 ${e.file}，但没有规定任一批准即可还是必须共同批准。`;
 }
 // Ordering mutation is semantics-preserving because whole-task budget has explicit ownership.
 if(rnd(2)&&[0,1,2,4,6,7,8].includes(f))source=time+' '+source.replace(' '+time,'');
 return source;
}
export function expectedSemantics(frame){return {events:frame.events,relations:frame.relations,expressions:frame.expressions,ambiguity:frame.ambiguity,authority_inference:false};}
export function materialize(implementationSha,generatorSha){
 if(!/^[a-f0-9]{64}$/.test(implementationSha)||!/^[a-f0-9]{64}$/.test(generatorSha))throw Error('REQUIRES_IMPLEMENTATION_AND_GENERATOR_FREEZE');
 const seed=sha256('BOUNDARYXP-025-BLIND-200'+implementationSha+generatorSha);
 return {seed,cases:Array.from({length:200},(_,i)=>{const frame=constructFrame(i,seed);return {id:'BLIND-'+String(i+1).padStart(3,'0'),frame,source:realize(frame,seed),expected:expectedSemantics(frame)};})};
}
