import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Mail, Check } from "lucide-react";

type Contact = Tables<"contact_submissions">;

export default function AdminContacts() {
  const [items, setItems] = useState<Contact[]>([]);

  const load = () => supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }).then(({ data }) => { if (data) setItems(data); });
  useEffect(() => { load(); }, []);

  const markRead = async (id: string) => {
    await supabase.from("contact_submissions").update({ is_read: true }).eq("id", id);
    load();
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-foreground mb-6">Contact Messages</h2>
      <div className="space-y-3">
        {items.map(c => (
          <div key={c.id} className={`glass-card rounded-lg p-4 ${!c.is_read ? "border-l-2 border-l-primary" : ""}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-foreground text-sm">{c.name} <span className="text-xs text-muted-foreground ml-2">{c.email}</span></p>
                <p className="text-sm text-muted-foreground mt-2">{c.message}</p>
                <p className="text-xs text-muted-foreground mt-2">{new Date(c.created_at).toLocaleString()}</p>
              </div>
              {!c.is_read && (
                <button onClick={() => markRead(c.id)} className="p-2 rounded hover:bg-muted shrink-0" title="Mark as read">
                  <Check size={14} className="text-primary" />
                </button>
              )}
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-muted-foreground">No messages yet.</p>}
      </div>
    </div>
  );
}
