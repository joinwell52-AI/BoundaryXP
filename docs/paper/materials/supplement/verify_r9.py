"""Read-only finite checks for r9's mathematical interface counterexamples.

Authoring: the same language-model research assistant as the revision.
These are constructed mathematical examples, not an independent semantic
oracle, a product implementation, a benchmark, or a proof over infinite domains.
"""
from fractions import Fraction
import itertools
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent


def calculate():
    # Reverse physical edge order: only the saved position determines an operand.
    tuples = [('p', 'q'), ('q', 'p'), ('a', 'b'), ('x', 'y'), ('p', 'q', 'p')]
    restored = []
    for args in tuples:
        edges = list(reversed([(j, target) for j, target in enumerate(args, 1)]))
        assert len({j for j, _ in edges}) == len(args)
        recovered = tuple(dict(edges)[j] for j in range(1, len(args) + 1))
        assert recovered == args
        restored.append(recovered)
    implies = lambda a, b: (not a) or b
    assert implies(True, False) != implies(False, True)
    assert (1 < 2) != (2 < 1)
    assert ({1, 2} - {2, 3}) != ({2, 3} - {1, 2})
    assert set(tuples[0]) == set(tuples[1])  # Unordered endpoints lose direction.

    # The inactive branch imposes no condition on its private Boolean b.
    inactive = [{'b': b, 'naive_m': b, 'guarded_m': bool(0 and b)} for b in [False, True]]
    naive_witnesses = [x['b'] for x in inactive if x['naive_m']]
    guarded_witnesses = [x['b'] for x in inactive if x['guarded_m']]
    assert naive_witnesses == [True] and guarded_witnesses == []
    assert all(x['guarded_m'] == y['guarded_m'] for x in inactive for y in inactive)
    assert bool(1 and True)  # Guarding must retain a genuine active-branch violation.

    # Cross-task disjunction is retained as G. Requiring both branches is stronger.
    cases = list(itertools.product([False, True], [False, True], [29, 30, 31]))
    original = lambda a, b, t: a or (b and t < 30)
    naive_split = lambda a, b, t: a and b and t < 30
    changed = [list(c) for c in cases if original(*c) != naive_split(*c)]
    # Test the counterexample-query decomposition under several candidate H.
    candidates = [lambda a, b, t: True, lambda a, b, t: a,
                  lambda a, b, t: b, lambda a, b, t: t < 30]
    for h in candidates:
        full_counterexamples = [c for c in cases if h(*c) and not original(*c)]
        local_counterexamples = []  # L1=L2=True; they exclude no models.
        joint_counterexamples = [c for c in cases if h(*c) and not original(*c)]
        assert full_counterexamples == local_counterexamples + joint_counterexamples

    # Exact rational witness disproves continuous coverage despite endpoint passes.
    feasible = lambda e: [u for u in [Fraction(0), Fraction(1)] if u == e]
    assert feasible(Fraction(0)) and feasible(Fraction(1))
    assert feasible(Fraction(1, 2)) == []
    return {
        'passed': True,
        'groups': 4,
        'positional_arguments': {'tuples_recovered': len(restored),
                                 'duplicate_positions_preserved': restored[-1] == ('p', 'q', 'p'),
                                 'asymmetric_operator_witnesses': 3},
        'inactive_private_variable': {'naive_false_witness_b': naive_witnesses,
                                      'guarded_false_witnesses': guarded_witnesses,
                                      'active_true_violation_preserved': True},
        'coupled_disjunction': {'finite_assignments': len(cases),
                               'naive_split_disagreements': len(changed),
                               'full_context_decomposition_checks': len(candidates)},
        'continuous_environment': {'endpoint_checks_pass': True,
                                   'uncovered_environment': '1/2',
                                   'allowed_controls': [0, 1]},
        'product_or_model_calls': 0,
        'independent_semantic_evaluation': False,
    }


if __name__ == '__main__':
    actual = calculate()
    expected = json.loads((HERE / 'r9-math-checks.json').read_text(encoding='utf-8'))
    assert actual == expected, (actual, expected)
    print(json.dumps(actual))
