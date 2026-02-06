@echo off
cd /d d:\SalesBoost\frontend
rmdir /s /q dist 2>nul
call npm run build
cd dist
tar -a -cf ../dist.zip *
echo Build complete
