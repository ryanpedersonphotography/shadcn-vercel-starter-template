# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands
- `pnpm install` - Install dependencies
- `pnpm dev` - Start development server on port 3001 (includes registry build + turbopack)
- `pnpm build` - Build for production (includes registry build)
- `pnpm start` - Start production server on port 3001
- `pnpm lint` - Run Biome linter
- `pnpm lint:fix` - Run Biome linter with auto-fix
- `pnpm registry:build` - Build shadcn/ui registry files
- `pnpm seed` - Seed Payload CMS with initial data

### Package Manager
- Uses `pnpm` (v9.15.2)
- Node.js >= 22 required

## Architecture Overview

### Registry System
This is a **shadcn/ui Registry Starter** - a specialized Next.js application that serves as both a component library and a registry for AI tools (v0, Claude Code, Cursor, etc.).

**Core Registry Concepts:**
- `registry.json` - Central configuration defining all components, blocks, themes, and UI primitives
- `/r/[name].json` endpoints - Auto-generated JSON files for each registry item (used by AI tools)
- Registry types: `registry:theme`, `registry:block`, `registry:component`, `registry:ui`
- Registry builds happen automatically during dev/build via `shadcn@latest build`

### Application Structure

**Dual Route System:**
- `app/(registry)/` - Registry browser interface with sidebar navigation
- `app/demo/[name]/` - Component preview pages for testing

**Key Directories:**
- `src/components/ui/` - Base shadcn/ui components
- `src/components/registry/` - Registry-specific UI (sidebar, theme toggle, etc.)
- `src/components/` - Custom brand components (header, logo, hero, etc.)
- `src/layouts/` - Reusable layouts for v0 integration
- `src/lib/registry.ts` - Registry data access functions

### Theme and Styling
- **Tailwind v4** with CSS variables
- **Nature theme** with green/brown color palette using OKLCH color space
- Custom CSS variables defined in both `globals.css` and `registry.json`
- Biome for code formatting (2-space indentation)

### AI Tool Integration
- **v0 Integration**: "Open in v0" buttons with pre-populated prompts
- **MCP Support**: Registry accessible via Claude Desktop/Code through `/public/registry.json`
- **Component Isolation**: Each registry item includes all dependencies and theme files

## Development Patterns

### Registry Item Structure
When adding new components to the registry:
1. Add component files to appropriate `src/components/` directory
2. Update `registry.json` with new item definition
3. Include `registryDependencies` for shadcn/ui components and theme
4. Specify file paths and types (`registry:component`, `registry:page`, etc.)

### Component Organization
- **Brand Components**: Marketing/business components (hero, login, product-grid)
- **UI Primitives**: Base shadcn/ui components with theme integration
- **Blocks**: Complete page layouts combining multiple components
- **Layouts**: v0-compatible layout wrappers

### File Path Conventions
- Use `@/` imports for all internal references
- Registry path mapping: `@/registry` points to `registry.json`
- Target paths in registry items define where files should be installed

## Important Files

### Configuration
- `components.json` - shadcn/ui configuration (New York style, RSC enabled)
- `biome.json` - Linting/formatting rules with sorted classes
- `registry.json` - Complete registry definition with theme and components
- `next.config.ts` - Prevents search engine indexing with X-Robots-Tag

### Core Registry Logic
- `src/lib/registry.ts` - Functions to query registry data by type
- `src/app/(registry)/registry/[name]/page.tsx` - Individual component preview pages

## Special Considerations

### SEO Prevention
The application explicitly prevents search engine indexing via:
- `next.config.ts` headers
- Meta robots tags in layout
- Designed for private/internal registry use

### Registry Authentication (Optional)
Can be protected using `REGISTRY_AUTH_TOKEN` environment variable with middleware on `/r/:path*` routes for AI tool access control.

### v0 Integration Requirements
- Each registry item must include theme dependencies
- Layout files enable proper v0 chat initialization
- Component files include all necessary imports and dependencies