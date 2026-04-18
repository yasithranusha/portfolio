"use client";

import { useEffect } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";

export function GlobalCursorSpotlight() {
  // Initialize to static off-screen or center coordinates for identical SSR / Client render
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  // Apply a very slight spring to make the light feel fluid
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    // Post-hydration, safely jump the light to the center of the window if you want.
    // Or just let it fly in from offscreen on the first mouse movement.
    mouseX.set(window.innerWidth / 2);
    mouseY.set(window.innerHeight / 2);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-50 mix-blend-screen"
      style={{
        background: useMotionTemplate`
          radial-gradient(
            600px circle at ${smoothX}px ${smoothY}px,
            rgba(85, 254, 126, 0.04),
            transparent 80%
          )
        `,
      }}
    />
  );
}
