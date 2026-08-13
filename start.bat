@echo off
echo 🚀 Démarrage Holcim Maintenance Prédictive...

:: PostgreSQL PATH permanent
setx PATH "%PATH%;C:\Program Files\PostgreSQL\17\bin"
set PATH=%PATH%;C:\Program Files\PostgreSQL\17\bin

:: Terminal 1 - Backend Node.js
start "Backend" cmd /k "cd C:\Holcim_Maintenance\app\backend && node server.js"

:: Attendre 5 secondes
timeout /t 5 /nobreak

:: Terminal 2 - Flask ML
start "Flask ML" cmd /k "cd C:\Holcim_Maintenance\app\ml_api && python app.py"

:: Attendre 5 secondes
timeout /t 5 /nobreak

:: Terminal 3 - Simulateur
start "Simulateur" cmd /k "cd C:\Holcim_Maintenance\notebooks && python simulateur.py"

:: Attendre 5 secondes
timeout /t 5 /nobreak

:: Terminal 4 - React
start "React" cmd /k "cd C:\Holcim_Maintenance\app\frontend && npm start"

echo ✅ Tous les services démarrés !