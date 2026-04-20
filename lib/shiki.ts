import { createHighlighter, type Highlighter } from "shiki";
import { cacheLife } from "next/cache";

let highlighter: Highlighter | null = null;

export async function getHighlighter(): Promise<Highlighter> {
  if (highlighter) return highlighter;

  highlighter = await createHighlighter({
    themes: ["tokyo-night"],
    langs: [
      "typescript",
      "javascript",
      "tsx",
      "jsx",
      "bash",
      "shell",
      "json",
      "yaml",
      "python",
      "go",
      "rust",
      "sql",
      "css",
      "html",
      "xml",
      "java",
      "kotlin",
      "markdown",
      "dockerfile",
    ],
  });

  return highlighter;
}

const SUPPORTED = new Set([
  "typescript","javascript","tsx","jsx","bash","shell","json","yaml",
  "python","go","rust","sql","css","html","xml","java","kotlin",
  "markdown","dockerfile","text",
]);

export async function highlight(code: string, lang: string): Promise<string> {
  "use cache";
  cacheLife("hours");
  const h = await getHighlighter();
  const safeLang = SUPPORTED.has(lang) ? lang : "text";
  return h.codeToHtml(code, {
    lang: safeLang,
    theme: "tokyo-night",
  });
}
