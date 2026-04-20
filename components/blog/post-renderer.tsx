import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import { visit } from "unist-util-visit";
import rehypeSlug from "rehype-slug";
import { toString } from "hast-util-to-string";
import { highlight } from "@/lib/shiki";
import { PostContent } from "./post-content";
import type { Root as MdastRoot, Code, Html } from "mdast";
import type { Root as HastRoot, Element, Parent as HastParent } from "hast";

export interface BlogHeading {
  text: string;
  id: string;
  level: number;
}

interface PostRendererProps {
  content: string | undefined | null;
}

/**
 * Remark plugin to extract and highlight code blocks using Shiki
 */
function remarkShiki() {
  return async (tree: MdastRoot) => {
    const nodes: Code[] = [];
    visit(tree, "code", (node: Code) => {
      nodes.push(node);
    });

    await Promise.all(
      nodes.map(async (node) => {
        const html = await highlight(node.value, node.lang || "text");
        // Convert the code node to a raw HTML node
        const htmlNode = node as unknown as Html;
        htmlNode.type = "html";
        htmlNode.value = html;
      })
    );
  };
}

/**
 * Rehype plugin to add Tailwind classes to standard HTML elements
 */
function rehypeTailwind() {
  return (tree: HastRoot) => {
    visit(tree, "element", (node: Element) => {
      const { tagName } = node;
      const properties = node.properties || {};
      const existing = properties.className;
      const classes = Array.isArray(existing) ? existing : existing ? [existing as string] : [];

      switch (tagName) {
        case "h1":
          classes.push("text-2xl", "font-extrabold", "font-sans", "text-white", "mt-16", "mb-8", "scroll-mt-24");
          break;
        case "h2":
          classes.push("text-xl", "font-bold", "font-sans", "text-white", "mt-12", "mb-6", "border-b", "border-outline-variant/10", "pb-2", "scroll-mt-24");
          break;
        case "h3":
          classes.push("text-lg", "font-semibold", "font-sans", "text-white", "mt-10", "mb-4", "scroll-mt-24");
          break;
        case "p":
          classes.push("text-[#adaaaa]", "leading-7", "my-5");
          break;
        case "ul":
          classes.push("my-6", "list-none", "space-y-3", "pl-4");
          break;
        case "ol":
          classes.push("my-6", "list-decimal", "list-inside", "text-[#adaaaa]", "space-y-3", "pl-4");
          break;
        case "li":
          classes.push("text-[#adaaaa]", "mb-2", "flex", "items-start");
          if (!properties.className || !(properties.className as string[]).includes("task-list-item")) {
            const arrow: Element = {
              type: "element",
              tagName: "span",
              properties: { 
                className: ["text-primary", "mr-3", "mt-1.5", "text-[10px]", "shrink-0", "opacity-80"],
                "aria-hidden": "true" 
              },
              children: [{ type: "text", value: "▶" }]
            };
            const contentWrapper: Element = {
              type: "element",
              tagName: "span",
              properties: { className: ["flex-1"] },
              children: node.children as Element["children"]
            };
            node.children = [arrow, contentWrapper];
          }
          break;
        case "a":
          classes.push("text-[#5db4fe]", "hover:text-[#85ecff]", "underline", "underline-offset-4", "decoration-primary/30", "hover:decoration-primary", "transition-all");
          properties.target = "_blank";
          properties.rel = "noopener noreferrer";
          break;
        case "blockquote":
          classes.push("border-l-4", "border-primary/40", "pl-6", "text-[#adaaaa]", "italic", "my-8", "bg-surface-container-low/30", "py-4", "pr-4", "rounded-r");
          break;
        case "code":
          if (!(properties.className as string[] | undefined)?.some((c: string) => c.startsWith("language-"))) {
            classes.push("text-[#85ecff]", "bg-[#1a1919]", "px-1.5", "py-0.5", "rounded", "text-[0.9em]", "font-mono");
          }
          break;
        case "img":
          classes.push("w-full", "h-auto");
          break;
      }

      properties.className = classes;
      node.properties = properties;
    });
  };
}

/**
 * Rehype plugin to collect headings for the Table of Contents
 */
function rehypeHeadingCollector(headings: BlogHeading[]) {
  return (tree: HastRoot) => {
    visit(tree, "element", (node: Element) => {
      const { tagName } = node;
      if (["h1", "h2", "h3"].includes(tagName)) {
        const id = node.properties?.id as string;
        if (id) {
          headings.push({
            text: toString(node),
            id,
            level: parseInt(tagName.charAt(1)),
          });
        }
      }
    });
  };
}

/**
 * Rehype plugin to wrap images in a styled div
 */
function rehypeImageWrapper() {
  return (tree: HastRoot) => {
    visit(tree, "element", (node: Element, index: number | undefined, parent: HastParent | undefined) => {
      if (node.tagName === "img" && parent && index !== undefined) {
        const wrapper: Element = {
          type: "element",
          tagName: "div",
          properties: {
            className: ["my-8", "rounded-lg", "overflow-hidden", "border", "border-outline-variant/20"]
          },
          children: [node]
        };
        parent.children[index] = wrapper;
      }
    });
  };
}

async function renderContent(markdown: string | undefined | null): Promise<{ html: string; headings: BlogHeading[] }> {
  if (!markdown) return { html: "", headings: [] };

  const headings: BlogHeading[] = [];

  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkShiki)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeTailwind)
    .use(rehypeHeadingCollector, headings)
    .use(rehypeImageWrapper)
    .use(rehypeStringify, { allowDangerousHtml: true });

  const result = await processor.process(markdown);

  // Inject copy buttons server-side so the client never touches the DOM to create elements.
  // Shiki outputs raw HTML strings that rehype plugins can't visit, so we post-process here.
  const COPY_BTN =
    '<button class="copy-btn absolute top-2 right-2 text-[10px] font-mono border border-[#494847]/60 px-2 py-1 text-[#adaaaa] hover:text-primary hover:border-primary/40 transition-colors bg-[#0e0e0e] cursor-pointer opacity-0 group-hover:opacity-100">COPY</button>';

  const html = result.toString()
    .replace(/(<pre\b)/g, '<div class="relative group">$1')
    .replace(/<\/pre>/g, `</pre>${COPY_BTN}</div>`);

  return { html, headings };
}

export async function PostRenderer({ content }: PostRendererProps) {
  const { html, headings } = await renderContent(content);

  if (!html) {
    return (
      <p className="font-mono text-sm text-outline italic">{"// no content yet"}</p>
    );
  }

  return <PostContent html={html} headings={headings} />;
}
