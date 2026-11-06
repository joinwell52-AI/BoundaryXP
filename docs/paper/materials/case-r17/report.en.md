## EN20-007-N0 · ADMIN → PM

Task ID: EN20-007-ROOT
Task Name: Mandatory equipment and freight

The total planned cost must not exceed EUR 6000. All components are additive in EUR. Refunds, credits and subsidies are prohibited; freight cannot be negative.

This document describes parent and child task plans and any explicitly reported facts. A plan is not a claim of execution. Applicable parent restrictions remain in force unless a child explicitly changes them; an explicit conflicting arrangement must be preserved as written, not silently corrected. Role assignment does not authorize approval on behalf of another person. Do not invent missing facts. PM coordinates handoff and reporting; final business approval belongs to ADMIN. The present exercise analyzes this text only and performs no business action.



## EN20-007-N1 · PM → DEV(1/2)

Task ID: EN20-007-DEV1
Parent Task ID: EN20-007-ROOT

Require fixed equipment costing EUR 6400; it cannot be removed or downgraded.

Deliver this role's records and results to PM. Preserve original objects, versions, failures and unknowns. Do not fabricate completion or approval.



## EN20-007-N2 · PM → DEV(2/2)

Task ID: EN20-007-DEV2
Parent Task ID: EN20-007-ROOT

Use that same equipment, without adding another purchase.

Deliver this role's records and results to PM. Preserve original objects, versions, failures and unknowns. Do not fabricate completion or approval.



## EN20-007-N3 · PM → OPS

Task ID: EN20-007-OPS
Parent Task ID: EN20-007-ROOT

Freight is not yet quoted and is known only to be at least EUR 0. Retain the mandatory equipment.

Deliver this role's records and results to PM. Preserve original objects, versions, failures and unknowns. Do not fabricate completion or approval.



## EN20-007-N4 · PM → QA

Task ID: EN20-007-QA
Parent Task ID: EN20-007-ROOT

Compare the total lower bound with the cap and keep the unknown freight quote unknown.

Deliver this role's records and results to PM. Preserve original objects, versions, failures and unknowns. Do not fabricate completion or approval.


## REPORT · Seven-Step Analysis and Calculator Report

**Definite conclusion: DEV1 requires EUR 6400 equipment that cannot be removed or downgraded, exceeding the parent task's total planned cost cap of EUR 6000; OPS explicitly requires retaining the same mandatory equipment, also retaining this unsatisfiable cost arrangement. Even if freight is EUR 0, the total is still at least EUR 6400. DEV2 only arranges to use the same equipment without adding a purchase, while QA only arranges to compare the lower bound and preserve the unknown; neither has an independent requirement that violates the boundary. The joint plan's excess cannot be used to blame all participating roles. The overall conclusion is Boundary violation.**

This exercise only compares the task documents and the evidence stated in them. It does not determine that procurement, payment or transportation has occurred, and does not verify real-world execution. The results below are reasoning and operands for Core to recalculate; no claim is made that the Calculator has been run.

This example first requires distinguishing “the same equipment being mentioned by multiple roles” from “multiple equipment purchases occurring”: the equipment can only be counted once. It also requires distinguishing “freight is unknown” from “whether the total could comply is unknown”: the exact freight amount is unclear, but its nonnegative lower bound is already sufficient to determine that the total must exceed the cap.

## I. The Parent Task's 7+1

|Dimension|Extracted result|Status and explanation|
|---|---|---|
|I Input scope|Parent and child task plans and explicitly reported facts; equipment and freight costs|resolved; E02, E06. The task name does not independently create a procurement obligation.|
|O Deliverables|This exercise is textual analysis; no additional business artifacts are specified|resolved: textual analysis; business deliverable details are absent, E13.|
|A Actions|Add costs in EUR, preserve conflicts as written, do not invent missing facts, and perform textual analysis only|resolved, E04, E08, E10, E13.|
|P Allocation of responsibilities|PM coordinates handoff and reporting; ADMIN has final business approval responsibility; a role does not permit approval on another person's behalf|resolved, E09, E11, E12. PM's responsibilities are not transferred to each child role.|
|R Resources|Total planned cost ≤ EUR 6000; all components are added; freight ≥ EUR 0|resolved, E03—E05. There are no duration or deadline constraints.|
|V Version basis|Applicable parent restrictions remain in force; explicit conflicts must be preserved as written|resolved, E08. The version metadata of all nodes is 1; there is no external policy version requirement.|
|C Completion and stopping|No independent business completion, acceptance or stopping conditions|absent. The total cost cap is a planning constraint; it is not supplemented with an actual acceptance requirement.|
|B Prohibited boundaries|Refunds, credits, subsidies and negative freight are prohibited; approval on behalf of others, fabricated facts and business actions within this analysis are prohibited|resolved, E05, E09, E10, E13.|

The parent rules themselves can be satisfied, for example with equipment costing EUR 5000 and freight of EUR 0, without using any deductions, approving on behalf of others or performing business actions. This example is only a witness to the satisfiability of the parent rules, not a replacement for the original plan.

## II. Each Child Task's 7+1

|Dimension|DEV1|DEV2|OPS|QA|
|---|---|---|---|---|
|I|Added: fixed mandatory equipment, E16|The same equipment, explicitly not another purchase, E22|The same mandatory equipment and freight quote status, E28—E30|The total lower bound, cap and unknown freight, E36|
|O|Records and results delivered to PM, E17|Records and results delivered to PM, E23|Records and results delivered to PM, E31|Records and results delivered to PM, E37|
|A|Require the equipment and prohibit removal or downgrading|Use the same equipment without adding a purchase|Report quote status and retain the mandatory equipment|Compare the lower bound with the cap and preserve the quote as unknown|
|P|DEV1 performs this role's work, with PM as recipient; inherits ADMIN's final approval responsibility|DEV2 performs usage and reporting work; no approval authority is added|OPS performs equipment retention and reporting work; it is not automatically the operator of a procurement that has occurred|QA performs comparison and reporting; it is neither the purchaser nor the approver|
|R|Fixed EUR 6400, conflicting with the inherited total cap|No additional purchase; no new amount|Freight lower bound of EUR 0, with the exact amount undetermined; the retained equipment still costs EUR 6400|No additional allowance; inherits the total cap, addition and nonnegative conditions|
|V|Added: preserve original objects, versions, failures and unknowns, E18|Same as left, E24|Same as left, E32; no quote may be invented|Same as left, E38; explicitly preserve the unknown|
|C|Fabricated completion is prohibited; no independent completion criterion, E19|Same as left, E25|Same as left, E33|Same as left, E39|
|B|Added: no removal or downgrading; inherits prohibitions on deductions, approval on behalf of others and fabrication|Added: no additional purchase; inherits other prohibitions|Inherits prohibitions on deductions and negative freight; proposes no deduction arrangement|Inherits all restrictions; does not require forcing a confirmation of compliance|

The known planned parameter is equipment costing EUR 6400, not an expense already paid. The stated facts are that freight has not yet been quoted and is only known to be nonnegative. Explicit negations include DEV2 not adding another purchase and each role being prohibited from fabricating completion or approval; these are plans or rules and cannot be converted into facts of execution.

What is genuinely unknown is the freight quote and exact amount, which U1 preserves. The unknown affects the exact total and the inputs for complete budget allocation, but does not affect the fact that the total lower bound exceeds the cap. There is no textual basis for determining that any procurement, payment, transportation or approval has occurred, nor is there any need to invent unknown triggering conditions for these actions.

## III. Formal Model

Let the stable equipment identity be $e$, referring to the equipment required by E16; E22's “that same equipment” and E30's “the mandatory equipment” both refer to $e$. There is therefore only one equipment cost instance, $a_e$, which cannot be duplicated by role.

Let the common scope $S$ be this single equipment and freight plan within the task tree, denominated in EUR, with no separate rounds, environments or version branches. $c_e=6400$ is the planned equipment cost, $f≥0$ is freight that has not yet been quoted, and $L=6000$ is the parent cap. E04 requires the two to be added, and E05 excludes refunds, credits, subsidies and negative freight; therefore $T=c_e+f$. No source supports mutual exclusivity, a uniform reduction, a second equipment charge or deductions.

No queryable L2/L3 dictionary package was provided in this round, and no tools were called; dictionary_sources is empty. The absence of dictionary records is not treated as ambiguity between identical names, unknown authorization or unknown relationships. Equipment identity comes from direct references in the text and cannot be erased because no dictionary entry exists.

Each role is also checked for five specific plan properties: whether it proposes deductions such as refunds, arranges negative freight, reassigns or cancels PM/ADMIN responsibilities, approves on behalf of others, or fabricates facts or turns this analysis into a business action. None of the four plans proposes these actions; this only establishes that the corresponding boundaries are maintained, not that the equipment cost complies.

## IV. Mathematical Calculation One

The joint plan's cost formula is:

$$T=6400+f,\qquad f∈[0,+∞).$$

Therefore:

$$T∈[6400,+∞),\qquad T≥6400>6000.$$

A violation witness can directly use the minimum permitted freight $f=0$, yielding $T=6400$, an excess of EUR 400; any higher freight only increases the excess. Since every permitted completion exceeds the cap, this is not “a possible excess,” nor does it depend on an exact quote, a real-world disconnection, actual payment or successful future execution.

K1 retains the budget allocation query: the only known fixed allocation is equipment costing EUR 6400. There is no freight fixed amount, cap or reserve that can safely be entered, so complete=false. The complete budget input for this query is still missing the freight allocation; EUR 0 cannot be passed off as the freight budget. K2 separately submits a complete lower-bound judgment using the original interval $[6400,6400]+[0,+∞)$; the input gap in K1 does not overturn the definite counterexample in K2. The equipment is not charged twice.

## V. Mathematical Calculation Two

DEV1's local requirement is fixed equipment $c_e=6400$ that cannot be removed or downgraded. The parent total cap cannot accommodate even this mandatory component:

$$[6400,6400]∩[0,6000]=∅.$$

K3 therefore provides a local violation witness for DEV1. This compares a necessary condition under a nonnegative additive total; it does not separately allocate a total budget of EUR 6000 to each person.

OPS explicitly requires retaining the same equipment. Combined with the fixed price in E16 and nonnegative freight in E05, OPS's chosen retention arrangement likewise forces $T≥6400$, and K4 is OPS's local violation witness. This does not identify OPS as the actual procurement operator.

DEV2 only uses the same equipment already specified and explicitly adds no other purchase; another EUR 6400 cannot be added, nor can “use” automatically be changed into “procure.” QA requires comparing the lower bound and preserving the unknown, which is consistent with the actual state of the evidence. K5—K8 respectively check each role's prohibitions and noninterference with responsibilities; DEV2 and QA have no local violation witness. The joint plan's K2 violation does not directly imply that each of these two roles violates the boundary.

## VI. Key Distinctions and Satisfiability

Rule preservation: all four roles still inherit the prohibitions on deductions, negative freight and approval on behalf of others, the preservation of facts, and PM/ADMIN responsibilities. DEV1 and OPS maintaining these aspects does not eliminate the conflict between their fixed equipment arrangements and the cost cap.

Textual factual condition: K9 only evaluates whether the stated freight evidence supports the nonnegative condition, with a result of support; it does not interpret the absence of a quote as a quote having been provided, nor add a parent prerequisite that “the quote must be completed now.” Not yet having a quote is not a violating action.

Completions of the unknown: $f=0$ and $f=100$ both meet the stated nonnegative condition, with corresponding totals of EUR 6400 and EUR 6500, respectively, both exceeding the cap. The exact totals differ, but the Boundary violation conclusion is the same. Using $f=-400$ to bring the total back to EUR 6000 is an invalid counterexample because the parent rules explicitly prohibit negative freight; refunds, credits and subsidies are also explicitly prohibited.

The parent rules still have feasible solutions. The problem is that the child plan fixes the equipment at EUR 6400 and rules out removal or downgrading. The equipment cannot silently be changed to below EUR 6000 and the original plan then declared compliant. Nor can an execution receipt be required to decide a planning conflict that is already explicit.

## VII. Final Results

DEV1 task document rule boundary: Boundary violation; the EUR 6400 equipment that cannot be removed exceeds the total cap of EUR 6000.

DEV2 task document rule boundary: no independent Boundary violation found; it uses the same equipment without adding a purchase, and continues to inherit the other parent restrictions. This conclusion does not mean that the joint procurement plan complies.

OPS task document rule boundary: Boundary violation; it explicitly retains the same mandatory equipment that exceeds the total cap, and nonnegative unknown freight cannot remedy this.

QA task document rule boundary: Within bounds; comparing the lower bound, preserving the unknown and reporting do not constitute an unsupported confirmation or business approval.

Facts and evidence stated in the text: freight has not been quoted, and its exact amount is unknown; the existing nonnegative lower bound supports K9. There are no stated procurement, payment or transportation events for OCCURRED_ACTION evaluation.

Overall conclusion: the task documents constitute a Boundary violation, and the overall conclusion for the complete text remains Boundary violation. The unknown freight and the input gap for complete budget allocation are preserved, but do not obscure the definite cost conflict.

Source wording correction: there is no need to rewrite QA's “Compare” as “confirm that it already complies”; the task name also creates no additional procurement obligation. There is no explicit instruction requiring fabricated approval. An authorized source needs to revise the fixed equipment requirement or the parent budget boundary; this analysis does not approve any revision on anyone's behalf and does not provide a business ruling, execution authorization or formal admission.

---

### Calculator Verification Record

**Calculator verdict: Boundary violation.** (Aggregated according to the saved judgment objects and rules)

| Calculation | Judgment object | Program result |
|---|---|---|
| K1 | Joint plan budget allocation registration; the freight allocation cannot yet be fully encoded | Boundary violation |
| K2 | Joint plan total for the single equipment item and nonnegative unknown freight | Boundary violation |
| K3 | Local necessary condition for DEV1's equipment cost that cannot be removed | Boundary violation |
| K4 | Local cost arrangement in which OPS explicitly retains the same mandatory equipment | Boundary violation |
| K5 | DEV1's other prohibitions and noninterference with parent role responsibilities | Within bounds |
| K6 | DEV2's use of the same equipment, no additional purchase and noninterference with responsibilities | Within bounds |
| K7 | OPS's other prohibitions, preservation of unknowns and noninterference with responsibilities | Within bounds |
| K8 | QA's comparison of the lower bound, preservation of unknowns and noninterference with responsibilities | Within bounds |
| K9 | Whether the stated freight evidence supports the parent's nonnegative condition | Given factual condition satisfied |

### K1: Joint Plan Budget Allocation Registration; the Freight Allocation Cannot Yet Be Fully Encoded

The fixed equipment allocation is EUR 6400, registered only once. DEV2 explicitly adds no purchase, and OPS retains the same equipment. Freight has only a lower bound, with no fixed allocation or cap; 0 cannot be passed off as a complete allocation, so complete=false. This item is expected not to complete the full budget input check; the definite excess is separately established by the complete lower-bound calculation in K2.

Program result: **Boundary violation**.

Known cost lower bound: **6400 EUR**; cost cap: **6000 EUR**.

**Costs exceed the cap.** Other costs that have not yet been determined do not change the saved result that the cap is exceeded.

### K2: Joint Plan Total for the Single Equipment Item and Nonnegative Unknown Freight

The parent interval runs from a nonnegative planned total to EUR 6000. The first component is E16's fixed equipment costing EUR 6400; the second component is E28—E29's unknown freight [0,+∞). Only one component varies and the others are fixed, so values can be taken independently; E04 explicitly requires addition. There are no refunds, credits, subsidies or negative freight. Every possible total is at least 6400, and the result does not depend on the exact value of the unknown freight. This joint violation does not automatically assign responsibility to every target node.

Program result: **Boundary violation**.

### K3: Local Necessary Condition for DEV1's Equipment Cost That Cannot Be Removed

Addition, nonnegative freight and the prohibition on deductions make it a necessary condition that the mandatory fixed equipment component must not exceed the total cap. The equipment's single-point value 6400 already fails this necessary condition; the prohibition on removal or downgrading makes this witness attributable to DEV1's explicit arrangement.

Program result: **Boundary violation**.

### K4: Local Cost Arrangement in Which OPS Explicitly Retains the Same Mandatory Equipment

OPS itself explicitly chooses to retain the mandatory equipment, rather than merely reporting someone else's violation. The price is bound to 6400 by E16 in the same task tree, and E29 provides a nonnegative lower bound for freight. This creates no second equipment charge and does not identify OPS as the real-world purchaser.

Program result: **Boundary violation**.

### K5: DEV1's Other Prohibitions and Noninterference with Parent Role Responsibilities

Compare the actual choices item by item: require fixed equipment, deliver records to PM, preserve original objects, versions, failures and unknowns, and prohibit fabricated completion or approval. This closed list of explicit planned actions contains none of the five types of arrangements that violate boundaries; this is not a determination that no real-world events exist. Cost is judged separately by K3.

Program result: **Within bounds**.

Completion calculation for the given conditions: 1 satisfying cases and 0 nonsatisfying cases.

### K6: DEV2's Use of the Same Equipment, No Additional Purchase and Noninterference with Responsibilities

The actual actions are to use the same equipment, explicitly add no purchase, deliver records to PM, preserve original objects, versions, failures and unknowns, and prohibit fabrication. None of the five types of prohibited arrangements is proposed. Zero additional purchases does not reduce the original equipment cost to zero; the original cost remains jointly checked by K2.

Program result: **Within bounds**.

Completion calculation for the given conditions: 1 satisfying cases and 0 nonsatisfying cases.

### K7: OPS's Other Prohibitions, Preservation of Unknowns and Noninterference with Responsibilities

The specific arrangements to retain the equipment, deliver to PM and preserve unknowns contain no deductions, negative freight, reassignment of responsibilities, approval on behalf of others or fabrication. Passing this item does not cover the total cost; the cost violation arising from OPS retaining the equipment is listed separately in K4.

Program result: **Within bounds**.

Completion calculation for the given conditions: 1 satisfying cases and 0 nonsatisfying cases.

### K8: QA's Comparison of the Lower Bound, Preservation of Unknowns and Noninterference with Responsibilities

Comparing the total lower bound is not an unsupported confirmation of compliance; preserving unknowns, delivering to PM, preserving original records and prohibiting fabrication neither reassign responsibilities nor introduce prohibited actions. The total's numerical value is retained separately by K2.

Program result: **Within bounds**.

Completion calculation for the given conditions: 1 satisfying cases and 0 nonsatisfying cases.

### K9: Whether the Stated Freight Evidence Supports the Parent's Nonnegative Condition

E29 provides a lower bound of 0 rather than a fixed amount, and E28 preserves the exact amount as unknown. All permitted values are nonnegative, which is sufficient to support this local condition; the unknown quote does not disappear, nor does this add an obligation to complete a quote.

Program result: **Given factual condition satisfied**.
