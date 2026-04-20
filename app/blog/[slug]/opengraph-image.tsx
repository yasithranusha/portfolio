import { ImageResponse } from "next/og";
import { fetchPostMetadata, fetchPosts } from "@/lib/notion";
import { siteConfig } from "@/config/site";

export const runtime = "nodejs";
export const revalidate = 86400;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  const posts = await fetchPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

/**
 * Fallback UI for when Data Fetching or Rendering fails.
 * This prevents a production 500 error and provides diagnostic info.
 */
function ErrorFallback({ title, message, slug }: { title: string; message: string; slug?: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#0e0e0e",
        padding: "80px",
        fontFamily: "monospace",
        color: "#ff5f56",
        position: "relative",
      }}
    >
      <div style={{ fontSize: "24px", marginBottom: "20px", display: "flex" }}>[ SYSTEM_FAILURE ]</div>
      <div style={{ fontSize: "64px", fontWeight: "bold", marginBottom: "40px", color: "#ffffff", display: "flex" }}>
        {title}
      </div>
      <div style={{ fontSize: "20px", opacity: 0.8, color: "#ff5f56", display: "flex" }}>
        STATUS: {message}
      </div>
      <div style={{ marginTop: "auto", fontSize: "14px", opacity: 0.4, color: "#ffffff", display: "flex" }}>
        ENTRY: {slug?.toUpperCase() ?? "UNKNOWN"}
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "linear-gradient(rgba(255, 95, 86, 0.05) 50%, transparent 50%)",
          backgroundSize: "100% 4px",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  try {
    // Use metadata-only fetch to avoid 500 timeouts/memory errors
    const post = await fetchPostMetadata(slug);

    if (!post) {
      return new ImageResponse(
        <ErrorFallback title="POST_NOT_FOUND" message="RESOLVER_FAILURE" slug={slug} />,
        { ...size }
      );
    }

    const title   = post.title   ?? "Blog Post";
    const excerpt = post.excerpt ?? "";

    let coverDataUri: string | null = null;
    if (post.cover) {
      try {
        const isStatic = process.env.NEXT_PHASE === "phase-production-build";
        const res = await fetch(post.cover, { 
          headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
          // Give it more time locally (10s)
          signal: isStatic ? undefined : AbortSignal.timeout(10000) 
        });

        if (res.ok) {
          const buf  = await res.arrayBuffer();
          const mime = res.headers.get("content-type") ?? "image/jpeg";
          const base64 = Buffer.from(buf).toString("base64");
          coverDataUri = `data:${mime};base64,${base64}`;
        } else if (res.status !== 404) {
          console.warn(`[opengraph-image] Cover fetch HTTP error: ${res.status}`);
        }
      } catch (e: unknown) {
        const errorMsg = e instanceof Error ? e.message : String(e);
        console.warn("[opengraph-image] Cover fetch failed (timeout or network):", errorMsg);
      }
    }

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
          {/* Grid Background */}
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

          {/* Accent Glow */}
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

          {/* Left Cover Image */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "48%",
              height: "100%",
              paddingTop: "44px",
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

          {/* Right Content */}
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
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
              <div style={{ color: "#55fe7e", fontSize: "14px", fontWeight: "bold", display: "flex" }}>
                yasith@kernel:~/blog$
              </div>
              <div style={{ color: "#ffffff", fontSize: "14px", opacity: 0.8, display: "flex" }}>
                cat metadata.json
              </div>
            </div>

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

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "40px", height: "2px", backgroundColor: "#55fe7e", display: "flex" }} />
              <div style={{ color: "rgba(85,254,126,0.4)", fontSize: "10px", letterSpacing: "0.2em", fontWeight: "bold", display: "flex" }}>
                SYSTEM_STATUS: OK
              </div>
            </div>

            {excerpt && (
              <div
                style={{
                  color: "rgba(173, 170, 170, 0.7)",
                  fontSize: "18px",
                  lineHeight: 1.6,
                  display: "flex",
                  fontFamily: "sans-serif",
                }}
              >
                {excerpt}
              </div>
            )}

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
                 v1.0.0
              </div>
            </div>
          </div>

          {/* Scanlines layer */}
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

          {/* Terminal Header */}
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
              Kernel_Console / Logic_Stable
            </div>
          </div>
        </div>
      ),
      { ...size }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "UNRECOVERABLE_ERROR";
    console.error("[opengraph-image] Fatal generation crash:", error);
    return new ImageResponse(
      <ErrorFallback 
        title="RUNTIME_EXCEPTION" 
        message={message} 
        slug={slug} 
      />,
      { ...size }
    );
  }
}
