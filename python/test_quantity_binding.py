"""Raw source -> dimension/identity -> algebra, with scope counterexamples."""
import unittest
from source_constraints import analyze_source
from admin_compute import compute

PRESSURE = '根据《特种设备压力容器安全技术规程》，由锅炉控制系统执行蒸汽包排气阀调节。泄压响应耗时上限为 5 秒；主蒸汽包表压严格小于 2.5 兆帕，且表压至少为 1.8 兆帕；输出泄压阀开度控制日志即为完成；全流程严禁旁路机械安全阀联动开关。'
DOLLARS = '根据《跨境电商海外仓退换货质检细则》，质检员处理退运包裹。单件包裹翻新处理残值评估至少 80 美元，但根据保税退运免税核销协议，残值评估上限严格小于 50 美元；单件质检耗时限制在 600 秒以内；打印退运返修入库标签即为完成。'


class QuantityBinding(unittest.TestCase):
    def intersections(self,r):
        return [c for c in r['structuralCalculations']['sets'] if c['operation']=='source_bound_intersection']

    def evidence(self,text,value):
        if isinstance(value,list):
            for v in value:self.evidence(text,v)
        elif isinstance(value,dict):
            if {'quote','start','end'}<=value.keys():
                self.assertEqual(text[value['start']:value['end']],value['quote'])
            for v in value.values():self.evidence(text,v)

    def test_user_90_pressure_intersection_and_provenance(self):
        r=analyze_source(PRESSURE);c=self.intersections(r)[0]
        self.assertEqual(c['readableResult'],'[1800000,2500000)')
        self.assertEqual(c['unit'],'Pa');self.assertFalse(c['empty'])
        n=r['numbers'][1]
        self.assertEqual((n['originalValue'],n['originalUnit'],n['conversionFactor']),('2.5','兆帕','1000000'))
        self.assertEqual([p['matches'] for p in n['probes']],[True,False,False])
        self.assertEqual(c['binding']['status'],'source_binding_assumption')
        self.evidence(PRESSURE,r)

    def test_user_91_empty_usd_interval_and_explanation(self):
        r=analyze_source(DOLLARS);f=next(f for f in r['advice'] if f['code']=='interval_empty')
        self.assertEqual(f['proof']['readableResult'],'∅')
        self.assertEqual(f['proof']['unit'],'USD')
        self.assertEqual([n['value'] for n in r['numbers']],['80','50','600'])
        self.assertIn('80',f['scenario']['zh-CN']);self.assertIn('50',f['scenario']['zh-CN'])
        self.assertIn('assumption',f);self.evidence(DOLLARS,r)

    def test_values_and_open_end_changes_change_the_result(self):
        for lower,upper,operator,empty in [(40,50,'严格小于',False),(50,50,'严格小于',True),(50,50,'不超过',False),(81,80,'不超过',True)]:
            text=DOLLARS.replace('80 美元',f'{lower} 美元').replace('严格小于 50 美元',f'{operator} {upper} 美元')
            self.assertEqual(self.intersections(analyze_source(text))[0]['empty'],empty)

    def test_distinct_qualified_metrics_do_not_merge(self):
        for text in [PRESSURE.replace('且表压','且回水管表压'),
                     DOLLARS.replace('残值评估上限','运费评估上限'),
                     DOLLARS.replace('50 美元','50 欧元'),
                     '阀门压力至少200帕，管道压力严格小于100帕。',
                     'If pressure > 200 Pa, output log; otherwise pressure < 100 Pa.',
                     '压力至少200帕；另一阶段，压力严格小于100帕。']:
            self.assertFalse(self.intersections(analyze_source(text)),text)

    def test_known_units_exact_scaling_and_rate_separation(self):
        text='电压至少0.5千伏；距离上限为25公里；耗时在3分钟内；推送速率不超过5次/秒；推送次数不超过5次；比例小于35%。'
        r=analyze_source(text)
        self.assertEqual([(n['value'],n['unit']) for n in r['numbers']],
                         [('500','volts'),('25000','meters'),('180','seconds'),('5','calls_per_second'),('5','count'),('35','percent')])
        self.assertEqual(len(r['projection']['fields']['R']),6)

    def test_si_symbol_case_is_not_natural_language_case_folding(self):
        for symbol,value in [('mV','0.005'),('MV','5000000'),('MPa','5000000'),('mPa','0.005')]:
            r=analyze_source('Value at least5 '+symbol+'.')
            self.assertEqual(r['numbers'][0]['value'],value,symbol)
        self.assertEqual(analyze_source('VALUE AT LEAST5 VOLTS.')['numbers'][0]['unit'],'volts')

    def test_explicit_metric_units_supply_the_value(self):
        text='🙂 Calls per second shall not exceed 5; Pressure (MPa) strictly less than 2.5.'
        r=analyze_source(text)
        self.assertEqual([(n['unit'],n['value']) for n in r['numbers']],[('calls_per_second','5'),('Pa','2500000')])
        self.assertTrue(all(n['unitOrigin']=='explicit_metric_unit' for n in r['numbers']))
        self.assertEqual(r['numbers'][0]['unitSources'][0]['quote'],'Calls per second')
        self.evidence(text,r)

    def test_prefix_currency_must_agree_with_suffix(self):
        self.assertEqual(analyze_source('Refund value at least USD 80')['numbers'][0]['unit'],'USD')
        self.assertEqual(analyze_source('金额至少人民币五百万')['numbers'][0]['value'],'5000000')
        r=analyze_source('Refund value at least USD 80 EUR')
        self.assertFalse(r['numbers']);self.assertIn('currency_unit_conflict',[f['code'] for f in r['advice']])

    def test_prefix_rate_and_conditional_unit(self):
        text='注水流量至少为每小时80立方米，且注水流量严格小于每分钟1立方米；严禁在风速大于12米每秒时放飞。'
        r=analyze_source(text);c=self.intersections(r)[0]
        self.assertTrue(c['empty']);self.assertEqual(c['unit'],'cubic_meters_per_hour')
        self.assertEqual(r['numbers'][1]['value'],'60')
        self.assertEqual(r['numbers'][2]['kind'],'prohibition_filter')
        self.evidence(text,r)
        self.assertEqual(analyze_source('流量至少每小时八十立方米')['numbers'][0]['value'],'80')

    def test_contrast_with_unknown_metric_identity_has_conditional_result(self):
        text='夹套急冷水注入流量至少为每小时80立方米，但根据进水管路机械抗压安全标准，瞬时注水流量上限严格小于每小时50立方米。'
        r=analyze_source(text);f=next(f for f in r['advice'] if f['code']=='metric_identity_unresolved')
        self.assertEqual(f['proof']['readableResult'],'∅');self.assertFalse(f['proof']['bindingEstablished'])
        self.assertNotIn('interval_empty',[f['code'] for f in r['advice']]);self.assertFalse(self.intersections(r))
        self.assertEqual(f['severity'],'attention');self.evidence(text,r)
        resolved=text.replace('夹套急冷水注入流量','注水体积流量').replace('瞬时注水流量','注水体积流量')
        self.assertTrue(self.intersections(analyze_source(resolved))[0]['empty'])
        self.assertNotIn('metric_identity_unresolved',[f['code'] for f in analyze_source(text.replace('但根据','根据'))['advice']])

    def test_unknown_units_are_visible_and_never_cross_conjoined(self):
        for text in ['温度至少80度且严格小于50度。','Amount at least80 dollars and less than50 dollars.',
                     '自定义指标至少80神秘单位且严格小于50神秘单位。','Length at least5 metersXYZ.','压差至少5厘米汞柱。']:
            r=analyze_source(text)
            self.assertFalse(self.intersections(r),text)
            self.assertTrue(any(f['code'] in ['numeric_unit_unresolved','unit_reference_unresolved'] for f in r['advice']),text)

    def test_same_metric_in_explicit_different_unit_scales(self):
        r=analyze_source('Valve pressure (MPa) strictly less than2.5, and valve pressure (kPa) at least1800.')
        c=self.intersections(r)[0]
        self.assertEqual(c['readableResult'],'[1800000,2500000)');self.assertEqual(c['unit'],'Pa')

    def test_new_101_113_domains_do_not_invent_permission(self):
        for text,expected in [('母线输出交流电压有效值严格小于420伏，且母线输出交流电压有效值至少为380伏；严禁合闸。','[380,420)'),
                              ('发酵液溶氧饱和度百分比严格小于60%，且溶氧饱和度百分比至少为35%；严禁开启补料泵。','[35,60)')]:
            r=analyze_source(text);self.assertEqual(self.intersections(r)[0]['readableResult'],expected)
            self.assertEqual(r['projection']['fields']['A'],[])

    def test_wp_bounds_are_not_conjoined_across_scopes(self):
        r=compute('## WP1 Prepare\n压力至少200帕。\n## WP2 Finish\n压力严格小于100帕。')
        self.assertFalse(any(f['code']=='interval_empty' for e in r['engines'] for f in e['findings']))

    def test_unresolved_subject_is_not_labelled_a_resolved_condition(self):
        r=analyze_source('质检员处理退运包裹。')
        self.assertFalse(r['projection']['fields']['P'])
        self.assertIn('上下文待绑定',r['projection']['fields']['A'][0]['text']['zh-CN'])
        self.assertIn('context_kept_as_unresolved_guard',[f['code'] for f in r['advice']])
        self.assertIn('退运包裹',r['projection']['fields']['I'][0]['text']['zh-CN'])

    def test_explicit_executors_and_completion_gerund(self):
        for actor in ['调度专员','审核专员','检查程序']:
            r=analyze_source(f'由{actor}执行检测作业。')
            self.assertEqual(r['projection']['fields']['P'][0]['text']['en'],actor+' (executor)')
        r=analyze_source('Generating summary.json is the completion condition.')
        self.assertTrue(r['projection']['fields']['C']);self.assertEqual(r['projection']['fileOutputs'][0]['name'],'summary.json')

    def test_role_names_do_not_become_actions_after_a_heading(self):
        for actor,verb in [('港口调度员','办理'),('事务处理程序','读取'),('接口调用工程师','生成')]:
            text=f'工单一：由{actor}{verb}交接记录。'
            r=analyze_source(text)
            self.assertEqual(r['projection']['fields']['P'][0]['text']['en'],actor+' (executor)')
            self.assertEqual(r['projection']['contract']['actions'][0]['verb'],verb)
            self.evidence(text,r)
        r=analyze_source('未经行车调度调度长核准，严禁人工强行放行。')
        self.assertFalse(r['projection']['fields']['A']);self.assertTrue(r['projection']['fields']['B'])

    def test_long_mixed_scope_does_not_match_a_verb_in_actor_or_truncate(self):
        target='cross-currency liquidity transfer for regional treasury pool'
        text='由资金结算专员执行 '+target+'；生成流水即为完成。'
        r=analyze_source(text)
        self.assertEqual([v['text']['zh-CN'].strip() for v in r['projection']['fields']['I']],[target])
        self.assertEqual(r['projection']['fields']['P'][0]['text']['en'],'资金结算专员 (executor)')
        self.evidence(text,r)
        r=analyze_source('针对'+('原始订单数据'*40)+'，生成汇总表。')
        self.assertEqual(r['projection']['fields']['I'][0]['text']['zh-CN'],'原始订单数据'*40)


if __name__=='__main__':unittest.main()
