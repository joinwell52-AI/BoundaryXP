from pathlib import Path
script=Path(__file__).with_name('package-joint-ui56.py')
code=script.read_text(encoding='utf-8').replace('ui.56','ui.57').replace("report/'PACKAGE.json'","report/'PACKAGE-ui57.json'")
exec(compile(code,str(script),'exec'))
