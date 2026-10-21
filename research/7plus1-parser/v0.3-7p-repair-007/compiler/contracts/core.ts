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

  scope_expr_id?: string;
  condition_expr_id?: string;
  quantity_expr_id?: string;

  relation_ids: string[];
  node_ids: string[];
  source_span_ids: string[];

  eligibility_decision_id: string;
}


export type CanonicalSlot = "I" | "O" | "A" | "P" | "R" | "V" | "C" | "B";


export type ProofNode =
  | { kind: "CANONICAL_ENTRY"; id: string; canonical_entry_id: string }
  | { kind: "BOUNDARY_FACT"; id: string; boundary_fact_id: string }
  | { kind: "RELATION"; id: string; relation_id: string }
  | { kind: "SEMANTIC_NODE"; id: string; semantic_node_id: string }
  | { kind: "SPAN_CANDIDATE"; id: string; span_candidate_id: string }
  | { kind: "SOURCE_SPAN"; id: string; source_span_id: string }
  | { kind: "STRUCTURE_NODE"; id: string; structure_node_id: string }
  | { kind: "CLAUSE"; id: string; clause_id: string }
  | { kind: "ELIGIBILITY_DECISION"; id: string; eligibility_decision_id: string }
  | { kind: "SET_EXPR"; id: string; expr_id: string }
  | { kind: "CONDITION_EXPR"; id: string; expr_id: string }
  | { kind: "QUANTITY_EXPR"; id: string; expr_id: string }
  | { kind: "COVERAGE_RECORD"; id: string; coverage_record_id: string }
  | { kind: "CANONICAL_SLOT_RESULT"; id: string; canonical_slot_result_id: string };


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



export type StructureNodeKind =
  | "ROOT"
  | "HEADING"
  | "PARAGRAPH"
  | "CLAUSE"
  | "LIST"
  | "LIST_ITEM"
  | "TABLE"
  | "TABLE_ROW"
  | "TABLE_CELL";

export interface StructureNode {
  structure_node_id: string;
  kind: StructureNodeKind;
  parent_id?: string;
  child_ids: string[];
  source_span_ids: string[];
  ordinal?: number;
}

export interface Clause {
  clause_id: string;
  structure_node_id: string;
  source_span_ids: string[];
  parent_clause_id?: string;
  child_clause_ids: string[];
  clause_kind:
    | "DECLARATIVE"
    | "CONDITIONAL"
    | "NEGATIVE"
    | "SEQUENTIAL"
    | "LIST_ITEM"
    | "OTHER";
}

export interface StructureTree {
  root_structure_node_id: string;
  nodes: StructureNode[];
  clauses: Clause[];
}

export type EligibilityDisposition =
  | "BOUNDARY"
  | "AUXILIARY"
  | "OUTSIDE_ENVELOPE"
  | "UNRESOLVED"
  | "COVERAGE_FAILURE";

export type EligibilityReasonCode =
  | "EXPLICIT_TASK_SCOPE"
  | "POSITIVE_ACTION_TARGET"
  | "EXPLICIT_DELIVERABLE"
  | "PARTICIPATION_RELATION"
  | "RESOURCE_LIMIT"
  | "NORMATIVE_BASIS"
  | "COMPLETION_OR_STOP"
  | "FORBIDDEN_OR_RESTRICTED"
  | "AUXILIARY_CONDITION"
  | "AUXILIARY_SEQUENCE"
  | "AUXILIARY_QUANTITY"
  | "OUTSIDE_BOUNDARY_ENVELOPE"
  | "INSUFFICIENT_SEMANTIC_EVIDENCE"
  | "PARSER_COVERAGE_FAILURE";

export interface EligibilityDecision {
  eligibility_decision_id: string;
  disposition: EligibilityDisposition;
  candidate_relation_ids: string[];
  candidate_node_ids: string[];
  proposed_fact_type?: BoundaryFactType;
  reason_code: EligibilityReasonCode;
  unresolved_ref?: string;
  source_span_ids: string[];
}

export interface BoundaryIR {
  boundary_ir_id: string;

  facts: BoundaryFact[];

  set_expr_nodes: SetExprNode[];
  condition_expr_nodes: ConditionExprNode[];
  quantity_expr_nodes: QuantityExprNode[];

  unresolved_refs: string[];

  status:
    | "RESOLVED"
    | "PARTIALLY_RESOLVED"
    | "UNRESOLVED";
}

export type SetExprNode =
  | {
      expr_id: string;
      kind: "ITEM";
      entity_node_id: string;
      source_span_ids: string[];
      relation_ids: string[];
    }
  | {
      expr_id: string;
      kind: "ALL" | "ANY";
      base_entity_node_id: string;
      source_span_ids: string[];
      relation_ids: string[];
    }
  | {
      expr_id: string;
      kind: "UNION" | "INTERSECTION";
      operand_expr_ids: string[];
      source_span_ids: string[];
      relation_ids: string[];
    }
  | {
      expr_id: string;
      kind: "EXCEPT";
      base_expr_id: string;
      excluded_expr_id: string;
      source_span_ids: string[];
      relation_ids: string[];
    };

export type ConditionExprNode =
  | {
      expr_id: string;
      op: "STATE_REF";
      state_node_id: string;
      source_span_ids: string[];
      relation_ids: string[];
    }
  | {
      expr_id: string;
      op: "RELATION_REF";
      relation_id: string;
      source_span_ids: string[];
      relation_ids: string[];
    }
  | {
      expr_id: string;
      op: "BOUNDARY_FACT_REF";
      boundary_fact_id: string;
      source_span_ids: string[];
      relation_ids: string[];
    }
  | {
      expr_id: string;
      op: "AND" | "OR";
      operand_expr_ids: string[];
      source_span_ids: string[];
      relation_ids: string[];
    }
  | {
      expr_id: string;
      op: "NOT";
      operand_expr_id: string;
      source_span_ids: string[];
      relation_ids: string[];
    };

export type QuantityMetric =
  | "COUNT"
  | "TIME"
  | "BUDGET"
  | "SIZE"
  | "PERCENT"
  | "RATE"
  | "OTHER";

export interface QuantityExprNode {
  expr_id: string;
  metric: QuantityMetric;
  target_node_ids: string[];

  lower_bound?: {
    inclusive: boolean;
    value: number | string;
  };

  upper_bound?: {
    inclusive: boolean;
    value: number | string;
  };

  unit?: string;

  value_node_ids: string[];
  source_span_ids: string[];
  relation_ids: string[];
}

export type SlotStatus =
  | "RESOLVED"
  | "UNRESOLVED"
  | "ABSENT"
  | "PARSER_COVERAGE_FAILURE";

export interface CanonicalEntry {
  canonical_entry_id: string;
  slot: CanonicalSlot;
  boundary_fact_ids: string[];

  state:
    | "RESOLVED"
    | "UNRESOLVED";

  display_value: string;

  condition_expr_id?: string;
  scope_expr_id?: string;
  quantity_expr_id?: string;

  source_span_ids: string[];
}

export interface CanonicalSlotResult {
  slot: CanonicalSlot;
  status: SlotStatus;
  entries: CanonicalEntry[];
}

export interface Canonical7Plus1 {
  projection_id: string;

  I: CanonicalSlotResult;
  O: CanonicalSlotResult;
  A: CanonicalSlotResult;
  P: CanonicalSlotResult;
  R: CanonicalSlotResult;
  V: CanonicalSlotResult;
  C: CanonicalSlotResult;
  B: CanonicalSlotResult;
}

export type CoverageDisposition =
  | "BOUNDARY"
  | "AUXILIARY"
  | "OUTSIDE_ENVELOPE"
  | "UNRESOLVED"
  | "NON_TASK_TEXT"
  | "COVERAGE_FAILURE";

export interface CoverageRecord {
  coverage_record_id: string;

  structure_node_id?: string;
  clause_id?: string;

  source_span_ids: string[];

  disposition: CoverageDisposition;

  eligibility_decision_ids: string[];
  boundary_fact_ids: string[];
  unresolved_refs: string[];

  reason: string;
}

export interface CompilerExecutionContext {
 metadata: {run_id:string;compiler_version:string;created_at:string;source_sha256:string};
 source: unknown;
 structure: StructureTree | NotImplementedStage;
 nlp_signals: unknown;
 span_lattice: SpanLattice | NotImplementedStage;
 semantic_nodes: SemanticNode[] | NotImplementedStage;
 relations: DecodedRelation[] | NotImplementedStage;
 relation_bundles: RelationBundle[] | NotImplementedStage;
 unresolved: UnresolvedRecord[];
 eligibility_decisions: EligibilityDecision[] | NotImplementedStage;
 coverage: CoverageRecord[] | NotImplementedStage;
 boundary_ir: BoundaryIR | NotImplementedStage;
 canonical_7plus1: Canonical7Plus1 | NotImplementedStage;
 proof_dag: ProofDAG | NotImplementedStage;
 diagnostics: unknown[];
 performance: Record<string,number|null>;
}
