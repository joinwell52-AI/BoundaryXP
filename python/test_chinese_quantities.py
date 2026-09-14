import unittest
from decimal import Decimal
from source_constraints import analyze_source
from quantity_literals import decimal_literal


class ChineseQuantities(unittest.TestCase):
    def test_positional_values_and_multipliers(self):
        for value,expected in [('三十','30'),('一百八十','180'),('四十八','48'),('五百万','5000000'),
                ('500 万','5000000'),('1.5万','15000'),('八万六千四百','86400'),('两','2'),
                ('二零二六','2026'),('零点零五','0.05'),('一点五万','15000'),('一亿零三万零五','100030005'),
                ('一千零二十','1020'),('一万零一十','10010'),('10,000.50','10000.50'),('负三点五','-3.5')]:
            with self.subTest(value=value):self.assertEqual(decimal_literal(value),Decimal(expected))

    def test_omitted_place_and_invalid_literals_are_not_guessed(self):
        for value in ['一百二','一千三','一万万','两百三','三十十','1,23','五百左右','一千零零五']:
            with self.subTest(value=value),self.assertRaises(ValueError):decimal_literal(value)
        result=analyze_source('耗时上限为一百二秒。')
        self.assertEqual(result['numbers'],[])
        self.assertIn('numeric_literal_unresolved',[a['code'] for a in result['advice']])

    def test_units_keep_evidence_and_distinct_metrics(self):
        text='🙂处理耗时限制在三十分钟以内；短信调用上限为四十次；执行时长在两个小时内；金额上限为五百万元；重试间隔严格小于零点零五秒。'
        result=analyze_source(text);n=result['numbers']
        self.assertEqual([(x['value'],x['unit'],x['relation']) for x in n],
                         [('1800','seconds','le'),('40','count','le'),('7200','seconds','le'),('5000000','CNY','le'),('0.05','seconds','lt')])
        self.assertEqual(len({x['metricKey'] for x in n if x['unit']=='seconds'}),3)
        for x in n:
            s=x['expressionSource'];self.assertEqual(text.encode('utf-16-le')[s['start']*2:s['end']*2].decode('utf-16-le'),s['quote'])
        self.assertEqual(n[0]['originalValue'],'三十')
        self.assertEqual(n[2]['originalUnit'],'小时')

    def test_direct_negated_comparison_is_bound_not_business_ban(self):
        for raw,op in [('大于','le'),('小于','ge'),('大于等于','lt'),('小于等于','gt')]:
            for value in ['五百','500']:
                result=analyze_source(f'单项赔偿金额禁止{raw}{value}元；严禁未录像验车。')
                n=result['numbers'][0]
                self.assertEqual((n['kind'],n['relation'],n['value']),('bound',op,'500'))
                self.assertEqual(len(result['prohibitions']['records']),1)
                self.assertIn('严禁未录像验车',result['projection']['fields']['B'][0]['text']['zh-CN'])

    def test_qualifier_inside_prohibition_is_not_a_positive_bound(self):
        text='严禁向收缩压大于一百六十毫米汞柱的受试者发放试剂。'
        result=analyze_source(text);n=result['numbers'][0]
        self.assertEqual((n['kind'],n['relation'],n['value']),('prohibition_filter','gt','160'))
        self.assertEqual(result['projection']['fields']['R'],[])
        self.assertEqual(result['projection']['fields']['B'][0]['text']['zh-CN'],text[:-1])

    def test_year_and_unstated_temperature_scale(self):
        result=analyze_source('根据二零二六年版规程，温度至少二度且严格小于八度。')
        self.assertEqual([(n['value'],n['unit']) for n in result['numbers']],[('2','degree_unspecified'),('8','degree_unspecified')])
        self.assertFalse(any(n['value']=='2026' for n in result['numbers']))

    def test_preposed_subject_and_target_have_different_roles(self):
        for actor,target in [('网络工程师','核心交换机机柜'),('甲组','乙设备')]:
            result=analyze_source(f'由{actor}对{target}执行口令轮换。')
            frame=result['projection']['contract']['actions'][0]
            roles={r['name']:r['value'] for r in frame['roles']}
            self.assertEqual(roles,{'executor':actor,'input':target,'interface':'口令轮换'})
            self.assertEqual([r['text']['zh-CN'] for r in result['projection']['fields']['I']],[target])

    def test_ba_source_and_artifact_are_separate(self):
        result=analyze_source('由码垛机将果蔬打包箱导出为标准木托盘。')
        roles={r['name']:r['value'] for r in result['projection']['contract']['actions'][0]['roles']}
        self.assertEqual(roles,{'executor':'码垛机','input':'果蔬打包箱','artifact':'标准木托盘'})


if __name__=='__main__':unittest.main()
