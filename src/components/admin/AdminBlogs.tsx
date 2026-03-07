import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X } from "lucide-react";

type Blog = Tables<"blogs">;

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [editing, setEditing] = useState<Partial<Blog> | null>(null);

  const load = () => supabase.from("blogs").select("*").order("created_at", { ascending: false }).then(({ data }) => { if (data) setBlogs(data); });
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    const { id, created_at, updated_at, ...rest } = editing as any;
    if (id) {
      const { error } = await supabase.from("blogs").update(rest).eq("id", id);
      if (error) toast.error(error.message); else toast.success("Updated!");
    } else {
      const { error } = await supabase.from("blogs").insert(rest);
      if (error) toast.error(error.message); else toast.success("Created!");
    }
    setEditing(null); load();
  };

  const del = async (id: string) => { if (!confirm("Delete?")) return; await supabase.from("blogs").delete().eq("id", id); toast.success("Deleted"); load(); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Blogs</h2>
        <button onClick={() => setEditing({ title: "", slug: "", excerpt: "", content: "", tags: [], is_published: false })}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm flex items-center gap-2"><Plus size={14} /> New Blog</button>
      </div>

      {editing && (
        <div className="glass-card rounded-xl p-6 mb-6 space-y-4">
          <div className="flex justify-between"><h3 className="font-semibold text-foreground">{editing.id ? "Edit" : "New"} Blog</h3><button onClick={() => setEditing(null)}><X size={18} className="text-muted-foreground" /></button></div>
          <input placeholder="Title" value={editing.title || ""} onChange={e => setEditing({ ...editing, title: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-muted text-foreground text-sm border border-border focus:border-primary focus:outline-none" />
          <input placeholder="Slug (url-friendly)" value={editing.slug || ""} onChange={e => setEditing({ ...editing, slug: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-muted text-foreground text-sm border border-border focus:border-primary focus:outline-none" />
          <input placeholder="Excerpt" value={editing.excerpt || ""} onChange={e => setEditing({ ...editing, excerpt: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-muted text-foreground text-sm border border-border focus:border-primary focus:outline-none" />
          <textarea placeholder="Content (Markdown)" value={editing.content || ""} onChange={e => setEditing({ ...editing, content: e.target.value })} rows={8} className="w-full px-3 py-2 rounded-lg bg-muted text-foreground text-sm border border-border focus:border-primary focus:outline-none resize-none font-mono" />
          <input placeholder="Tags (comma separated)" value={editing.tags?.join(", ") || ""} onChange={e => setEditing({ ...editing, tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })} className="w-full px-3 py-2 rounded-lg bg-muted text-foreground text-sm border border-border focus:border-primary focus:outline-none" />
          <label className="flex items-center gap-2 text-sm text-muted-foreground"><input type="checkbox" checked={editing.is_published ?? false} onChange={e => setEditing({ ...editing, is_published: e.target.checked })} /> Published</label>
          <button onClick={save} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm">Save</button>
        </div>
      )}

      <div className="space-y-3">
        {blogs.map(b => (
          <div key={b.id} className="glass-card rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground text-sm">{b.title} <span className={`text-xs ml-2 ${b.is_published ? "text-primary" : "text-muted-foreground"}`}>{b.is_published ? "Published" : "Draft"}</span></p>
              <p className="text-xs text-muted-foreground mt-1">{b.excerpt}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setEditing(b)} className="p-2 rounded hover:bg-muted"><Pencil size={14} className="text-muted-foreground" /></button>
              <button onClick={() => del(b.id)} className="p-2 rounded hover:bg-muted"><Trash2 size={14} className="text-destructive" /></button>
            </div>
          </div>
        ))}
        {blogs.length === 0 && <p className="text-sm text-muted-foreground">No blog posts yet.</p>}
      </div>
    </div>
  );
}
