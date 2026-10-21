import {createHash} from 'node:crypto';
export const hash=x=>createHash('sha256').update(typeof x==='string'||Buffer.isBuffer(x)?x:JSON.stringify(x)).digest('hex');
export function sourceDocument(input,metadata={}){
 const bytes=Buffer.isBuffer(input)?input:Buffer.from(input,'utf8');
 const raw_text=new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(bytes),points=[...raw_text];
 const sha256=hash(bytes),source_id='source:'+sha256;
 const span=(start,end)=>({source_id,start,end,quote:points.slice(start,end).join('')});
 const line_index=[];let start=0;
 for(let i=0;i<points.length;i++)if(points[i]==='\n'){line_index.push({start,end:i+1});start=i+1;}
 if(start<points.length)line_index.push({start,end:points.length});
 const source={source_id,sha256,raw_text,codepoint_length:points.length,language_hint:/\p{Script=Han}/u.test(raw_text)?/[A-Za-z]/u.test(raw_text)?'mixed':'zh-CN':/[A-Za-z]/u.test(raw_text)?'en':'unknown',line_index,document_kind:/^\s*(?:#|[-*] |\||```)/mu.test(raw_text)?'markdown':/^\w+: /mu.test(raw_text)?'yaml-like':'plain',metadata};
 const nodes=[],accountability=[];let fence=null,frontmatter=false;
 for(const [i,l] of line_index.entries()){
  const q=span(l.start,l.end).quote;let type='PARAGRAPH',state='STRUCTURED_TEXT';
  if(i===0&&q.trim()==='---'){frontmatter=true;type='YAML_DELIMITER';}
  else if(frontmatter){type=q.trim()==='---'?'YAML_DELIMITER':'KEY_VALUE';if(q.trim()==='---')frontmatter=false;}
  else if(/^\s*(`{3,}|~{3,})/u.test(q)){const marker=q.trim().slice(0,3);if(!fence)fence=marker;else if(fence===marker)fence=null;type='CODE_FENCE';state='OPAQUE_TEXT';}
  else if(fence){type='CODE_BLOCK';state='OPAQUE_TEXT';}
  else if(/^\s*#{1,6}\s/u.test(q))type='HEADING';
  else if(/^\s*(?:[-*+] |\d+[.)] )/u.test(q))type='LIST_ITEM';
  else if(/^\s*\|/u.test(q))type=/^[\s|:\-]+$/u.test(q)?'TABLE_ALIGNMENT':'TABLE_ROW';
  else if(/^\s*[^:：\r\n]{1,80}[:：]/u.test(q))type='KEY_VALUE';
  const n={id:'structure:'+i,type,source_span:span(l.start,l.end),state,parent:'document'};nodes.push(n);accountability.push({structure_ref:n.id,source_span:n.source_span,state});
  if(type==='TABLE_ROW'){
   const chars=[...q];let a=chars.indexOf('|')+1,col=0;
   for(let k=a;k<chars.length;k++)if(chars[k]==='|'&&chars[k-1]!=='\\'){nodes.push({id:n.id+':cell:'+col++,type:'TABLE_CELL',row_id:n.id,column_index:col-1,parent:n.id,state:'STRUCTURED_TEXT',source_span:span(l.start+a,l.start+k)});a=k+1;}
  }
 }
 for(let i=0;i<nodes.length;i++)if(nodes[i].type==='TABLE_ROW'){const next=nodes.find(n=>n.source_span.start===nodes[i].source_span.end&&n.type==='TABLE_ALIGNMENT');nodes[i].role=next?'HEADER':'BODY';}
 return {source,structure:{nodes,accountability,invariant:'UNKNOWN_STRUCTURE_MUST_NOT_DISAPPEAR'},span};
}
