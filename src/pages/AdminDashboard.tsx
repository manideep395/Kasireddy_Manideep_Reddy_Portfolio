import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LogOut, FolderOpen, FileText, Award, Briefcase, Mail, BarChart3, Wrench, Github } from "lucide-react";
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
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("projects");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/admin/login");
      } else {
        setUser(session.user);
      }
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
        </main>
      </div>
    </div>
  );
}
