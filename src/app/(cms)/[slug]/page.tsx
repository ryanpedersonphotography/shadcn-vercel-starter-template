import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/cms";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CMSPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="container mx-auto py-12">
      {/* Hero Section */}
      {page.hero && (
        <div className="mb-12 text-center">
          {page.hero.heading && (
            <h1 className="mb-4 text-4xl font-bold">{page.hero.heading}</h1>
          )}
          {page.hero.subheading && (
            <p className="mb-8 text-gray-600 text-xl">{page.hero.subheading}</p>
          )}
          {page.hero.ctaText && page.hero.ctaLink && (
            <Button asChild size="lg">
              <Link href={page.hero.ctaLink}>{page.hero.ctaText}</Link>
            </Button>
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="prose prose-lg mx-auto max-w-4xl">
        {/* For now, render a simple message. In production, you'd render the rich text content */}
        <div className="rounded-lg border p-6">
          <p>
            Page content would be rendered here. The rich text content from
            Payload CMS would be parsed and displayed.
          </p>
          {page.content && (
            <div className="mt-4">
              <pre className="whitespace-pre-wrap text-sm">
                {JSON.stringify(page.content, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Generate static params for known pages
export async function generateStaticParams() {
  // This would typically fetch all published pages from the CMS
  // For now, return empty array to use dynamic rendering
  return [];
}