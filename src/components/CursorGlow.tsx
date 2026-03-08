import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mx = -100, my = -100;
    let dx = -100, dy = -100;
    let rx = -100, ry = -100;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const animate = () => {
      dx += (mx - dx) * 0.2;
      dy += (my - dy) * 0.2;
      rx += (mx - rx) * 0.08;
      ry += (my - ry) * 0.08;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${rx}px, ${ry}px)`;
      }
      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    const raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* Inner dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 z-[9999] pointer-events-none hidden md:block"
      >
        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
      </div>
      {/* Outer glow ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 z-[9998] pointer-events-none hidden md:block"
      >
        <div className="w-8 h-8 rounded-full border border-primary/40 bg-primary/5" />
      </div>
    </>
  );
}
