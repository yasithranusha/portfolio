import { createHighlighter, type Highlighter } from "shiki";

let highlighter: Highlighter | null = null;

export async function getHighlighter(): Promise<Highlighter> {
  if (highlighter) return highlighter;

  highlighter = await createHighlighter({
    themes: ["github-dark-dimmed"],
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
  const h = await getHighlighter();
  const safeLang = SUPPORTED.has(lang) ? lang : "text";
  return h.codeToHtml(code, {
    lang: safeLang,
    theme: "github-dark-dimmed",
  });
}
