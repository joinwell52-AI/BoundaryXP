import {modifierPhrase} from '../v0.3-7p-composition-014/syntax-mechanisms.mjs';
// A comparison complement supplies alternatives for the reviewed material and
// its normative reference. It never asserts conformance or grants authority.
export function conformanceCandidates(f){
 f.proposals.provider='EXPLICIT_CONFORMANCE_COMPLEMENT_CANDIDATES';
 const ledger=f.semantic_decoding.conformance_candidates=[];
 for(const a of f.analyses){const ts=a.cl.tokens;
  for(const p of ts.filter(t=>/^(符合|conform|conforms|comply|complies)$/iu.test(t.text))){const pi=ts.indexOf(p),owners=a.events.filter(n=>n.metadata.sense==='review'&&ts.findIndex(t=>t.id===n.metadata.token_id)===p.head);
   const args=ts.filter(t=>t.head===pi&&/^(obj|dobj)$/u.test(t.dep??'')),subjects=ts.filter(t=>t.head===pi&&t.dep==='nsubj');
   for(const owner of owners)for(const arg of args){const ranges=[modifierPhrase(a.cl,arg)],srl=(a.cl.srl??[]).filter(fr=>fr.some(r=>r[1]==='PRED'&&r[2]===pi)).flatMap(fr=>fr.filter(r=>r[1]==='ARG1'&&r[2]>pi));for(const r of srl)ranges.push([ts[r[2]].start,ts[r[3]-1].end]);
    for(const [from,to] of ranges){const ref=f.tools.node(a.cl,'REFERENCE',from,to,{sense:'CONFORMANCE_REFERENCE',literal_tag:'REFERENCE',token_id:arg.id,owner:owner.node_id,comparison_mode:'CHECK_CONFORMANCE',authority_inferred:false}),relation=f.tools.relation(a.cl,'CONFORMS_TO',owner,ref,[a.sid,...ref.source_span_ids]);
     relation.generic_evidence??=[];relation.generic_evidence.push({rule:'EXPLICIT_REVIEW_CONFORMANCE_COMPLEMENT',comparison_token_id:p.id,reference_token_id:arg.id,owner_token_id:owner.metadata.token_id,asserts_conformance:false,structural_path:[a.parent_structure_id,a.cl.id,owner.node_id,p.id,arg.id],source_span_ids:relation.evidence_span_ids});
     for(const subject of subjects){const domain=new Set([ts.indexOf(subject)]);for(let size=-1;size!==domain.size;){size=domain.size;ts.forEach((t,i)=>{if(domain.has(t.head)&&/^(nmod(?::.*)?|compound(?::.*)?|case|det|amod|acl)$/u.test(t.dep??''))domain.add(i);});}const [start,end]=modifierPhrase(a.cl,subject),object=f.tools.node(a.cl,'ENTITY',Math.min(start,...[...domain].map(i=>ts[i].start)),end,{sense:'CONFORMANCE_CHECK_OBJECT',owner:owner.node_id,token_id:subject.id,syntax_token_ids:[...domain].map(i=>ts[i].id)}),use=f.tools.relation(a.cl,'PATIENT',owner,object,[a.sid,...object.source_span_ids,...ref.source_span_ids]);use.generic_evidence??=[];use.generic_evidence.push({rule:'CONFORMANCE_REVIEWED_SUBJECT_CANDIDATE',dependency_relation_ids:[relation.relation_id],source_span_ids:use.evidence_span_ids});use.dependency_relation_ids=[relation.relation_id];}
     ledger.push({event_node_id:owner.node_id,reference_node_id:ref.node_id,relation_id:relation.relation_id,comparison_token_id:p.id,source_span_ids:relation.evidence_span_ids});
    }
   }
  }
 }
 return f;
}
