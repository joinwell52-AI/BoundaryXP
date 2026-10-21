// Shared finite senses. All indices and source surfaces remain original.
export const PREDICATE_WORDS={read:['读取','查看','read','reads'],review:['检查','核查','核对','核验','复核','审查','审阅','inspect','inspects','check','checks','review','reviews','reviewed','verify'],generate:['生成','编写','创建','输出','generate','create','write','writes','created','written','generated'],send:['提交','交给','发送','send','sends','submit','submits','sent','submitted'],report:['汇报','上报','报告','report','reports'],receive:['收到','接收','receive','received'],complete:['完成','结束','complete','completed','finished'],confirm:['确认','confirm','confirms','confirmed'],compare:['比较','对比','compare'],clear:['清空','清理','clear'],rewrite:['重写','rewrite'],recalculate:['重新计算','重算','recalculate']};
// Source-preserving result creation; no artifact names or slot answers.
PREDICATE_WORDS.review.push('审计','audit','audits');
// Nominal action complements retain their source form; this is a finite
// lexical sense, not authorization to execute a noun appearing in prose.
PREDICATE_WORDS.review.push('inspection','inspections');
PREDICATE_WORDS.start=['启动','start','starts','launch','launches'];
PREDICATE_WORDS.restore=['恢复','resume','resumes','restore','restores'];
PREDICATE_WORDS.generate.push('形成','交付','form','forms','produce','produces','deliver','delivers');
PREDICATE_WORDS.explain=['说明','解释','explain','explains'];
PREDICATE_WORDS.generate.push('creates','produced');
PREDICATE_WORDS.generate.push('creation');
// Finite reusable action senses; realization still requires a source-owned
// predicate/complement and never a substring inside a name or quoted text.
PREDICATE_WORDS.review.push('评审','排查','核验');
PREDICATE_WORDS.probe=['探测','probe','probes'];
PREDICATE_WORDS.trigger=['触发','trigger','triggers'];
PREDICATE_WORDS.query=['查询','query','queries'];
PREDICATE_WORDS.supplement=['补测','supplement'];
PREDICATE_WORDS.choose=['选择','choose','select'];
PREDICATE_WORDS.guess=['猜测','猜','guess'];
PREDICATE_WORDS.retry=['重试','retry','retried'];
PREDICATE_WORDS.aggregate=['汇总','汇合','aggregate'];
const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
export function sensePattern(senses){return '(?:'+senses.flatMap(s=>PREDICATE_WORDS[s]??[]).sort((a,b)=>b.length-a.length).map(w=>/^[a-z]/iu.test(w)?'\\b'+escape(w)+'\\b':escape(w)).join('|')+')';}
export function predicates(text,senses=Object.keys(PREDICATE_WORDS)){const map=new Map(senses.flatMap(s=>(PREDICATE_WORDS[s]??[]).map(w=>[w.toLowerCase(),s])));return [...text.matchAll(new RegExp(sensePattern(senses),'giu'))].map(m=>({sense:map.get(m[0].toLowerCase()),surface:m[0],index:m.index,end:m.index+m[0].length,start_cp:[...text.slice(0,m.index)].length,end_cp:[...text.slice(0,m.index+m[0].length)].length}));}
export function installLexicalContract(f){f.semantic_decoding.predicate_normalization_ir={version:'SOURCE_PRESERVING_SENSES_025',mentions:f.analyses.flatMap(a=>predicates(a.cl.span.quote).filter(p=>!f.nlp_signals.literals.some(l=>l.span.start<=a.cl.span.start+p.start_cp&&l.span.end>=a.cl.span.start+p.end_cp)).map(p=>({...p,clause_id:a.cl.id,start:a.cl.span.start+p.start_cp,end:a.cl.span.start+p.end_cp,source_span_ids:[a.sid]}))),source_rewritten:false,lemma_candidates:[]};
 for(const a of f.analyses)for(const e of a.events){const token=a.cl.tokens.find(t=>t.id===e.metadata.token_id);if(!token||!token.lemma||! /^(VERB|AUX)$/u.test(token.pos??''))continue;const senses=Object.entries(PREDICATE_WORDS).filter(([,words])=>words.includes(token.lemma.toLowerCase())).map(([sense])=>sense);if(senses.length!==1||e.metadata.sense!=='SOURCE_EVENT')continue;const prior=e.metadata.sense;e.metadata.sense=senses[0];e.normalized=senses[0];e.metadata.sense_evidence={rule:'FINITE_LEMMA_AT_EXISTING_PREDICATE_USE_SITE',token_id:token.id,lemma:token.lemma,source_span_ids:e.source_span_ids};f.semantic_decoding.predicate_normalization_ir.lemma_candidates.push({node_id:e.node_id,prior_sense:prior,sense:senses[0],...e.metadata.sense_evidence});}
 return f;}
