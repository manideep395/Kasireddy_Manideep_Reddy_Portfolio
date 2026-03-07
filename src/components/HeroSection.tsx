import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Github, FileText, Mail } from "lucide-react";

const roles = ["AI Developer", "Full Stack Developer", "Data Analyst", "Hackathon Builder"];

export default function HeroSection() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const currentRole = roles[roleIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && text.length < currentRole.length) {
      timeout = setTimeout(() => setText(currentRole.slice(0, text.length + 1)), 80);
    } else if (!deleting && text.length === currentRole.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && text.length > 0) {
      timeout = setTimeout(() => setText(text.slice(0, -1)), 40);
    } else if (deleting && text.length === 0) {
      setDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }
    return () => clearTimeout(timeout);
  }, [text, deleting, roleIndex]);

  return (
    <section className="relative min-h-screen flex items-center justify-center section-padding">
      <div className="max-w-4xl mx-auto text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="text-sm font-mono text-primary mb-4 tracking-widest uppercase">
            Welcome to my portfolio
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
            <span className="text-foreground">Kasireddy</span>{" "}
            <span className="gradient-text">Manideep Reddy</span>
          </h1>
          <div className="h-10 mb-6">
            <span className="text-xl md:text-2xl font-mono text-secondary">
              {text}
              <span className="animate-glow-pulse text-primary">|</span>
            </span>
          </div>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            I build intelligent systems, AI tools, and scalable applications
            that solve real-world problems.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#projects"
            className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
          >
            View Projects
          </a>
          <a
            href="https://github.com/manideep395"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-lg glass text-foreground font-semibold hover:border-primary/50 transition-colors flex items-center gap-2"
          >
            <Github size={18} /> Explore GitHub
          </a>
          <a
            href="#contact"
            className="px-6 py-3 rounded-lg glass text-foreground font-semibold hover:border-primary/50 transition-colors flex items-center gap-2"
          >
            <Mail size={18} /> Contact Me
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-20"
        >
          <a href="#about" className="inline-block animate-float">
            <ArrowDown size={24} className="text-primary" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
