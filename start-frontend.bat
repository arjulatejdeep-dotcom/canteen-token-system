@echo off
title Canteen Frontend (Port 5173)
cd /d "%~dp0canteen-frontend"
npm run dev -- --port 5173
pause