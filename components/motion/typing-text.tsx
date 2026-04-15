"use client";

import { useEffect, useState } from "react";

interface TypingTextProps {
  lines: readonly string[];
  speed?: number;
  loop?: boolean;
  prefix?: string;
}

export function TypingText({ lines, speed = 50, loop = false, prefix = "$ " }: TypingTextProps) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [done, setDone] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (done && !loop) return;

    if (currentLine >= lines.length) {
      if (loop) {
        const reset = setTimeout(() => {
          setDisplayedLines([]);
          setCurrentLine(0);
          setCurrentChar(0);
          setDone(false);
        }, 2000);
        return () => clearTimeout(reset);
      }
      setDone(true);
      return;
    }

    const line = lines[currentLine];

    if (currentChar < line.length) {
      const t = setTimeout(() => {
        setDisplayedLines((prev) => {
          const updated = [...prev];
          updated[currentLine] = (updated[currentLine] ?? "") + line[currentChar];
          return updated;
        });
        setCurrentChar((c) => c + 1);
      }, speed);
      return () => clearTimeout(t);
    } else {
      // Move to next line after a short pause
      const t = setTimeout(() => {
        setCurrentLine((l) => l + 1);
        setCurrentChar(0);
      }, 400);
      return () => clearTimeout(t);
    }
  }, [currentLine, currentChar, lines, speed, loop, done]);

  // Cursor blink
  useEffect(() => {
    const t = setInterval(() => setShowCursor((v) => !v), 530);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="font-mono text-sm space-y-1">
      {displayedLines.map((text, i) => (
        <div key={i} className="flex items-start">
          {prefix && (
            <span className="text-[#55fe7e] mr-1 flex-shrink-0">{prefix}</span>
          )}
          <span className="text-white">{text}</span>
          {i === displayedLines.length - 1 && !done && (
            <span
              className="inline-block w-[2px] h-[1em] bg-[#55fe7e] ml-0.5 flex-shrink-0"
              style={{ opacity: showCursor ? 1 : 0, transition: "opacity 0.1s" }}
            />
          )}
        </div>
      ))}
      {done && (
        <div className="flex items-center">
          <span className="text-[#55fe7e] mr-1">{prefix}</span>
          <span
            className="inline-block w-[2px] h-[1em] bg-[#55fe7e]"
            style={{ opacity: showCursor ? 1 : 0, transition: "opacity 0.1s" }}
          />
        </div>
      )}
    </div>
  );
}
