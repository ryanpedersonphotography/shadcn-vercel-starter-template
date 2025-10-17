#!/bin/bash

# 🚀 Automated Deployment Setup Script
# This script automates the deployment of shadcn/ui Registry + Payload CMS to Vercel

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check Node.js version
    if command_exists node; then
        NODE_VERSION=$(node --version | cut -d'v' -f2)
        MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1)
        if [ "$MAJOR_VERSION" -ge 18 ]; then
            log_success "Node.js $NODE_VERSION ✓"
        else
            log_error "Node.js 18+ required. Current: $NODE_VERSION"
            exit 1
        fi
    else
        log_error "Node.js not found. Please install Node.js 18+"
        exit 1
    fi
    
    # Check package manager
    if command_exists pnpm; then
        log_success "pnpm found ✓"
        PKG_MANAGER="pnpm"
    elif command_exists npm; then
        log_success "npm found ✓"
        PKG_MANAGER="npm"
    else
        log_error "No package manager found. Please install npm or pnpm"
        exit 1
    fi
    
    # Check git
    if command_exists git; then
        log_success "git found ✓"
    else
        log_error "git not found. Please install git"
        exit 1
    fi
    
    # Check Vercel CLI
    if command_exists vercel; then
        log_success "Vercel CLI found ✓"
    else
        log_warning "Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
}

# Install dependencies
install_dependencies() {
    log_info "Installing dependencies..."
    
    if [ "$PKG_MANAGER" = "pnpm" ]; then
        pnpm install
    else
        npm install
    fi
    
    log_success "Dependencies installed ✓"
}

# Setup environment
setup_environment() {
    log_info "Setting up environment variables..."
    
    if [ ! -f ".env.local" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env.local
            log_success "Copied .env.example to .env.local ✓"
        else
            log_warning "No .env.example found. Creating basic .env.local"
            cat > .env.local << EOF
# Database - Replace with your Neon connection string
DATABASE_URL='postgresql://user:password@host/db?sslmode=require'

# Payload Secret - Generate with: openssl rand -hex 32
PAYLOAD_SECRET='your-32-character-secret-key-here'

# Next.js
NEXT_PUBLIC_SERVER_URL=http://localhost:3001
EOF
        fi
        
        echo
        log_warning "⚠️  IMPORTANT: You need to update .env.local with your actual values:"
        echo -e "${YELLOW}1. DATABASE_URL - Your Neon PostgreSQL connection string${NC}"
        echo -e "${YELLOW}2. PAYLOAD_SECRET - Generate with: openssl rand -hex 32${NC}"
        echo
        read -p "Press Enter when you've updated .env.local..."
    else
        log_success ".env.local already exists ✓"
    fi
}

# Test local setup
test_local() {
    log_info "Testing local setup..."
    
    # Build the project
    if [ "$PKG_MANAGER" = "pnpm" ]; then
        pnpm build
    else
        npm run build
    fi
    
    log_success "Build successful ✓"
    
    echo
    log_info "Starting development server..."
    echo -e "${BLUE}Your app will be available at: http://localhost:3001${NC}"
    echo -e "${BLUE}Admin interface at: http://localhost:3001/admin${NC}"
    echo
    echo -e "${YELLOW}Press Ctrl+C to stop the server and continue with deployment${NC}"
    
    if [ "$PKG_MANAGER" = "pnpm" ]; then
        pnpm dev
    else
        npm run dev
    fi
}

# Deploy to Vercel
deploy_vercel() {
    log_info "Deploying to Vercel..."
    
    # Login to Vercel if not already logged in
    if ! vercel whoami >/dev/null 2>&1; then
        log_info "Please login to Vercel..."
        vercel login
    fi
    
    # Deploy
    log_info "Deploying to production..."
    vercel --prod
    
    log_success "Deployment complete ✓"
    
    echo
    log_info "Next steps:"
    echo -e "${YELLOW}1. Go to your Vercel dashboard to configure environment variables${NC}"
    echo -e "${YELLOW}2. Add your DATABASE_URL and PAYLOAD_SECRET to production environment${NC}"
    echo -e "${YELLOW}3. Update NEXT_PUBLIC_SERVER_URL to your Vercel app URL${NC}"
    echo -e "${YELLOW}4. Redeploy after adding environment variables${NC}"
}

# Seed database
seed_database() {
    log_info "Seeding database with sample data..."
    
    if [ -f "src/lib/seed.ts" ]; then
        if [ "$PKG_MANAGER" = "pnpm" ]; then
            pnpm exec tsx src/lib/seed.ts
        else
            npx tsx src/lib/seed.ts
        fi
        log_success "Database seeded ✓"
    else
        log_warning "No seed file found, skipping database seeding"
    fi
}

# Main menu
show_menu() {
    echo
    echo -e "${BLUE}🚀 shadcn/ui Registry + Payload CMS Deployment Helper${NC}"
    echo
    echo "Choose an option:"
    echo "1) Full setup (recommended for first time)"
    echo "2) Install dependencies only"
    echo "3) Setup environment variables"
    echo "4) Test local development"
    echo "5) Deploy to Vercel"
    echo "6) Seed database"
    echo "7) Check prerequisites"
    echo "0) Exit"
    echo
    read -p "Enter your choice [0-7]: " choice
    
    case $choice in
        1)
            check_prerequisites
            install_dependencies
            setup_environment
            seed_database
            test_local
            ;;
        2)
            check_prerequisites
            install_dependencies
            ;;
        3)
            setup_environment
            ;;
        4)
            test_local
            ;;
        5)
            deploy_vercel
            ;;
        6)
            seed_database
            ;;
        7)
            check_prerequisites
            ;;
        0)
            log_info "Goodbye!"
            exit 0
            ;;
        *)
            log_error "Invalid option. Please try again."
            show_menu
            ;;
    esac
}

# Run main menu
main() {
    clear
    show_menu
}

# Check if script is run directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main
fi