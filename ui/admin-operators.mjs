import {pointLength, pointSlice, pointIndex, pointMatches} from './codepoints.mjs';
// Controlled grammar: operator data is separate from the composition engine.
// This is a candidate interpretation, never an authorization decision.
export const operatorGrammar = Object.freeze({
 version:'1.0.0',
 modalities:[
  ['FORBID',/^(?:不得|禁止|严禁|must not\b|shall not\b|do not\b)\s*/i],
  ['NOT_REQUIRED',/^(?:不必|无需|need not\b|do not have to\b)\s*/i],
  ['REQUIRE',/^(?:必须|务必|must\b|shall\b)\s*/i]
 ],
 conditions:[
  ['NOT',/^未经\s*(.+?)\s*授权\s*[,，]\s*/u],
  ['approval',/^经\s*(.+?)\s*授权\s*[,，]\s*/u],
  ['NOT',/^without authorization from\s+(.+?)\s*,\s*/i],
  ['approval',/^with authorization from\s+(.+?)\s*,\s*/i]
 ]
});

const key=node=>JSON.stringify(node);
function combine(op,left,right){
 const args=[left,right].flatMap(n=>n.op===op?n.args:[n]);
 return {op,args}; // associative normalization; no unlicensed distributive expansion
}

// Chart-style enumeration over an explicit coordination grammar. No assumed
// AND/OR precedence. Parentheses constrain composition. At most 6 atoms.
export function parseAuthority(source){
 const tokens=source.split(/(\band\b|\bor\b|和|且|或|[()（）])/iu).map(t=>t.trim()).filter(Boolean);
 if(!tokens.length||tokens.length>31||tokens.filter(t=>! /^(?:and|or|和|且|或|[()（）])$/iu.test(t)).length>6)return [];
 let cursor=0;
 function group(nested=false){
  const terms=[],ops=[];
  while(cursor<tokens.length){
   let value,t=tokens[cursor++];
   if(/^[（(]$/.test(t))value=group(true);
   else if(/^[\p{L}\p{N}_-]+$/u.test(t)&&! /^(and|or)$/i.test(t))value=[{op:'authority',name:t}];
   else return [];
   if(!value.length)return [];
   terms.push(value);
   if(cursor===tokens.length){if(nested)return [];break;}
   t=tokens[cursor++];
   if(/^[）)]$/.test(t)){if(!nested)return [];nested=false;break;}
   const op=/^(and|和|且)$/i.test(t)?'AND':/^(or|或)$/i.test(t)?'OR':null;
   if(!op)return [];
   ops.push(op);
  }
  if(nested||terms.length!==ops.length+1)return [];
  const memo=new Map();
  function span(a,b){
   if(a===b)return terms[a];
   const id=`${a}:${b}`;if(memo.has(id))return memo.get(id);
   const results=new Map();
   for(let i=a;i<b;i++)for(const l of span(a,i))for(const r of span(i+1,b)){
    const n=combine(ops[i],l,r);results.set(key(n),n);
   }
   const out=[...results.values()];memo.set(id,out);return out;
  }
  return span(0,terms.length-1);
 }
 const result=group();return cursor===tokens.length?result:[];
}

export function formatAuthority(node){
 return node.op==='authority'?node.name:`(${node.args.map(formatAuthority).join(node.op==='AND'?' AND ':' OR ')})`;
}

function interpret(raw){
 let rest=raw.trim(),conditions=[{op:'unconditional'}];
 for(const [op,pattern] of operatorGrammar.conditions){
  const m=pattern.exec(rest);if(!m)continue;
  const trees=parseAuthority(m[1]);if(!trees.length)return null;
  conditions=trees.map(authorities=>{
   const approval={op:'approval',authorities};
   return op==='NOT'?{op:'NOT',arg:approval}:approval;
  });
  rest=rest.slice(m[0].length);break;
 }
 // Longest matching operator wins ("do not have to" precedes "do not").
 const matches=operatorGrammar.modalities.map(([modality,p])=>({modality,match:p.exec(rest)})).filter(x=>x.match).sort((a,b)=>pointLength(b.match[0])-pointLength(a.match[0]));
 if(!matches.length)return null;
 const {modality,match}=matches[0],action=rest.slice(match[0].length).trim();
 // Keep the whole predicate as an opaque atom. Unsupported nested operators,
 // clause boundaries, quotes and unresolved punctuation cannot become facts.
 if(!action||/[,，:：!?！？“”"「」]|\b(?:unless|except|if|but|not|must|shall)\b|不得|必须|未经|除非|否则|不必|并非/i.test(action))return null;
 return conditions.map(condition=>({condition,modality,action,actor:null,task:null,authorizationDecision:null}));
}

function finding(rule,entry,title,why,suggestion,enTitle,enSuggestion){
 return {key:`structure:${rule}:${entry.start}`,rule,fields:['A','B','P'],status:'possible-ambiguity',
  quote:entry.quote,source_quote:entry.quote,start:entry.start,end:entry.end,title,why,suggestion,
  en:{title:enTitle,suggestion:enSuggestion}};
}

export function checkOperatorText(text){
 if(typeof text!=='string'||pointLength(text)>100000)throw Error('Expected task text of at most 100000 characters');
 const statements=[],findings=[];
 for(const m of pointMatches(text, /[^。！？；;\n.!?]+/gu)){
  const quote=m[0].trim();if(!quote)continue;
  const start=m.index+m[0].indexOf(quote),candidates=interpret(quote);
  const entry={quote,start,end:start+pointLength(quote),status:candidates?'candidate':'uncovered',candidates:candidates??[]};
  statements.push(entry);
  if(candidates?.length>1){
   const alternatives=candidates.map(c=>formatAuthority((c.condition.op==='NOT'?c.condition.arg:c.condition).authorities));
   findings.push({...finding('coordination-scope',entry,'明确授权者的组合关系',`存在不同组合：${alternatives.join('；')}。它们可能要求不同的授权。`,
    '请用括号明确授权者分组，并写明“全部授权”或“任一授权”；该条件只约束原句动作，不产生新的执行权限。',
    'Clarify the authorization grouping',`Possible groupings: ${alternatives.join('; ')}. Use parentheses and specify all versus any approvals. This does not grant permission.`),alternatives});
  }
 }
 // Exact scoped REQUIRE/FORBID pairs only. Opaque action equivalence is never
 // guessed. Different conditions and ambiguous candidates are not collapsed.
 const groups=new Map();
 for(const entry of statements){
  if(entry.candidates.length!==1)continue;
  const c=entry.candidates[0],id=key([c.condition,c.action]);
  const group=groups.get(id)??[];
  const other=group.find(e=>new Set([c.modality,e.candidates[0].modality]).size===2&&[c.modality,e.candidates[0].modality].every(v=>['REQUIRE','FORBID'].includes(v)));
  if(other){
   findings.push({...finding('constraint-collision',entry,'核对同一动作的必须与禁止要求',`本句与“${other.quote}”具有相同的已解析条件和动作，却分别要求执行和禁止。执行者或适用范围仍需核对。`,
    '请说明两条要求是否适用于不同执行者或范围；如果适用于同一事项，请由 ADMIN 修改其中一条要求或明确例外，工具不会自行删除禁止项。',
    'Review required versus forbidden action',`This overlaps with “${other.quote}” under the same parsed condition and action. Clarify actor or scope differences, or have ADMIN revise the requirements; no prohibition is removed automatically.`),
    evidence:[other,entry].map(e=>({quote:e.quote,start:e.start,end:e.end})),witness:{assumption:'same actor, task and scope',action:c.action,condition:c.condition,required:true,forbidden:true}});
  }
  group.push(entry);groups.set(id,group);
 }
 return {grammarVersion:operatorGrammar.version,statements,findings,
  coverage:{candidate:statements.filter(s=>s.status==='candidate').length,uncovered:statements.filter(s=>s.status==='uncovered').length},
  limitation:'Finite controlled grammar, opaque action atoms, unbound actor/task. Candidates are not verified intent or authorization. No model, probabilities or general semantic proof.'};
}
