@echo off
title Canteen Backend (Port 8081)
cd /d "%~dp0canteen-backend"
if exist "target\canteen-backend-0.0.1-SNAPSHOT.jar" (
    echo Starting pre-compiled backend on Port 8081...
    java -jar target\canteen-backend-0.0.1-SNAPSHOT.jar
) else (
    echo Starting via Maven...
    mvn spring-boot:run
)
pause