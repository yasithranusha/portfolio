import { ImageResponse } from "next/og";
import { fetchPostMetadata, fetchPosts } from "@/lib/notion";
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
  // Use metadata-only fetch to avoid 500 timeouts/memory errors
  const post = await fetchPostMetadata(slug);

  const title   = post?.title   ?? "Blog Post";
  const excerpt = post?.excerpt ?? "";

  let coverDataUri: string | null = null;
  if (post?.cover) {
    try {
      const isStatic = process.env.NEXT_PHASE === "phase-production-build";
      const res = await fetch(post.cover, { 
        signal: isStatic ? undefined : AbortSignal.timeout(4000) 
      });

      if (res.ok) {
        const buf  = await res.arrayBuffer();
        const mime = res.headers.get("content-type") ?? "image/jpeg";
        // Use standard Buffer if available, or fallback to btoa for edge safety
        const base64 = typeof Buffer !== "undefined" 
          ? Buffer.from(buf).toString("base64")
          : btoa(String.fromCharCode(...new Uint8Array(buf)));
        coverDataUri = `data:${mime};base64,${base64}`;
      }
    } catch (e: unknown) {
      if (process.env.NEXT_PHASE !== "phase-production-build") {
        console.warn("[opengraph-image] Failed to fetch cover:", e);
      }
    }
  }

  // Excerpt is now managed manually in Notion for optimal length

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#0e0e0e",
          position: "relative",
          overflow: "hidden",
          fontFamily: "monospace",
        }}
      >
        {/* 1. Subtle grid matching globals.css */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "linear-gradient(rgba(85,254,126,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(85,254,126,0.02) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* 2. Accent Glow — bottom right */}
        <div
          style={{
            position: "absolute",
            bottom: "-150px",
            right: "-150px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            display: "flex",
            background: "radial-gradient(circle, rgba(85,254,126,0.06) 0%, transparent 70%)",
          }}
        />

        {/* 3. Left — cover image container */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "48%",
            height: "100%",
            paddingTop: "44px", // Top bar offset
            position: "relative",
          }}
        >
          {coverDataUri ? (
            <div style={{ display: "flex", padding: "12px", border: "1px solid rgba(85,254,126,0.1)", borderRadius: "12px", background: "rgba(85,254,126,0.03)", position: "relative" }}>
              <img
                src={coverDataUri}
                alt=""
                style={{
                  width: "420px",
                  height: "280px",
                  objectFit: "cover",
                  borderRadius: "6px",
                  border: "1px solid rgba(85,254,126,0.2)",
                }}
              />
            </div>
          ) : (
            <div
              style={{
                width: "420px",
                height: "280px",
                border: "1px solid rgba(85,254,126,0.1)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(85,254,126,0.2)",
                fontSize: "14px",
                letterSpacing: "0.4em",
                background: "rgba(85,254,126,0.02)",
              }}
            >
              NO_COVER_IMG
            </div>
          )}
        </div>

        {/* 4. Right — Content area */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "52%",
            padding: "80px 64px 40px 0px",
            gap: "24px",
            position: "relative",
          }}
        >
          {/* Shell Prompt */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <div style={{ color: "#55fe7e", fontSize: "14px", fontWeight: "bold", display: "flex" }}>
              yasith@kernel:~/blog$
            </div>
            <div style={{ color: "#ffffff", fontSize: "14px", opacity: 0.8, display: "flex" }}>
              cat metadata.json
            </div>
          </div>

          {/* Title with Terminal Glow */}
          <div
            style={{
              color: "#ffffff",
              fontSize: title.length > 45 ? "42px" : "48px",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              display: "flex",
              textShadow: "0 0 20px rgba(85,254,126,0.15)",
            }}
          >
            {title}
          </div>

          {/* Decorative Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "40px", height: "2px", backgroundColor: "#55fe7e", display: "flex" }} />
            <div style={{ color: "rgba(85,254,126,0.4)", fontSize: "10px", letterSpacing: "0.2em", fontWeight: "bold", display: "flex" }}>
              SYSTEM_STATUS: OK
            </div>
          </div>

          {/* Excerpt */}
          {excerpt && (
            <div
              style={{
                color: "rgba(173, 170, 170, 0.7)",
                fontSize: "18px",
                lineHeight: 1.6,
                display: "flex",
                fontFamily: "sans-serif", // Slight contrast for readability
              }}
            >
              {excerpt}
            </div>
          )}

          {/* Footer branding */}
          <div style={{ 
            marginTop: "auto", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between",
            borderTop: "1px solid rgba(85,254,126,0.05)",
            paddingTop: "20px"
          }}>
            <div style={{ color: "#55fe7e", fontSize: "11px", letterSpacing: "0.15em", opacity: 0.6, display: "flex" }}>
              AUTHOR: {siteConfig.name.toUpperCase()}
            </div>
            <div style={{ color: "rgba(173, 170, 170, 0.3)", fontSize: "10px", display: "flex" }}>
               v2.0.4-boot
            </div>
          </div>
        </div>

        {/* 5. Global Scanlines effect — moved to layer naturally */}
        <div 
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%)",
            backgroundSize: "100% 4px",
            pointerEvents: "none",
          }}
        />

        {/* 6. Terminal Header — moved last to be on top of everything naturally */}
        <div 
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "44px",
            backgroundColor: "#181818",
            display: "flex",
            alignItems: "center",
            padding: "0 24px",
            borderBottom: "1px solid rgba(85,254,126,0.1)",
          }}
        >
          <div style={{ display: "flex", gap: "8px" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#ff5f56", display: "flex" }} />
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#ffbd2e", display: "flex" }} />
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#27c93f", display: "flex" }} />
          </div>
          <div style={{ 
            flex: 1, 
            display: "flex", 
            justifyContent: "center",
            color: "rgba(173, 170, 170, 0.4)", 
            fontSize: "10px", 
            letterSpacing: "0.3em", 
            fontWeight: "bold",
            textTransform: "uppercase" 
          }}>
            Kernel_Console / Blog_Entry
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
