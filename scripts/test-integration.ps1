# Script de PowerShell para ejecutar tests de integración con PostgreSQL local

Write-Host "🚀 Iniciando tests de integración..." -ForegroundColor Yellow

# Verificar si Docker está instalado
$docker = Get-Command docker -ErrorAction SilentlyContinue
if (-not $docker) {
    Write-Host "❌ Docker no está instalado" -ForegroundColor Red
    exit 1
}

# Verificar si Docker Compose está instalado
$dockerCompose = Get-Command docker-compose -ErrorAction SilentlyContinue
if (-not $dockerCompose) {
    Write-Host "❌ Docker Compose no está instalado" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Levantando base de datos PostgreSQL local..." -ForegroundColor Yellow
docker-compose -f docker-compose.test.yml up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al iniciar Docker Compose" -ForegroundColor Red
    exit 1
}

# Esperar a que la BD esté lista
Write-Host "⏳ Esperando a que PostgreSQL esté listo..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Verificar que la BD está conectada (intento simple con psql si está disponible)
Write-Host "✅ PostgreSQL debería estar listo" -ForegroundColor Green

Write-Host "🧪 Ejecutando tests de integración..." -ForegroundColor Yellow
npm run test:integration

$testResult = $LASTEXITCODE

Write-Host "🛑 Deteniendo base de datos..." -ForegroundColor Yellow
docker-compose -f docker-compose.test.yml down

if ($testResult -eq 0) {
    Write-Host "✅ Tests completados exitosamente" -ForegroundColor Green
} else {
    Write-Host "❌ Tests fallaron" -ForegroundColor Red
}

exit $testResult
