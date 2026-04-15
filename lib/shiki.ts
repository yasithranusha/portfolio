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
      "markdown",
      "dockerfile",
    ],
  });

  return highlighter;
}

export async function highlight(code: string, lang: string): Promise<string> {
  const h = await getHighlighter();
  return h.codeToHtml(code, {
    lang: lang || "text",
    theme: "github-dark-dimmed",
  });
}
