import json
from pathlib import Path
import unittest
from unittest.mock import patch
from admin_compute import compute,source_slice

CASES=json.loads(Path(__file__).with_name('fixtures.json').read_text(encoding='utf-8'))

class LibraryTests(unittest.TestCase):
    def test_frozen_cases(self):
        for i,case in enumerate(CASES):
            with self.subTest(i=i,text=case['text']):
                result=compute(case['text'])
                if case.get('allInsufficient'):
                    self.assertTrue(all(e['status']=='insufficient_data' for e in result['engines']))
                else:
                    engine=next(e for e in result['engines'] if e['name']==case['engine'])
                    self.assertNotEqual(engine['status'],'insufficient_data')
                    self.assertEqual(len(engine['findings']),case['findings'])
                self.assertEqual(result,compute(case['text']))
                self.assertIsNone(result['businessDecision'])
                for r in result['ir']:
                    s=r['source'];self.assertEqual(source_slice(case['text'],s['start'],s['end']),s['quote'])

    def test_empty_set_and_units(self):
        self.assertEqual(compute('对象范围：{}')['ir'][0]['values'],[])
        r=compute('时长至少2小时；时长最多60分钟')
        self.assertEqual(len(r['engines'][0]['findings']),1)
        r=compute('时长至少1小时；时长最多60分钟')
        self.assertEqual(len(r['engines'][0]['findings']),0)
        self.assertEqual(r['engines'][0]['calculations'][0]['result'],'[Decimal(\'3600\')]')

    def test_unknown_and_unicode(self):
        text='🧭说明。必须修改配置；不得修改配置'
        r=compute(text)
        self.assertEqual(len(r['engines'][1]['findings']),1)
        self.assertTrue(r['uncovered'])
        for x in r['ir']:
            s=x['source'];self.assertEqual(source_slice(text,s['start'],s['end']),s['quote'])
        for text in ['未经授权，不得修改配置','Do not have to modify x, but check first']:
            self.assertTrue(compute(text)['uncovered'])
        for text in ['',None,'x'*100001]:
            with self.assertRaises(ValueError):compute(text)

    def test_error_is_data_and_does_not_skip_other_engines(self):
        with patch('admin_compute.check_sets',side_effect=RuntimeError('private detail')):
            result=compute('必须修改配置；不得修改配置')
        self.assertEqual(result['engines'][0]['status'],'error')
        self.assertEqual(result['engines'][1]['status'],'findings')
        self.assertEqual(result['engines'][2]['status'],'insufficient_data')
        self.assertNotIn('private detail',json.dumps(result))

    def test_discrete_counts(self):
        self.assertEqual(len(compute('数量至少1.1次；数量最多1.5次')['engines'][0]['findings']),1)

if __name__=='__main__':unittest.main()
