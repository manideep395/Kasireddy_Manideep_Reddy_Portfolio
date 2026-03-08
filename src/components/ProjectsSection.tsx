import { useState, useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ExternalLink, Github, Star, Code2, Loader2, GitFork } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface GitHubRepo {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  html_url: string;
  homepage: string | null;
  updated_at: string;
  topics?: string[];
}

const languageColors: Record<string, string> = {
  TypeScript: "hsl(210 80% 55%)",
  JavaScript: "hsl(50 90% 50%)",
  Python: "hsl(210 60% 45%)",
  Java: "hsl(15 70% 50%)",
  HTML: "hsl(15 80% 55%)",
  CSS: "hsl(260 60% 55%)",
  Jupyter: "hsl(25 80% 50%)",
  "Jupyter Notebook": "hsl(25 80% 50%)",
  Dart: "hsl(200 80% 50%)",
  C: "hsl(210 30% 50%)",
  "C++": "hsl(300 30% 50%)",
  Shell: "hsl(120 40% 45%)",
};

function ProjectCard({ repo, index, isInView }: { repo: GitHubRepo; index: number; isInView: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });
  const glareX = useTransform(mouseX, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(mouseY, [-0.5, 0.5], [0, 100]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40, rotateX: 15 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ delay: 0.05 + index * 0.04, duration: 0.5, ease: "easeOut" }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 800 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="glass-card rounded-xl p-6 group hover:border-primary/40 transition-all duration-300 flex flex-col relative overflow-hidden cursor-default"
    >
      {/* 3D glare overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: useTransform(
            [glareX, glareY],
            ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, hsl(175 80% 50% / 0.08), transparent 60%)`
          ),
        }}
      />

      <div className="flex items-center justify-between mb-3" style={{ transform: "translateZ(20px)" }}>
        {repo.language ? (
          <span className="flex items-center gap-1.5 text-xs font-mono px-2 py-1 rounded bg-primary/10 text-primary">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: languageColors[repo.language] || "hsl(var(--primary))" }} />
            {repo.language}
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs font-mono px-2 py-1 rounded bg-muted text-muted-foreground">
            <Code2 size={12} /> —
          </span>
        )}
        <div className="flex items-center gap-2">
          {repo.stars > 0 && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star size={12} /> {repo.stars}
            </span>
          )}
          {repo.forks > 0 && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <GitFork size={12} /> {repo.forks}
            </span>
          )}
        </div>
      </div>

      <h3
        className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors truncate"
        style={{ transform: "translateZ(30px)" }}
      >
        {repo.name}
      </h3>

      <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1 line-clamp-3" style={{ transform: "translateZ(15px)" }}>
        {repo.description || "No description available"}
      </p>

      {repo.topics && repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4" style={{ transform: "translateZ(10px)" }}>
          {repo.topics.slice(0, 4).map((t) => (
            <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/10 text-secondary font-mono">{t}</span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between" style={{ transform: "translateZ(25px)" }}>
        <div className="flex gap-3">
          <a href={repo.html_url} target="_blank" rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors hover:scale-110 transform">
            <Github size={18} />
          </a>
          {repo.homepage && (
            <a href={repo.homepage} target="_blank" rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors hover:scale-110 transform">
              <ExternalLink size={18} />
            </a>
          )}
        </div>
        <span className="text-xs text-muted-foreground font-mono">
          {new Date(repo.updated_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
        </span>
      </div>
    </motion.div>
  );
}

export default function ProjectsSection() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    const fetchWithRetry = async (attempts = 3) => {
      for (let i = 0; i < attempts; i++) {
        try {
          const { data } = await supabase.functions.invoke("github-data");
          if (data?.repos && data.repos.length > 0) {
            setRepos(data.repos);
            setLoading(false);
            return;
          }
        } catch {}
        if (i < attempts - 1) await new Promise(r => setTimeout(r, 1500));
      }
      setLoading(false);
    };
    fetchWithRetry();
  }, []);

  const languages = ["All", ...Array.from(new Set(repos.map(r => r.language).filter(Boolean))) as string[]];
  const filtered = filter === "All" ? repos : repos.filter(r => r.language === filter);

  return (
    <section id="projects" className="section-padding" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            GitHub <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-muted-foreground mb-2">All {repos.length} repositories from GitHub</p>
          <div className="w-20 h-1 bg-primary rounded mb-6" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-8">
          {languages.map((lang) => (
            <button key={lang} onClick={() => setFilter(lang)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === lang ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "glass text-muted-foreground hover:text-foreground"}`}>
              {lang}
            </button>
          ))}
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5" style={{ perspective: "1200px" }}>
            {filtered.map((repo, i) => (
              <ProjectCard key={repo.name} repo={repo} index={i} isInView={isInView} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
