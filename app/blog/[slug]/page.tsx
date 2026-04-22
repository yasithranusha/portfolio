import type { Metadata } from "next";
import { Suspense } from "react";
import { FadeImage } from "@/components/ui/fade-image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchPost, fetchPosts, fetchPostMetadata } from "@/lib/notion";
import { PostRenderer } from "@/components/blog/post-renderer";
import { SectionLabel } from "@/components/ui/section-label";
import { Tag } from "@/components/ui/tag";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { siteConfig } from "@/config/site";
import { Skeleton } from "@/components/ui/skeleton";

// ─── Static Params & Metadata ──────────────────────────────────────

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await fetchPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPostMetadata(slug);
  if (!post) return { title: "Not Found" };

  const ogTitle  = post.title.length > 60  ? post.title.slice(0, 57)  + "…" : post.title;
  const metaDesc = post.excerpt.length > 155 ? post.excerpt.slice(0, 152) + "…" : post.excerpt;

  return {
    title:       post.title,
    description: metaDesc,
    keywords:    post.tags.length > 0 ? post.tags : undefined,
    openGraph: {
      title:        ogTitle,
      description:  metaDesc,
      type:         "article",
      url:          `${siteConfig.url}blog/${slug}`,
      siteName:     siteConfig.name,
      locale:       "en_US",
      publishedTime: post.date,
      modifiedTime:  post.lastEditedAt,
      authors:      [siteConfig.name],
      tags:         post.tags,
      images: post.cover
        ? [{ url: post.cover, width: 1200, height: 630, alt: post.title }]
        : undefined,
    },
    twitter: {
      card:        "summary_large_image",
      title:       ogTitle,
      description: metaDesc,
      images:      post.cover ? [post.cover] : undefined,
    },
    alternates: {
      canonical: `${siteConfig.url}blog/${slug}`,
    },
    other: {
      "og:logo": `${siteConfig.url}icon.png`,
    },
  };
}

// ─── Content skeleton (shown while PostRenderer streams) ────────────
function PostContentSkeleton() {
  return (
    <div className="space-y-4 mt-8">
      <Skeleton className="h-4 w-full bg-surface-container-highest" />
      <Skeleton className="h-4 w-5/6 bg-surface-container-highest" />
      <Skeleton className="h-4 w-4/6 bg-surface-container-highest" />
      <Skeleton className="h-32 w-full mt-8 bg-surface-container-highest" />
      <Skeleton className="h-4 w-full bg-surface-container-highest" />
      <Skeleton className="h-4 w-3/4 bg-surface-container-highest" />
      <Skeleton className="h-4 w-5/6 bg-surface-container-highest" />
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await fetchPost(slug);

  if (!post) notFound();

  const isoDate = post.date ?? "";
  const displayDate = isoDate
    ? new Date(isoDate).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const wordCount = post.content.split(/\s+/).filter(Boolean).length;

  // ── JSON-LD structured data (Article schema) ──────────────────────
  const jsonLd = {
    "@context": "https://schema.org",
    "@type":    "Article",
    mainEntityOfPage: { "@type": "WebPage", "@id": `${siteConfig.url}blog/${slug}` },
    headline:        post.title,
    description:     post.excerpt,
    image:           post.cover || `${siteConfig.url}blog/${slug}/opengraph-image`,
    datePublished:   post.date,
    dateModified:    post.lastEditedAt,
    wordCount,
    timeRequired:    `PT${post.readTimeMin}M`,
    keywords:        post.tags.join(", "),
    author: {
      "@type": "Person",
      name:    siteConfig.name,
      url:     siteConfig.url,
    },
    publisher: {
      "@type": "Person",
      name:    siteConfig.name,
      url:     siteConfig.url,
    },
    url: `${siteConfig.url}blog/${slug}`,
  };

  // ── Breadcrumb JSON-LD ────────────────────────────────────────────
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type":    "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Blog", item: `${siteConfig.url}blog` },
      { "@type": "ListItem", position: 2, name: post.title, item: `${siteConfig.url}blog/${slug}` },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto w-full">
      <ReadingProgress />

      {/* ── Structured data ─────────────────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* ── Breadcrumb nav ──────────────────────────────────────── */}
      <nav aria-label="Breadcrumb" className="mb-8 flex items-center justify-between group">
        <Link
          href="/blog"
          className="text-[10px] font-mono text-[#adaaaa] hover:text-[#5db4fe] transition-colors tracking-widest flex items-center gap-2"
        >
          <span className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" aria-hidden="true">{"$ "}</span>
          cd ../archives
        </Link>
        <div className="text-[9px] font-mono text-outline opacity-50 hidden sm:block" aria-hidden="true">
          {slug.toUpperCase()}
        </div>
      </nav>

      {/* ── Article ─────────────────────────────────────────────── */}
      <article itemScope itemType="https://schema.org/Article">

        {/* ── Post header ───────────────────────────────────────── */}
        <header className="mb-10 space-y-3 pb-8 border-b border-outline-variant/20">
          <SectionLabel>log_entry</SectionLabel>

          <h1
            className="text-2xl sm:text-3xl font-bold font-sans text-white leading-tight"
            itemProp="headline"
          >
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-[10px] font-mono text-outline">
              {isoDate && (
                <time dateTime={isoDate} itemProp="datePublished">
                  {displayDate}
                </time>
              )}
              {post.lastEditedAt && (
                <meta itemProp="dateModified" content={post.lastEditedAt} />
              )}
              <span>[{post.readTime}]</span>
            </div>
          </div>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <Tag key={tag} variant="secondary">
                  #{tag}
                </Tag>
              ))}
            </div>
          )}

          {post.excerpt && (
            <p
              className="text-sm font-mono text-[#adaaaa] leading-6 pt-2"
              itemProp="description"
            >
              {post.excerpt}
            </p>
          )}
        </header>

        {/* ── Cover image — blur shimmer while loading, fades in on load ── */}
        {post.cover && (
          <figure
            className="relative aspect-[2.6/1] mb-12 rounded-lg overflow-hidden border border-outline-variant/30 group"
            aria-label={`Cover image for ${post.title}`}
          >
            <FadeImage
              src={post.cover}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 72rem"
              itemProp="image"
            />
            {/* Decorative overlays — hidden from assistive tech */}
            <div className="absolute inset-0 bg-black/10 mix-blend-overlay pointer-events-none" aria-hidden="true" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent pointer-events-none" aria-hidden="true" />
            <div
              className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"
              aria-hidden="true"
            />
          </figure>
        )}

        {/* ── Post content (Server Component, may stream) ─────────
            Suspense shows a skeleton while PostRenderer processes
            and renders the markdown.
        ─────────────────────────────────────────────────────── */}
        <Suspense fallback={<PostContentSkeleton />}>
          <PostRenderer content={post.content} />
        </Suspense>

      </article>

      {/* ── Footer nav ──────────────────────────────────────────── */}
      <footer className="mt-16 pt-8 border-t border-outline-variant/20">
        <Link
          href="/blog"
          className="text-[11px] font-mono text-[#adaaaa] hover:text-[#55fe7e] transition-colors"
        >
          &gt; Back to Archives
        </Link>
      </footer>
    </div>
  );
}
