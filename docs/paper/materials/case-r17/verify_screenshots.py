"""Validate rectangular crops against retained real-browser captures; no synthesis."""
from pathlib import Path
import json,hashlib
from PIL import Image
HERE=Path(__file__).resolve().parent
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
crops=json.loads((HERE/'screenshots/crops.json').read_text())
checks=[]
for name,box in crops.items():
 source=HERE/'screenshots'/('en20-007-overview-full.png' if name=='radar' else 'en20-007-calculations-full.png')
 target=HERE.parent/'figures'/f'en20-007-{name}.png'
 with Image.open(source) as original,Image.open(target) as cropped:
  expected=original.crop(box)
  assert cropped.size==expected.size
  assert cropped.mode==expected.mode
  assert cropped.tobytes()==expected.tobytes()
  checks.append({'image':target.name,'size':list(cropped.size),'source_sha256':sha(source),'crop':box,'sha256':sha(target)})
geometry=json.loads((HERE/'screenshots/en20-007-calculations-geometry.json').read_text(encoding='utf-8'))
assert geometry['project']=='f9214488-9935-47bc-a081-5b99f1914765'
assert 'EN20-007' in geometry['selected']
assert 'Calculator verdict: Boundary violation' in geometry['assessment']
assert '6400' in geometry['reportText'] and '6000' in geometry['reportText']
print(json.dumps({'passed':True,'case_id':'EN20-007','real_browser_crops':checks,'editing':'RECTANGULAR_CROPS_ONLY'},ensure_ascii=False))
