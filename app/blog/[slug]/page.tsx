import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchPost, fetchPosts } from "@/lib/notion";
import { PostRenderer } from "@/components/blog/post-renderer";
import { SectionLabel } from "@/components/ui/section-label";
import { Tag } from "@/components/ui/tag";
import { siteConfig } from "@/config/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await fetchPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPost(slug);
  if (!post) return { title: "Not Found" };
  return {
    title:       post.title,
    description: post.excerpt,
    openGraph: {
      title:         post.title,
      description:   post.excerpt,
      type:          "article",
      url:           `${siteConfig.url}blog/${slug}`,
      publishedTime: post.date,
      authors:       [siteConfig.name],
      tags:          post.tags,
      ...(post.cover && { images: [{ url: post.cover, width: 1200, height: 630, alt: post.title }] }),
    },
    twitter: {
      card:        "summary_large_image",
      title:       post.title,
      description: post.excerpt,
      ...(post.cover && { images: [post.cover] }),
    },
    alternates: {
      canonical: `${siteConfig.url}blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await fetchPost(slug);

  if (!post) notFound();

  const date = post.date
    ? new Date(post.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type":    "Article",
    headline:        post.title,
    description:     post.excerpt,
    datePublished:   post.date,
    author: { "@type": "Person", name: siteConfig.name, url: siteConfig.url },
    publisher: { "@type": "Person", name: siteConfig.name, url: siteConfig.url },
    url: `${siteConfig.url}blog/${slug}`,
    ...(post.cover && { image: post.cover }),
    keywords: post.tags.join(", "),
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Breadcrumb */}
      <div className="mb-8">
        <Link
          href="/blog"
          className="text-[10px] font-mono text-[#adaaaa] hover:text-[#5db4fe] transition-colors tracking-widest"
        >
          ← /archives
        </Link>
      </div>

      {/* Post header */}
      <header className="mb-10 space-y-3 pb-8 border-b border-outline-variant/20">
        <SectionLabel>log_entry</SectionLabel>
        <h1 className="text-2xl sm:text-3xl font-bold font-sans text-white leading-tight">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono text-outline">
          <span>{date}</span>
          <span>[{post.readTime}]</span>
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
          <p className="text-sm font-mono text-[#adaaaa] leading-6 pt-2">{post.excerpt}</p>
        )}
      </header>

      {/* Post content */}
      <PostRenderer content={post.content} />

      {/* Footer nav */}
      <div className="mt-16 pt-8 border-t border-outline-variant/20">
        <Link
          href="/blog"
          className="text-[11px] font-mono text-[#adaaaa] hover:text-[#55fe7e] transition-colors"
        >
          &gt; Back to Archives
        </Link>
      </div>
    </div>
  );
}
