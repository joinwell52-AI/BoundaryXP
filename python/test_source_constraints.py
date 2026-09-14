import json
import unittest
from unittest.mock import patch
from pathlib import Path
from source_constraints import analyze_source
from admin_compute import compute

CASES=json.loads(Path(__file__).with_name('complex_cases.json').read_text(encoding='utf-8'))

class SourceTests(unittest.TestCase):
    def test_compound_comparators_preserve_whole_operator(self):
        for op,relation,values in [('大于等于','ge',[False,True,True]),('小于等于','le',[True,True,False]),('至少为','ge',[False,True,True]),('>=','ge',[False,True,True]),('<=','le',[True,True,False])]:
            result=analyze_source('金额'+op+' 700 USD')
            n=result['numbers'][0]
            self.assertEqual(n['relation'],relation)
            self.assertTrue(n['expressionSource']['quote'].startswith(op))
            self.assertEqual([p['matches'] for p in n['probes']],values)
    def test_partial_parser_failure_preserves_existing_engine_results(self):
        with patch('admin_compute._source.analyze_source',side_effect=RuntimeError('private')):
            r=compute('必须修改配置；不得修改配置')
        self.assertIsNone(r['sourceAnalysis']);self.assertEqual(r['sourceAnalysisError']['type'],'RuntimeError')
        self.assertEqual(len(r['engines'][1]['findings']),1);self.assertNotIn('private',json.dumps(r))
    def test_finance_original_and_renamed_values(self):
        for text,amount,seconds in [(CASES[0],'10000','1800'),(CASES[0].replace('10,000','25,500.50').replace('30 分钟','45 分钟').replace('unbilled_invoices','open_balances'),'25500.5','2700')]:
            r=analyze_source(text)
            self.assertEqual([n['value'] for n in r['numbers']],[amount,seconds])
            self.assertEqual([n['boundaryProbe']['matches'] for n in r['numbers']],[False,True])
            self.assertEqual([n['matches'] for n in r['numbers'][0]['probes']],[True,False,False])
            self.assertEqual(r['approvals'][0]['operator'],'OR')
            self.assertEqual([v['satisfies'] for v in r['approvals'][0]['truthTable']],[False,True,True,True])
            self.assertIn('CFO',r['flow']['branches'][0]['otherwise']['quote'])
            self.assertIn('approval_continuation',[f['code'] for f in r['advice']])
            self.assertTrue(r['fields']['R']);self.assertTrue(r['fields']['O'])
    def test_english_numeric_goals_are_not_conditions(self):
        r=analyze_source(CASES[1]);self.assertEqual([n['kind'] for n in r['numbers']],['condition','goal'])
        self.assertEqual([n['value'] for n in r['numbers']],['0.1','100'])
        self.assertFalse(r['flow']['terminationProven'])
        self.assertIn('retry_bound_unknown',[f['code'] for f in r['advice']])
        self.assertIsNone(r['sets']['cardinality'])
    def test_tenant_exclusion_not_invented_population(self):
        r=analyze_source(CASES[2]);self.assertEqual(r['numbers'][0]['value'],'7')
        self.assertEqual(r['numbers'][0]['kind'],'condition')
        self.assertEqual(r['sets']['exclusions'][0]['excluded'],['tenant_001','tenant_vip'])
        self.assertIsNone(r['sets']['cardinality'])
        self.assertIn('selector_unknown',[f['code'] for f in r['advice']])
    def test_temporal_scope_is_not_conflict(self):
        r=analyze_source(CASES[3]);self.assertTrue(r['flow']['temporal'])
        self.assertIn('temporal_reference',[f['code'] for f in r['advice']])
        self.assertNotIn('conflict',[f['code'] for f in r['advice']])
    def test_different_action_time_windows(self):
        r=analyze_source(CASES[4]);self.assertEqual(r['times']['comparisons'][0]['gapMinutes'],60)
        self.assertIsNone(r['times']['comparisons'][0]['conflict'])
        self.assertFalse(r['numbers'][0]['boundaryProbe']['matches'])
        self.assertIn('outcome_output_scope',[f['code'] for f in r['advice']])
    def test_numeric_relations_boundaries_and_boolean_variants(self):
        for op,expected in [('<',False),('<=',True),('>',False),('>=',True),('less than',False),('at most',True),('大于',False),('不超过',True)]:
            r=analyze_source('If amount '+op+' 2,500.50 USD, write a report.')
            self.assertEqual(r['numbers'][0]['value'],'2500.5');self.assertEqual(r['numbers'][0]['boundaryProbe']['matches'],expected)
        r=analyze_source('取得 A 和 B 的 Token 授权')
        self.assertEqual([v['satisfies'] for v in r['approvals'][0]['truthTable']],[False,False,False,True])
        self.assertFalse(analyze_source('not less than 5 USD')['numbers'])
    def test_bilingual_evidence_and_determinism(self):
        for text in CASES+['😀 If balance < 20 usd, write CSV; total duration must not exceed 2 minutes.','整理一下资料。','Use v2.4.1, e.g. alpha.']:
            r=analyze_source(text);self.assertEqual(r,analyze_source(text));self.assertFalse(r['summary']['completeInterpretation'])
            for s in [c['source'] for c in r['clauses']]+[n['expressionSource'] for n in r['numbers']]:
                self.assertEqual(text.encode('utf-16-le')[s['start']*2:s['end']*2].decode('utf-16-le'),s['quote'])
            for f in r['advice']:self.assertIn('en',f['suggestion']);self.assertIsNone(f['decision'])

    def test_second_batch_units_and_scope(self):
        cases=json.loads(Path(__file__).with_name('complex_cases_batch2.json').read_text(encoding='utf-8'))
        r=analyze_source(cases[0]);self.assertEqual([n['value'] for n in r['numbers']],['0.05','2','10','5','180'])
        intersection=next(c for c in r['structuralCalculations']['sets'] if c['operation']=='source_bound_intersection')
        self.assertFalse(intersection['empty']);self.assertEqual(intersection['interval'],"[Decimal('0.05'),Decimal('2'))")
        r=analyze_source(cases[1]);self.assertEqual(r['approvals'][0]['operator'],'AND')
        # The signatures are prerequisites, not a command to export. The
        # unresolved final guard must be visible without inventing a conflict.
        self.assertNotIn('guard_modal_conflict',[f['code'] for f in r['advice']])
        self.assertIn('guard_binding_unresolved',[f['code'] for f in r['advice']])
        self.assertFalse([r for r in r['guardAnalysis']['rules'] if r['modality']=='REQUIRE'])
        r=analyze_source(cases[2]);self.assertEqual(r['structuralCalculations']['sets'][0]['overlap'],['db-primary'])
        r=analyze_source(cases[3]);g=r['structuralCalculations']['graph'][0]
        self.assertEqual(g['topologicalOrder'],['A','C','D','B']);self.assertFalse(g['cyclicComponents'])
        r=analyze_source(cases[3].replace('C 必须在 A 完成','C 必须在 B 完成'))
        self.assertEqual(sorted(r['structuralCalculations']['graph'][0]['cyclicComponents'][0]),['B','C','D'])
        r=analyze_source(cases[4]);self.assertEqual([n['value'] for n in r['numbers']],['5','3'])
        self.assertFalse(r['structuralCalculations']['sets']) # different named metrics not auto-conjoined
        r=analyze_source('调用次数至少1.1次且最多1.5次')
        self.assertTrue(r['structuralCalculations']['sets'][0]['empty'])
    def test_postfix_and_limit_wording_variants(self):
        for text,expected in [('本次时间限制在45分钟以内','2700'),('单次执行最长2小时','7200'),('操作应于10分钟内完成','600'),('全流程15分钟内结束','900'),('发信接口上限为500次','500')]:
            r=analyze_source(text);self.assertEqual(len(r['numbers']),1);self.assertEqual(r['numbers'][0]['value'],expected)
        r=analyze_source('禁止在主库锁表超过5秒')
        self.assertEqual(r['numbers'][0]['kind'],'prohibition_filter')
        self.assertEqual([p['matches'] for p in r['numbers'][0]['probes']],[False,False,True])
        self.assertFalse(r['structuralCalculations']['sets'])

if __name__=='__main__':unittest.main()
