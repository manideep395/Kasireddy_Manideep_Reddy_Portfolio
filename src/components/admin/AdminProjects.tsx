import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X } from "lucide-react";

type Project = Tables<"projects">;

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Partial<Project> | null>(null);

  const load = () => supabase.from("projects").select("*").order("display_order").then(({ data }) => { if (data) setProjects(data); });
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    const { id, created_at, updated_at, ...rest } = editing as any;
    if (id) {
      const { error } = await supabase.from("projects").update(rest).eq("id", id);
      if (error) toast.error(error.message); else toast.success("Updated!");
    } else {
      const { error } = await supabase.from("projects").insert(rest);
      if (error) toast.error(error.message); else toast.success("Created!");
    }
    setEditing(null);
    load();
  };

  const del = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    await supabase.from("projects").delete().eq("id", id);
    toast.success("Deleted");
    load();
  };

  const syncGithub = async () => {
    toast.info("Syncing GitHub repos...");
    const { data, error } = await supabase.functions.invoke("github-data");
    if (error || !data?.repos) { toast.error("Failed to sync"); return; }
    for (const repo of data.repos) {
      const existing = projects.find(p => p.name === repo.name && p.is_from_github);
      if (existing) {
        await supabase.from("projects").update({ description: repo.description, language: repo.language || "Unknown", stars: repo.stars, github_url: repo.html_url, demo_url: repo.homepage || null }).eq("id", existing.id);
      } else {
        await supabase.from("projects").insert({ name: repo.name, description: repo.description, language: repo.language || "Unknown", stars: repo.stars, github_url: repo.html_url, demo_url: repo.homepage || null, is_from_github: true, category: "Web" });
      }
    }
    toast.success(`Synced ${data.repos.length} repos`);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Projects</h2>
        <div className="flex gap-2">
          <button onClick={syncGithub} className="px-4 py-2 rounded-lg glass text-sm text-foreground hover:border-primary/50 transition-colors">Sync GitHub</button>
          <button onClick={() => setEditing({ name: "", description: "", category: "Web", language: "JavaScript", tags: [], github_url: "", demo_url: "", stars: 0, is_featured: false, display_order: 0 })}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm flex items-center gap-2"><Plus size={14} /> Add Project</button>
        </div>
      </div>

      {editing && (
        <div className="glass-card rounded-xl p-6 mb-6 space-y-4">
          <div className="flex justify-between"><h3 className="font-semibold text-foreground">{editing.id ? "Edit" : "New"} Project</h3><button onClick={() => setEditing(null)}><X size={18} className="text-muted-foreground" /></button></div>
          <div className="grid md:grid-cols-2 gap-4">
            <input placeholder="Name" value={editing.name || ""} onChange={e => setEditing({ ...editing, name: e.target.value })} className="px-3 py-2 rounded-lg bg-muted text-foreground text-sm border border-border focus:border-primary focus:outline-none" />
            <input placeholder="Language" value={editing.language || ""} onChange={e => setEditing({ ...editing, language: e.target.value })} className="px-3 py-2 rounded-lg bg-muted text-foreground text-sm border border-border focus:border-primary focus:outline-none" />
            <select value={editing.category || "Web"} onChange={e => setEditing({ ...editing, category: e.target.value })} className="px-3 py-2 rounded-lg bg-muted text-foreground text-sm border border-border focus:border-primary focus:outline-none">
              <option>AI</option><option>Web</option><option>Data</option><option>Tools</option>
            </select>
            <input placeholder="Stars" type="number" value={editing.stars ?? 0} onChange={e => setEditing({ ...editing, stars: +e.target.value })} className="px-3 py-2 rounded-lg bg-muted text-foreground text-sm border border-border focus:border-primary focus:outline-none" />
            <input placeholder="GitHub URL" value={editing.github_url || ""} onChange={e => setEditing({ ...editing, github_url: e.target.value })} className="px-3 py-2 rounded-lg bg-muted text-foreground text-sm border border-border focus:border-primary focus:outline-none" />
            <input placeholder="Demo URL" value={editing.demo_url || ""} onChange={e => setEditing({ ...editing, demo_url: e.target.value })} className="px-3 py-2 rounded-lg bg-muted text-foreground text-sm border border-border focus:border-primary focus:outline-none" />
            <input placeholder="Tags (comma separated)" value={editing.tags?.join(", ") || ""} onChange={e => setEditing({ ...editing, tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })} className="px-3 py-2 rounded-lg bg-muted text-foreground text-sm border border-border focus:border-primary focus:outline-none" />
            <input placeholder="Display Order" type="number" value={editing.display_order ?? 0} onChange={e => setEditing({ ...editing, display_order: +e.target.value })} className="px-3 py-2 rounded-lg bg-muted text-foreground text-sm border border-border focus:border-primary focus:outline-none" />
          </div>
          <textarea placeholder="Description" value={editing.description || ""} onChange={e => setEditing({ ...editing, description: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-lg bg-muted text-foreground text-sm border border-border focus:border-primary focus:outline-none resize-none" />
          <label className="flex items-center gap-2 text-sm text-muted-foreground"><input type="checkbox" checked={editing.is_featured ?? false} onChange={e => setEditing({ ...editing, is_featured: e.target.checked })} /> Featured</label>
          <button onClick={save} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm">Save</button>
        </div>
      )}

      <div className="space-y-3">
        {projects.map(p => (
          <div key={p.id} className="glass-card rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground text-sm">{p.name} <span className="text-xs text-primary font-mono ml-2">{p.language}</span> <span className="text-xs text-muted-foreground ml-2">{p.category}</span></p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{p.description}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setEditing(p)} className="p-2 rounded hover:bg-muted"><Pencil size={14} className="text-muted-foreground" /></button>
              <button onClick={() => del(p.id)} className="p-2 rounded hover:bg-muted"><Trash2 size={14} className="text-destructive" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
