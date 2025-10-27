@echo off
echo ========================================
echo    DEPLOY BOUTIQUE ANA A NETLIFY
echo ========================================

echo Construyendo la aplicacion...
call npm run build:gh-pages

echo.
echo ========================================
echo    DEPLOY COMPLETADO
echo ========================================
echo.
echo Archivos listos en: dist/boutique-ana
echo.
echo Para hacer deploy:
echo 1. Ve a https://netlify.com
echo 2. Arrastra la carpeta dist/boutique-ana
echo 3. Obtienes una URL instantanea
echo.
echo O usa: npx netlify deploy --dir=dist/boutique-ana --prod
echo.
pause
