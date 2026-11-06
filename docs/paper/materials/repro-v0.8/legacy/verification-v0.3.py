"""Recompute the manuscript's mathematical examples without calling BXP or an LLM.

This is an arithmetic and finite-logic check, not a semantic Gold evaluation,
product conformance test, or reproduction of the historical experiments.
"""

import hashlib
import itertools
import json
from pathlib import Path


RESULTS = []


def check(identifier, description, actual, expected):
    RESULTS.append({
        "id": identifier,
        "description": description,
        "actual": actual,
        "expected": expected,
        "passed": actual == expected,
    })


def assignments(names):
    return [dict(zip(names, values))
            for values in itertools.product((False, True), repeat=len(names))]


def witnesses(names, predicate):
    return [s for s in assignments(names) if predicate(s)]


def reachability(edges):
    nodes = {n for edge in edges for n in edge}
    result = set()
    for start in nodes:
        pending = [b for a, b in edges if a == start]
        seen = set()
        while pending:
            end = pending.pop()
            if end in seen:
                continue
            seen.add(end)
            result.add((start, end))
            pending.extend(b for a, b in edges if a == end)
    return result


check("PV01", "Closed action-set counterexample", sorted({3} - {0, 1, 2}), [3])
check("PV02", "Same object does not erase a new action",
      sorted({"read", "truncate"} - {"read"}), ["truncate"])
check("PV03", "Forbidden action intersection",
      sorted({"read", "modify", "save"} & {"modify", "save"}),
      ["modify", "save"])
check("PV04", "Required-output difference has the opposite direction",
      sorted({"id", "status"} - {"id"}), ["status"])

allowed_pairs = {("DEV", "a"), ("QA", "b")}
factorized = set(itertools.product({"DEV", "QA"}, {"a", "b"}))
check("PV05", "Independent projections introduce unauthorized pairs",
      [list(pair) for pair in sorted(factorized - allowed_pairs)],
      [["DEV", "b"], ["QA", "a"]])

check("PV06", "Shared budget requires composition",
      {"local_within_limit": all(v <= 100 for v in (60, 60)),
       "total": sum((60, 60)), "excess": sum((60, 60)) - 100},
      {"local_within_limit": True, "total": 120, "excess": 20})
check("PV07", "Independent interval endpoints produce an attainable excess",
      {"minimum": 40 + 30, "maximum": 60 + 50,
       "witness": [60, 50], "excess": 60 + 50 - 100},
      {"minimum": 70, "maximum": 110, "witness": [60, 50], "excess": 10})
check("PV08", "Parallel stage followed by serial work",
      max(35, 45) + 20, 65)
check("PV09", "Two serial chains running in parallel",
      max(20 + 25, 30 + 40), 70)

approval = witnesses(("a", "b", "c"),
                     lambda s: any(s.values()) and sum(s.values()) < 2)
check("PV10", "Any-one approval fails an at-least-two requirement",
      approval,
      [{"a": False, "b": False, "c": True},
       {"a": False, "b": True, "c": False},
       {"a": True, "b": False, "c": False}])

gap = witnesses(("a", "b", "c", "h"),
                lambda s: s["a"] and s["b"] and s["c"] and not s["h"])
check("PV11", "All local checks can finish without aggregate delivery",
      gap, [{"a": True, "b": True, "c": True, "h": False}])

extra = witnesses(("r", "f"), lambda s: s["r"] and not (s["r"] and s["f"]))
completion_violation = witnesses(
    ("r", "f", "d"),
    lambda s: (s["d"] == (s["r"] and s["f"]))
    and s["r"] and not s["d"])
check("PV12", "Extra completion premise and violated sufficient condition",
      {"condition_difference": extra, "sufficient_condition_violation": completion_violation},
      {"condition_difference": [{"r": True, "f": False}],
       "sufficient_condition_violation": [{"r": True, "f": False, "d": False}]})

handoff = witnesses(("report", "logs"),
                    lambda s: s["report"] and not (s["report"] and s["logs"]))
check("PV13", "Upstream report alone does not guarantee required logs",
      handoff, [{"report": True, "logs": False}])

# Only finitely enumerated examples are claimed here; the universal lower-bound
# statement is proved symbolically in Proposition 6 of the manuscript.
check("PV14", "Known 70-minute step exceeds 60 under serial or parallel samples",
      {"known_excess": 70 - 60,
       "all_sample_extensions_violate": all(
           70 + z > 60 and max(70, z) > 60 for z in (0, 5, 20, 100))},
      {"known_excess": 10, "all_sample_extensions_violate": True})

feasible = witnesses(("a",), lambda s: s["a"] and not s["a"])
out = witnesses(("a",), lambda s: s["a"] and not s["a"] and not s["a"])
status = "INCONSISTENT" if not feasible else ("VIOLATED" if out else "PRESERVED")
check("PV15", "Unsatisfiable child must not pass by vacuity",
      {"feasible_assignments": len(feasible), "counterexamples": len(out), "status": status},
      {"feasible_assignments": 0, "counterexamples": 0, "status": "INCONSISTENT"})

child_paths = reachability({("u", "w"), ("w", "v")})
reverse_paths = reachability({("D", "C"), ("C", "A")})
check("PV16", "Paths preserve or reverse a parent precedence relation",
      {"indirect_preservation": ("u", "v") in child_paths,
       "reverse_path": ("D", "A") in reverse_paths,
       "reverse_order_violates_parent": ["D", "C", "A"].index("A")
       > ["D", "C", "A"].index("D")},
      {"indirect_preservation": True, "reverse_path": True,
       "reverse_order_violates_parent": True})

script_path = Path(__file__).resolve()
payload = {
    "kind": "MANUSCRIPT_MATHEMATICAL_EXAMPLE_RECOMPUTATION",
    "manuscript": "manuscript-v0.3.zh-CN.md",
    "script_sha256": hashlib.sha256(script_path.read_bytes()).hexdigest(),
    "uses_product_core": False,
    "model_calls": 0,
    "is_gold_evaluation": False,
    "historical_experiments_rerun": False,
    "total": len(RESULTS),
    "passed": sum(r["passed"] for r in RESULTS),
    "checks": RESULTS,
}
destination = script_path.with_suffix(".json")
content = json.dumps(payload, ensure_ascii=True, indent=2) + "\n"
if destination.exists():
    if destination.read_text(encoding="utf-8") != content:
        raise FileExistsError("Refusing to replace a different verification result")
else:
    destination.write_text(content, encoding="utf-8")
print(json.dumps({"total": payload["total"], "passed": payload["passed"],
                  "result": str(destination)}, ensure_ascii=True))
raise SystemExit(0 if payload["passed"] == payload["total"] else 1)
