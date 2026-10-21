from pathlib import Path
script=Path(__file__).with_name('package-scope-ui62.py')
code=script.read_text(encoding='utf-8').replace('ui.62','ui.63')
exec(compile(code,str(script),'exec'))
