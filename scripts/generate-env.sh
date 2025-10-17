#!/bin/bash

# 🔑 Environment Variable Generator
# Generates secure environment variables for the project

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🔑 Generating environment variables...${NC}"
echo

# Generate Payload secret
if command -v openssl >/dev/null 2>&1; then
    PAYLOAD_SECRET=$(openssl rand -hex 32)
    echo -e "${GREEN}✅ Generated PAYLOAD_SECRET using openssl${NC}"
elif command -v node >/dev/null 2>&1; then
    PAYLOAD_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
    echo -e "${GREEN}✅ Generated PAYLOAD_SECRET using Node.js${NC}"
else
    echo -e "${YELLOW}⚠️  Could not generate PAYLOAD_SECRET automatically${NC}"
    echo "Please generate manually: https://generate-secret.vercel.app/32"
    PAYLOAD_SECRET="your-32-character-secret-key-here"
fi

# Create .env.local file
cat > .env.local << EOF
# Database - Replace with your actual Neon PostgreSQL connection string
DATABASE_URL='postgresql://user:password@host/db?sslmode=require'

# Payload Secret - Auto-generated secure secret
PAYLOAD_SECRET='${PAYLOAD_SECRET}'

# Next.js - Update with your actual domain for production
NEXT_PUBLIC_SERVER_URL=http://localhost:3001
EOF

echo -e "${GREEN}✅ Created .env.local with generated secrets${NC}"
echo
echo -e "${YELLOW}⚠️  IMPORTANT: You still need to update:${NC}"
echo -e "   1. DATABASE_URL with your Neon PostgreSQL connection string"
echo -e "   2. NEXT_PUBLIC_SERVER_URL with your domain for production"
echo
echo -e "${BLUE}📄 Contents of .env.local:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cat .env.local
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo
echo -e "${GREEN}✅ Environment setup complete!${NC}"