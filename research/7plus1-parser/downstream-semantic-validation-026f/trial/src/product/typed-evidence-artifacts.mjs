import { buildTaskNodes, normalizedSectionTitle, projectTaskNodeConstraints } from './task-nodes.mjs';
import { buildEvidenceGraph } from './evidence-graph.mjs';
import { documentSemanticUnits } from './nlp-document-units.mjs';
import { deriveDocumentCoverageGaps } from './document-coverage.mjs';
import { compileSemanticIr } from '../bxp/semantic-ir-compiler.mjs';

export function buildTypedEvidenceArtifacts(candidate, producer = { kind: 'unattributed' }) {
  const task = candidate?.ir?.sources?.find(source => source.role === 'task');
  if (!task?.text) throw Object.assign(Error('Typed candidate has no task source.'), { code: 'TYPED_TASK_SOURCE_MISSING' });
  const sourceTexts = Object.fromEntries(candidate.ir.sources.map(source => [source.id, source.text]));
  const compilation = compileSemanticIr(candidate.ir, candidate.formalization);
  const mappedEntries = new Set(compilation.model?.compilation_trace
    .filter(item => item.status === 'mapped').map(item => item.entry_id) ?? []);
  const units = Object.entries(candidate.ir.elements ?? {}).flatMap(([slot, bucket]) => (bucket.entries ?? []).map(entry => ({
    id: entry.id, slot, status: entry.status, text: entry.text, evidence: entry.evidence,
    formal_status: bucket.coverage === 'assessed' && entry.status === 'resolved' && mappedEntries.has(entry.id)
      ? 'compiled' : 'not_assessed',
  })));
  const document = documentSemanticUnits(task.text);
  const unmappedBlocks = deriveDocumentCoverageGaps(task.text, units, document);
  const task_nodes = projectTaskNodeConstraints(task.text, buildTaskNodes(task.text), units);
  const conditionalEvidence = (document?.diagnostics ?? [])
    .filter(item => item.code === 'DOCUMENT_APPLICABILITY_REQUIRES_REVIEW')
    .flatMap(item => {
      const primary = item.evidence[0];
      const condition = item.evidence.at(-1);
      const headingTitle = normalizedSectionTitle(condition.quote.trim().replace(/^#{1,6}\s+/u, '').split(/\r?\n/u, 1)[0]);
      const genericHeading = /^(?:适用条件|前置条件|条件|例外|豁免|applicability conditions?|preconditions?|conditions?|exceptions?|exemptions?)$/iu.test(headingTitle);
      const contextualEvidence = genericHeading ? primary : condition;
      const quote = contextualEvidence.quote;
      const roles = [
        ...(/(?:除非|\bunless\b)/iu.test(quote) ? ['exception'] : []),
        ...(/(?:如果|若|仅当|仅在|只有|当.+时|\bif\b|\bwhen\b|\bprovided that\b)/iu.test(quote)
          ? ['condition'] : []),
      ];
      return (genericHeading ? roles : roles.length ? roles : ['condition']).map(role => ({ role, evidence: contextualEvidence,
        applies_to: primary }));
    });
  const bindings = (candidate.formalization?.bindings ?? []).map(binding => ({
    binding_id: binding.id, unit_id: binding.entry_id, semantic_id: binding.operator, status: 'unresolved',
    rule_version: 'boundx.typed-formalization/experimental-v1',
    ...(binding.when === undefined ? {} : { when: structuredClone(binding.when) }),
    ...(binding.unless === undefined ? {} : { unless: structuredClone(binding.unless) }),
  }));
  const evidence_graph = buildEvidenceGraph({ text: task.text, sources: sourceTexts, task_nodes, units, bindings,
    unmappedBlocks, conditionalEvidence, producer });
  return { task_nodes, evidence_graph };
}
