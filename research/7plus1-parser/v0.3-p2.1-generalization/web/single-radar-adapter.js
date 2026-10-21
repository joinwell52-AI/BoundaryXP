// 只读视图适配；不重分类、不补条款、不改变保存结果。
export function displayNode(node) {
  if (!node || node.result || !node.saved_display) return node;
  const saved=node.saved_display;
  return {...node,...saved.source,result:{boundary:saved.boundary,review:saved.review},display_only:true};
}
export function singleRadarInput(plan, node) {
  if (!['SINGLE','TREE'].includes(plan?.mode)) throw new Error('UNKNOWN_TASK_MODE');
  node=displayNode(node);
  const result = node?.result??{boundary:{clauses:[]}};
  return JSON.parse(JSON.stringify({
    mode: 'single', task_id: node?.id??'empty', task_label: node?.label??'未选任务',
    result_ref: {id: node?.result_key, version: node?.version, sha256: result.input_sha256,historical_display:!!node?.display_only},
    source_ref: {task_id: node?.id, version: node?.version},
    clauses: result.boundary.clauses,
    math_analysis: Array.isArray(result.proposal?.math_analysis) ? result.proposal.math_analysis : [],
    issues: {source: result.boundary.issues ?? [], uncertainties: result.boundary.uncertainties ?? [], review: result.review?.issues ?? []},
    record_status: {status: node?.status, review: result.review}
  }));
}

// 父子图只合并显示已有条款，引用保留节点身份；状态由原界面提供。
export function treeRadarInput(plan, node, {comparison, visible, statuses, labels}) {
  const nodes = node ? [node] : plan.nodes;
  const ancestors = [];
  if (node && comparison) {
    let parent = plan.nodes.find(n=>n.id===node.parent_id);
    while(parent && !ancestors.some(n=>n.id===parent.id)) {
      ancestors.push(parent); parent=plan.nodes.find(n=>n.id===parent.parent_id);
    }
  }
  const selected = [...ancestors, ...nodes].map(displayNode).filter(n=>n.result && visible[n.id]!==false);
  const rootIds=new Set(plan.nodes.filter(n=>!n.parent_id).map(n=>n.id));
  const clauses=selected.flatMap(n=>n.result.boundary.clauses.map(c=>({...c,
    id:n.id+':'+c.id, display_id:c.id, node_id:n.id, node_label:n.label,
    layer:comparison&&(ancestors.some(a=>a.id===n.id)||!node&&rootIds.has(n.id))?'parent':'current'
  })));
  return JSON.parse(JSON.stringify({mode:'single',task_id:node?.id??'combo',
    task_label:node?.label??'父子任务总览',clauses,
    result_ref:{project_id:plan.project_id,revision:plan.revision,comparison_stale:plan.comparison_stale,
      nodes:selected.map(n=>({id:n.id,version:n.version,result_key:n.result_key}))},
    display_context:{tree:true,comparison,title:comparison?(node?'父子比较':'组合比较'):'本任务边界',
      statuses,labels},source_ref:{nodes:selected.map(n=>({id:n.id,version:n.version}))}
  }));
}
