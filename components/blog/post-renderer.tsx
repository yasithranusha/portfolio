import { highlight } from "@/lib/shiki";
import { PostContent } from "./post-content";

interface PostRendererProps {
  content: string | undefined | null;
}

// Parse code blocks from markdown and highlight with Shiki
async function renderContent(markdown: string | undefined | null): Promise<string> {
  if (!markdown) return "";
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const parts: string[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(markdown)) !== null) {
    // Text before the code block
    const before = markdown.slice(lastIndex, match.index);
    parts.push(markdownToHtml(before));

    // Highlighted code block
    const lang = match[1] || "text";
    const code = match[2].trimEnd();
    const highlighted = await highlight(code, lang);
    parts.push(highlighted);

    lastIndex = match.index + match[0].length;
  }

  // Remaining text
  parts.push(markdownToHtml(markdown.slice(lastIndex)));

  return parts.join("\n");
}

// Very simple markdown → HTML (headings, paragraphs, bold, italic, inline code, links)
function markdownToHtml(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold font-sans text-white mt-8 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-semibold font-sans text-white mt-10 mb-3">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold font-sans text-white mt-12 mb-4">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="text-[#adaaaa]">$1</em>')
    .replace(/`([^`]+)`/g, '<code class="text-[#85ecff] bg-[#131313] px-1 text-[0.85em]">$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-[#5db4fe] hover:text-[#85ecff] underline" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-2 border-outline-variant pl-4 text-[#adaaaa] my-4">$1</blockquote>')
    .replace(/^- (.+)$/gm, '<li class="text-[#adaaaa] ml-4 list-none before:content-[\'>\'] before:mr-2 before:text-[#55fe7e]">$1</li>')
    .replace(/\n\n/g, '</p><p class="text-[#adaaaa] leading-7 my-3">')
    .replace(/^(?!<[hlbp])(.+)$/gm, '<p class="text-[#adaaaa] leading-7 my-3">$1</p>');
}

export async function PostRenderer({ content }: PostRendererProps) {
  const html = await renderContent(content);

  if (!html) {
    return (
      <p className="font-mono text-sm text-outline italic">// no content yet</p>
    );
  }

  return <PostContent html={html} />;
}
