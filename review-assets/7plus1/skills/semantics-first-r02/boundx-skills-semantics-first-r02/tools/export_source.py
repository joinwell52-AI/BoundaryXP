#!/usr/bin/env python3
"""Export one development text only. Does not invoke a model or include expectations."""
import argparse
import json
import sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source_id',help='For example BI05-en or MX01')
    parser.add_argument('--output',type=Path,help='Write a new UTF-8 TXT file; refuses to overwrite')
    args=parser.parse_args()
    try:
        rows=json.loads((ROOT/'evaluation/language/sources.json').read_text(encoding='utf-8'))['cases']
        row=next((r for r in rows if r['id']==args.source_id),None)
        if row is None:raise ValueError('Unknown source ID')
        data=(row['text']+'\n').encode('utf-8')
        if args.output:
            with args.output.open('xb') as f:f.write(data)
        else:
            sys.stdout.buffer.write(data)
    except (OSError,ValueError,KeyError) as exc:
        parser.exit(1,str(exc)+'\n')
if __name__=='__main__':main()
