import { ImageResponse } from "next/og";
import { fetchPost } from "@/lib/notion";
import { siteConfig } from "@/config/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await fetchPost(slug);

  const title   = post?.title   ?? "Blog Post";
  const excerpt = post?.excerpt ?? "";
  const tags    = post?.tags    ?? [];

  // Fetch cover image server-side — Notion S3 URL is consumed here, never exposed
  let coverDataUri: string | null = null;
  if (post?.cover) {
    try {
      const res = await fetch(post.cover);
      if (res.ok) {
        const buf = await res.arrayBuffer();
        const mime = res.headers.get("content-type") ?? "image/jpeg";
        coverDataUri = `data:${mime};base64,${Buffer.from(buf).toString("base64")}`;
      }
    } catch {
      // fall through — render without cover
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: "#0a0a0a",
          fontFamily: "monospace",
          overflow: "hidden",
        }}
      >
        {/* Cover image — full bleed */}
        {coverDataUri && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverDataUri}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        )}

        {/* Dark overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: coverDataUri
              ? "linear-gradient(to right, rgba(0,0,0,0.92) 55%, rgba(0,0,0,0.5) 100%)"
              : "rgba(0,0,0,1)",
          }}
        />

        {/* Grid lines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(85,254,126,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(85,254,126,0.04) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "56px 60px",
            width: coverDataUri ? "65%" : "100%",
            height: "100%",
          }}
        >
          {/* Top label */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ color: "#55fe7e", fontSize: "12px", letterSpacing: "0.15em" }}>
              {siteConfig.domain} / blog
            </div>
            <div style={{ flex: 1, height: "1px", backgroundColor: "rgba(85,254,126,0.25)" }} />
            <div style={{ color: "rgba(85,254,126,0.4)", fontSize: "11px", letterSpacing: "0.1em" }}>
              LOG_ENTRY
            </div>
          </div>

          {/* Title + excerpt + tags */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {tags.length > 0 && (
              <div style={{ display: "flex", gap: "8px" }}>
                {tags.slice(0, 3).map((tag) => (
                  <div
                    key={tag}
                    style={{
                      backgroundColor: "rgba(85,254,126,0.12)",
                      color: "#55fe7e",
                      fontSize: "11px",
                      padding: "3px 10px",
                      letterSpacing: "0.1em",
                    }}
                  >
                    #{tag}
                  </div>
                ))}
              </div>
            )}

            <div
              style={{
                color: "#f0f0f0",
                fontSize: title.length > 45 ? "40px" : "50px",
                fontWeight: 700,
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
              }}
            >
              {title}
            </div>

            {excerpt && (
              <div
                style={{
                  color: "rgba(240,240,240,0.5)",
                  fontSize: "17px",
                  lineHeight: 1.5,
                  fontFamily: "monospace",
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {excerpt}
              </div>
            )}
          </div>

          {/* Bottom author bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              borderTop: "1px solid rgba(85,254,126,0.15)",
              paddingTop: "18px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#55fe7e",
                boxShadow: "0 0 8px #55fe7e",
              }}
            />
            <div style={{ color: "#55fe7e", fontSize: "15px", letterSpacing: "0.08em" }}>
              {siteConfig.name}
            </div>
            <div style={{ color: "rgba(255,255,255,0.2)", fontSize: "13px", marginLeft: "auto", letterSpacing: "0.1em" }}>
              {siteConfig.domain}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
