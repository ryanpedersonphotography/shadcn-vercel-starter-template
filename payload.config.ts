import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { vercelPostgresAdapter } from "@payloadcms/db-vercel-postgres";
import { buildConfig } from "payload";
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Database adapter selection: Use Neon Postgres in production, local Postgres for dev
const adapter = postgresAdapter({
  pool: { 
    connectionString: process.env.DATABASE_URL || process.env.DATABASE_URI || "",
  },
});

export default buildConfig({
  admin: {
    user: "users",
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: adapter,
  sharp,
  collections: [
    // Users collection for admin access
    {
      slug: "users",
      auth: true,
      admin: {
        useAsTitle: "email",
      },
      fields: [
        {
          name: "name",
          type: "text",
        },
      ],
    },
    // Pages collection for dynamic page content
    {
      slug: "pages",
      admin: {
        useAsTitle: "title",
      },
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
        },
        {
          name: "slug",
          type: "text",
          required: true,
          unique: true,
          admin: {
            position: "sidebar",
          },
        },
        {
          name: "hero",
          type: "group",
          fields: [
            {
              name: "heading",
              type: "text",
            },
            {
              name: "subheading",
              type: "text",
            },
            {
              name: "ctaText",
              type: "text",
              label: "CTA Text",
            },
            {
              name: "ctaLink",
              type: "text",
              label: "CTA Link",
            },
          ],
        },
        {
          name: "content",
          type: "richText",
        },
        {
          name: "status",
          type: "select",
          options: [
            {
              label: "Draft",
              value: "draft",
            },
            {
              label: "Published",
              value: "published",
            },
          ],
          defaultValue: "draft",
          admin: {
            position: "sidebar",
          },
        },
      ],
    },
    // Components collection for reusable UI components
    {
      slug: "components",
      admin: {
        useAsTitle: "name",
      },
      fields: [
        {
          name: "name",
          type: "text",
          required: true,
        },
        {
          name: "slug",
          type: "text",
          required: true,
          unique: true,
        },
        {
          name: "description",
          type: "textarea",
        },
        {
          name: "category",
          type: "select",
          options: [
            { label: "UI", value: "ui" },
            { label: "Block", value: "block" },
            { label: "Component", value: "component" },
          ],
          required: true,
        },
        {
          name: "previewCode",
          type: "code",
          admin: {
            language: "tsx",
          },
        },
        {
          name: "documentation",
          type: "richText",
        },
      ],
    },
    // Products collection for e-commerce demo
    {
      slug: "products",
      admin: {
        useAsTitle: "name",
      },
      fields: [
        {
          name: "name",
          type: "text",
          required: true,
        },
        {
          name: "slug",
          type: "text",
          required: true,
          unique: true,
        },
        {
          name: "price",
          type: "number",
          required: true,
          min: 0,
        },
        {
          name: "description",
          type: "textarea",
        },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
        },
        {
          name: "category",
          type: "select",
          options: [
            { label: "Fashion", value: "fashion" },
            { label: "Accessories", value: "accessories" },
            { label: "Footwear", value: "footwear" },
          ],
        },
        {
          name: "featured",
          type: "checkbox",
          defaultValue: false,
        },
        {
          name: "status",
          type: "select",
          options: [
            { label: "Active", value: "active" },
            { label: "Draft", value: "draft" },
            { label: "Archived", value: "archived" },
          ],
          defaultValue: "draft",
        },
      ],
    },
    // Media collection for file uploads
    {
      slug: "media",
      upload: {
        staticDir: "public/media",
        imageSizes: [
          {
            name: "thumbnail",
            width: 400,
            height: 300,
            position: "centre",
          },
          {
            name: "card",
            width: 768,
            height: 1024,
            position: "centre",
          },
          {
            name: "tablet",
            width: 1024,
            height: undefined,
            position: "centre",
          },
        ],
        adminThumbnail: "thumbnail",
        mimeTypes: ["image/*"],
      },
      fields: [
        {
          name: "alt",
          type: "text",
        },
      ],
    },
  ],
  globals: [
    // Global site settings
    {
      slug: "site-settings",
      fields: [
        {
          name: "siteName",
          type: "text",
          required: true,
        },
        {
          name: "tagline",
          type: "text",
        },
        {
          name: "logo",
          type: "upload",
          relationTo: "media",
        },
        {
          name: "favicon",
          type: "upload",
          relationTo: "media",
        },
        {
          name: "socialLinks",
          type: "group",
          fields: [
            {
              name: "twitter",
              type: "text",
            },
            {
              name: "github",
              type: "text",
            },
            {
              name: "linkedin",
              type: "text",
            },
          ],
        },
      ],
    },
    // Navigation global
    {
      slug: "navigation",
      fields: [
        {
          name: "mainMenu",
          type: "array",
          fields: [
            {
              name: "label",
              type: "text",
              required: true,
            },
            {
              name: "link",
              type: "text",
              required: true,
            },
            {
              name: "openInNewTab",
              type: "checkbox",
              defaultValue: false,
            },
          ],
        },
        {
          name: "footerLinks",
          type: "array",
          fields: [
            {
              name: "label",
              type: "text",
              required: true,
            },
            {
              name: "link",
              type: "text",
              required: true,
            },
          ],
        },
      ],
    },
  ],
});