import { useEffect, useState, useRef } from "react";
import { motion, useInView, useMotionValue, useTransform, useSpring } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Skill = Tables<"skills">;

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 20 });

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

export default function SkillsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    supabase.from("skills").select("*").order("display_order").then(({ data }) => {
      if (data) setSkills(data);
    });
  }, []);

  const categories = [...new Set(skills.map(s => s.category))];

  return (
    <section id="skills" className="section-padding" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Technical <span className="gradient-text">Skills</span></h2>
          <div className="w-20 h-1 bg-primary rounded mb-8" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6" style={{ perspective: "1000px" }}>
          {categories.map((cat, ci) => (
            <motion.div key={cat} initial={{ opacity: 0, y: 30, rotateX: 10 }} animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}} transition={{ delay: 0.2 + ci * 0.1 }}>
              <TiltCard className="glass-card rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-5" style={{ transform: "translateZ(20px)" }}>{cat}</h3>
                <div className="space-y-4" style={{ transform: "translateZ(10px)" }}>
                  {skills.filter(s => s.category === cat).map((skill, si) => (
                    <div key={skill.id}>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-sm text-muted-foreground">{skill.name}</span>
                        <span className="text-xs font-mono text-primary">{skill.level}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={isInView ? { width: `${skill.level}%` } : {}}
                          transition={{ duration: 1, delay: 0.5 + ci * 0.1 + si * 0.05, ease: "easeOut" }}
                          className="h-full rounded-full"
                          style={{ background: `linear-gradient(90deg, hsl(175 80% 50%), hsl(260 60% 60%))` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
