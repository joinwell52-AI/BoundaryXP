import { createHash } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import { validateSourceAccountability } from './source-accountability.mjs';
import { appendTableStructure } from './table-structure.mjs';

export const DOCUMENT_STRUCTURE_INVARIANT = 'INV-DOCUMENT-STRUCTURAL-ACCOUNTABILITY';
const hash = text => createHash('sha256').update(text).digest('hex');

// Minimal Markdown structure only. No predicate, ADR or boundary interpretation.
function construct(text, structure) {
  validateSourceAccountability(text, structure.source_accountability);
  const points = [...text], clauses = structure.source_accountability.clauses;
  const span = (start,end) => ({ source_id:'task',start,end,quote:points.slice(start,end).join('') });
  const nodes = [], diagnostics = [], records = [], clauseNodes = new Map();
  const add = (type,start,end,extra={}) => {
    const n={id:`${type.toLowerCase()}-${start}-${nodes.length}`,type,
      kind:type==='CLAUSE'?'clause':type.toLowerCase(),source_span:span(start,end),...extra}; nodes.push(n); return n;
  };
  const doc=add('DOCUMENT',0,points.length);
  const sections=[],sectionStack=[];
  for(const [i,s] of structure.sections.entries()) {
    while(sectionStack.length && sectionStack.at(-1).level>=s.level)sectionStack.pop();
    const end=structure.sections.slice(i+1).find(n=>n.level<=s.level)?.start??points.length;
    const node=add('SECTION',s.start,end,{heading_span:span(s.start,s.heading_end),_owner:sectionStack.at(-1)?.node.id??doc.id});
    sections.push({node,level:s.level});sectionStack.push({node,level:s.level});
  }
  const sectionAt = at => sections.filter(s=>s.node.source_span.start<=at&&at<s.node.source_span.end).at(-1)?.node.id??doc.id;
  const lines=[];let start=0;
  for(let i=0;i<points.length;i++)if(points[i]==='\n') {lines.push({start,end:i+1,quote:points.slice(start,i+1).join('')});start=i+1;}
  if(start<points.length)lines.push({start,end:points.length,quote:points.slice(start).join('')});
  let stack=[];
  const allItems=[];
  const opaque = clauses.filter(c=>c.state==='DIAGNOSTIC');
  function issue(code,evidence,node) {
    diagnostics.push({code,evidence,node_id:node?.id??null});
    if(node)node.structural_status='UNRESOLVED';
  }
  for(const [index,line] of lines.entries()) {
    if(opaque.some(c=>line.start<c.evidence.end&&line.end>c.evidence.start)) {stack=[];continue;}
    if(/^ {0,3}(?:(?:\*\s*){3,}|(?:-\s*){3,}|(?:_\s*){3,})$/u.test(line.quote.trimEnd())) {stack=[];continue;}
    const match=/^( *)([-+*]|\d+[.)])([ \t]+)([^\r\n]*)(?:\r?\n)?$/u.exec(line.quote);
    if(!match) {
      // Unsupported lazy/indented continuation is explicitly diagnosed, never
      // absorbed into the prior item's argument by proximity.
      if(stack.length && /^ +\S/u.test(line.quote))issue('UNSUPPORTED_LIST_CONTINUATION',span(line.start,line.end),stack.at(-1).list);
      if(/^\t+[-+*]\s/u.test(line.quote))issue('AMBIGUOUS_TAB_LIST_INDENT',span(line.start,line.end));
      stack=[];continue;
    }
    const indent=match[1].length,style=/^\d/u.test(match[2])?'ordered':'unordered';
    while(stack.length&&indent<stack.at(-1).indent)stack.pop();
    if(stack.length&&indent===stack.at(-1).indent&&style!==stack.at(-1).style)stack.pop();
    let frame=stack.at(-1);
    if(!frame||indent!==frame.indent) {
      let owner=sectionAt(line.start),parentClause=null,syntax=null,ambiguous=false;
      if(frame&&indent>frame.indent) {
        if(indent>=frame.contentColumn) owner=frame.item.id;
        else ambiguous=true;
      } else if(indent>0) ambiguous=true;
      if(owner===sectionAt(line.start)&&!ambiguous) {
        const prev=lines[index-1];
        const c=clauses.find(c=>c.evidence.end===line.start&&c.kind==='source_clause'&&c.state!=='DIAGNOSTIC');
        if(prev&&c&&/^ *\S/u.test(prev.quote)&&!/^ *(?:[-+*]|\d+[.)])[ \t]+/u.test(prev.quote)
          &&prev.quote.match(/^ */u)[0].length===indent&&/[：:]\s*$/u.test(c.evidence.quote)) {
          const colon=[...c.evidence.quote].findLastIndex(ch=>ch==='：'||ch===':');
          parentClause=c.id;
          syntax={colon:span(c.evidence.start+colon,c.evidence.start+colon+1),
            marker:span(line.start+indent,line.start+indent+match[2].length),
            rule:'COLON_NEWLINE_LIST_AT_SAME_INDENT'};
        }
      }
      const list=add('LIST',line.start,line.end,{_owner:owner,_parentClause:parentClause,
        _syntax:syntax,indent,style,structural_status:ambiguous?'UNRESOLVED':'UNAMBIGUOUS'});
      if(ambiguous)issue('UNESTABLISHED_INDENT_PARENT',span(line.start,line.end),list);
      frame={list,indent,style,item:null,contentColumn:0};stack.push(frame);
    }
    const contentStart=line.start+indent+match[2].length+match[3].length;
    const contentEnd=contentStart+[...match[4]].length;
    const item=add('LIST_ITEM',line.start,line.end,{_owner:frame.list.id,
      content_span:contentStart<contentEnd?span(contentStart,contentEnd):null,
      marker_span:span(line.start+indent,contentStart),modifier_spans:[],structural_status:'UNAMBIGUOUS'});
    if(!item.content_span)issue('EMPTY_LIST_ITEM',span(line.start,line.end),item);
    // Parenthesized item-local spans are lexical evidence, not semantic qualifiers.
    let tick=false,depth=0,opening=-1;
    for(let i=contentStart;i<contentEnd;i++) {
      if(points[i]==='`')tick=!tick;
      if(tick)continue;
      if(['（','('].includes(points[i])) {if(depth++===0)opening=i;}
      else if(['）',')'].includes(points[i])&&depth>0&&--depth===0)item.modifier_spans.push(span(opening,i+1));
    }
    if(depth)issue('UNCLOSED_ITEM_MODIFIER',item.content_span,item);
    allItems.push(item); frame.item=item;frame.contentColumn=indent+match[2].length+match[3].length;
    for(const active of stack) {
      active.list.source_span=span(active.list.source_span.start,line.end);
      if(active!==frame&&active.item)active.item.source_span=span(active.item.source_span.start,line.end);
    }
    records.push({kind:'list_marker',evidence:item.marker_span,node_id:item.id});
  }
  // Every pre-existing source clause has exactly one direct structural witness.
  // Nested items keep their subtree span; the item's own clause becomes a child,
  // rather than flattening the nested list or duplicating a clause identity.
  for(const c of clauses) {
    const item=allItems.find(n=>isDeepStrictEqual(n.source_span,c.evidence));
    if(item) {item.clause_id=c.id;clauseNodes.set(c.id,item.id);continue;}
    const owner=allItems.filter(n=>n.source_span.start<=c.evidence.start&&n.source_span.end>=c.evidence.end)
      .sort((a,b)=>(a.source_span.end-a.source_span.start)-(b.source_span.end-b.source_span.start))[0]?.id??sectionAt(c.evidence.start);
    const n=add(c.kind==='source_clause'?'PARAGRAPH':'CLAUSE',c.evidence.start,c.evidence.end,{clause_id:c.id,_owner:owner});
    clauseNodes.set(c.id,n.id);
  }
  const byId=new Map(nodes.map(n=>[n.id,n]));
  const edges=[],structural_edges=[];
  for(const n of nodes) {
    if(n===doc)continue;
    const parent=n._parentClause?clauseNodes.get(n._parentClause):n._owner;
    const owner=byId.get(parent);
    const continuation=Boolean(n._parentClause);
    const kind=continuation?'OPEN_COMPLEMENT_LIST':owner.type==='LIST'&&n.type==='LIST_ITEM'?'LIST_ITEM':'CONTAINS';
    const status=n.structural_status==='UNRESOLVED'||owner.structural_status==='UNRESOLVED'?'UNRESOLVED':'UNAMBIGUOUS';
    const edge={id:`ownership-${edges.length}`,parent,child:n.id,kind,status};
    edges.push(edge);
    const relation=(type,from=parent,to=n.id)=>structural_edges.push({id:`structural-${structural_edges.length}`,type,
      parent:from,child:to,status,ownership_edge_id:edge.id,
      source_spans:[structuredClone(owner.source_span),structuredClone(n.source_span)],
      ...(continuation?{syntax_evidence:structuredClone(n._syntax)}:{})});
    relation('direct_child');
    if(owner.source_span.start<=n.source_span.start&&owner.source_span.end>=n.source_span.end)relation('contains');
    if(kind==='LIST_ITEM')relation('list_item_of',n.id,parent);
    if(continuation)relation('structural_continuation');
    delete n._owner;delete n._parentClause;delete n._syntax;
  }
  return { invariant:DOCUMENT_STRUCTURE_INVARIANT,version:'1',source_sha256:hash(text),
    coordinate_system:'unicode_codepoints_half_open',nodes,edges,structural_edges,syntax_records:records,diagnostics,
    clause_witnesses:clauses.map(c=>({clause_id:c.id,node_id:clauseNodes.get(c.id),evidence:c.evidence})),
    edges_contract:'Single-parent ownership projection for the frozen r05 consumer; structural_edges retains all explicit relation types.',
    limits:'Contiguous Markdown lists and indentation only; unsupported continuation is diagnosed. No semantic attachment or authority inference.' };
}

export function buildDocumentTree(text, structure) { return appendTableStructure(text,structure,construct(text,structure)); }

export function validateDocumentStructuralAccountability(text, structure, tree) {
  const expected=buildDocumentTree(text,structure);
  if(!isDeepStrictEqual(tree,expected))throw Error(`${DOCUMENT_STRUCTURE_INVARIANT}:STRUCTURE_OR_PROVENANCE_MISMATCH`);
  return { invariant:DOCUMENT_STRUCTURE_INVARIANT,status:'PASS',nodes:tree.nodes.length,structural_edges:tree.structural_edges.length,
    source_clauses:tree.clause_witnesses.length,diagnostics:tree.diagnostics.length,
    limitation:'Preserves the declared bounded markup grammar; does not prove full Markdown or semantic completeness.' };
}
