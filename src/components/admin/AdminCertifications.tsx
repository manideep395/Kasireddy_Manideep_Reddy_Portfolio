import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X } from "lucide-react";

type Cert = Tables<"certifications">;

export default function AdminCertifications() {
  const [items, setItems] = useState<Cert[]>([]);
  const [editing, setEditing] = useState<Partial<Cert> | null>(null);

  const load = () => supabase.from("certifications").select("*").order("display_order").then(({ data }) => { if (data) setItems(data); });
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    const { id, created_at, ...rest } = editing as any;
    if (id) {
      const { error } = await supabase.from("certifications").update(rest).eq("id", id);
      if (error) toast.error(error.message); else toast.success("Updated!");
    } else {
      const { error } = await supabase.from("certifications").insert(rest);
      if (error) toast.error(error.message); else toast.success("Created!");
    }
    setEditing(null); load();
  };

  const del = async (id: string) => { if (!confirm("Delete?")) return; await supabase.from("certifications").delete().eq("id", id); toast.success("Deleted"); load(); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Certifications</h2>
        <button onClick={() => setEditing({ title: "", issuer: "", display_order: 0 })}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm flex items-center gap-2"><Plus size={14} /> Add</button>
      </div>

      {editing && (
        <div className="glass-card rounded-xl p-6 mb-6 space-y-4">
          <div className="flex justify-between"><h3 className="font-semibold text-foreground">{editing.id ? "Edit" : "New"}</h3><button onClick={() => setEditing(null)}><X size={18} className="text-muted-foreground" /></button></div>
          <div className="grid md:grid-cols-2 gap-4">
            <input placeholder="Title" value={editing.title || ""} onChange={e => setEditing({ ...editing, title: e.target.value })} className="px-3 py-2 rounded-lg bg-muted text-foreground text-sm border border-border focus:border-primary focus:outline-none" />
            <input placeholder="Issuer" value={editing.issuer || ""} onChange={e => setEditing({ ...editing, issuer: e.target.value })} className="px-3 py-2 rounded-lg bg-muted text-foreground text-sm border border-border focus:border-primary focus:outline-none" />
            <input placeholder="Credential URL" value={editing.credential_url || ""} onChange={e => setEditing({ ...editing, credential_url: e.target.value })} className="px-3 py-2 rounded-lg bg-muted text-foreground text-sm border border-border focus:border-primary focus:outline-none" />
            <input placeholder="Order" type="number" value={editing.display_order ?? 0} onChange={e => setEditing({ ...editing, display_order: +e.target.value })} className="px-3 py-2 rounded-lg bg-muted text-foreground text-sm border border-border focus:border-primary focus:outline-none" />
          </div>
          <button onClick={save} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm">Save</button>
        </div>
      )}

      <div className="space-y-3">
        {items.map(c => (
          <div key={c.id} className="glass-card rounded-lg p-4 flex items-center justify-between">
            <div><p className="font-medium text-foreground text-sm">{c.title}</p><p className="text-xs text-muted-foreground">{c.issuer}</p></div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setEditing(c)} className="p-2 rounded hover:bg-muted"><Pencil size={14} className="text-muted-foreground" /></button>
              <button onClick={() => del(c.id)} className="p-2 rounded hover:bg-muted"><Trash2 size={14} className="text-destructive" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
