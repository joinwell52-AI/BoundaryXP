import fs from 'node:fs';
const root='research/7plus1-parser/v0.3-7p-repair-001/';
function edit(file,from,to){const p=root+file,s=fs.readFileSync(p,'utf8');if(!s.includes(from))throw Error(file+' replacement not found');fs.writeFileSync(p,s.replaceAll(from,to));}
edit('engine.mjs','v0.3-p2.2-scope-consistency-repair','v0.3-7p-repair-001');
edit('engine.mjs',"compiler_version:'0.3-p2.2-scope-consistency-repair'","compiler_version:'0.3-7p-repair-001'");
edit('grammar.mjs','件|分钟|小时|秒','件|天|日|分钟|小时|秒');
edit('expressions.mjs','件|分钟|小时|秒','件|天|日|分钟|小时|秒');
edit('expressions.mjs','分钟|小时|秒|minutes?','天|日|days?|分钟|小时|秒|minutes?');
edit('eligibility.mjs','const decisions=[],plans=[],nmap=', 'const decisions=[],plans=[],nmap=');
edit('eligibility.mjs',"decisions.push(e);plans.push({",`const domain=relations.map(r=>f.analyses.find(a=>a.cl.id===r.clause_id)?.discourse).find(s=>s&&!boundaryDomain(s));
 if(domain){e.disposition='OUTSIDE_ENVELOPE';e.reason_code='OUTSIDE_BOUNDARY_ENVELOPE';delete e.proposed_fact_type;decisions.push(e);return;}
 decisions.push(e);plans.push({`);
edit('eligibility.mjs',"&&(['ROLE','PERSON'].includes(tail.metadata.literal_tag)||tail.metadata.participant_roles?.length)","&&tail.metadata.participant_eligibility?.eligible");
edit('eligibility.mjs',"&&tail.metadata.participant_roles?.length)propose", "&&tail.metadata.participant_eligibility?.eligible&&tail.metadata.participant_roles?.length)propose");
edit('eligibility.mjs',"if(r.relation_type==='LIMIT')propose(head.node_type==='STATE'||head.metadata.modality==='NOT_REQUIRED'?'AUX_QUANTITY':'RESOURCE',[r],[head.node_id,tail.node_id],{predicate_node_id:head.node_id,object_node_ids:[tail.node_id],quantity_expr_id:p.quantity_expr_id});",`if(r.relation_type==='LIMIT'){const q=classifyQuantity(f,tail,head);tail.metadata.quantity_classification=q;(f.semantic_decoding.quantity_eligibility??=[]).push({node_id:tail.node_id,...q});propose(!q.resource_eligible||head.metadata.modality==='NOT_REQUIRED'?'AUX_QUANTITY':'RESOURCE',[r],[head.node_id,tail.node_id],{predicate_node_id:head.node_id,object_node_ids:[tail.node_id],quantity_expr_id:p.quantity_expr_id});}`);
edit('eligibility.mjs',"for(const event of info.events){const rs=", "for(const event of info.events){if(!boundaryDomain(info.discourse)){propose('ACTION',f.relations.filter(r=>r.head_node_id===event.node_id),[event.node_id]);continue;}const rs=");
edit('eligibility.mjs',"if(!info.handled){const u=", "if(!info.handled&&boundaryDomain(info.discourse)){const u=");
edit('coreference.mjs',"domain.filter(n=>section(n)===section(old))", "domain.filter(n=>section(n)===section(old)&&n.metadata.discourse?.kind===old.metadata.discourse?.kind)");
console.log('implementation edits complete');
