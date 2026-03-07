import { useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, Github, Star } from "lucide-react";

const filters = ["All", "AI", "Web", "Data", "Tools"];

interface Project {
  name: string;
  description: string;
  tags: string[];
  language: string;
  stars?: number;
  github?: string;
  category: string;
}

const projects: Project[] = [
  {
    name: "Smart Resume Generator",
    description: "AI-powered resume builder that generates professional resumes from user data with intelligent formatting and keyword optimization.",
    tags: ["Python", "NLP", "FastAPI"],
    language: "Python",
    stars: 5,
    github: "https://github.com/manideep395",
    category: "AI",
  },
  {
    name: "Twitter Sentiment Analysis",
    description: "Real-time sentiment analysis tool for Twitter data using NLP transformers and machine learning classification.",
    tags: ["Python", "ML", "NLP"],
    language: "Python",
    stars: 8,
    github: "https://github.com/manideep395",
    category: "AI",
  },
  {
    name: "Weather Forecast Dashboard",
    description: "Interactive weather dashboard with real-time data visualization, forecasting, and location-based weather alerts.",
    tags: ["React", "API", "Charts"],
    language: "JavaScript",
    stars: 3,
    github: "https://github.com/manideep395",
    category: "Web",
  },
  {
    name: "SQL Injection Detection Tool",
    description: "Security tool that detects and prevents SQL injection attacks using pattern matching and ML-based analysis.",
    tags: ["Python", "Security", "ML"],
    language: "Python",
    stars: 12,
    github: "https://github.com/manideep395",
    category: "Tools",
  },
  {
    name: "Building Construction Cost Tool",
    description: "Data-driven application for estimating building construction costs with material pricing and project management features.",
    tags: ["Python", "Data", "Analytics"],
    language: "Python",
    stars: 4,
    github: "https://github.com/manideep395",
    category: "Data",
  },
  {
    name: "Portfolio AI Chatbot",
    description: "AI-powered chatbot that answers questions about projects, skills, and experience using portfolio data.",
    tags: ["AI", "NLP", "React"],
    language: "TypeScript",
    stars: 6,
    github: "https://github.com/manideep395",
    category: "AI",
  },
];

export default function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState("All");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const filtered = activeFilter === "All" ? projects : projects.filter((p) => p.category === activeFilter);

  return (
    <section id="projects" className="section-padding" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <div className="w-20 h-1 bg-primary rounded mb-8" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-3 mb-10"
        >
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeFilter === f
                  ? "bg-primary text-primary-foreground"
                  : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, i) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="glass-card rounded-xl p-6 group hover:border-primary/30 transition-all duration-300 hover:glow-primary flex flex-col"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono px-2 py-1 rounded bg-primary/10 text-primary">
                  {project.language}
                </span>
                {project.stars !== undefined && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star size={12} /> {project.stars}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {project.name}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-3">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Github size={18} />
                  </a>
                )}
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <ExternalLink size={18} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
