import {init,killThreads} from 'z3-solver';
import net from 'node:net';import http from 'node:http';import https from 'node:https';import tls from 'node:tls';
// This worker has no network role, even when its host is online.
const noNetwork=()=>{throw Error('KERNEL_NETWORK_FORBIDDEN');};
net.connect=noNetwork;net.createConnection=noNetwork;http.request=noNetwork;http.get=noNetwork;https.request=noNetwork;https.get=noNetwork;tls.connect=noNetwork;globalThis.fetch=noNetwork;
process.once('message',async({problem,budget})=>{
 let api;
 try{
  api=await init();api.setParam('memory_max_size',budget.memoryMb);const ctx=new api.Context('boundx'),solver=new ctx.Solver();solver.set('timeout',budget.solverMs);
  const vars=Object.fromEntries(Object.entries(problem.declarations).map(([id,d])=>[id,ctx[d.sort].const(id)]));
  const compile=t=>{
   if(t.op==='var')return vars[t.name];
   if(t.op==='const')return ctx[t.sort].val(t.value);
   const a=t.args.map(compile);
   switch(t.op){
    case 'and':return ctx.And(...a);case 'or':return ctx.Or(...a);case 'not':return ctx.Not(a[0]);
    case 'eq':return a[0].eq(a[1]);case 'lt':return a[0].lt(a[1]);case 'le':return a[0].le(a[1]);case 'gt':return a[0].gt(a[1]);case 'ge':return a[0].ge(a[1]);
    case 'add':return a.length?a.slice(1).reduce((v,b)=>v.add(b),a[0]):ctx[t.sort].val(0);
    case 'ite':return ctx.If(...a);default:throw Error('BACKEND_AST_OPERATOR:'+t.op);
   }
  };
  for(let i=0;i<problem.assertions.length;i++)solver.addAndTrack(compile(problem.assertions[i].formula),'a'+i);
  const smtlib=solver.toSmtlib2().replace('(check-sat)','(check-sat-assuming ('+problem.assertions.map((_,i)=>'a'+i).join(' ')+'))'),status=await solver.check(),model={};let conflict_core=[];
  if(status==='sat'){const m=solver.model();for(const [id,v]of Object.entries(vars)){const x=m.eval(v,true);model[id]=problem.declarations[id].sort==='Bool'?ctx.isTrue(x):x.asString();}}
  if(status==='unsat')conflict_core=[...solver.unsatCore()].map(x=>problem.assertions[Number(String(x).slice(1))]?.id);
  const result={result:status.toUpperCase(),model:status==='sat'?model:null,conflict_core,verification:'BACKEND_RESULT',smtlib,assertion_map:problem.assertions.map((x,i)=>({name:'a'+i,id:x.id,source_id:x.source_id??null})),reason:status==='unknown'?solver.reasonUnknown():null,backend:{name:'z3-solver',version:'5.2.0',local:true,offline:true,budget}};
  await killThreads(api.em);process.send(result,()=>{process.disconnect();process.exit(0);});
 }catch(e){if(api)await killThreads(api.em).catch(()=>{});process.send({result:'UNKNOWN',verification:'FAILED',reason:/memory|allocation/i.test(e.message)?'RESOURCE_LIMIT_MEMORY':e.message,backend_error:true},()=>{process.disconnect();process.exit(1);});}
});
