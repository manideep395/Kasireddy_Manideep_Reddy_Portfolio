import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Briefcase, Award } from "lucide-react";

const experiences = [
  {
    role: "Python Developer Intern",
    company: "Codec Technologies",
    duration: "2023",
    description: "Built Python applications and automation scripts. Worked on data processing pipelines and API development.",
    tech: ["Python", "FastAPI", "SQL"],
  },
  {
    role: "Java Developer Intern",
    company: "Codec Technologies",
    duration: "2023",
    description: "Developed Java-based applications, implemented OOP design patterns, and worked on backend services.",
    tech: ["Java", "Spring", "MySQL"],
  },
  {
    role: "Data Analytics Virtual Intern",
    company: "Deloitte",
    duration: "2024",
    description: "Completed data analytics projects involving data cleaning, visualization, and business insights generation.",
    tech: ["Python", "Pandas", "Tableau"],
  },
];

const certifications = [
  { title: "Data Structures and Algorithms using Java", issuer: "Infosys Springboard" },
  { title: "Data Analytics Virtual Internship", issuer: "Deloitte" },
];

export default function ExperienceSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="experience" className="section-padding" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Experience & <span className="gradient-text">Certifications</span>
          </h2>
          <div className="w-20 h-1 bg-primary rounded mb-10" />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {experiences.map((exp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="glass-card rounded-xl p-6 hover:glow-primary transition-all duration-300"
            >
              <Briefcase size={20} className="text-primary mb-3" />
              <h3 className="text-lg font-semibold text-foreground">{exp.role}</h3>
              <p className="text-sm text-primary font-mono">{exp.company}</p>
              <p className="text-xs text-muted-foreground mt-1 mb-3">{exp.duration}</p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{exp.description}</p>
              <div className="flex flex-wrap gap-2">
                {exp.tech.map((t) => (
                  <span key={t} className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
            <Award size={20} className="text-primary" /> Certifications
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {certifications.map((cert, i) => (
              <div key={i} className="glass-card rounded-lg p-5 flex items-center gap-4">
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
