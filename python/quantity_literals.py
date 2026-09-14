"""Exact positional arithmetic for a bounded Chinese/Arabic numeral language.

Only numeral tokens are decoded. The source document is never rewritten, so
all evidence offsets continue to refer to the original text. No model/weights.
Colloquial omitted-place forms are rejected by a canonical round-trip check.
"""
import re
from decimal import Decimal

DIGITS='零一二三四五六七八九'
SMALL={'十':10,'百':100,'千':1000}
SCALES={'万':10000,'亿':100000000}
TRANSLATE=str.maketrans({'两':'二','〇':'零'})
ARABIC=r'[+-]?(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?(?:\s*[万亿])?'
CHINESE=r'负?[零〇一二两三四五六七八九十百千万亿]+(?:点[零〇一二两三四五六七八九]+[万亿]?)?'
TOKEN=rf'(?:{ARABIC}|{CHINESE})'


def _group(n):
    result=[];zero=False
    for scale,label in [(1000,'千'),(100,'百'),(10,'十'),(1,'')]:
        digit,n=divmod(n,scale)
        if digit:
            if zero:result.append('零')
            result.extend([DIGITS[digit],label]);zero=False
        elif result and n:zero=True
    return ''.join(result)


def canonical_integer(n):
    if n==0:return '零'
    if not 0<n<10**12:raise ValueError('Chinese numeral magnitude unsupported')
    result=[];zero=False
    for scale,label in [(10**8,'亿'),(10**4,'万'),(1,'')]:
        group,n=divmod(n,scale)
        if group:
            if result and (zero or group<1000):result.append('零')
            result.extend([_group(group),label]);zero=False
        elif result and n:zero=True
    return re.sub(r'^一十','十',''.join(result))


def _integer(value):
    if not any(c in SMALL or c in SCALES for c in value):
        return int(''.join(str(DIGITS.index(c)) for c in value))
    total=section=pending=0
    for c in value:
        if c in DIGITS:pending=DIGITS.index(c)
        elif c in SMALL:
            section+=(pending or 1)*SMALL[c];pending=0
        elif c=='万':total+=(section+pending)*10000;section=pending=0
        elif c=='亿':total=(total+section+pending)*100000000;section=pending=0
    number=total+section+pending
    normalized=re.sub(r'^一十','十',value)
    if canonical_integer(number)!=normalized:raise ValueError('Omitted or invalid Chinese numeral place')
    return number


def decimal_literal(value):
    """Decode a complete token; never accept a numeric prefix of an unknown word."""
    value=re.sub(r'\s+','',value).translate(TRANSLATE)
    if len(value)>40:raise ValueError('Numeral length limit')
    if re.fullmatch(ARABIC,value):
        scale=SCALES.get(value[-1],1)
        return Decimal((value[:-1] if scale!=1 else value).replace(',',''))*scale
    if not re.fullmatch(CHINESE,value):raise ValueError('Unsupported numeral')
    sign=-1 if value.startswith('负') else 1
    value=value.removeprefix('负')
    if '点' not in value:return Decimal(sign*_integer(value))
    left,right=value.split('点');scale=SCALES.get(right[-1],1)
    if scale!=1:right=right[:-1]
    fractional=''.join(str(DIGITS.index(c)) for c in right)
    return sign*(Decimal(_integer(left))+Decimal('0.'+fractional))*scale
