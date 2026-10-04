export function findPrerequisitePath(edges, from, to) {
  const neighbours = new Map();
  for (const edge of edges.filter(item => item.kind === 'prerequisite')) {
    if (!neighbours.has(edge.from)) neighbours.set(edge.from, []);
    neighbours.get(edge.from).push(edge);
  }
  for (const outgoing of neighbours.values()) outgoing.sort((left, right) =>
    left.to < right.to ? -1 : left.to > right.to ? 1 : left.id < right.id ? -1 : left.id > right.id ? 1 : 0);
  const visited = new Set([from]);
  const parent = new Map();
  const queue = [from];
  for (let index = 0; index < queue.length; index++) {
    for (const edge of neighbours.get(queue[index]) ?? []) {
      if (edge.to === to) {
        const nodes = [edge.to];
        const edgeIds = [edge.id];
        let node = queue[index];
        while (node !== from) {
          nodes.push(node);
          const previous = parent.get(node);
          edgeIds.push(previous.id);
          node = previous.from;
        }
        nodes.push(from);
        return { from, to, reachable: true, nodes: nodes.reverse(), edge_ids: edgeIds.reverse() };
      }
      if (visited.has(edge.to)) continue;
      visited.add(edge.to);
      parent.set(edge.to, edge);
      queue.push(edge.to);
    }
  }
  return { from, to, reachable: false, nodes: [], edge_ids: [] };
}

export function solveValidatedPrerequisites(edges, reachabilityQueries = []) {
  const required = edges.filter(item => item.kind === 'prerequisite');
  const graph = new Map();
  for (const edge of required) {
    if (!graph.has(edge.from)) graph.set(edge.from, []);
    if (!graph.has(edge.to)) graph.set(edge.to, []);
    graph.get(edge.from).push(edge.to);
  }
  const visiting = new Map();
  const done = new Set();
  const cycles = [];
  const neighbours = new Map([...graph].map(([node, targets]) => [node, [...new Set(targets)].sort()]));
  for (const root of [...graph.keys()].sort()) {
    if (done.has(root)) continue;
    const stack = [{ node: root, next: 0 }];
    visiting.set(root, 0);
    while (stack.length) {
      const frame = stack[stack.length - 1];
      const targets = neighbours.get(frame.node);
      if (frame.next === targets.length) {
        visiting.delete(frame.node);
        done.add(frame.node);
        stack.pop();
        continue;
      }
      const next = targets[frame.next++];
      if (visiting.has(next)) {
        cycles.push([...stack.slice(visiting.get(next)).map(item => item.node), next]);
      } else if (!done.has(next)) {
        visiting.set(next, stack.length);
        stack.push({ node: next, next: 0 });
      }
    }
  }
  const representatives = new Map();
  for (const edge of required) {
    const key = JSON.stringify([edge.from, edge.to]);
    if (!representatives.has(key) || edge.id < representatives.get(key)) representatives.set(key, edge.id);
  }
  const unique = [...new Map(cycles.map(cycle => [JSON.stringify(cycle), cycle])).values()].map(nodes => ({
    nodes, edge_ids: nodes.slice(0, -1).map((node, index) => representatives.get(JSON.stringify([node, nodes[index + 1]]))),
  }));
  const result = { prerequisite_edges: required.length, cycles: unique };
  if (reachabilityQueries.length) result.reachability = reachabilityQueries.map(({ from, to }) =>
    findPrerequisitePath(required, from, to));
  return result;
}
