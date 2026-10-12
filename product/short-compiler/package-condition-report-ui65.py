from pathlib import Path
source=Path(__file__).with_name('package-scope-ui62.py')
exec(compile(source.read_text(encoding='utf-8').replace('ui.62','ui.65').replace('SCOPE-CONSUMPTION-CLOSURE-r01','CONDITION-REFERENCE-AND-DELIVERY-r01'),str(source),'exec'))
