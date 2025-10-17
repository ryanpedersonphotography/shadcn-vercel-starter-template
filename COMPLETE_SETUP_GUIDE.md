# 🚀 Complete Setup Guide: shadcn/ui Registry + Payload CMS

This guide will walk you through **every single step** to recreate this exact setup from scratch, including all external services and deployment configurations.

## 📋 Table of Contents

1. [Prerequisites & Account Setup](#prerequisites--account-setup)
2. [Database Setup (Neon)](#database-setup-neon)
3. [Project Initialization](#project-initialization)
4. [Payload CMS Integration](#payload-cms-integration)
5. [Custom Admin Interface](#custom-admin-interface)
6. [Vercel Deployment](#vercel-deployment)
7. [Environment Configuration](#environment-configuration)
8. [Testing & Verification](#testing--verification)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 Prerequisites & Account Setup

### Required Accounts
You'll need accounts for these services (all have free tiers):

1. **GitHub** - Code repository
   - Go to: https://github.com
   - Create account or sign in

2. **Vercel** - Deployment platform
   - Go to: https://vercel.com
   - Sign up with your GitHub account
   - This will automatically connect your repositories

3. **Neon** - PostgreSQL database
   - Go to: https://neon.tech
   - Sign up (free tier: 3GB storage, no credit card required)
   - Verify your email

### Local Development Tools

**Required:**
```bash
# Node.js 18+ (check version)
node --version  # Should be 18.0.0 or higher

# Package manager (choose one)
npm --version   # Built into Node.js
# OR
pnpm --version  # Recommended: npm install -g pnpm

# Git
git --version
```

**Optional but Recommended:**
```bash
# Vercel CLI (for deployment)
npm install -g vercel

# Neon CLI (for database management)  
npm install -g neonctl
```

---

## 🗄️ Database Setup (Neon)

### Step 1: Create Neon Project

1. **Login to Neon Console**
   - Go to: https://console.neon.tech
   - Click "Create Project"

2. **Configure Project**
   ```
   Project Name: shadcn-registry-db
   Database Name: neondb
   Region: us-east-2 (or closest to your users)
   PostgreSQL Version: 15 (default)
   ```

3. **Get Connection String**
   - After creation, go to "Connection Details"
   - Copy the connection string (looks like):
   ```
   postgresql://neondb_owner:PASSWORD@HOST.neon.tech/neondb?sslmode=require
   ```
   - **Save this** - you'll need it for environment variables

### Step 2: Alternative Database Options

If you prefer other database providers:

**Supabase:**
```bash
# 1. Go to https://supabase.com
# 2. Create new project
# 3. Get connection string from Settings > Database
```

**Local PostgreSQL (Docker):**
```bash
# Start PostgreSQL container
docker run --name payload-postgres \
  -p 5432:5432 \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=payload \
  -d postgres:15

# Connection string for local:
# postgresql://postgres:password@localhost:5432/payload
```

---

## 🚀 Project Initialization

### Step 1: Clone the Starter

```bash
# Clone the repository
git clone https://github.com/ryanpedersonphotography/shadcn-ui-registry-starter.git
cd shadcn-ui-registry-starter

# Install dependencies
pnpm install
# OR
npm install
```

### Step 2: Environment Setup

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your values
```

**Edit `.env.local`:**
```env
# Database - Use your Neon connection string
DATABASE_URL='postgresql://neondb_owner:YOUR_PASSWORD@ep-xxx.neon.tech/neondb?sslmode=require'

# Payload Secret - Generate with: openssl rand -hex 32
PAYLOAD_SECRET=your-32-character-secret-key-here

# Next.js
NEXT_PUBLIC_SERVER_URL=http://localhost:3001
```

**Generate Payload Secret:**
```bash
# On macOS/Linux:
openssl rand -hex 32

# On Windows (PowerShell):
[System.Convert]::ToHex((1..32 | ForEach {Get-Random -Maximum 256})) -replace ' ',''

# Or use online generator:
# https://generate-secret.vercel.app/32
```

### Step 3: Test Local Setup

```bash
# Start development server
pnpm dev
# OR
npm run dev

# Verify it's running
open http://localhost:3001
```

You should see:
- ✅ Registry homepage loads
- ✅ Admin interface at http://localhost:3001/admin
- ✅ Products API at http://localhost:3001/admin/api/collections/products

---

## 📝 Payload CMS Integration Details

### Understanding the Architecture

This project uses a **custom admin interface** instead of Payload's default admin:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Custom Admin  │───▶│   Payload API   │───▶│   PostgreSQL    │
│  (shadcn/ui)    │    │  (headless)     │    │    (Neon)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Key Configuration Files

**`payload.config.ts`** - CMS Schema & Collections:
```typescript
// Defines content types: Users, Pages, Products, Components, Media
// Database adapter configuration
// Admin settings and permissions
```

**`src/app/admin/`** - Custom Admin Interface:
```
admin/
├── layout.tsx          # Sidebar navigation
├── page.tsx            # Dashboard
├── products/           # Product management
│   ├── page.tsx        # List products
│   ├── new/page.tsx    # Create product
│   └── [id]/page.tsx   # Edit product
└── api/                # Generic collection APIs
    └── collections/[collection]/route.ts
```

### Collections Schema

The project includes these content types:

1. **Users** - Admin authentication
2. **Pages** - Static content pages  
3. **Products** - E-commerce/catalog items
4. **Components** - Design system components
5. **Media** - File uploads and images

---

## 🎨 Custom Admin Interface

### Why Custom Admin?

We built a custom admin interface because:
- **Consistency**: Uses the same shadcn/ui components as the frontend
- **Customization**: Full control over UI/UX
- **Integration**: Seamless integration with the registry system
- **Performance**: Optimized for our specific use cases

### Key Components

**Sidebar Navigation** (`src/app/admin/layout.tsx`):
```typescript
// Uses shadcn/ui Sidebar components
// Responsive design with collapsible menu
// Active state management
```

**Product Management** (`src/app/admin/products/`):
```typescript
// Table with shadcn/ui Table components
// Form with validation using react-hook-form
// Modal dialogs for confirmations
// Toast notifications for feedback
```

**Generic API Layer** (`src/app/admin/api/collections/[collection]/route.ts`):
```typescript
// CRUD operations for any Payload collection
// Error handling and validation
// TypeScript safety with Payload types
```

---

## 🌐 Vercel Deployment

### Step 1: Connect Repository

1. **Login to Vercel**
   - Go to: https://vercel.com/dashboard
   - Click "Add New..." → "Project"

2. **Import Repository**
   - Find your forked repository
   - Click "Import"

3. **Configure Project**
   ```
   Project Name: shadcn-registry-cms
   Framework Preset: Next.js
   Root Directory: ./
   ```

### Step 2: Environment Variables

In Vercel dashboard → Settings → Environment Variables:

**Add these variables:**
```bash
DATABASE_URL = postgresql://your-neon-connection-string
PAYLOAD_SECRET = your-32-character-secret
NEXT_PUBLIC_SERVER_URL = https://your-app.vercel.app
```

**Using Vercel CLI:**
```bash
# Install Vercel CLI
npm install -g vercel

# Login and link project
vercel
vercel link

# Add environment variables
vercel env add DATABASE_URL production
vercel env add PAYLOAD_SECRET production  
vercel env add NEXT_PUBLIC_SERVER_URL production
```

### Step 3: Deploy

```bash
# Deploy to production
vercel --prod

# OR through dashboard
# Push to main branch → automatic deployment
```

### Step 4: Remove Deployment Protection

1. Go to: Vercel Dashboard → Project → Settings → Deployment Protection
2. **Disable "Vercel Authentication"** for production
3. Your app will be publicly accessible

---

## ⚙️ Environment Configuration

### Local Development (`.env.local`)

```env
# Database
DATABASE_URL='postgresql://user:pass@host/db?sslmode=require'

# Payload CMS
PAYLOAD_SECRET=your-development-secret-32-chars-minimum

# Next.js  
NEXT_PUBLIC_SERVER_URL=http://localhost:3001
```

### Production (Vercel Environment Variables)

```env
# Database - Same Neon connection string
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

# Payload CMS - Different secret for production
PAYLOAD_SECRET=different-production-secret-32-chars

# Next.js - Your Vercel app URL
NEXT_PUBLIC_SERVER_URL=https://your-app.vercel.app
```

### Environment Variable Security

**Best Practices:**
- ✅ Use different secrets for development and production
- ✅ Never commit secrets to git (they're in `.gitignore`)
- ✅ Regenerate secrets if compromised
- ✅ Use Vercel's secret management (variables are encrypted)

---

## 🧪 Testing & Verification

### Step 1: Local Testing Checklist

```bash
# 1. Start development server
pnpm dev

# 2. Test homepage
curl http://localhost:3001
# Should return HTML (not error)

# 3. Test admin interface  
open http://localhost:3001/admin
# Should show dashboard

# 4. Test API endpoints
curl http://localhost:3001/admin/api/collections/products
# Should return JSON with products array

# 5. Test product creation
curl -X POST http://localhost:3001/admin/api/collections/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Product","slug":"test","price":10}'
# Should return created product
```

### Step 2: Production Testing Checklist

```bash
# Replace YOUR_APP with your Vercel app name
APP_URL="https://your-app.vercel.app"

# 1. Test homepage
curl $APP_URL
# Should return HTML

# 2. Test admin interface
open $APP_URL/admin
# Should show dashboard (no auth required)

# 3. Test API
curl $APP_URL/admin/api/collections/products
# Should return products

# 4. Test CRUD operations through UI
# - Create a product via admin interface
# - Edit the product  
# - Delete the product
# - Verify changes persist
```

### Step 3: Database Verification

**Check Neon Dashboard:**
1. Go to: https://console.neon.tech
2. Select your project
3. Go to "Tables" tab
4. Verify these tables exist:
   - `payload_preferences`
   - `users`
   - `pages`
   - `products`
   - `components`
   - `media`

**Check Data:**
```sql
-- Connect to your database and run:
SELECT COUNT(*) FROM products;
-- Should show number of products created
```

---

## 🔧 Troubleshooting

### Common Issues & Solutions

#### 1. Database Connection Failed

**Error:** `Connection failed` or `ENOTFOUND`

**Solutions:**
```bash
# Check connection string format
echo $DATABASE_URL
# Should start with postgresql:// and include ?sslmode=require

# Test connection
psql $DATABASE_URL -c "SELECT version();"

# Verify Neon database is active (not paused)
# Go to Neon console → your project → should show "Active"
```

#### 2. Build Errors on Vercel

**Error:** `Type error` or `Module not found`

**Solutions:**
```bash
# Test build locally first
pnpm build

# Check Node.js version
node --version  # Should be 18+

# Clear Next.js cache
rm -rf .next
pnpm build

# Check environment variables in Vercel dashboard
```

#### 3. Admin Interface Not Loading

**Error:** 404 on `/admin` or blank page

**Solutions:**
```bash
# Check if routes exist
ls src/app/admin/
# Should show: layout.tsx, page.tsx, products/

# Check browser console for errors
# Open developer tools → Console tab

# Verify environment variables
echo $NEXT_PUBLIC_SERVER_URL
```

#### 4. API Routes Returning 500

**Error:** `Internal Server Error` on API calls

**Solutions:**
```bash
# Check server logs (Vercel dashboard → Functions → View logs)

# Test locally with debugging
DEBUG=payload:* pnpm dev

# Verify database tables exist
# Connect to database and list tables
```

### Debug Commands

```bash
# Check all environment variables
env | grep -E "(DATABASE|PAYLOAD|NEXT)"

# Test database connectivity
npx tsx -e "
import { getPayload } from 'payload';
import config from './payload.config.js';
const payload = await getPayload({ config });
console.log('Connected!');
"

# Check Vercel deployment logs
vercel logs

# Test API endpoints locally
curl -v http://localhost:3001/admin/api/collections/products
```

---

## 🎯 Next Steps & Customization

### Extending the CMS

**Add New Collections:**
1. Edit `payload.config.ts`
2. Add new collection schema
3. Create admin pages in `src/app/admin/`
4. Deploy changes

**Example - Add "Categories" collection:**
```typescript
// In payload.config.ts
{
  slug: "categories",
  admin: { useAsTitle: "name" },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "slug", type: "text", required: true },
    { name: "description", type: "textarea" }
  ]
}
```

### Customizing the Admin Interface

**Modify Sidebar:**
- Edit `src/app/admin/layout.tsx`
- Add new navigation items
- Update icons and routes

**Add New Admin Pages:**
```bash
# Create new admin section
mkdir src/app/admin/categories
# Add CRUD pages following products/ pattern
```

### Advanced Features

**Add Authentication:**
- Configure Payload user roles
- Add login/logout flows
- Protect admin routes

**Add File Uploads:**
- Configure media collection
- Add image upload UI
- Implement file storage (local/S3)

**Add Preview Mode:**
- Implement draft/published workflow
- Add preview endpoints
- Connect to frontend rendering

---

## 📚 Resources & Documentation

### Official Documentation
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Payload CMS](https://payloadcms.com/docs) - Headless CMS
- [Next.js](https://nextjs.org/docs) - React framework
- [Vercel](https://vercel.com/docs) - Deployment platform
- [Neon](https://neon.tech/docs) - PostgreSQL hosting

### Community & Support
- [shadcn/ui Discord](https://discord.gg/shadcn)
- [Payload CMS Discord](https://discord.gg/payload)
- [Next.js GitHub](https://github.com/vercel/next.js)

### Additional Tools
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [React Hook Form](https://react-hook-form.com/) - Form handling

---

## ✨ Success! 

If you've followed this guide, you now have:

- ✅ **Production-ready** shadcn/ui registry with CMS
- ✅ **Custom admin interface** for content management  
- ✅ **PostgreSQL database** with Neon hosting
- ✅ **Vercel deployment** with automatic builds
- ✅ **Type-safe APIs** for all content operations
- ✅ **Responsive design** that works on all devices

Your application is now live and ready for real-world use! 🚀

---

## 📞 Getting Help

If you encounter issues:

1. **Check this guide** - Most common issues are covered
2. **Review error messages** - They often contain the solution
3. **Test locally first** - Easier to debug than production
4. **Check service status** - Verify Neon, Vercel are operational
5. **Community support** - Use Discord/GitHub for help

**Remember:** This setup has been tested and verified to work. If you follow each step carefully, you should have a working application!