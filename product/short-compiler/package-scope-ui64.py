from pathlib import Path
script=Path(__file__).with_name('package-scope-ui62.py')
exec(compile(script.read_text(encoding='utf-8').replace('ui.62','ui.64'),str(script),'exec'))
