import { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { GitBranch, Star, Users, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface GithubStats {
  user: { name: string; avatar_url: string; bio: string; public_repos: number; followers: number; following: number } | null;
  stats: { totalRepos: number; totalStars: number; languages: { name: string; count: number; percentage: number }[] };
}

export default function GithubStatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [data, setData] = useState<GithubStats | null>(null);

  useEffect(() => {
    supabase.functions.invoke("github-data").then(({ data: d }) => {
      if (d) setData(d);
    });
  }, []);

  if (!data) return <div className="h-0" />;

  const stats = [
    { icon: BookOpen, label: "Repositories", value: data.stats.totalRepos },
    { icon: Star, label: "Total Stars", value: data.stats.totalStars },
    { icon: Users, label: "Followers", value: data.user?.followers ?? 0 },
    { icon: GitBranch, label: "Following", value: data.user?.following ?? 0 },
  ];

  return (
    <section id="github" className="px-6 pt-2 pb-4 md:px-12 md:pt-2 md:pb-4 lg:px-24" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            GitHub <span className="gradient-text">Analytics</span>
          </h2>
          <div className="w-20 h-1 bg-primary rounded mb-10" />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="glass-card rounded-xl p-5 text-center"
            >
              <s.icon className="mx-auto text-primary mb-2" size={24} />
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Top Languages</h3>
          <div className="space-y-3">
            {data.stats.languages.slice(0, 6).map((lang, i) => (
              <div key={lang.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-muted-foreground">{lang.name}</span>
                  <span className="text-xs font-mono text-primary">{lang.percentage}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${lang.percentage}%` } : {}}
                    transition={{ duration: 1, delay: 0.6 + i * 0.05 }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, hsl(175 80% 50%), hsl(260 60% 60%))` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
