import json
import unittest
from pathlib import Path
from source_constraints import analyze_source

CASE='对商户批量执行退款操作 `batch_refund`。未经 Finance_Director 电子签名授权，严禁调用该退款接口；但若系统收到来自风控系统的高危欺诈拦截指令，必须立即执行 `batch_refund` 原路退回资金；调用耗时须在 60 秒内结束。'

class GuardTests(unittest.TestCase):
    def test_original_case_and_renaming(self):
        for text,name,actor in [(CASE,'batch_refund','Finance_Director'),(CASE.replace('batch_refund','release_hold').replace('Finance_Director','Accounts_Lead').replace('60 秒','90 秒'),'release_hold','Accounts_Lead')]:
            result=analyze_source(text);g=result['guardAnalysis']
            self.assertEqual(len(g['rules']),2)
            self.assertTrue(all(r['predicate']=={'verb':'invoke','target':name} for r in g['rules']))
            c=g['calculations'][0]
            self.assertEqual(c['guardOverlap'],'sat');self.assertEqual(c['jointActionConstraints'],'unsat')
            self.assertIn({'kind':'approval','name':actor,'value':False},c['witness'])
            self.assertTrue(any(v['kind']=='event' and v['value'] for v in c['witness']))
            self.assertEqual(len(c['truthTable']),4)
            self.assertIn('guard_modal_conflict',[f['code'] for f in result['advice']])
            self.assertEqual(result['numbers'][0]['relation'],'le')

    def test_english_equivalent(self):
        text='Execute operation `transfer_funds`. Without Treasury_Lead approval, must not call this operation; if the system receives a fraud alert, must immediately invoke `transfer_funds`; total time must not exceed 60 seconds.'
        self.assertEqual(analyze_source(text)['guardAnalysis']['calculations'][0]['jointActionConstraints'],'unsat')

    def test_competing_reference_remains_unresolved(self):
        text=CASE.replace('。未经','，另有操作 `refund_check`。未经')
        r=analyze_source(text)['guardAnalysis']
        self.assertFalse(r['calculations'])
        self.assertTrue(any(x['reason']=='ambiguous_action_reference' for x in r['unresolved']))

    def test_different_actions_and_non_obligation(self):
        text='未经 Finance_Director 授权，严禁调用 `batch_refund`；若系统收到风控指令，必须调用 `release_hold`。'
        self.assertFalse(analyze_source(text)['guardAnalysis']['calculations'])
        self.assertFalse(analyze_source(CASE.replace('必须立即执行','允许执行'))['guardAnalysis']['calculations'])

    def test_aligned_approval_guards_do_not_conflict(self):
        text='未经 Finance_Director 授权，严禁调用 `batch_refund`；经 Finance_Director 授权后，必须调用 `batch_refund`。'
        result=analyze_source(text)['guardAnalysis']
        self.assertEqual(result['calculations'][0]['guardOverlap'],'unsat')
        self.assertFalse(result['findings'])

    def test_unrecognized_additional_guard_not_dropped(self):
        for text in [CASE.replace('原路退回资金','但仅在审批通过后'),CASE.replace('系统收到来自风控系统的高危欺诈拦截指令','系统收到指令且已经完成核验')]:
            r=analyze_source(text)['guardAnalysis']
            self.assertFalse(r['calculations']);self.assertTrue(r['unresolved'])

    def test_source_slices_and_repeatability(self):
        text='😀 '+CASE
        r=analyze_source(text);self.assertEqual(r,analyze_source(text))
        def verify(value):
            if isinstance(value,list):
                for x in value:verify(x)
            elif isinstance(value,dict):
                if {'start','end','quote'}<=value.keys():self.assertEqual(text.encode('utf-16-le')[value['start']*2:value['end']*2].decode('utf-16-le'),value['quote'])
                for x in value.values():verify(x)
        verify(r)
