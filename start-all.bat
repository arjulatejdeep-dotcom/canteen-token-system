@echo off
title Launching Smart Campus Canteen
start "Canteen Backend (Port 8081)" cmd /k "cd /d %~dp0canteen-backend && if exist target\canteen-backend-0.0.1-SNAPSHOT.jar (java -jar target\canteen-backend-0.0.1-SNAPSHOT.jar) else (mvn spring-boot:run)"
timeout /t 5 >nul
start "Canteen Frontend (Port 5173)" cmd /k "cd /d %~dp0canteen-frontend && npm run dev -- --port 5173"