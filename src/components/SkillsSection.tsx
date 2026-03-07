import { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Skill = Tables<"skills">;

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
          <div className="w-20 h-1 bg-primary rounded mb-10" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {categories.map((cat, ci) => (
            <motion.div key={cat} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 + ci * 0.1 }} className="glass-card rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-5">{cat}</h3>
              <div className="space-y-4">
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
