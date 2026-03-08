import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ExternalLink, Github, Star, Code2, Loader2 } from "lucide-react";
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
}

const languageColors: Record<string, string> = {
  TypeScript: "hsl(210 80% 55%)",
  JavaScript: "hsl(50 90% 50%)",
  Python: "hsl(210 60% 45%)",
  Java: "hsl(15 70% 50%)",
  HTML: "hsl(15 80% 55%)",
  CSS: "hsl(260 60% 55%)",
};

export default function ProjectsSection() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    supabase.functions.invoke("github-data").then(({ data }) => {
      if (data?.repos) setRepos(data.repos);
      setLoading(false);
    }).catch(() => setLoading(false));
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
          <div className="w-20 h-1 bg-primary rounded mb-8" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }} className="flex flex-wrap gap-3 mb-10">
          {languages.map((lang) => (
            <button key={lang} onClick={() => setFilter(lang)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === lang ? "bg-primary text-primary-foreground" : "glass text-muted-foreground hover:text-foreground"}`}>
              {lang}
            </button>
          ))}
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((repo, i) => (
              <motion.div
                key={repo.name}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="animate-card-float glass-card rounded-xl p-6 group hover:border-primary/30 transition-all duration-300 hover:glow-primary flex flex-col"
              >
                <div className="flex items-center justify-between mb-3">
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
                  {repo.stars > 0 && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star size={12} /> {repo.stars}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors truncate">
                  {repo.name}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                  {repo.description || "No description available"}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex gap-3">
                    <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                      <Github size={18} />
                    </a>
                    {repo.homepage && (
                      <a href={repo.homepage} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                        <ExternalLink size={18} />
                      </a>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">
                    {new Date(repo.updated_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
