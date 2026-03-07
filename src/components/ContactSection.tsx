import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Mail, Phone, Github, Linkedin, Send } from "lucide-react";

export default function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoLink = `mailto:kasireddymanideepreddy405@gmail.com?subject=Portfolio Contact from ${formData.name}&body=${encodeURIComponent(formData.message)}`;
    window.open(mailtoLink);
  };

  return (
    <section id="contact" className="section-padding" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <div className="w-20 h-1 bg-primary rounded mx-auto mb-4" />
          <p className="text-muted-foreground">Let's build something amazing together</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <a href="mailto:kasireddymanideepreddy405@gmail.com" className="glass-card rounded-lg p-4 flex items-center gap-4 hover:glow-primary transition-all">
              <Mail size={20} className="text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm text-foreground">kasireddymanideepreddy405@gmail.com</p>
              </div>
            </a>
            <div className="glass-card rounded-lg p-4 flex items-center gap-4">
              <Phone size={20} className="text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-sm text-foreground">+91 9390424085</p>
              </div>
            </div>
            <div className="flex gap-4">
              <a
                href="https://github.com/manideep395"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card rounded-lg p-4 flex-1 flex items-center justify-center gap-2 hover:glow-primary transition-all"
              >
                <Github size={20} className="text-primary" />
                <span className="text-sm text-foreground">GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/kasireddymr/"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card rounded-lg p-4 flex-1 flex items-center justify-center gap-2 hover:glow-accent transition-all"
              >
                <Linkedin size={20} className="text-secondary" />
                <span className="text-sm text-foreground">LinkedIn</span>
              </a>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
            onSubmit={handleSubmit}
            className="glass-card rounded-xl p-6 space-y-4"
          >
            <input
              type="text"
              placeholder="Your Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-muted text-foreground text-sm placeholder:text-muted-foreground border border-border focus:border-primary focus:outline-none transition-colors"
            />
            <input
              type="email"
              placeholder="Your Email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-muted text-foreground text-sm placeholder:text-muted-foreground border border-border focus:border-primary focus:outline-none transition-colors"
            />
            <textarea
              placeholder="Your Message"
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-muted text-foreground text-sm placeholder:text-muted-foreground border border-border focus:border-primary focus:outline-none transition-colors resize-none"
            />
            <button
              type="submit"
              className="w-full px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Send size={16} /> Send Message
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
