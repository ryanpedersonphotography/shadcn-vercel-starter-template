import { getPayloadClient } from "./payload";
import { unstable_cache } from "next/cache";

/**
 * Fetch a page by slug
 */
export const getPageBySlug = unstable_cache(
  async (slug: string) => {
    try {
      const payload = await getPayloadClient();
      const pages = await payload.find({
        collection: "pages",
        where: {
          slug: { equals: slug },
          status: { equals: "published" },
        },
        limit: 1,
      });

      return pages.docs[0] || null;
    } catch (error) {
      console.error("Error fetching page:", error);
      return null;
    }
  },
  ["page"],
  { revalidate: 60 }
);

/**
 * Fetch products
 */
export const getProducts = unstable_cache(
  async (options?: {
    featured?: boolean;
    category?: string;
    limit?: number;
  }) => {
    try {
      const payload = await getPayloadClient();
      const where: any = { status: { equals: "active" } };

      if (options?.featured) {
        where.featured = { equals: true };
      }

      if (options?.category) {
        where.category = { equals: options.category };
      }

      const products = await payload.find({
        collection: "products",
        where,
        limit: options?.limit || 10,
      });

      return products.docs;
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  },
  ["products"],
  { revalidate: 60 }
);

/**
 * Fetch components
 */
export const getComponents = unstable_cache(
  async (category?: string) => {
    try {
      const payload = await getPayloadClient();
      const where: any = {};

      if (category) {
        where.category = { equals: category };
      }

      const components = await payload.find({
        collection: "components",
        where,
      });

      return components.docs;
    } catch (error) {
      console.error("Error fetching components:", error);
      return [];
    }
  },
  ["components"],
  { revalidate: 60 }
);

/**
 * Fetch site settings
 */
export const getSiteSettings = unstable_cache(
  async () => {
    try {
      const payload = await getPayloadClient();
      const settings = await payload.findGlobal({
        slug: "site-settings",
      });

      return settings;
    } catch (error) {
      console.error("Error fetching site settings:", error);
      return null;
    }
  },
  ["site-settings"],
  { revalidate: 60 }
);

/**
 * Fetch navigation
 */
export const getNavigation = unstable_cache(
  async () => {
    try {
      const payload = await getPayloadClient();
      const navigation = await payload.findGlobal({
        slug: "navigation",
      });

      return navigation;
    } catch (error) {
      console.error("Error fetching navigation:", error);
      return null;
    }
  },
  ["navigation"],
  { revalidate: 60 }
);