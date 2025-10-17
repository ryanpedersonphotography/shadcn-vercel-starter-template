# Payload CMS Integration Guide

This project now includes Payload CMS v3 (native Next.js integration) for content management.

## Quick Start

### 1. Database Setup

For local development, use Docker to run PostgreSQL:

```bash
docker run --name payload-postgres \
  -p 5432:5432 \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=payload \
  -d postgres:15
```

### 2. Environment Variables

Copy the example environment file and update with your values:

```bash
cp .env.example .env.local
```

Update `.env.local` with:
- `DATABASE_URI`: Your PostgreSQL connection string
- `PAYLOAD_SECRET`: Generate with `openssl rand -hex 32`
- `NEXT_PUBLIC_SERVER_URL`: Your site URL (http://localhost:3001 for local)

### 3. Initialize Database and Seed Data

```bash
# Generate Payload types
pnpm generate:types

# Seed initial data (creates admin user and sample content)
pnpm seed
```

Default admin credentials:
- Email: `admin@example.com`
- Password: `admin123`

### 4. Run Development Server

```bash
pnpm dev
```

Access:
- Frontend: http://localhost:3001
- Admin UI: http://localhost:3001/admin

## Collections

### Pages
- Dynamic pages with hero sections and rich text content
- URL: `/[slug]`
- Fields: title, slug, hero (heading, subheading, CTA), content, status

### Products
- E-commerce product catalog
- Fields: name, slug, price, description, image, category, featured, status
- Used by the product grid component

### Components
- Registry components documentation
- Fields: name, slug, description, category, previewCode, documentation

### Media
- File uploads with automatic image optimization
- Sizes: thumbnail (400x300), card (768x1024), tablet (1024xAuto)

### Users
- Admin users for CMS access
- Authentication enabled

## Global Settings

### Site Settings
- Site name, tagline, logo, favicon, social links
- Accessible via `getSiteSettings()` function

### Navigation
- Main menu and footer links
- Accessible via `getNavigation()` function

## Data Fetching

Use the provided helper functions in `src/lib/cms.ts`:

```typescript
import { 
  getPageBySlug, 
  getProducts, 
  getComponents,
  getSiteSettings,
  getNavigation 
} from "@/lib/cms";

// Fetch a page
const page = await getPageBySlug("home");

// Fetch products
const products = await getProducts({ featured: true, limit: 4 });

// Fetch components by category
const uiComponents = await getComponents("ui");
```

## Revalidation

Content updates trigger automatic cache revalidation via webhook:

1. Webhook endpoint: `/api/revalidate`
2. Verifies payload secret
3. Revalidates specific cache tags based on collection

## Preview Mode

Preview draft content before publishing:

1. Access preview URL: `/api/preview?secret=YOUR_SECRET&slug=/page-slug`
2. Exit preview: `/api/exit-preview`
3. Draft mode shows unpublished content

## Deployment to Vercel

### 1. Database Setup

Use a managed PostgreSQL service:
- [Neon](https://neon.tech)
- [Supabase](https://supabase.com)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)

### 2. Environment Variables

Add to Vercel:
- `DATABASE_URI`: Production PostgreSQL connection string
- `PAYLOAD_SECRET`: Production secret (generate new one)
- `NEXT_PUBLIC_SERVER_URL`: Your production URL

### 3. Deploy

```bash
vercel
```

Or connect GitHub repository for automatic deployments.

## Webhook Configuration

Configure Payload to send webhooks on content changes:

1. Admin UI → Settings → Webhooks
2. Add webhook URL: `https://your-site.vercel.app/api/revalidate`
3. Add secret header: `x-payload-secret: YOUR_PAYLOAD_SECRET`
4. Select events: Create, Update, Delete

## Extending the CMS

### Add New Collection

Edit `payload.config.ts`:

```typescript
{
  slug: "blog-posts",
  fields: [
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true },
    { name: "content", type: "richText" },
    // Add more fields
  ],
}
```

### Add New Global

```typescript
{
  slug: "homepage-settings",
  fields: [
    { name: "heroTitle", type: "text" },
    // Add more fields
  ],
}
```

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check connection string format
- Ensure database exists

### Admin UI Not Loading
- Check `PAYLOAD_SECRET` is set
- Verify database migrations ran
- Check browser console for errors

### Revalidation Not Working
- Verify webhook secret matches
- Check webhook logs in Vercel dashboard
- Ensure cache tags are correct

## Resources

- [Payload CMS Docs](https://payloadcms.com/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Vercel Deployment](https://vercel.com/docs)