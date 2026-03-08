import { Github, Linkedin, Mail, ArrowUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

function CursorDot() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let x = 0, y = 0, dx = 0, dy = 0;

    const onMove = (e: MouseEvent) => {
      const footer = dotRef.current?.parentElement;
      if (!footer) return;
      const rect = footer.getBoundingClientRect();
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    };

    const animate = () => {
      dx += (x - dx) * 0.15;
      dy += (y - dy) * 0.15;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
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
    <div
      ref={dotRef}
      className="pointer-events-none absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 z-10"
    >
      <div className="w-5 h-5 rounded-full bg-primary/40 blur-[2px]" />
      <div className="absolute inset-[6px] rounded-full bg-primary" />
    </div>
  );
}

export default function Footer() {
  const [year] = useState(() => new Date().getFullYear());

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socials = [
    { icon: Github, href: "https://github.com/manideep395", label: "GitHub" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/kasireddymr/", label: "LinkedIn" },
    { icon: Mail, href: "mailto:kasireddymanideepreddy405@gmail.com", label: "Email" },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-border">
      <CursorDot />

      {/* Gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-lg font-bold font-mono text-primary">Mani.dev</span>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs">
              Building intelligent systems & scalable applications.
            </p>
          </motion.div>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-center gap-3"
          >
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target={label !== "Email" ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group glass-card rounded-xl p-3 hover:glow-primary transition-all duration-300"
                aria-label={label}
              >
                <Icon size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            ))}
          </motion.div>

          {/* Back to top + copyright */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-end gap-3"
          >
            <button
              onClick={scrollToTop}
              className="glass-card rounded-xl p-3 hover:glow-primary transition-all duration-300 group"
              aria-label="Back to top"
            >
              <ArrowUp size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
            <p className="text-xs text-muted-foreground">
              © {year} <span className="gradient-text font-semibold">Manideep Reddy</span>
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
