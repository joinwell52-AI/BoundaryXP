import { referenceOf } from './registry.mjs';
import { containsLexicalTerm } from './lexical.mjs';

export function retrieveDomainContext(source, pack) {
  const reference = referenceOf(pack), entries = [];
  const words = entry => [...(Array.isArray(entry.aliases) ? entry.aliases : Object.values(entry.aliases ?? {}).flat()), ...(entry.assertions ?? []),
    ...(typeof entry.label === 'string' ? [entry.label] : Object.values(entry.label ?? {}))];
  const add = (kind, entry, matched_by) => entries.push({ reference: { ...reference, entry_id: entry.id, kind }, kind,
    entry, retrieval: { matched_by, candidate_only: true } });
  const actions = pack.payloads.actions.frames.filter(frame => [...frame.triggers.zh, ...frame.triggers.en].some(term => containsLexicalTerm(source, term)));
  for (const entry of actions) add('action', entry, 'literal_trigger');
  const entityIds = new Set(actions.flatMap(entry => entry.entityTypes));
  const frameIds = new Set(actions.map(entry => entry.id));
  for (const entry of pack.payloads.entities.entities) {
    const matched = words(entry).some(term => containsLexicalTerm(source, term));
    if (matched || entityIds.has(entry.id)) add('entity', entry, matched ? 'literal_term' : 'selected_frame_entity_type');
  }
  for (const [kind, payload, key] of [['role', 'roles', 'roles'], ['resource', 'resources', 'resources'],
    ['reference', 'references', 'references'], ['completion', 'completions', 'completions']]) {
    for (const entry of pack.payloads[payload][key]) if (words(entry).some(term => containsLexicalTerm(source, term))) add(kind, entry, 'literal_term');
  }
  for (const entry of pack.payloads.boundaries.risks) {
    const matched = words(entry).some(term => containsLexicalTerm(source, term));
    if (matched || entry.frameIds.some(id => frameIds.has(id))) add('risk', entry, matched ? 'literal_term' : 'selected_frame_risk');
  }
  return entries;
}
