#!/bin/bash

echo "🚀 Setting up SaaS Messaging Platform..."

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js 20+${NC}"
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    echo -e "${BLUE}Installing pnpm...${NC}"
    npm install -g pnpm
fi

if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker is not installed. Please install Docker${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Prerequisites check passed${NC}"

# Install dependencies
echo -e "${BLUE}Installing dependencies...${NC}"
pnpm install

echo -e "${GREEN}✓ Dependencies installed${NC}"

# Setup environment files
echo -e "${BLUE}Setting up environment files...${NC}"

if [ ! -f "apps/backend/.env" ]; then
    cp apps/backend/.env.example apps/backend/.env
    echo -e "${GREEN}✓ Backend .env created${NC}"
fi

if [ ! -f "apps/frontend/.env.local" ]; then
    cp apps/frontend/.env.example apps/frontend/.env.local
    echo -e "${GREEN}✓ Frontend .env.local created${NC}"
fi

# Start Docker services
echo -e "${BLUE}Starting Docker services...${NC}"
docker-compose up -d postgres redis

# Wait for services
echo -e "${BLUE}Waiting for services to be ready...${NC}"
sleep 5

# Run database migrations
echo -e "${BLUE}Running database migrations...${NC}"
cd apps/backend
pnpm prisma generate
pnpm prisma migrate dev --name init
cd ../..

echo -e "${GREEN}✓ Database migrations completed${NC}"

# Build shared package
echo -e "${BLUE}Building shared package...${NC}"
pnpm --filter @saas-platform/shared build

echo -e "${GREEN}✓ Shared package built${NC}"

echo ""
echo -e "${GREEN}✅ Setup completed successfully!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Update .env files with your API keys"
echo "2. Run 'pnpm dev' to start development servers"
echo ""
echo -e "${BLUE}Services will be available at:${NC}"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:3001"
echo "  API Docs: http://localhost:3001/api/docs"
echo ""
