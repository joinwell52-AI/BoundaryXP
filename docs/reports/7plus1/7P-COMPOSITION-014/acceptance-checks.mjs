import {checks as previous} from './non-gold-checks.mjs';
export function checks(x,r){
 if(!x.new_in_012)return previous(x,r);
 const c=r.compiler_v03,nm=new Map(c.semantic_nodes.map(n=>[n.node_id,n])),facts=c.boundary_ir.facts,owners=c.nlp_signals.semantic_decoding.semantic_ownership;
 const out=[],add=(check,pass,evidence)=>out.push({check,pass:!!pass,evidence});
 add('contract gate',r.contract_gate_results.status==='PASS',r.contract_gate_results);
 add('exact provenance',r.source_spans.every(s=>[...x.text].slice(s.start,s.end).join('')===s.text),null);
 const root=f=>!f.fact_type.startsWith('AUX_'),byType=t=>facts.filter(f=>f.fact_type===t),obj=(f,s)=>f.object_node_ids?.some(i=>nm.get(i)?.surface===s);
 switch(x.expected_mechanism_contract){
 case 'BASIS':add('explicit basis retained',byType('BASELINE').some(f=>f.state==='RESOLVED'&&obj(f,x.target)),byType('BASELINE'));add('basis is not I',!byType('TASK_OBJECT').some(f=>obj(f,x.target)),null);add('acceptance not execution',!byType('ACTION').length,byType('ACTION'));break;
 case 'NO_EXECUTION':add('acceptance explanation not A',!byType('ACTION').length,byType('ACTION'));break;
 case 'COMPLETION':add('acceptance C retained',byType('COMPLETION').some(f=>f.state==='RESOLVED'&&f.condition_expr_id),byType('COMPLETION'));break;
 case 'PARENTHETICAL_FORBID':add('outer forbid retained',byType('FORBID').some(f=>f.state==='RESOLVED'&&nm.get(f.predicate_node_id)?.surface==='删除'),byType('FORBID'));add('explanation not prohibition',!facts.some(f=>root(f)&&nm.get(f.predicate_node_id)?.surface==='保存'),null);break;
 case 'NO_ARTIFACT_ROLE':add('artifact mention not I/O',!facts.some(f=>['TASK_OBJECT','DELIVERABLE'].includes(f.fact_type)&&obj(f,x.target)),facts);break;
 case 'OWNED_CONSTRAINT':{const local=owners.records.filter(o=>o.owner_category==='OUTPUT_CONTENT');add('constraint remains output-owned',local.some(o=>o.owner_output_ids.length)&&!byType('FORBID').length,local);break;}
 case 'AMBIGUOUS_OWNER':add('conflicting owner unresolved',owners.records.some(o=>o.owner_category==='OUTPUT_CONTENT'&&o.status==='AMBIGUOUS')&&c.unresolved.some(u=>u.kind==='UNRESOLVED_SCOPE')&&!byType('FORBID').length,owners.records.filter(o=>o.owner_category==='OUTPUT_CONTENT'));break;
 case 'NO_BASIS':add('background mention not root V',!byType('BASELINE').length,byType('BASELINE'));break;
 case 'CONSTRAINT':add('explicit acceptance constraint retained',byType('FORBID').some(f=>f.state==='RESOLVED'&&nm.get(f.predicate_node_id)?.surface===x.target),byType('FORBID'));add('prohibition not A',!byType('ACTION').length,null);break;
 default:throw Error('UNDECLARED_MECHANISM');
 }
 return out;
}
