import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LogOut, FolderOpen, FileText, Award, Briefcase, Mail, Wrench, Settings } from "lucide-react";
import AdminProjects from "@/components/admin/AdminProjects";
import AdminBlogs from "@/components/admin/AdminBlogs";
import AdminExperiences from "@/components/admin/AdminExperiences";
import AdminCertifications from "@/components/admin/AdminCertifications";
import AdminContacts from "@/components/admin/AdminContacts";
import AdminSkills from "@/components/admin/AdminSkills";

const tabs = [
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "blogs", label: "Blogs", icon: FileText },
  { id: "experiences", label: "Experience", icon: Briefcase },
  { id: "certifications", label: "Certifications", icon: Award },
  { id: "skills", label: "Skills", icon: Wrench },
  { id: "contacts", label: "Messages", icon: Mail },
  { id: "settings", label: "Settings", icon: Settings },
];

function AdminSettings() {
  const [resumeUrl, setResumeUrl] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("site_settings").select("value").eq("key", "resume_url").single().then(({ data }) => {
      if (data?.value) setResumeUrl(data.value);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from("site_settings").update({ value: resumeUrl, updated_at: new Date().toISOString() }).eq("key", "resume_url");
    if (error) {
      // Try insert if no row exists
      await supabase.from("site_settings").insert({ key: "resume_url", value: resumeUrl });
    }
    toast.success("Resume URL updated!");
    setSaving(false);
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-foreground mb-6">Site Settings</h2>
      <div className="glass-card rounded-xl p-6 max-w-2xl space-y-4">
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Resume URL (Google Drive, Dropbox, etc.)</label>
          <input
            type="url"
            value={resumeUrl}
            onChange={(e) => setResumeUrl(e.target.value)}
            placeholder="https://drive.google.com/..."
            className="w-full px-4 py-3 rounded-lg bg-muted text-foreground text-sm border border-border focus:border-primary focus:outline-none"
          />
        </div>
        <button onClick={handleSave} disabled={saving}
          className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 disabled:opacity-50">
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("projects");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) navigate("/admin/login");
      else setUser(session.user);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/admin/login");
      else setUser(session.user);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/" className="text-xl font-bold gradient-text">MR</a>
          <span className="text-sm text-muted-foreground">Admin Panel</span>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <LogOut size={16} /> Sign Out
        </button>
      </header>

      <div className="flex">
        <nav className="w-56 border-r border-border min-h-[calc(100vh-65px)] p-4 space-y-1">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                activeTab === tab.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}>
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </nav>

        <main className="flex-1 p-6">
          {activeTab === "projects" && <AdminProjects />}
          {activeTab === "blogs" && <AdminBlogs />}
          {activeTab === "experiences" && <AdminExperiences />}
          {activeTab === "certifications" && <AdminCertifications />}
          {activeTab === "skills" && <AdminSkills />}
          {activeTab === "contacts" && <AdminContacts />}
          {activeTab === "settings" && <AdminSettings />}
        </main>
      </div>
    </div>
  );
}
