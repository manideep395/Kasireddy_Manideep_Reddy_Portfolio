import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useInView } from "framer-motion";
import { Brain, Code, Database, Lightbulb } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

const staticTimeline = [
  { year: "2021", title: "Started B.Tech at Vasavi College of Engineering", subtitle: "Vasavi College of Engineering" },
  { year: "2024", title: "Built AI-Powered Projects & Hackathon Participation", subtitle: "Personal Projects" },
];

const interests = [
  { icon: Brain, label: "Artificial Intelligence" },
  { icon: Code, label: "Software Engineering" },
  { icon: Database, label: "Data Systems" },
  { icon: Lightbulb, label: "Problem Solving" },
];

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), { stiffness: 200, damping: 20 });

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={(e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
        mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
      }}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [experiences, setExperiences] = useState<Tables<"experiences">[]>([]);

  useEffect(() => {
    supabase.from("experiences").select("*").order("display_order").then(({ data }) => {
      if (data) setExperiences(data);
    });
  }, []);

  return (
    <section id="about" className="section-padding" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            About <span className="gradient-text">Me</span>
          </h2>
          <div className="w-20 h-1 bg-primary rounded mb-8" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-10"
        >
          <p className="text-muted-foreground leading-relaxed mb-4 max-w-3xl">
            I'm a <span className="text-foreground font-medium">B.Tech Computer Science student at Vasavi College of Engineering</span> with
            a deep passion for building intelligent systems and practical software solutions.
          </p>
          <p className="text-muted-foreground leading-relaxed max-w-3xl">
            From AI-driven tools to full-stack applications, I focus on creating technology
            that improves productivity and solves real problems. I thrive in hackathons
            and enjoy pushing boundaries with emerging technologies.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Interests */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">Interests & Focus</h3>
            <div className="grid grid-cols-2 gap-4" style={{ perspective: "800px" }}>
              {interests.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <TiltCard className="glass-card rounded-lg p-4 flex items-center gap-3">
                    <item.icon size={20} className="text-primary shrink-0" style={{ transform: "translateZ(15px)" }} />
                    <span className="text-sm text-foreground" style={{ transform: "translateZ(10px)" }}>{item.label}</span>
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">Journey</h3>
            <div className="relative pl-6 border-l border-border">
              {staticTimeline[0] && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.5 }} className="mb-6 relative">
                  <div className="absolute -left-[calc(0.75rem+1.5px)] top-1 w-3 h-3 rounded-full bg-primary" />
                  <span className="text-xs font-mono text-primary">{staticTimeline[0].year}</span>
                  <p className="text-foreground text-sm mt-1 font-medium">{staticTimeline[0].title}</p>
                  <p className="text-muted-foreground text-xs">{staticTimeline[0].subtitle}</p>
                </motion.div>
              )}
              {experiences.map((exp, i) => (
                <motion.div key={exp.id} initial={{ opacity: 0, x: 20 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.6 + i * 0.1 }} className="mb-6 relative">
                  <div className="absolute -left-[calc(0.75rem+1.5px)] top-1 w-3 h-3 rounded-full bg-primary" />
                  <span className="text-xs font-mono text-primary">{exp.duration}</span>
                  <p className="text-foreground text-sm mt-1 font-medium">{exp.role}</p>
                  <p className="text-muted-foreground text-xs">{exp.company}</p>
                  {exp.description && (
                    <p className="text-muted-foreground text-xs mt-1 leading-relaxed">{exp.description}</p>
                  )}
                </motion.div>
              ))}
              {staticTimeline[1] && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.7 + experiences.length * 0.1 }} className="mb-0 relative">
                  <div className="absolute -left-[calc(0.75rem+1.5px)] top-1 w-3 h-3 rounded-full bg-primary" />
                  <span className="text-xs font-mono text-primary">{staticTimeline[1].year}</span>
                  <p className="text-foreground text-sm mt-1 font-medium">{staticTimeline[1].title}</p>
                  <p className="text-muted-foreground text-xs">{staticTimeline[1].subtitle}</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
