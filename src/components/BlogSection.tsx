import { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Calendar, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Blog = Tables<"blogs">;

export default function BlogSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    supabase.from("blogs").select("*").eq("is_published", true).order("created_at", { ascending: false }).limit(3)
      .then(({ data }) => { if (data) setBlogs(data); });
  }, []);

  if (blogs.length === 0) return null;

  return (
    <section id="blog" className="section-padding" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Blog & <span className="gradient-text">Articles</span>
          </h2>
          <div className="w-20 h-1 bg-primary rounded mb-10" />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {blogs.map((blog, i) => (
            <motion.article
              key={blog.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="glass-card rounded-xl overflow-hidden group"
            >
              {blog.cover_image && (
                <div className="h-40 overflow-hidden">
                  <img src={blog.cover_image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <Calendar size={12} />
                  {new Date(blog.created_at).toLocaleDateString()}
                </div>
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{blog.title}</h3>
                {blog.excerpt && <p className="text-sm text-muted-foreground line-clamp-2">{blog.excerpt}</p>}
                <div className="flex flex-wrap gap-2 mt-3">
                  {blog.tags?.map(tag => (
                    <span key={tag} className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">{tag}</span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
