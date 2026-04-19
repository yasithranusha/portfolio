"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { NotionPost } from "@/lib/notion";
import {
  exec,
  getCompletions,
  commonPrefix,
  makePrompt,
  type TerminalLine,
  type HistoryEntry,
} from "@/lib/terminal-exec";

export type { TerminalLine, HistoryEntry };

export interface InteractiveTerminalProps {
  title?: string;
  initialCwd?: string;
  initialCommands?: string[];
  initialHistory?: HistoryEntry[];
  posts?: NotionPost[];
  className?: string;
  onBootComplete?: () => void;
}

// ─── Component ───────────────────────────────────────────────────────

export function InteractiveTerminal({
  title,
  initialCwd = "~",
  initialCommands = [],
  initialHistory,
  posts = [],
  className = "",
  onBootComplete,
}: InteractiveTerminalProps) {
  const [history,        setHistory]        = useState<HistoryEntry[]>(initialHistory ?? []);
  const [cwd,            setCwd]            = useState(initialCwd);
  const [typingText,     setTypingText]     = useState<string | null>(null);
  const [typingCwd,      setTypingCwd]      = useState(initialCwd);
  // When initialHistory is provided or no commands exist, start immediately ready (no animation needed)
  const [ready,          setReady]          = useState(!!initialHistory || initialCommands.length === 0);
  const [input,          setInput]          = useState("");
  const [cmdHistory,     setCmdHistory]     = useState<string[]>([]);
  const [histIdx,        setHistIdx]        = useState(-1);
  const [focused,        setFocused]        = useState(false);
  const [completionHint, setCompletionHint] = useState<string[] | null>(null);
  const [hasInteracted,  setHasInteracted]  = useState(false);

  const bodyRef     = useRef<HTMLDivElement>(null);
  const inputRef    = useRef<HTMLInputElement>(null);
  // Ref so boot effect and runInput always see the latest posts without stale closure
  const postsRef    = useRef(posts);
  // Captured once at mount — determines whether to skip boot animation
  const skipBootRef = useRef(!!initialHistory || initialCommands.length === 0);

  useEffect(() => { postsRef.current = posts; }, [posts]);

  useEffect(() => {
    if (!hasInteracted) return;
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [history, typingText, ready, input, hasInteracted]);

  // Boot sequence
  useEffect(() => {
    if (skipBootRef.current) return;

    let cancelled = false;
    let animCwd   = initialCwd;
    const wait    = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

    async function boot() {
      await wait(120);
      for (let ci = 0; ci < initialCommands.length; ci++) {
        const cmd = initialCommands[ci];
        if (cancelled) return;
        setTypingCwd(animCwd);
        setTypingText("");
        for (let i = 1; i <= cmd.length; i++) {
          if (cancelled) return;
          await wait(38);
          setTypingText(cmd.slice(0, i));
        }
        await wait(160);
        const cwdBefore = animCwd;
        const { output, nextCwd } = exec(cmd, animCwd, postsRef.current);
        animCwd = nextCwd;
        setCwd(animCwd);
        if (output === "__CLEAR__") {
          setHistory([]);
        } else {
          setHistory((prev) => [...prev, { command: cmd, output, cwd: cwdBefore }]);
        }
        setTypingText(null);
        // Fire after last command's output appears — before the prompt shows
        if (ci === initialCommands.length - 1) {
          onBootComplete?.();
        }
        await wait(220);
      }
      if (!cancelled) {
        setReady(true);
      }
    }

    boot();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const runInput = useCallback(() => {
    const cmd = input.trim();
    if (!cmd) return;
    const cwdBefore = cwd;
    const { output, nextCwd } = exec(cmd, cwd, postsRef.current);
    setCwd(nextCwd);
    if (output === "__CLEAR__") {
      setHistory([]);
    } else {
      setHistory((prev) => [...prev, { command: cmd, output, cwd: cwdBefore }]);
    }
    setCmdHistory((h) => [cmd, ...h]);
    setHistIdx(-1);
    setInput("");
    setCompletionHint(null);
    setHasInteracted(true);
  }, [input, cwd]);

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const completions = getCompletions(input, cwd, postsRef.current);
      if (completions.length === 0) return;
      if (completions.length === 1) {
        setInput(completions[0]);
        setCompletionHint(null);
      } else {
        setInput(commonPrefix(completions));
        setCompletionHint(completions);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      setCompletionHint(null);
      runInput();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCompletionHint(null);
      const next = histIdx + 1;
      if (next < cmdHistory.length) { setHistIdx(next); setInput(cmdHistory[next]); }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setCompletionHint(null);
      const next = histIdx - 1;
      if (next < 0) { setHistIdx(-1); setInput(""); }
      else { setHistIdx(next); setInput(cmdHistory[next]); }
    }
  }, [input, cwd, runInput, histIdx, cmdHistory]);

  return (
    <div
      className={`flex flex-col bg-black border border-[#494847]/20 font-mono text-xs overflow-hidden ${className}`}
      onClick={() => {
        if (ready) {
          setHasInteracted(true);
          inputRef.current?.focus();
        }
      }}
    >
      {/* Stoplight header */}
      <div className="h-8 bg-[#1a1919] px-4 flex items-center justify-between border-b border-[#494847]/10 flex-shrink-0">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-error/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-primary/60" />
        </div>
        {title && (
          <span className="text-[10px] font-bold text-on-surface-variant/40 tracking-widest uppercase">
            {title}
          </span>
        )}
      </div>

      {/* Scrollable body — fixed height enforced by className, content scrolls within */}
      <div
        ref={bodyRef}
        className="flex-1 overflow-y-auto p-4 space-y-0.5 cursor-text min-h-0"
      >
        {/* Command history */}
        {history.map((entry, i) => (
          <div key={i}>
            <div className="flex gap-2 flex-wrap leading-5">
              <span className="text-primary select-none flex-shrink-0">{makePrompt(entry.cwd)}</span>
              <span className="text-on-surface">{entry.command}</span>
            </div>
            {entry.output.map((line, j) =>
              line.html ? (
                <div
                  key={j}
                  className={`leading-5 ${line.color ?? "text-on-surface-variant"}`}
                  dangerouslySetInnerHTML={{ __html: line.text }}
                />
              ) : (
                <div
                  key={j}
                  className={`leading-5 whitespace-pre-wrap break-words ${line.color ?? "text-on-surface-variant"}`}
                >
                  {line.text}
                </div>
              )
            )}
          </div>
        ))}

        {/* Typing animation */}
        {typingText !== null && (
          <div className="flex gap-2 items-baseline leading-5">
            <span className="text-primary select-none flex-shrink-0">{makePrompt(typingCwd)}</span>
            <span>
              <span className="text-on-surface">{typingText}</span>
              <span className="inline-block w-[0.4375rem] h-[0.8125rem] bg-primary cursor-blink align-middle" />
            </span>
          </div>
        )}

        {/* Tab completion hint */}
        {completionHint && (
          <div className="flex flex-wrap gap-x-4 gap-y-0.5 leading-5 py-0.5">
            {completionHint.map((c) => (
              <span key={c} className="text-secondary">{c.split(" ").slice(-1)[0]}</span>
            ))}
          </div>
        )}

        {/* Live input line — always at the bottom of scroll content */}
        {ready && (
          <div
            className="flex gap-2 items-baseline leading-5"
            onClick={(e) => { e.stopPropagation(); inputRef.current?.focus(); }}
          >
            <span className="text-primary select-none flex-shrink-0">{makePrompt(cwd)}</span>
            <span>
              <span className="text-on-surface">{input}</span>
              <span
                className={`inline-block w-[0.4375rem] h-[0.8125rem] align-middle ${
                  focused ? "bg-primary cursor-blink" : "bg-primary/30"
                }`}
              />
            </span>
            {/* Hidden input captures keyboard — never visible */}
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => { setInput(e.target.value); setCompletionHint(null); }}
              onKeyDown={onKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              style={{ position: "fixed", left: "-9999px", width: "1px", height: "1px", opacity: 0 }}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
            />
          </div>
        )}
      </div>
    </div>
  );
}
