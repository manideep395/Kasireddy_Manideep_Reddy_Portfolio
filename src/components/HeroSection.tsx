import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Github, Mail } from "lucide-react";
import profilePhoto from "@/assets/profile-photo.jpg";

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
      <div className="max-w-6xl mx-auto z-10 flex flex-col md:flex-row items-center gap-10 md:gap-16">
        {/* Left: Text content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 text-center md:text-left"
        >
          <p className="text-sm font-mono text-primary mb-4 tracking-widest uppercase">
            Welcome to my portfolio
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            <span className="text-foreground">Kasireddy</span>{" "}
            <span className="gradient-text">Manideep Reddy</span>
          </h1>
          <div className="h-10 mb-6">
            <span className="text-xl md:text-2xl font-mono text-secondary">
              {text}
              <span className="animate-glow-pulse text-primary">|</span>
            </span>
          </div>
          <p className="text-muted-foreground text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
            I build intelligent systems, AI tools, and scalable applications
            that solve real-world problems.
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <a href="#projects" className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
              View Projects
            </a>
            <a href="https://github.com/manideep395" target="_blank" rel="noopener noreferrer"
              className="px-6 py-3 rounded-lg glass text-foreground font-semibold hover:border-primary/50 transition-colors flex items-center gap-2">
              <Github size={18} /> Explore GitHub
            </a>
            <a href="#contact" className="px-6 py-3 rounded-lg glass text-foreground font-semibold hover:border-primary/50 transition-colors flex items-center gap-2">
              <Mail size={18} /> Contact Me
            </a>
          </div>
        </motion.div>

        {/* Right: Profile photo with 3D effects */}
        <motion.div
          initial={{ opacity: 0, x: 40, rotateY: -15 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative shrink-0"
          style={{ perspective: "800px" }}
        >
          <div className="relative w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80">
            {/* Glow ring */}
            <div className="absolute inset-0 rounded-full opacity-50 blur-xl"
              style={{ background: "linear-gradient(135deg, hsl(175 80% 50% / 0.4), hsl(260 60% 60% / 0.4))" }} />
            {/* Photo */}
            <img
              src={profilePhoto}
              alt="Kasireddy Manideep Reddy"
              className="relative w-full h-full rounded-full object-cover border-2 border-primary/30 shadow-2xl"
            />
            {/* Decorative ring */}
            <div className="absolute -inset-3 rounded-full border border-primary/20 animate-spin" style={{ animationDuration: "20s" }} />
            <div className="absolute -inset-6 rounded-full border border-secondary/10 animate-spin" style={{ animationDuration: "30s", animationDirection: "reverse" }} />
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <a href="#about" className="inline-block animate-float">
          <ArrowDown size={24} className="text-primary" />
        </a>
      </motion.div>
    </section>
  );
}
