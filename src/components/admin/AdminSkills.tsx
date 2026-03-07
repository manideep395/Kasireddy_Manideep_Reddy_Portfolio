import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X } from "lucide-react";

type Skill = Tables<"skills">;

export default function AdminSkills() {
  const [items, setItems] = useState<Skill[]>([]);
  const [editing, setEditing] = useState<Partial<Skill> | null>(null);

  const load = () => supabase.from("skills").select("*").order("category").order("display_order").then(({ data }) => { if (data) setItems(data); });
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    const { id, ...rest } = editing as any;
    if (id) {
      const { error } = await supabase.from("skills").update(rest).eq("id", id);
      if (error) toast.error(error.message); else toast.success("Updated!");
    } else {
      const { error } = await supabase.from("skills").insert(rest);
      if (error) toast.error(error.message); else toast.success("Created!");
    }
    setEditing(null); load();
  };

  const del = async (id: string) => { if (!confirm("Delete?")) return; await supabase.from("skills").delete().eq("id", id); toast.success("Deleted"); load(); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Skills</h2>
        <button onClick={() => setEditing({ name: "", category: "Languages", level: 50, display_order: 0 })}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm flex items-center gap-2"><Plus size={14} /> Add</button>
      </div>

      {editing && (
        <div className="glass-card rounded-xl p-6 mb-6 space-y-4">
          <div className="flex justify-between"><h3 className="font-semibold text-foreground">{editing.id ? "Edit" : "New"}</h3><button onClick={() => setEditing(null)}><X size={18} className="text-muted-foreground" /></button></div>
          <div className="grid md:grid-cols-2 gap-4">
            <input placeholder="Skill Name" value={editing.name || ""} onChange={e => setEditing({ ...editing, name: e.target.value })} className="px-3 py-2 rounded-lg bg-muted text-foreground text-sm border border-border focus:border-primary focus:outline-none" />
            <input placeholder="Category" value={editing.category || ""} onChange={e => setEditing({ ...editing, category: e.target.value })} className="px-3 py-2 rounded-lg bg-muted text-foreground text-sm border border-border focus:border-primary focus:outline-none" />
            <div>
              <label className="text-xs text-muted-foreground">Level: {editing.level}%</label>
              <input type="range" min={0} max={100} value={editing.level ?? 50} onChange={e => setEditing({ ...editing, level: +e.target.value })} className="w-full" />
            </div>
            <input placeholder="Order" type="number" value={editing.display_order ?? 0} onChange={e => setEditing({ ...editing, display_order: +e.target.value })} className="px-3 py-2 rounded-lg bg-muted text-foreground text-sm border border-border focus:border-primary focus:outline-none" />
          </div>
          <button onClick={save} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm">Save</button>
        </div>
      )}

      <div className="space-y-3">
        {items.map(s => (
          <div key={s.id} className="glass-card rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div><p className="font-medium text-foreground text-sm">{s.name}</p><p className="text-xs text-muted-foreground">{s.category}</p></div>
              <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full" style={{ width: `${s.level}%`, background: `linear-gradient(90deg, hsl(175 80% 50%), hsl(260 60% 60%))` }} /></div>
              <span className="text-xs font-mono text-primary">{s.level}%</span>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setEditing(s)} className="p-2 rounded hover:bg-muted"><Pencil size={14} className="text-muted-foreground" /></button>
              <button onClick={() => del(s.id)} className="p-2 rounded hover:bg-muted"><Trash2 size={14} className="text-destructive" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
