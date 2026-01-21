@echo off
REM Hela Fund - Quick Start Script for Testing Authentication (Windows)

echo.
echo ========================================
echo    Hela Fund Authentication Test Setup
echo ========================================
echo.

REM Check if MongoDB is running
echo Checking MongoDB status...
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo [OK] MongoDB is running
) else (
    echo [ERROR] MongoDB is not running
    echo Please start MongoDB first:
    echo   - Run: net start MongoDB
    echo   - Or start MongoDB from Services
    exit /b 1
)

echo.

REM Backend Setup
echo Setting up Backend...
cd backend

if not exist "node_modules\" (
    echo Installing backend dependencies...
    call npm install
) else (
    echo [OK] Backend dependencies already installed
)

if not exist ".env" (
    echo Creating .env file...
    copy .env.example .env
) else (
    echo [OK] .env file exists
)

echo.
echo Starting Backend Server...
start "Hela Fund Backend" cmd /k npm run dev

cd ..

REM Wait for backend to start
echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

REM Frontend Setup
echo.
echo Setting up Frontend...
cd frontend

if not exist "node_modules\" (
    echo Installing frontend dependencies...
    call npm install
) else (
    echo [OK] Frontend dependencies already installed
)

if not exist ".env" (
    echo Creating frontend .env file...
    echo VITE_API_URL=http://localhost:5000/api > .env
) else (
    echo [OK] Frontend .env file exists
)

echo.
echo Starting Frontend Server...
start "Hela Fund Frontend" cmd /k npm run dev

cd ..

echo.
echo ========================================
echo    Hela Fund is now running!
echo ========================================
echo.
echo Backend API:  http://localhost:5000
echo Frontend App: http://localhost:5173
echo.
echo Test the authentication:
echo   1. Open http://localhost:5173 in your browser
echo   2. Click 'Sign Up' to create a new account
echo   3. Choose either Requester or Supporter role
echo   4. Fill in the registration form
echo   5. After registration, you'll be logged in automatically
echo.
echo Press any key to open the frontend in your browser...
pause >nul
start http://localhost:5173

echo.
echo To stop the servers, close the terminal windows.
echo.
