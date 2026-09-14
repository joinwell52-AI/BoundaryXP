import type { BoundaryFinding, BoundaryReview } from "./index.ts";

export type BoundaryLocale = "zh-CN" | "en";
export type BoundaryReviewOptions = { locale?: BoundaryLocale };
const parameterAdvice: Record<string, string> = {
  I: "Specify the inspected objects, input files, instance and time range, with exact source excerpts.",
  O: "Specify deliverables and recipients. Candidate wording: Submit a report containing findings, evidence, limitations and recommendations.",
  A: "Specify permitted actions. Candidate wording: Inspect and recommend; request separate authorization for product changes. The task authorizer must confirm this clause.",
  P: "Specify accountable and executing roles and the independent observer's authorizing party.",
  R: "Specify time, call or cost limits. Ask the task authorizer to set actual values; do not invent a budget.",
  V: "Specify the task revision, evidence sources and code or data baseline to inspect.",
  C: "Specify completion and stopping conditions. Candidate wording: Deliver after completing the agreed inspection and report; product findings do not automatically require repair before reporting. Obtain authorizer confirmation.",
};
type Copy = Pick<BoundaryFinding, "basis" | "consequence" | "suggestion">;
function english(f: BoundaryFinding): Copy {
  const parameter = f.location.split(".").at(-1) ?? "";
  switch (f.kind) {
    case "parameter_unmapped": return {
      basis: `No source mapping was supplied for ${parameter}. This does not prove the original task omitted that requirement.`,
      consequence: "An executor may fill the gap using its own interpretation.",
      suggestion: `${parameterAdvice[parameter] ?? "Supply the missing source mapping."} If the task already specifies it, cite that excerpt. Candidate wording is not authorization.`,
    };
    case "projection_incomplete": return {
      basis: "Actions or completion conditions have not been mapped, so the set comparison is incomplete.",
      consequence: "Absence of detected differences cannot establish boundary consistency.",
      suggestion: "List each actor/action/target tuple and completion condition with exact source excerpts. Preserve uncertainty and request clarification from the task authorizer.",
    };
    case "parameter_difference": return {
      basis: `The excerpt mapped to ${parameter} differs from the authorizer's baseline. Textual difference is not a semantic verdict.`,
      consequence: "This may change goals, resources, responsibility or delivery requirements, or merely rephrase them.",
      suggestion: `Explain whether the two statements are equivalent and cite evidence. Preserve the original requirement or request authorization for a change. ${parameterAdvice[parameter] ?? ""}`,
    };
    case "action_difference": return {
      basis: "An actor/action/target tuple is absent from the baseline's mapped action set. This may be legitimate refinement, a label difference or scope expansion; it is not adjudicated.",
      consequence: "The child task may expand the assigned scope. This observation does not prove an unauthorized operation occurred.",
      suggestion: "Explain why the action is necessary for the original task and cite the authority. If inspection has become repair, consider: Verify the issue and submit evidence and repair recommendations. Request separate authorization if repair is necessary.",
    };
    case "completion_difference": return {
      basis: "A completion condition was added or its excerpt changed. Adding conjunctive conditions can tighten delivery criteria, subject to semantic verification.",
      consequence: "Inspect and report may have become repair successfully before reporting.",
      suggestion: "Explain this condition against the authorizer's delivery requirements. Move an optional recommendation into the report, or seek explicit authorization if it must become a completion prerequisite.",
    };
    case "completion_omission": return {
      basis: "A baseline completion condition has no matching identifier in the submitted plan.",
      consequence: "A deliverable may be omitted, or its identifier may simply have changed.",
      suggestion: "Restore the condition and source excerpt or identify its equivalent in the plan. Request authorization before deleting an original requirement.",
    };
    case "dependency_unknown": return {
      basis: "A dependency references a node outside the submitted task graph.",
      consequence: "The executor cannot determine the waiting target or its completion evidence.",
      suggestion: `Supply the task identifier, owner and completion evidence for dependency ${f.source_quote}. If external, specify its source and waiting condition.`,
    };
    case "dependency_cycle": return {
      basis: "The directed dependency graph contains a cycle. If every edge is an unmet completion prerequisite, that order cannot start.",
      consequence: "Circular waiting is possible; this does not prove the running system is deadlocked.",
      suggestion: "Review each edge in the displayed cycle. Separate information references from mandatory prerequisites and propose a startable order or cite conditions already satisfied.",
    };
    default: throw new Error(`Missing English finding translation: ${f.kind}`);
  }
}
export function localizeBoundaryReview(review: BoundaryReview, options: BoundaryReviewOptions = {}): BoundaryReview {
  const locale = options.locale ?? "zh-CN";
  if (locale !== "zh-CN" && locale !== "en") throw new Error("Unsupported locale; use zh-CN or en");
  if (locale === "zh-CN") return { ...review, locale };
  return { ...review, locale, findings: review.findings.map(f => ({ ...f, ...english(f),
    ...(f.symbolic_counterexample ? { symbolic_counterexample: { ...f.symbolic_counterexample,
      assumptions: "Identifiers retain their meanings; conditions are independent and completion is conjunctive. This is a symbolic counterexample; verify the source mapping.",
    } } : {}),
  })) };
}
