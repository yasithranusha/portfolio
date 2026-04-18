"use client";

import { useEffect, useRef } from "react";

export function PostContent({ html }: { html: string }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.querySelectorAll("pre").forEach((pre) => {
      if (pre.querySelector(".copy-btn")) return;

      const code = pre.querySelector("code")?.textContent ?? pre.textContent ?? "";

      // Wrap pre in a relative container so the button doesn't scroll with code
      const wrapper = document.createElement("div");
      wrapper.className = "relative group";
      pre.parentNode?.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      const btn = document.createElement("button");
      btn.className =
        "copy-btn absolute top-2 right-2 text-[10px] font-mono border border-[#494847]/60 px-2 py-1 text-[#adaaaa] hover:text-primary hover:border-primary/40 transition-colors bg-[#0e0e0e] opacity-0 group-hover:opacity-100";
      btn.textContent = "COPY";
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(code).then(() => {
          btn.textContent = "COPIED";
          setTimeout(() => { btn.textContent = "COPY"; }, 2000);
        });
      });

      wrapper.appendChild(btn);
    });
  }, [html]);

  return (
    <article
      ref={ref}
      className="font-mono text-sm max-w-none [&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:p-4 [&_pre]:border [&_pre]:border-[#494847]/30 [&_pre]:bg-[#0e0e0e]"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
