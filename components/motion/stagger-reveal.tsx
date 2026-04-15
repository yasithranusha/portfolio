"use client";

import { useEffect, useRef, useState } from "react";

interface StaggerRevealProps {
  children: React.ReactNode;
  staggerDelay?: number;
  y?: number;
  once?: boolean;
  className?: string;
}

export function StaggerReveal({
  children,
  staggerDelay = 0.08,
  y = 20,
  once = true,
  className,
}: StaggerRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  return (
    <div ref={ref} className={className}>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <div
              key={i}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : `translateY(${y}px)`,
                transition: `opacity 0.4s ease ${i * staggerDelay}s, transform 0.4s ease ${i * staggerDelay}s`,
              }}
            >
              {child}
            </div>
          ))
        : (
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : `translateY(${y}px)`,
              transition: "opacity 0.4s ease, transform 0.4s ease",
            }}
          >
            {children}
          </div>
        )}
    </div>
  );
}
