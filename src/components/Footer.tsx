import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          © 2024 <span className="gradient-text font-semibold">Kasireddy Manideep Reddy</span>. Built with passion.
        </p>
        <div className="flex items-center gap-4">
          <a href="https://github.com/manideep395" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <Github size={18} />
          </a>
          <a href="https://www.linkedin.com/in/kasireddymr/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-secondary transition-colors">
            <Linkedin size={18} />
          </a>
          <a href="mailto:kasireddymanideepreddy405@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
            <Mail size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
