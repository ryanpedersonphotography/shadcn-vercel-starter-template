import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

// This webhook will be called by Payload CMS when content changes
export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const secret = headersList.get("x-payload-secret");

    // Verify the webhook secret
    if (secret !== process.env.PAYLOAD_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { collection, operation } = body;

    // Revalidate specific tags based on the collection
    switch (collection) {
      case "pages":
        revalidateTag("page");
        break;
      case "products":
        revalidateTag("products");
        break;
      case "components":
        revalidateTag("components");
        break;
      case "site-settings":
        revalidateTag("site-settings");
        break;
      case "navigation":
        revalidateTag("navigation");
        break;
      default:
        // Revalidate all if unknown collection
        revalidateTag("page");
        revalidateTag("products");
        revalidateTag("components");
        revalidateTag("site-settings");
        revalidateTag("navigation");
    }

    return NextResponse.json({
      revalidated: true,
      collection,
      operation,
      now: Date.now(),
    });
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ status: "ok", timestamp: Date.now() });
}