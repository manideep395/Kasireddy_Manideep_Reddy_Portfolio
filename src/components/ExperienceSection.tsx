import { useEffect, useState, useRef } from "react";
import { motion, useInView, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Briefcase, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Experience = Tables<"experiences">;
type Certification = Tables<"certifications">;

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

export default function ExperienceSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);

  useEffect(() => {
    supabase.from("experiences").select("*").order("display_order").then(({ data }) => { if (data) setExperiences(data); });
    supabase.from("certifications").select("*").order("display_order").then(({ data }) => { if (data) setCertifications(data); });
  }, []);

  return (
    <section id="experience" className="section-padding" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Experience & <span className="gradient-text">Certifications</span></h2>
          <div className="w-20 h-1 bg-primary rounded mb-8" />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 mb-10" style={{ perspective: "1000px" }}>
          {experiences.map((exp, i) => (
            <motion.div key={exp.id} initial={{ opacity: 0, y: 30, rotateX: 10 }} animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}} transition={{ delay: 0.2 + i * 0.1 }}>
              <TiltCard className="glass-card rounded-xl p-6 hover:glow-primary transition-all duration-300 h-full">
                <div style={{ transform: "translateZ(15px)" }}>
                  <Briefcase size={20} className="text-primary mb-3" />
                  <h3 className="text-lg font-semibold text-foreground">{exp.role}</h3>
                  <p className="text-sm text-primary font-mono">{exp.company}</p>
                  <p className="text-xs text-muted-foreground mt-1 mb-3">{exp.duration}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{exp.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies?.map((t) => (
                      <span key={t} className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">{t}</span>
                    ))}
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5 }}>
          <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
            <Award size={20} className="text-primary" /> Certifications
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {certifications.map((cert) => (
              <div key={cert.id} className="glass-card rounded-lg p-5 flex items-center gap-4 hover:glow-accent transition-all duration-300">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Award size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{cert.title}</p>
                  <p className="text-xs text-muted-foreground">{cert.issuer}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
