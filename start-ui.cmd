@echo off
cd /d "%~dp0"
if exist "runtime\node.exe" (
  "runtime\node.exe" ui-server.mjs --open
) else (
  node ui-server.mjs --open
)
pause
