@echo off
title SITD - Sistema de Gestao de FATD

echo Verificando processos na porta 5173...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173"') do (
    echo Encerrando processo %%a...
    taskkill /PID %%a /F >nul 2>&1
)

echo.
echo Iniciando SITD em http://localhost:5173 ...
echo Acesso em rede: http://%COMPUTERNAME%:5173
echo.
echo Pressione Ctrl+C para encerrar.
echo.

cd /d "%~dp0"
npm run dev
