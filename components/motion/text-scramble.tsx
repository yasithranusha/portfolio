"use client";

import React, { useRef, useState, useCallback } from "react";

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*";

interface TextScrambleProps {
  text: string;
  className?: string;
  tag?: "span" | "div" | "p" | "h1" | "h2" | "h3" | "h4";
}

export function TextScramble({ text, className, tag: Tag = "span" }: TextScrambleProps) {
  const [display, setDisplay] = useState(text);
  const rafRef = useRef<number | null>(null);
  const frameRef = useRef(0);

  const scramble = useCallback(() => {
    const totalFrames = text.length * 3;

    const animate = () => {
      frameRef.current++;
      const progress = frameRef.current / totalFrames;

      const scrambled = text
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";
          if (i / text.length < progress) return char;
          return CHARSET[Math.floor(Math.random() * CHARSET.length)];
        })
        .join("");

      setDisplay(scrambled);

      if (frameRef.current < totalFrames) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setDisplay(text);
      }
    };

    frameRef.current = 0;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(animate);
  }, [text]);

  const cancel = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setDisplay(text);
  }, [text]);

  const TagEl = Tag as React.ElementType;

  return (
    <TagEl
      className={className}
      onMouseEnter={scramble}
      onMouseLeave={cancel}
    >
      {display}
    </TagEl>
  );
}
