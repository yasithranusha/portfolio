import { ImageResponse } from "next/og";
import { fetchPost, fetchPosts } from "@/lib/notion";
import { siteConfig } from "@/config/site";

export const revalidate = 86400;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  const posts = await fetchPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await fetchPost(slug);

  const title   = post?.title   ?? "Blog Post";
  const excerpt = post?.excerpt ?? "";

  let coverDataUri: string | null = null;
  if (post?.cover) {
    try {
      const res = await fetch(post.cover);
      if (res.ok) {
        const buf  = await res.arrayBuffer();
        const mime = res.headers.get("content-type") ?? "image/jpeg";
        coverDataUri = `data:${mime};base64,${Buffer.from(buf).toString("base64")}`;
      }
    } catch { /* render without cover */ }
  }

  const shortExcerpt = excerpt.length > 120 ? excerpt.slice(0, 117) + "…" : excerpt;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#0a0a0a",
          position: "relative",
          overflow: "hidden",
          fontFamily: "monospace",
        }}
      >
        {/* Subtle grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(85,254,126,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(85,254,126,0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Green glow — top left */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            left: "-80px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(85,254,126,0.08) 0%, transparent 70%)",
          }}
        />

        {/* Decorative diagonal streaks — top right */}
        <div style={{ position: "absolute", top: "55px", right: "180px", width: "260px", height: "2px", background: "rgba(85,254,126,0.35)", transform: "rotate(-12deg)", borderRadius: "2px" }} />
        <div style={{ position: "absolute", top: "72px", right: "175px", width: "160px", height: "1px", background: "rgba(85,254,126,0.15)", transform: "rotate(-12deg)", borderRadius: "2px" }} />

        {/* Left — cover image */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "48%",
            height: "100%",
            position: "relative",
          }}
        >
          {coverDataUri ? (
            <>
              {/* Glow card behind image */}
              <div
                style={{
                  position: "absolute",
                  width: "400px",
                  height: "295px",
                  border: "1px solid rgba(85,254,126,0.15)",
                  borderRadius: "12px",
                  background: "rgba(85,254,126,0.04)",
                  transform: "translate(12px, 14px)",
                }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverDataUri}
                alt=""
                style={{
                  width: "400px",
                  height: "280px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  border: "1px solid rgba(85,254,126,0.2)",
                  position: "relative",
                }}
              />
            </>
          ) : (
            <div
              style={{
                width: "400px",
                height: "280px",
                border: "1px solid rgba(85,254,126,0.2)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(85,254,126,0.3)",
                fontSize: "16px",
                letterSpacing: "0.15em",
              }}
            >
              {siteConfig.domain}
            </div>
          )}
        </div>

        {/* Right — text */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "52%",
            padding: "60px 64px 60px 16px",
            gap: "20px",
            position: "relative",
          }}
        >
          {/* Top label */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#55fe7e", boxShadow: "0 0 6px #55fe7e" }} />
            <div style={{ color: "#55fe7e", fontSize: "12px", letterSpacing: "0.18em" }}>
              {siteConfig.domain} / blog
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              color: "#f0f0f0",
              fontSize: title.length > 50 ? "36px" : "42px",
              fontWeight: 700,
              lineHeight: 1.25,
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </div>

          {/* Divider */}
          <div style={{ width: "48px", height: "2px", backgroundColor: "#55fe7e", opacity: 0.6 }} />

          {/* Excerpt */}
          {shortExcerpt && (
            <div
              style={{
                color: "rgba(240,240,240,0.55)",
                fontSize: "17px",
                lineHeight: 1.65,
              }}
            >
              {shortExcerpt}
            </div>
          )}

          {/* Author */}
          <div style={{ color: "rgba(85,254,126,0.45)", fontSize: "13px", letterSpacing: "0.08em", marginTop: "4px" }}>
            {siteConfig.name}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
