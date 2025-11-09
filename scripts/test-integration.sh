#!/bin/bash

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Iniciando tests de integración...${NC}"

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker no está instalado${NC}"
    exit 1
fi

# Verificar si Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose no está instalado${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Levantando base de datos PostgreSQL local...${NC}"
docker-compose -f docker-compose.test.yml up -d

# Esperar a que la BD esté lista
echo -e "${YELLOW}⏳ Esperando a que PostgreSQL esté listo...${NC}"
sleep 10

# Verificar que la BD está conectada
docker-compose -f docker-compose.test.yml exec -T postgres_test pg_isready -U test -d marketplace_test
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ PostgreSQL no está listo${NC}"
    docker-compose -f docker-compose.test.yml down
    exit 1
fi

echo -e "${GREEN}✅ PostgreSQL está listo${NC}"

echo -e "${YELLOW}🧪 Ejecutando tests de integración...${NC}"
npm run test:integration

TEST_RESULT=$?

echo -e "${YELLOW}🛑 Deteniendo base de datos...${NC}"
docker-compose -f docker-compose.test.yml down

if [ $TEST_RESULT -eq 0 ]; then
    echo -e "${GREEN}✅ Tests completados exitosamente${NC}"
else
    echo -e "${RED}❌ Tests fallaron${NC}"
fi

exit $TEST_RESULT
