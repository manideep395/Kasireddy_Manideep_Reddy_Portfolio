import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Brain, Code, Database, Lightbulb } from "lucide-react";

const timeline = [
  { year: "2021", title: "Started B.Tech at Vasavi College of Engineering", type: "education" },
  { year: "2023", title: "Python Developer Intern at Codec Technologies", type: "work" },
  { year: "2023", title: "Java Developer Intern at Codec Technologies", type: "work" },
  { year: "2024", title: "Deloitte Data Analytics Virtual Internship", type: "work" },
  { year: "2024", title: "Built AI-Powered Projects & Hackathon Participation", type: "project" },
];

const interests = [
  { icon: Brain, label: "Artificial Intelligence" },
  { icon: Code, label: "Software Engineering" },
  { icon: Database, label: "Data Systems" },
  { icon: Lightbulb, label: "Problem Solving" },
];

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
          <div className="w-20 h-1 bg-primary rounded mb-10" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-muted-foreground leading-relaxed mb-6">
              I'm a <span className="text-foreground font-medium">B.Tech Computer Science student at Vasavi College of Engineering</span> with
              a deep passion for building intelligent systems and practical software solutions.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              From AI-driven tools to full-stack applications, I focus on creating technology
              that improves productivity and solves real problems. I thrive in hackathons
              and enjoy pushing boundaries with emerging technologies.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {interests.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="glass-card rounded-lg p-4 flex items-center gap-3"
                >
                  <item.icon size={20} className="text-primary shrink-0" />
                  <span className="text-sm text-foreground">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="relative pl-6 border-l border-border">
              {timeline.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="mb-8 last:mb-0 relative"
                >
                  <div className="absolute -left-[calc(0.75rem+1.5px)] top-1 w-3 h-3 rounded-full bg-primary" />
                  <span className="text-xs font-mono text-primary">{item.year}</span>
                  <p className="text-foreground text-sm mt-1">{item.title}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
