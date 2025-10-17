import { getPayload } from 'payload'
import config from '@payload-config'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

export async function seedDatabase() {
  try {
    const payload = await getPayload({ config });

    // Check if we already have data
    const existingPages = await payload.find({
      collection: "pages",
      limit: 1,
    });

    if (existingPages.docs.length > 0) {
      console.log("Database already seeded, skipping...");
      return;
    }

    console.log("Seeding database...");

    // Create default user
    const user = await payload.create({
      collection: "users",
      data: {
        email: "admin@example.com",
        password: "admin123",
        name: "Admin User",
      },
    });

    // Create site settings
    await payload.updateGlobal({
      slug: "site-settings",
      data: {
        siteName: "shadcn/ui Registry Starter",
        tagline: "Beautiful UI components built with Radix UI and Tailwind CSS",
      },
    });

    // Create navigation
    await payload.updateGlobal({
      slug: "navigation",
      data: {
        mainMenu: [
          { label: "Home", link: "/" },
          { label: "Components", link: "/registry" },
          { label: "Tokens", link: "/tokens" },
          { label: "Demo", link: "/demo/dashboard" },
        ],
        footerLinks: [
          { label: "Documentation", link: "/docs" },
          { label: "GitHub", link: "https://github.com" },
          { label: "Twitter", link: "https://twitter.com" },
        ],
      },
    });

    // Create homepage
    await payload.create({
      collection: "pages",
      data: {
        title: "Home",
        slug: "home",
        hero: {
          heading: "Build your component library",
          subheading:
            "Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.",
          ctaText: "Get Started",
          ctaLink: "/registry",
        },
        content: {
          root: {
            children: [
              {
                children: [
                  {
                    text: "Welcome to the shadcn/ui registry starter. This template gives you everything you need to build your own component registry.",
                  },
                ],
                type: "paragraph",
              },
            ],
            type: "root",
          },
        },
        status: "published",
      },
    });

    // Create sample products
    const products = [
      {
        name: "Acme Prism T-Shirt",
        slug: "acme-prism-tshirt",
        price: 25,
        description: "A stylish t-shirt with a prism design",
        category: "fashion",
        featured: true,
        status: "active",
      },
      {
        name: "Acme Circles T-Shirt",
        slug: "acme-circles-tshirt",
        price: 30,
        description: "Modern geometric circles design",
        category: "fashion",
        featured: true,
        status: "active",
      },
      {
        name: "Acme Drawstring Bag",
        slug: "acme-drawstring-bag",
        price: 15,
        description: "Practical and stylish drawstring bag",
        category: "accessories",
        featured: false,
        status: "active",
      },
      {
        name: "Acme Stacked Sticker",
        slug: "acme-stacked-sticker",
        price: 5,
        description: "High-quality vinyl sticker",
        category: "accessories",
        featured: false,
        status: "active",
      },
    ];

    for (const product of products) {
      await payload.create({
        collection: "products",
        data: product,
      });
    }

    // Create sample components
    const components = [
      {
        name: "Button",
        slug: "button",
        description: "A versatile button component with multiple variants",
        category: "ui",
        previewCode: `<Button variant="outline">Click me</Button>`,
      },
      {
        name: "Card",
        slug: "card",
        description: "A flexible card component for displaying content",
        category: "ui",
        previewCode: `<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
</Card>`,
      },
      {
        name: "Dashboard",
        slug: "dashboard",
        description: "Complete dashboard layout with sidebar and charts",
        category: "block",
        previewCode: `// Dashboard block component`,
      },
    ];

    for (const component of components) {
      await payload.create({
        collection: "components",
        data: {
          ...component,
          documentation: {
            root: {
              children: [
                {
                  children: [
                    {
                      text: `Documentation for ${component.name} component`,
                    },
                  ],
                  type: "paragraph",
                },
              ],
              type: "root",
            },
          },
        },
      });
    }

    console.log("Database seeded successfully!");
    console.log("Default admin credentials:");
    console.log("Email: admin@example.com");
    console.log("Password: admin123");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}