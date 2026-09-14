import json
import unittest
from pathlib import Path

from admin_compute import compute
from source_constraints import analyze_source


CASES = {item['id']: item for item in json.loads(
    Path(__file__).with_name('cases_121_140.json').read_text(encoding='utf-8'))}


def analysis(case_id):
    return analyze_source(CASES[case_id]['text'])


def codes(result):
    return {item['code'] for item in result.get('advice', [])}


class Cases121To140(unittest.TestCase):
    def test_all_cases_are_deterministic_source_backed_and_non_adjudicating(self):
        self.assertEqual(set(CASES), set(range(121, 141)))
        for case_id, case in CASES.items():
            with self.subTest(case_id=case_id):
                result = compute(case['text'])
                self.assertEqual(result, compute(case['text']))
                self.assertIsNone(result['businessDecision'])
                current = result.get('sourceAnalysis') or {}
                self.assertEqual(current['coverageAnalysis']['formula'], 'S_required \\ S_extracted')
                self.assertIn('parser coverage only', current['coverageAnalysis']['meaning'])
                for item in current.get('advice', []):
                    self.assertIsNone(item['decision'])

    def test_121_selector_resources_and_lexicalized_nouns(self):
        result = analysis(121); projection = result['projection']['fields']
        self.assertEqual(result['coverageAnalysis']['notExtracted'], [])
        self.assertEqual([(n['kind'], n['value'], n['unit']) for n in result['numbers']], [
            ('selector', '15', 'unspecified'), ('bound', '600', 'seconds'), ('bound', '500', 'lines')])
        self.assertEqual([x['text']['zh-CN'] for x in projection['P']], ['代码重构智能体（执行）'])
        self.assertEqual([x['text']['zh-CN'] for x in projection['I']], ['结算核心服务仓库中复杂度大于 15 的遗留函数'])

    def test_122_token_budget_is_empty_under_explicit_binding_assumption(self):
        result = analysis(122)
        calculation = result['structuralCalculations']['sets'][0]
        self.assertEqual((calculation['unit'], calculation['empty'], calculation['readableResult']), ('tokens', True, '∅'))
        self.assertEqual(calculation['binding']['method'], 'per_call_token_signature')
        self.assertFalse(calculation['binding']['equivalenceProven'])
        self.assertEqual(result['coverageAnalysis']['notExtracted'], ['B', 'P'])
        self.assertIn('interval_empty', codes(result))

    def test_123_cycle_and_124_numeric_negation(self):
        cycle = analysis(123)
        graph = cycle['structuralCalculations']['graph'][0]
        self.assertEqual(set(graph['cyclicComponents'][0]), {'少样本样例微调注入', '黄金测试集评估打分', '意图分类对齐检查'})
        self.assertEqual(cycle['coverageAnalysis']['notExtracted'], ['V'])
        unit = analysis(124)
        self.assertEqual([(n['relation'], n['value'], n['unit'], n['kind']) for n in unit['numbers']], [
            ('le', '120', 'seconds', 'bound'), ('le', '5', 'seconds', 'bound'), ('ge', '85', 'percent', 'goal')])
        self.assertEqual(len(unit['prohibitions']['records']), 1)

    def test_125_and_139_explicit_target_prohibition_intersections(self):
        for case_id, entity in [(125, 'internal-kms-core'), (139, 'release/v2.0-hotfix')]:
            with self.subTest(case_id=case_id):
                result = analysis(case_id); calculation = result['structuralCalculations']['sets'][0]
                self.assertEqual(calculation['overlap'], [entity])
                self.assertIsNone(calculation['authorized'])
                self.assertIn('target_forbidden_overlap', codes(result))

    def test_126_inline_stage_handover_uses_declared_file_difference(self):
        result = compute(CASES[126]['text'])
        self.assertEqual([stage['id'] for stage in result['pipeline']['stages']], ['WP-STAGE-1', 'WP-STAGE-2'])
        calculation = result['pipeline']['handover']['calculations'][0]
        self.assertEqual(calculation['missing'], ['domain_finetuned_vocab.parquet'])
        self.assertEqual(calculation['declaredOutputs'], ['doc_chunks.jsonl'])
        self.assertIn('io_handover_deficit', {x['code'] for x in result['pipeline']['handover']['findings']})

    def test_127_english_roles_units_and_boundaries(self):
        result = analysis(127); fields = result['projection']['fields']
        self.assertEqual(result['coverageAnalysis']['notExtracted'], [])
        self.assertEqual([(n['value'], n['unit']) for n in result['numbers']], [('900', 'seconds'), ('5', 'pull_requests')])
        self.assertIn('vulnerable open-source dependencies in the microservice repository', [x['text']['zh-CN'] for x in fields['I']])
        self.assertEqual([x['text']['zh-CN'] for x in fields['P']], ['Dependency Patching Agent（执行）'])

    def test_128_and_135_and_quorums_are_source_roles_not_grants(self):
        for case_id, authorities in [(128, ['基础架构运维总监', '业务架构师']), (135, ['测试负责智能体', '稳定性架构师'])]:
            with self.subTest(case_id=case_id):
                item = analysis(case_id)['approvals'][0]
                self.assertEqual((item['operator'], item['quorum']), ('AND', 2))
                self.assertEqual(item['authorities'], authorities)
                self.assertIsNone(item['granted'])
        self.assertEqual(analysis(128)['coverageAnalysis']['notExtracted'], ['O', 'V'])

    def test_129_root_effect_conflict_is_propositional_not_first_order(self):
        result = analysis(129); effect = result['effectAnalysis']
        self.assertEqual(effect['calculations'][0]['result'], 'unsat')
        self.assertEqual(effect['calculations'][0]['logicFragment'], 'quantifier-free propositional Boolean constraints')
        self.assertIn('guard_modal_conflict', codes(result))
        self.assertIsNone(effect['decision'])

    def test_130_unless_guard_and_131_orthogonal_dimensions(self):
        telemetry = analysis(130)
        record = telemetry['prohibitions']['records'][0]
        self.assertEqual(record['approvalActor'], 'Lead Security Architect')
        self.assertIn('unless approved by Lead Security Architect', record['guardSource']['quote'])
        self.assertEqual([(n['value'], n['unit']) for n in telemetry['numbers']], [('60', 'seconds'), ('2000', 'lines')])
        training = analysis(131)
        self.assertEqual([(n['value'], n['unit'], n['dimension']) for n in training['numbers']], [
            ('1600', 'gigabytes', 'digital_storage'), ('259200', 'seconds', 'duration')])
        self.assertFalse(training['structuralCalculations']['sets'])

    def test_132_anaphora_and_133_continuous_interval(self):
        entity = analysis(132)
        self.assertIn('anaphora_binding_unresolved', codes(entity))
        search = analysis(133); calculation = search['structuralCalculations']['sets'][0]
        self.assertEqual((calculation['readableResult'], calculation['unit'], calculation['empty']), ('[88,99)', 'percent', False))
        self.assertEqual(search['numbers'][0]['value'], '0.8')

    def test_134_inverted_input_output_and_missing_version(self):
        result = analysis(134); fields = result['projection']['fields']
        self.assertEqual([x['text']['zh-CN'] for x in fields['I']], ['从 Git 仓库拉取的近两周已合并 Pull Request 记录'])
        self.assertIn('标准格式 Markdown 变更日志', [x['text']['zh-CN'] for x in fields['O']])
        self.assertEqual(result['coverageAnalysis']['notExtracted'], ['V'])

    def test_136_different_step_names_do_not_fabricate_cycle(self):
        result = analysis(136); graph = result['structuralCalculations']['graph'][0]
        self.assertEqual(graph['cyclicComponents'], [])
        self.assertIn('dependency_identity_unresolved', codes(result))
        self.assertEqual(result['coverageAnalysis']['notExtracted'], ['B', 'V'])

    def test_137_date_range_does_not_prove_finite_cardinality(self):
        result = analysis(137)
        self.assertIn('finite_cardinality_unproven', codes(result))
        self.assertEqual(result['coverageAnalysis']['notExtracted'], [])

    def test_138_local_exception_and_numeric_prohibition_filter(self):
        result = analysis(138); record = result['prohibitions']['records'][0]
        self.assertIn('测试企业根账号不在此限', record['exceptionSource']['quote'])
        numeric = next(n for n in result['numbers'] if n['kind'] == 'prohibition_filter')
        self.assertEqual((numeric['relation'], numeric['value'], numeric['unit']), ('gt', '10000000', 'CNY'))
        self.assertNotIn(numeric['source'], result['projection']['fields']['R'])

    def test_140_different_patch_effects_stay_unresolved(self):
        result = analysis(140)
        self.assertIn('effect_identity_unresolved', codes(result))
        self.assertNotIn('guard_modal_conflict', codes(result))
        self.assertFalse(result['effectAnalysis']['calculations'])


if __name__ == '__main__':
    unittest.main()
