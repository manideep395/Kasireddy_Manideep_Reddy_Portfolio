import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X } from "lucide-react";

type Experience = Tables<"experiences">;

export default function AdminExperiences() {
  const [items, setItems] = useState<Experience[]>([]);
  const [editing, setEditing] = useState<Partial<Experience> | null>(null);

  const load = () => supabase.from("experiences").select("*").order("display_order").then(({ data }) => { if (data) setItems(data); });
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    const { id, created_at, updated_at, ...rest } = editing as any;
    if (id) {
      const { error } = await supabase.from("experiences").update(rest).eq("id", id);
      if (error) toast.error(error.message); else toast.success("Updated!");
    } else {
      const { error } = await supabase.from("experiences").insert(rest);
      if (error) toast.error(error.message); else toast.success("Created!");
    }
    setEditing(null); load();
  };

  const del = async (id: string) => { if (!confirm("Delete?")) return; await supabase.from("experiences").delete().eq("id", id); toast.success("Deleted"); load(); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Experience</h2>
        <button onClick={() => setEditing({ role: "", company: "", duration: "", description: "", technologies: [], display_order: 0 })}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm flex items-center gap-2"><Plus size={14} /> Add</button>
      </div>

      {editing && (
        <div className="glass-card rounded-xl p-6 mb-6 space-y-4">
          <div className="flex justify-between"><h3 className="font-semibold text-foreground">{editing.id ? "Edit" : "New"}</h3><button onClick={() => setEditing(null)}><X size={18} className="text-muted-foreground" /></button></div>
          <div className="grid md:grid-cols-2 gap-4">
            <input placeholder="Role" value={editing.role || ""} onChange={e => setEditing({ ...editing, role: e.target.value })} className="px-3 py-2 rounded-lg bg-muted text-foreground text-sm border border-border focus:border-primary focus:outline-none" />
            <input placeholder="Company" value={editing.company || ""} onChange={e => setEditing({ ...editing, company: e.target.value })} className="px-3 py-2 rounded-lg bg-muted text-foreground text-sm border border-border focus:border-primary focus:outline-none" />
            <input placeholder="Duration" value={editing.duration || ""} onChange={e => setEditing({ ...editing, duration: e.target.value })} className="px-3 py-2 rounded-lg bg-muted text-foreground text-sm border border-border focus:border-primary focus:outline-none" />
            <input placeholder="Technologies (comma)" value={editing.technologies?.join(", ") || ""} onChange={e => setEditing({ ...editing, technologies: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })} className="px-3 py-2 rounded-lg bg-muted text-foreground text-sm border border-border focus:border-primary focus:outline-none" />
          </div>
          <textarea placeholder="Description" value={editing.description || ""} onChange={e => setEditing({ ...editing, description: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-lg bg-muted text-foreground text-sm border border-border focus:border-primary focus:outline-none resize-none" />
          <button onClick={save} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm">Save</button>
        </div>
      )}

      <div className="space-y-3">
        {items.map(e => (
          <div key={e.id} className="glass-card rounded-lg p-4 flex items-center justify-between">
            <div><p className="font-medium text-foreground text-sm">{e.role} <span className="text-xs text-primary ml-2">{e.company}</span></p><p className="text-xs text-muted-foreground">{e.duration}</p></div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setEditing(e)} className="p-2 rounded hover:bg-muted"><Pencil size={14} className="text-muted-foreground" /></button>
              <button onClick={() => del(e.id)} className="p-2 rounded hover:bg-muted"><Trash2 size={14} className="text-destructive" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
