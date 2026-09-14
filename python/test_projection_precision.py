import unittest
from source_constraints import analyze_source


def fields(result,k):return [x['text']['zh-CN'] for x in result['projection']['fields'][k]]


class ProjectionPrecision(unittest.TestCase):
    def test_english_count_bound_does_not_invent_gateway_actor(self):
        r=analyze_source('SMS gateway calls up to 40 times; Send reminder to Customer.')
        self.assertEqual([(n['value'],n['unit']) for n in r['numbers']],[('40','count')])
        self.assertEqual(fields(r,'P'),[])
        self.assertFalse(any('gateway' in x for x in fields(r,'A')))

    def test_frequency_keeps_denominator_and_does_not_become_total_calls(self):
        r=analyze_source('API call rate at most 50 calls per second; Total calls at most 500 calls.')
        self.assertEqual([(n['value'],n['unit']) for n in r['numbers']],[('50','calls_per_second'),('500','count')])
        self.assertIn('次/秒',fields(r,'R')[0])
        self.assertFalse(any(x['code']=='interval_empty' for x in r['advice']))

    def test_direct_english_negative_comparison(self):
        r=analyze_source('Inspection time shall not exceed 1800 seconds; Compensation prohibited to be greater than 500 dollars; Shall not erase the disk unless approved by Director.')
        self.assertEqual([(n['relation'],n['unit'],n['value']) for n in r['numbers']],
                         [('le','seconds','1800'),('le','dollar_unspecified','500')])
        self.assertEqual(len(fields(r,'B')),1)
        self.assertIn('unless approved by Director',fields(r,'B')[0])
        self.assertFalse(any('erase' in x.lower() for x in fields(r,'A')))

    def test_reference_ends_at_source_clause_not_task_end(self):
        for prefix in ['According to','Per','Under']:
            r=analyze_source(prefix+' Policy v3.2，由 Analyst 生成 report.json。严禁删除日志。')
            self.assertEqual(fields(r,'V'),['Policy v3.2'])
            self.assertEqual(r['projection']['contract']['actions'][0]['guard_sources'],[])
            self.assertTrue(fields(r,'B'))

    def test_completion_markers_do_not_enter_artifact_or_drop_assertion(self):
        for clause,want in [('全部车辆完成状态标记即为任务完成','全部车辆完成状态标记'),
                ('全部托盘贴好标记即为完成标志','全部托盘贴好标记'),
                ('Generates receipt is completed','Generates receipt'),
                ('Generates receipt marks completion','Generates receipt')]:
            r=analyze_source(clause)
            self.assertIn(want,fields(r,'C'))
            self.assertFalse(any('completed' in x for x in fields(r,'O')))

    def test_explicit_actor_declaration_and_comma_binding(self):
        for actor in ['Dispatcher','Network Engineer','Unit Alpha']:
            r=analyze_source('By '+actor+', read orders.csv.')
            self.assertIn(actor+'（执行）',fields(r,'P'))
            frame=r['projection']['contract']['actions'][0]
            self.assertEqual(next(x['value'] for x in frame['roles'] if x['name']=='executor'),actor)
        r=analyze_source('由分拣专员执行；导出木质托盘件。')
        self.assertIn('分拣专员（执行）',fields(r,'P'))
        self.assertFalse(any(x['name']=='executor' for x in r['projection']['contract']['actions'][0]['roles']))

    def test_unknown_by_clause_does_not_make_an_executor(self):
        r=analyze_source('By Analyst while weather permits; read orders.csv.')
        self.assertEqual(fields(r,'P'),[])

    def test_stated_retry_bound_is_not_reported_missing(self):
        for text in ['通信重试次数禁止大于三次。','Retries per node up to 3 calls.','API retry count 上限为 3 次。']:
            self.assertNotIn('retry_bound_unknown',[x['code'] for x in analyze_source(text)['advice']])


if __name__=='__main__':unittest.main()
