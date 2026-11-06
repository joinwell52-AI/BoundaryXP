"""Finite mathematical examples for the manuscript; not BXP Core or a parser."""
import argparse
import copy
import hashlib
import itertools
import json
import pathlib
import subprocess
import sys
import tempfile

ROOT = pathlib.Path(__file__).resolve().parent


def read(name):
    return json.loads((ROOT / name).read_text(encoding="utf-8"))


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def evaluate(expr, values):
    if isinstance(expr, (bool, int)):
        return expr
    if isinstance(expr, str):
        return values[expr]
    op, *args = expr
    if op == "literal":
        require(len(args) == 1, "literal arity")
        return args[0]
    supported = {"and", "or", "not", "eq", "le", "add", "implies"}
    require(op in supported, "unsupported operator: " + op)
    vals = [evaluate(arg, values) for arg in args]
    if op in {"not"}:
        require(len(vals) == 1 and isinstance(vals[0], bool), "not type/arity")
        return not vals[0]
    if op in {"and", "or", "implies"}:
        require(all(isinstance(v, bool) for v in vals), "boolean type")
        if op == "and":
            return all(vals)
        if op == "or":
            return any(vals)
        require(len(vals) == 2, "implies arity")
        return not vals[0] or vals[1]
    if op == "add":
        require(all(type(v) is int for v in vals), "integer type")
        return sum(vals)
    require(len(vals) == 2, "comparison arity")
    if op == "eq":
        return type(vals[0]) is type(vals[1]) and vals[0] == vals[1]
    require(all(type(v) is int for v in vals), "integer comparison type")
    return vals[0] <= vals[1]


def assignments(domains):
    names = list(domains)
    for values in itertools.product(*(domains[n] for n in names)):
        yield dict(zip(names, values))


def project(graph):
    views = {name: [] for name in "IOAPRVCB"}
    shared_roots = []
    dispositions = {}
    for root in graph["roots"]:
        node = graph["nodes"][root]
        targets = node["payload"].get("views", [])
        for target in targets:
            require(target in views, "unknown view")
            views[target].append(root)
        if not targets:
            disposition = node["payload"].get("disposition")
            require(disposition is not None, "unaccounted root")
            shared_roots.append(root)
            dispositions[root] = disposition
    return {"kind": "PAPER_7PLUS1_VIEW_GRAPH_NOT_WIRE_SCHEMA", "views": views,
            "shared_roots": shared_roots, "dispositions": dispositions,
            "nodes": copy.deepcopy(graph["nodes"]), "root_inventory": graph["roots"],
            "absent_views": graph["absent_views"]}


def recover(ir):
    starts = set(ir["shared_roots"])
    for refs in ir["views"].values():
        starts.update(refs)
    require(starts == set(ir["root_inventory"]), "projection root coverage")
    require(set(ir["dispositions"]) == set(ir["shared_roots"]), "root dispositions")
    seen = {}
    pending = sorted(starts)
    while pending:
        identifier = pending.pop()
        if identifier in seen:
            continue
        require(identifier in ir["nodes"], "dangling reference")
        node = ir["nodes"][identifier]
        seen[identifier] = node
        pending.extend(node["refs"])
    return {"nodes": seen, "roots": ir["root_inventory"], "absent_views": ir["absent_views"]}


def basic_uses(node):
    """The declared finite example's use rules, independent of stored view labels."""
    if node["type"] != "CLAIM":
        return None
    claim = node["payload"]
    if claim["predicate"] == "before":
        return None  # A typed shared relation, not a basic purpose claim.
    require(claim["layer"] == "MAIN", "unresolved semantic layer")
    if claim["modality"] == "FORBIDDEN":
        return {"B"}
    require(claim["modality"] in {"REQUIRED", "PERMITTED"}, "unsupported modality")
    if claim["predicate"] == "elapsed_limit":
        return {"R"}
    require(claim["predicate"] in {"coordinate", "assign_checks", "check", "generate", "review", "submit"},
            "unsupported basic form")
    uses = {"A"}
    roles = set(claim["roles"])
    if "INPUT_OBJECT" in roles:
        uses.add("I")
    if roles & {"RESULT", "DELIVERABLE"}:
        uses.add("O")
    if roles & {"ORGANIZER", "PERFORMER", "ASSIGNEE", "REVIEWER", "RECIPIENT"}:
        uses.add("P")
    return uses


def use_coverage(graph, ir):
    basics = {identifier: basic_uses(node) for identifier, node in graph["nodes"].items()}
    basics = {identifier: uses for identifier, uses in basics.items() if uses is not None}
    actual = {identifier: {view for view, refs in ir["views"].items() if identifier in refs}
              for identifier in basics}
    return bool(basics) and all(uses and actual[identifier] == uses for identifier, uses in basics.items()), len(basics)


def mapped(values, model):
    require(model["rho"].get("modify_config") == "modify_config", "hidden observed modification")
    return {name: evaluate(expr, values) for name, expr in model["rho"].items()}


def free_vars(expr):
    if isinstance(expr, str):
        return {expr}
    if isinstance(expr, (bool, int)) or expr[0] == "literal":
        return set()
    return set().union(*(free_vars(a) for a in expr[1:]))


def substitute(expr, rho):
    if isinstance(expr, str):
        return rho[expr]
    if isinstance(expr, (bool, int)) or expr[0] == "literal":
        return expr
    return [expr[0], *(substitute(a, rho) for a in expr[1:])]


def rejected(fn):
    try:
        fn()
    except (AssertionError, KeyError, ValueError):
        return True
    return False


def verify_manifest(required):
    path = ROOT / "MANIFEST.json"
    require(path.exists() or not required, "missing MANIFEST.json")
    if not path.exists():
        return
    manifest = read("MANIFEST.json")
    for name, digest in manifest["files"].items():
        path = ROOT / name
        require(path.is_file(), "missing file: " + name)
        require(hashlib.sha256(path.read_bytes()).hexdigest() == digest, "hash mismatch: " + name)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--record", help="write a new result file; never overwrite")
    args = parser.parse_args()
    verify_manifest(required=not args.record)
    expected = read("expected.json")
    graph = read("graph.json")
    ir = read("ir.json")
    require(project(graph) == ir, "Project differs from supplied instance")
    rebuilt = recover(ir)
    require(rebuilt == graph, "Recover differs from supplied graph")
    source = (ROOT / "sources/parent.md").read_bytes().decode("utf-8")
    ledger = read("source-ledger.json")
    for item in ledger["spans"]:
        require(source[item["start"]:item["end"]] == item["quote"], "source span mismatch")
    covered = set()
    for item in ledger["partition"]:
        require(source[item["start"]:item["end"]] == item["quote"], "source partition mismatch")
        covered.update(range(item["start"], item["end"]))
    complete = all(i in covered or char.isspace() for i, char in enumerate(source))
    require(complete, "uncovered non-whitespace source")
    for candidate in read("candidate-source-ledger.json"):
        raw = (ROOT / candidate["source"]).read_bytes()
        require(hashlib.sha256(raw).hexdigest() == candidate["sha256"], "candidate source identity")
        text = raw.decode("utf-8")
        for binding in candidate["bindings"]:
            require(text[binding["start"]:binding["end"]] == binding["quote"], "candidate source binding")
    summary = {"legacy_checks": 16, "projection": {
        "recovered_equal": rebuilt == graph, "root_count": len(graph["roots"]),
        "absent_views": list(ir["absent_views"]), "dangling_refs": 0,
        "source_partition_complete": complete}}

    with tempfile.TemporaryDirectory(prefix="bxp-paper-legacy-") as tmp:
        dest = pathlib.Path(tmp)
        require(dest.resolve().is_relative_to(pathlib.Path(tempfile.gettempdir()).resolve()), "temporary path containment")
        for name in ("verification-v0.3.py", "verification-v0.3.json"):
            (dest / name).write_bytes((ROOT / "legacy" / name).read_bytes())
        result = subprocess.run([sys.executable, str(dest / "verification-v0.3.py")],
                                capture_output=True, text=True)
        require(result.returncode == 0, "legacy recomputation: " + result.stderr)
        legacy = json.loads((dest / "verification-v0.3.json").read_text(encoding="utf-8"))
        require(legacy["total"] == legacy["passed"] == 16, "legacy checks")
        require([v["id"] for v in read("legacy/inputs.json")] ==
                [v["id"] for v in legacy["checks"]], "legacy input inventory")

    model = read("models.json")
    domain = list(assignments(model["domains"]))
    parents = model["parent_conjuncts"]
    case_results = {}
    witnesses = {}
    for name, delta in model["candidate_delta"].items():
        feasible = [v for v in domain if evaluate(model["candidate_common"], v) and evaluate(delta, v)]
        bad = []
        for v in feasible:
            image = mapped(v, model)
            claims = [c["claim"] for c in parents if not evaluate(c["expr"], image)]
            if claims:
                bad.append({"candidate": v, "parent_image": image, "violated_claims": claims})
        status = "INCONSISTENT" if not feasible else ("VIOLATED" if bad else "PRESERVED")
        case_results[name] = {"feasible": len(feasible), "counterexamples": len(bad), "status": status}
        witnesses[name] = {"feasible_example": feasible[0] if feasible else None,
                           "counterexample": bad[0] if bad else None}
    bad = witnesses["bad"]["counterexample"]
    case_results["bad"].update({"violated_claims": bad["violated_claims"],
        "elapsed": bad["parent_image"]["elapsed"], "modify_config": bad["parent_image"]["modify_config"]})
    summary["cases"] = {"good": case_results["good"], "bad": case_results["bad"],
        "ambiguous": {"interpretations": 2,
            "statuses": [case_results["ambiguous_report"]["status"], case_results["ambiguous_config"]["status"]],
            "status": "UNDERDETERMINED"}, "inconsistent": case_results["inconsistent"]}

    old_feasible = [(g, q) for g, q in itertools.product((False, True), repeat=2) if not g]
    covered_e = [g for g in (False, True) if any(e == g for e, _ in old_feasible)]
    summary["environment"] = {"old_nonempty_subset_accepts": bool(old_feasible) and all(not g or q for g, q in old_feasible),
        "covered_external": covered_e, "missing_external": [g for g in (False, True) if g not in covered_e],
        "revised_accepts": len(covered_e) == 2}

    guarded, unguarded = [], []
    for e, q1, q2 in itertools.product((False, True), repeat=3):
        a1, a2 = e, not e
        inactive = (a1 or not q1) and (a2 or not q2)
        if inactive and (not a1 or q1) and (not a2 or q2):
            guarded.append({"e": e, "q1": q1, "q2": q2, "costs": [20 if a1 else 0, 30 if a2 else 0]})
        if inactive and q1 and q2:
            unguarded.append((e, q1, q2))
    summary["branches"] = {"guarded_feasible": len(guarded), "unguarded_feasible": len(unguarded),
        "inactive_costs_zero": all((v["e"] or v["costs"][0] == 0) and (not v["e"] or v["costs"][1] == 0) for v in guarded)}

    stop_input = model["supplementary_inputs"]["stop"]
    vocabulary = set(stop_input["event_vocabulary"])

    def stop_valid(high_risk, trace):
        if len(trace) != stop_input["horizon"] or "inspect" not in trace[0]:
            return False
        if any(not events <= vocabulary for events in trace):
            return False
        if high_risk:
            return ("risk" in trace[1] and "stop" in trace[2] and "report" in trace[3]
                    and all("inspect" not in events for events in trace[2:]))
        return all("risk" not in events for events in trace) and "deliver" in trace[3]

    normal = ({"inspect"}, set(), set(), {"deliver"})
    emergency = ({"inspect"}, {"risk"}, {"stop"}, {"report"})
    voluntary = ({"inspect"}, {"risk"}, {"stop"}, {"report", "deliver"})
    continued = ({"inspect"}, {"risk"}, {"stop", "inspect"}, {"report"})
    emergency_choices = [emergency, voluntary]
    old_prohibition = all("deliver" not in events for events in voluntary[2:])
    summary["stop"] = {"normal_example_valid": stop_valid(False, normal),
        "emergency_without_delivery_valid": stop_valid(True, emergency),
        "emergency_with_delivery_valid": stop_valid(True, voluntary),
        "continue_after_risk_valid": stop_valid(True, continued),
        "old_prohibition_rejects_voluntary_delivery": stop_valid(True, voluntary) and not old_prohibition,
        "admissible_emergency_delivery_choices": sum(stop_valid(True, t) for t in emergency_choices),
        "unconditional_delivery_choices": sum(stop_valid(True, t) and "deliver" in t[3] for t in emergency_choices)}

    scope = model["supplementary_inputs"]["scope"]
    require(scope["candidate"] == "true" and scope["parent"] == "not e", "scope example contract")
    unscoped = [e for e in scope["environment_type"] if e]
    scoped = [e for e in unscoped if e in scope["admissible"]]
    summary["scope"] = {"scoped_preserved": bool(scope["admissible"]) and not scoped,
        "scoped_counterexamples": scoped, "unscoped_counterexamples": unscoped}

    covered_uses, basic_count = use_coverage(graph, ir)
    swapped = copy.deepcopy(ir)
    swapped["views"]["A"], swapped["views"]["B"] = swapped["views"]["B"], swapped["views"]["A"]
    summary["usage"] = {"declared_use_coverage": covered_uses, "basic_claims": basic_count,
        "swapped_views_still_recover_graph": recover(swapped) == graph,
        "swapped_views_fail_use_coverage": not use_coverage(graph, swapped)[0]}

    central = model["supplementary_inputs"]["central_queries"]
    query_domain = list(assignments({name: [False, True] for name in central["variables"]}))
    task, same, weaker = central["task"], central["equivalent"], central["weaker"]
    reverse = [v for v in query_domain if evaluate(weaker, v) and not evaluate(task, v)]
    summary["central_queries"] = {
        "consistent": any(evaluate(task, v) for v in query_domain),
        "member": evaluate(task, central["membership"]),
        "equivalent": all(evaluate(task, v) == evaluate(same, v) for v in query_domain),
        "implies_weaker": all(not evaluate(task, v) or evaluate(weaker, v) for v in query_domain),
        "reverse_implication": not reverse, "reverse_counterexample": reverse[0] if reverse else None}
    interfaces = read("interface-inputs.json")
    source_input = interfaces["source_correspondence"]
    source_domain = list(assignments(source_input["domains"]))
    source_results = {}
    for name, graph_expr in source_input["graphs"].items():
        omissions = [v for v in source_domain if evaluate(graph_expr, v) and not evaluate(source_input["task"], v)]
        strengthenings = [v for v in source_domain if evaluate(source_input["task"], v) and not evaluate(graph_expr, v)]
        source_results[name] = {
            "complete": not omissions, "sound": not strengthenings,
            "equal_boundary": not omissions and not strengthenings,
            "omission_witness": omissions[0] if omissions else None,
            "strengthening_witness": strengthenings[0] if strengthenings else None}
    summary["source_correspondence"] = source_results

    auxiliary = interfaces["auxiliary_definitions"]
    observations = list(assignments(auxiliary["observation_domain"]))
    require(not (set(auxiliary["observation_domain"]) & set(auxiliary["auxiliary_domain"])), "auxiliary variable capture")
    extended_domain = list(assignments({**auxiliary["observation_domain"], **auxiliary["auxiliary_domain"]}))
    definition = auxiliary["definition"]
    extensions = [v for v in extended_domain if evaluate(definition, v)]
    left, body = auxiliary["left_boundary"], auxiliary["right_body"]
    witness = auxiliary["false_witness"]
    wrong_right = evaluate(definition, witness) and evaluate(body, witness)
    guarded_implication = [v for v in extensions if evaluate(left, v) and not evaluate(body, v)]
    guarded_equivalence = [v for v in extensions if evaluate(left, v) != evaluate(body, v)]
    projection = sorted({v["t"] for v in extensions if not evaluate(auxiliary["nontrivial_body"], v)})
    original_projection = sorted(v["t"] for v in observations if not max(v["t"], 0) <= 1)
    legal = auxiliary["exact_domain_example"]
    represented = sorted(v["t"] for v in observations if evaluate(legal["predicate"], v))
    summary["auxiliary_definitions"] = {
        "sampled_definition_total_unique": all(sum(w["t"] == v["t"] for w in extensions) == 1 for v in observations),
        "original_boundaries_equal": all(evaluate(left, v) == (max(v["t"], 0) >= 0) for v in observations),
        "false_witness": witness,
        "naive_implication_accepts_witness": evaluate(left, witness) and not wrong_right,
        "naive_equivalence_accepts_witness": evaluate(left, witness) != wrong_right,
        "witness_satisfies_definition": evaluate(definition, witness),
        "guarded_implication_counterexamples": guarded_implication,
        "guarded_equivalence_counterexamples": guarded_equivalence,
        "nontrivial_counterexample_projection": projection,
        "nontrivial_projection_matches_original": projection == original_projection,
        "declared_legal_domain_exact_on_sample": represented == sorted(legal["admissible"])}

    canon = model["supplementary_inputs"]["canonicalization"]
    summary["equivalence"] = {"canonical_equal": json.dumps(canon["left"], sort_keys=True) == json.dumps(canon["right"], sort_keys=True),
        "semantic_equal": all(evaluate(canon["left"], v) == evaluate(canon["right"], v)
                              for v in assignments({"p": [False, True], "q": [False, True]}))}

    local, composite, coverage = [], [], []
    for item in parents:
        pulled = substitute(item["expr"], model["rho"])
        owners = {model["ownership"][v] for v in free_vars(pulled)}
        (local if len(owners) == 1 and "COMPOSITE" not in owners else composite).append(pulled)
        coverage.append({"parent_item": item["id"], "claim": item["claim"], "owners": sorted(owners)})
    equivalent = all(all(evaluate(c["expr"], mapped(v, model)) for c in parents) ==
                     (all(evaluate(c, v) for c in local) and all(evaluate(c, v) for c in composite)) for v in domain)
    summary["decomposition"] = {"local": len(local), "composite": len(composite),
        "all_parent_conjuncts_covered": len(coverage) == len(parents) and len({c["parent_item"] for c in coverage}) == len(parents),
        "reassembled_equivalent": equivalent}
    missing = copy.deepcopy(ir)
    missing["views"]["B"].remove("c11")
    lost_arg = copy.deepcopy(ir)
    lost_arg["nodes"]["c09"]["payload"]["ordered_claims"].reverse()
    hidden = copy.deepcopy(model)
    hidden["rho"]["modify_config"] = False
    summary["mutations"] = {"missing_projection_root_rejected": rejected(lambda: recover(missing)),
        "lost_ordered_argument_rejected": rejected(lambda: require(recover(lost_arg) == graph, "changed argument order")),
        "hidden_modification_rejected": rejected(lambda: mapped(domain[0], hidden)),
        "unsupported_operator_rejected": rejected(lambda: evaluate(["multiply", "qa_minutes", "ops_minutes"], domain[0]))}

    payload = {"kind": "FINITE_MATHEMATICAL_REPRODUCTION", "uses_product_core": False, "model_calls": 0,
        "protocol_conformance_claim": False, "gold_evaluation": False, "legacy_checks": 16,
        "supplementary_groups": 16, "summary": summary, "witnesses": witnesses,
        "coverage_ledger": coverage, "guarded_branch_assignments": guarded,
        "finite_candidate_domain_size": len(domain)}
    if args.record:
        output = pathlib.Path(args.record)
        if not output.is_absolute():
            output = ROOT / output
        with output.open("x", encoding="utf-8", newline="\n") as handle:
            json.dump(payload, handle, ensure_ascii=False, indent=2)
            handle.write("\n")
    require(summary == expected, "mathematical expectation mismatch; preserve the recorded result and inspect")
    if (ROOT / "actual.json").exists():
        require(read("actual.json") == payload, "recomputed result differs from frozen actual.json")
    print(json.dumps({"passed": True, "legacy_checks": 16, "supplementary_groups": 16,
        "domain_size": len(domain), "models": {k: v["status"] for k, v in summary["cases"].items()}}, ensure_ascii=True))


if __name__ == "__main__":
    main()
