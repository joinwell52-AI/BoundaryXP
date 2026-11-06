"""Recount the frozen finite model and locate GOOD's explicit prohibition."""
from pathlib import Path
import argparse
import hashlib
import importlib.util
import itertools
import json
import math

HERE = Path(__file__).resolve().parent
REPRO = HERE.parent / 'repro-v0.8'
read = lambda p: json.loads(p.read_text(encoding='utf-8'))
sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()


def verify():
    spec = importlib.util.spec_from_file_location('frozen_v08_verifier', REPRO / 'verify.py')
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    model = read(REPRO / 'models.json')
    domains = model['domains']
    names = list(domains)
    rows = [dict(zip(names, values)) for values in itertools.product(*(domains[n] for n in names))]
    assert len(rows) == math.prod(len(v) for v in domains.values()) == 4096
    booleans = [name for name, values in domains.items() if all(type(v) is bool for v in values)]
    assert len(booleans) == 10
    assert domains['order'] == ['review_then_submit', 'submit_then_review']
    assert domains['ops_minutes'] == [20]
    assert domains['qa_minutes'] == [10, 20]
    assert domains['pm_minutes'] == [5]
    common = [v for v in rows if module.evaluate(model['candidate_common'], v)]
    assert len(common) == 4
    counts = {}
    results = {}
    for name, delta in model['candidate_delta'].items():
        selected = [v for v in common if module.evaluate(delta, v)]
        counts[name] = len(selected)
        violations = []
        for v in selected:
            parent = module.mapped(v, model)
            failed = [c['claim'] for c in model['parent_conjuncts'] if not module.evaluate(c['expr'], parent)]
            if failed:
                violations.append(failed)
        results[name] = {'selected': len(selected), 'violating': len(violations), 'failed_claims': violations}
    assert counts == {'good': 1, 'bad': 1, 'ambiguous_report': 1, 'ambiguous_config': 1, 'inconsistent': 0}
    assert results['good']['violating'] == 0
    assert results['bad']['failed_claims'] == [['c11']]
    assert all(v['qa_minutes'] == 10 for v in common)
    ledger = next(v for v in read(REPRO / 'candidate-source-ledger.json') if v['candidate'] == 'good')
    source = REPRO / ledger['source']
    text = source.read_text(encoding='utf-8')
    assert sha(source) == ledger['sha256']
    delta = next(b for b in ledger['bindings'] if b['id'] == 'good:delta')
    assert text[delta['start']:delta['end']] == delta['quote'] == '不实际修改系统配置'
    scope = '本分解的实际操作限定为上述步骤。'
    assert scope in text
    return {
        'passed': True,
        'kind': 'READ_ONLY_FROZEN_FINITE_DOMAIN_AND_SOURCE_AUDIT',
        'inputs': {name: sha(REPRO / name) for name in ['models.json', 'verify.py', 'candidate-source-ledger.json', 'sources/good.md']},
        'domains': domains,
        'boolean_variables_in_storage': len(booleans),
        'order_values': 2,
        'binary_dimensions_in_manuscript_including_order': 11,
        'cartesian_product': '2^8 * 2^2 * 2 * 1 * 2 * 1 = 4096',
        'raw_assignment_count': len(rows),
        'independent_global_well_formedness_filter': {
            'status': 'NOT_RUN_IN_FROZEN_SCRIPT',
            'post_filter_count': None,
            'scope': 'Raw valuations are not reported as well-formed executions; explicit candidate schedules are supplied in section 6.2.'
        },
        'candidate_common_count': len(common),
        'candidate_results': results,
        'rational_domain_claim': 'Selected finite subset only; not exhaustive over nonnegative rational stage durations.',
        'good_negative_source': {**delta, 'source': ledger['source'], 'source_sha256': sha(source), 'explicit_scope_quote': scope},
        'model_calls': 0,
        'frozen_files_modified': False,
    }


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--record', action='store_true')
    args = parser.parse_args()
    result = verify()
    target = HERE / 'r17-clarifications.json'
    if args.record:
        target.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    else:
        assert read(target) == result
    print(json.dumps({'passed': True, 'raw_assignments': result['raw_assignment_count'],
                      'candidate_common': result['candidate_common_count'],
                      'selected': {k: v['selected'] for k, v in result['candidate_results'].items()},
                      'negative_source_verified': True, 'independent_global_well_formedness_filter': 'NOT_RUN_IN_FROZEN_SCRIPT'}))
