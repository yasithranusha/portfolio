import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<Response> {
  const secret = request.headers.get("x-revalidate-secret");

  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const type = request.nextUrl.searchParams.get("type");

  if (type === "project") {
    revalidateTag("projects", { expire: 0 });
    return NextResponse.json({ revalidated: true, tag: "projects" });
  }

  revalidateTag("posts", { expire: 0 });
  return NextResponse.json({ revalidated: true, tag: "posts" });
}
