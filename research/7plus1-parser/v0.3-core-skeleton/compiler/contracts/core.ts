export type EvidenceTier =
  | "HARD"
  | "STRONG"
  | "AMBIGUOUS"
  | "CONTRADICTED";


export interface SourceSpan {
  span_id: string;
  start: number;
  end: number;
  text: string;
}


export type SpanCandidateType =
  | "ENTITY"
  | "EVENT"
  | "STATE"
  | "VALUE"
  | "REFERENCE"
  | "CONDITION"
  | "DISCOURSE"
  | "UNKNOWN";


export type SpanCandidateStatus =
  | "CANDIDATE"
  | "SELECTED"
  | "SUPPRESSED"
  | "UNRESOLVED";


export type LiteralTag =
  | "FILEPATH"
  | "URI"
  | "VERSION"
  | "COMMIT"
  | "TICKET"
  | "ADR"
  | "POLICY"
  | "REFERENCE"
  | "NUMBER"
  | "PERCENT"
  | "DURATION"
  | "DATETIME"
  | "PERSON"
  | "ROLE"
  | "SYSTEM"
  | "SERVICE";


export interface SpanCandidate {
  span_candidate_id: string;
  source_span_id: string;
  candidate_type: SpanCandidateType;
  literal_tag?: LiteralTag;
  status: SpanCandidateStatus;
  evidence_tier: EvidenceTier;
  confidence_score?: number;
  provider_refs: string[];
  diagnostic_refs: string[];
}


export type SpanLatticeEdgeType =
  | "CONTAINS"
  | "OVERLAPS"
  | "COMPETES_WITH"
  | "CAN_COEXIST";


export interface SpanLatticeEdge {
  edge_id: string;
  edge_type: SpanLatticeEdgeType;
  from_span_candidate_id: string;
  to_span_candidate_id: string;
}


export interface SpanLattice {
  source_id: string;
  candidates: SpanCandidate[];
  edges: SpanLatticeEdge[];
}


export type SemanticNodeType =
  | "ENTITY"
  | "EVENT"
  | "STATE"
  | "VALUE"
  | "REFERENCE"
  | "CONDITION"
  | "DISCOURSE"
  | "UNKNOWN_REFERENT";


export interface SemanticNode {
  node_id: string;
  node_type: SemanticNodeType;
  surface: string;
  normalized?: string | null;
  span_candidate_ids: string[];
  source_span_ids: string[];
  evidence_tier: EvidenceTier;
  state: "RESOLVED" | "UNRESOLVED";
  unresolved_ref?: string;
  metadata: Record<string, unknown>;
}


export type RelationType =
  | "AGENT"
  | "PATIENT"
  | "THEME"
  | "RESULT"
  | "RECIPIENT"
  | "LOCATION"
  | "BASIS"
  | "CONFORMS_TO"
  | "SCOPE_MEMBER"
  | "LIMIT"
  | "CONDITION_OF"
  | "COMPLETION_OF"
  | "STOP_OF"
  | "APPROVAL_OF"
  | "FORBIDS"
  | "RESTRICTS"
  | "COREFERENCE"
  | "CONJUNCTION"
  | "SEQUENCE";


export interface DecodedRelation {
  relation_id: string;
  clause_id: string;
  relation_type: RelationType;
  head_node_id: string;
  tail_node_id: string;
  evidence_span_ids: string[];
  evidence_tier: EvidenceTier;
  state: "RESOLVED" | "UNRESOLVED" | "REJECTED";
  unresolved_ref?: string;
  confidence_score?: number;
  model_signal_refs: string[];
  rule_refs: string[];
}


export interface RelationBundle {
  bundle_id: string;
  clause_ids: string[];
  relation_ids: string[];
  bundle_state:
    | "RESOLVED"
    | "PARTIALLY_RESOLVED"
    | "UNRESOLVED";
  unresolved_refs: string[];
}


export type UnresolvedKind =
  | "UNRESOLVED_AMBIGUOUS"
  | "UNRESOLVED_COREFERENCE"
  | "UNRESOLVED_SCOPE"
  | "UNRESOLVED_RELATION"
  | "UNRESOLVED_QUANTIFICATION";


export interface UnresolvedRecord {
  unresolved_id: string;
  kind: UnresolvedKind;
  related_span_candidate_ids: string[];
  related_node_ids: string[];
  related_relation_ids: string[];
  related_clause_ids: string[];
  reason: string;
  human_question?: string;
  evidence_tier: EvidenceTier;
}


export type SetExpr =
  | { type: "ITEM"; entity_node_id: string }
  | { type: "ALL"; base_entity_node_id: string }
  | { type: "ANY"; base_entity_node_id: string }
  | { type: "UNION"; operands: SetExpr[] }
  | { type: "INTERSECTION"; operands: SetExpr[] }
  | { type: "EXCEPT"; base: SetExpr; excluded: SetExpr };


export type ConditionExpr =
  | { op: "STATE_REF"; state_node_id: string }
  | { op: "RELATION_REF"; relation_id: string }
  | { op: "BOUNDARY_FACT_REF"; boundary_fact_id: string }
  | { op: "AND"; operands: ConditionExpr[] }
  | { op: "OR"; operands: ConditionExpr[] }
  | { op: "NOT"; operand: ConditionExpr };


export type QuantityOperator = "EQ" | "LT" | "LTE" | "GT" | "GTE";

export interface QuantityExpr {
  op: QuantityOperator;
  value: number | string;
  unit?: string;
  value_node_id: string;
}


export type BoundaryFactType =
  | "TASK_OBJECT"
  | "DELIVERABLE"
  | "ACTION"
  | "PARTICIPANT"
  | "RESOURCE"
  | "BASELINE"
  | "COMPLETION"
  | "STOP"
  | "FORBID"
  | "RESTRICT"
  | "AUX_CONDITION"
  | "AUX_SEQUENCE"
  | "AUX_QUANTITY";


export interface BoundaryFact {
  boundary_fact_id: string;
  fact_type: BoundaryFactType;

  state: "RESOLVED" | "UNRESOLVED";
  unresolved_ref?: string;

  subject_node_ids: string[];
  predicate_node_id?: string;
  object_node_ids: string[];
  participant_node_ids: string[];

  scope?: SetExpr;
  condition?: ConditionExpr;
  quantity?: QuantityExpr;

  relation_ids: string[];
  node_ids: string[];
  source_span_ids: string[];

  eligibility_decision_id: string;
}


export interface BoundaryAST {
  boundary_ast_id: string;
  facts: BoundaryFact[];
  unresolved_refs: string[];
  status:
    | "RESOLVED"
    | "PARTIALLY_RESOLVED"
    | "UNRESOLVED";
}


export type CanonicalSlot = "I" | "O" | "A" | "P" | "R" | "V" | "C" | "B";


export interface CanonicalEntry {
  canonical_entry_id: string;
  slot: CanonicalSlot;
  boundary_fact_ids: string[];
  state: "RESOLVED" | "UNRESOLVED";
  display_value: string;
  condition?: ConditionExpr;
  scope?: SetExpr;
  quantity?: QuantityExpr;
  source_span_ids: string[];
}


export type ProofNode =
  | { kind: "CANONICAL_ENTRY"; id: string; canonical_entry_id: string }
  | { kind: "BOUNDARY_FACT"; id: string; boundary_fact_id: string }
  | { kind: "RELATION"; id: string; relation_id: string }
  | { kind: "SEMANTIC_NODE"; id: string; semantic_node_id: string }
  | { kind: "SPAN_CANDIDATE"; id: string; span_candidate_id: string }
  | { kind: "SOURCE_SPAN"; id: string; source_span_id: string };


export type ProofEdgeType =
  | "PROJECTS_TO"
  | "COMPILES_FROM"
  | "DECODED_FROM"
  | "ASSEMBLED_FROM"
  | "EXTRACTED_FROM";


export interface ProofEdge {
  edge_id: string;
  edge_type: ProofEdgeType;
  from_id: string;
  to_id: string;
}


export interface ProofDAG {
  proof_dag_id: string;
  nodes: ProofNode[];
  edges: ProofEdge[];
}


export interface NotImplementedStage {
  status: "NOT_IMPLEMENTED";
  reason: string;
}


export interface CompilerExecutionContext {
  metadata: {
    run_id: string;
    compiler_version: string;
    created_at: string;
    source_sha256: string;
  };

  source: unknown;
  structure: unknown;
  nlp_signals: unknown;

  span_lattice: SpanLattice | NotImplementedStage;
  semantic_nodes: SemanticNode[] | NotImplementedStage;
  relation_bundles: RelationBundle[] | NotImplementedStage;
  unresolved: UnresolvedRecord[];

  boundary_ast: BoundaryAST | NotImplementedStage;
  canonical_7plus1: unknown | NotImplementedStage;
  proof_dag: ProofDAG | NotImplementedStage;

  diagnostics: unknown[];
  performance: Record<string, number | null>;
}
