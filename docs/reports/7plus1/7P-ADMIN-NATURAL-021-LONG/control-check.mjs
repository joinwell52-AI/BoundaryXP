import {checkDevelopment} from '../7P-ADMIN-SHORT-020-LONG/check.mjs';
export function control(c,r){const x=c.expect,g=r.compiler_v03,ns=new Map(g.semantic_nodes.map(n=>[n.node_id,n])),facts=g.boundary_ir.facts,vs=checkDevelopment(c,r),need=(n,b)=>{if(!b)vs.failures.push(n);};
 // A negative non-execution control does not promise a known content owner.
 if(x.allow_owner_unresolved||(c.kind==='NEGATIVE'&&x.no_execution))vs.failures=vs.failures.filter(s=>s!=='no clear-source unresolved');
 if(x.actor)for(const f of facts.filter(f=>f.fact_type==='ACTION'))need('typed actor '+x.actor,f.subject_node_ids.some(i=>ns.get(i)?.surface===x.actor));
 if(x.no_actor)need('no invented subject',!facts.some(f=>f.fact_type==='ACTION'&&f.subject_node_ids.length));
 if(x.no_execution)need('non-execution ownership',!facts.some(f=>['ACTION','FORBID','STOP'].includes(f.fact_type)));
 if(x.action)need('predicate sense '+x.action,facts.some(f=>f.fact_type==='ACTION'&&ns.get(f.predicate_node_id)?.metadata.sense===x.action));
 for(const sense of x.forbid_senses??[])need('forbidden '+sense,facts.some(f=>f.fact_type==='FORBID'&&ns.get(f.predicate_node_id)?.metadata.sense===sense&&f.object_node_ids.some(i=>x.shared_object?ns.get(i)?.surface===x.shared_object:!x.forbid_objects||x.forbid_objects.includes(ns.get(i)?.surface))));
 if(x.no_stop_completion)need('forbidden stop is not C',!facts.some(f=>f.fact_type==='STOP'));
 for(const sense of ['send','review'])if(x['no_guessed_'+(sense==='send'?'transfer':'review')])need('no guessed '+sense,!facts.some(f=>f.state==='RESOLVED'&&f.fact_type==='ACTION'&&ns.get(f.predicate_node_id)?.metadata.sense===sense));
 if(x.no_guessed_object)need('ambiguous object not certified',!facts.some(f=>f.state==='RESOLVED'&&f.fact_type==='ACTION'&&['repair','rewrite'].includes(ns.get(f.predicate_node_id)?.metadata.sense)));
 const content=g.nlp_signals.semantic_decoding.output_content_ir,serialized=JSON.stringify(content??{});
 if(x.owned_content)need('owned content is explicit',content.requirements.some(q=>q.content_text.includes(x.owned_content)&&q.ownership_status==='UNIQUE_OUTPUT'&&q.owner_output_ids.some(i=>ns.get(i)?.surface===x.output)));
 if(x.no_owned_guess)need('no ambiguous output-owner certification',!serialized.includes('UNIQUE_OUTPUT'));
 if(x.no_quote_execution){const ranges=[...c.source.matchAll(/“([^”]*)”|"([^"]*)"/gu)].map(m=>({start:[...c.source.slice(0,m.index+1)].length,end:[...c.source.slice(0,m.index+m[0].length-1)].length}));need('no quoted execution',!facts.some(f=>f.state==='RESOLVED'&&['ACTION','FORBID','STOP'].includes(f.fact_type)&&ns.get(f.predicate_node_id)?.source_span_ids.some(i=>{const s=r.source_spans.find(s=>s.span_id===i);return s&&ranges.some(q=>q.start<=s.start&&s.end<=q.end);})));}
 if(x.transfer)need('resolved object transfer',facts.some(f=>f.state==='RESOLVED'&&f.fact_type==='ACTION'&&ns.get(f.predicate_node_id)?.metadata.sense==='send'&&f.object_node_ids.some(i=>ns.get(i)?.surface===x.transfer)));
 const roles=g.nlp_signals.semantic_decoding.negative_role_declarations??[];
 if(x.negative_role)need('typed negative responsibility',roles.some(xr=>xr.negative_roles.includes(x.negative_role)&&xr.subject_node_id&&ns.has(xr.subject_node_id)));
 if(x.no_negative_role)need('no invented negative responsibility',roles.length===0);
 if(x.no_negative_role_guess)need('no guessed excluded role subject',roles.every(xr=>!xr.subject_node_id)&&g.unresolved.some(u=>/COREFERENCE/u.test(u.kind)));
 if(x.no_literal_predicate)need('literal not predicate',!facts.some(f=>ns.get(f.predicate_node_id)?.surface==='inspect'));
 return {...vs,status:vs.failures.length?'FAIL':'PASS'};
}

