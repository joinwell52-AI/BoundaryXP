"""Exact unit data and lexical boundaries, independent of business domains.

Conversions are multiplicative Decimal factors from explicit source symbols.
Calendar days, unspecified dollars/degrees and rates retain distinct domains.
"""
import json
import re
from pathlib import Path

DATA = json.loads(Path(__file__).with_name('quantity_units.json').read_text(encoding='utf-8'))
DEFINITIONS = {u['id']: u for u in DATA['units']}
ALIASES = {a: (u['id'], factor) for u in DATA['units'] for factor, names in u['scales'] for a in names}
SYMBOLS = frozenset(DATA['case_sensitive_symbols'])
WORDS = {a.casefold(): value for a,value in ALIASES.items() if a not in SYMBOLS}


def alternatives(names, unit_boundary=True):
    # ASCII symbols cannot be prefixes of unknown words (e.g. 5 metersXYZ).
    return '|'.join(('(?-i:'+re.escape(n)+')' if n in SYMBOLS else re.escape(n)) + ('' if not unit_boundary else r'(?![A-Za-z_])' if n[-1].isascii() and n[-1].isalnum() else
                                  r'(?=\s|$|[^\u4e00-\u9fff]|以内|以下|以上|内|时|且|并|或|后|前|的|即|则|才)')
                    for n in sorted(names, key=len, reverse=True))


UNIT_PATTERN = alternatives(ALIASES)
PREFIX_RATES = {r['prefix']: r for r in DATA['prefix_rates']}


def resolve(value):
    return ALIASES[value] if value in SYMBOLS else WORDS.get(value.casefold(), ('unspecified', '1'))


def labels(unit):
    return DEFINITIONS.get(unit, {'display': ['单位待明确', 'unit unspecified']})['display']


def dimension(unit):
    return DEFINITIONS.get(unit, {}).get('dimension')


def metric_unit(prefix):
    """Only an explicit parenthesized unit or rate label can supply a suffix.

    Words such as temperature/amount do not determine a scale/currency.
    """
    # Token is commonly written as the metric head rather than a numeric
    # suffix ("Token 消耗量至少 8000"). It is still explicit source evidence,
    # not an inferred unit from an industry label.
    token = re.search(r'(?<![A-Za-z_])(?P<unit>Tokens?)(?![A-Za-z_])', prefix, re.I)
    if token:
        return token['unit'], token.span('unit')
    pattern = r'(?:\((?P<ascii>'+UNIT_PATTERN+r')\)|（(?P<wide>'+UNIT_PATTERN+r')）)\s*(?:(?:must|shall|严格|必须|上限|下限|upper limit|lower limit)\s*)*$'
    m = re.search(pattern, prefix, re.I)
    if m:
        group = 'ascii' if m['ascii'] else 'wide'
        return m[group], m.span(group)
    rates = [a for a,(unit,_) in ALIASES.items() if DEFINITIONS[unit]['dimension'] in ['call_rate','volume_rate','speed']]
    m = re.search(r'(?<![A-Za-z_])(?P<unit>'+alternatives(rates)+r')\s*(?:must|shall)?\s*$', prefix, re.I)
    return (m['unit'], m.span('unit')) if m else None
