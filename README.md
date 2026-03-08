# Kasireddy Manideep Reddy — Portfolio

A modern, interactive developer portfolio built with React, TypeScript, and Three.js — featuring smooth animations, an AI-powered chatbot, and a fully functional admin dashboard.

![Portfolio Preview](src/assets/profile-photo.png)

---

## ✨ Features

- **Interactive 3D Particle Background** — Immersive Three.js particle field with depth and motion
- **Custom Cursor Tracking** — Smooth dot + glow ring that follows mouse movement globally
- **AI Chatbot** — Context-aware assistant that answers questions about my skills, projects, and experience
- **Dark / Light Theme** — Fully polished dual-theme with seamless toggle
- **Admin Dashboard** — Manage projects, blogs, skills, experiences, certifications, and contact messages
- **Responsive Design** — Optimized for desktop, tablet, and mobile
- **Smooth Animations** — Framer Motion powered section reveals and micro-interactions
- **Contact Form** — Backend-integrated form with email notifications
- **GitHub Stats** — Live GitHub profile and repository data integration
- **Blog Section** — Markdown-supported blog with tagging and publishing controls

---

## 🛠️ Tech Stack

| Category       | Technologies                                      |
| -------------- | ------------------------------------------------- |
| **Frontend**   | React 18, TypeScript, Vite                        |
| **Styling**    | Tailwind CSS, shadcn/ui, CSS Variables             |
| **3D / Visual**| Three.js, @react-three/fiber, @react-three/drei   |
| **Animation**  | Framer Motion                                     |
| **Backend**    | Supabase (Database, Auth, Edge Functions, Storage) |
| **AI**         | Google Gemini via AI Gateway                      |
| **Routing**    | React Router DOM                                  |
| **Forms**      | React Hook Form, Zod validation                   |
| **Charts**     | Recharts                                          |

---

## 📁 Project Structure

```
src/
├── assets/              # Images and static assets
├── components/
│   ├── ui/              # Reusable shadcn/ui components
│   ├── admin/           # Admin dashboard components
│   ├── HeroSection.tsx
│   ├── AboutSection.tsx
│   ├── SkillsSection.tsx
│   ├── ProjectsSection.tsx
│   ├── ExperienceSection.tsx
│   ├── BlogSection.tsx
│   ├── ContactSection.tsx
│   ├── GithubStatsSection.tsx
│   ├── Navigation.tsx
│   ├── Footer.tsx
│   ├── AIChatbot.tsx
│   ├── CursorGlow.tsx
│   ├── ParticleField.tsx
│   └── ThemeToggle.tsx
├── pages/
│   ├── Index.tsx        # Main portfolio page
│   ├── AdminDashboard.tsx
│   └── AdminLogin.tsx
├── hooks/               # Custom React hooks
├── integrations/        # Supabase client & types
├── lib/                 # Utility functions
└── index.css            # Design tokens & global styles

supabase/
├── functions/
│   ├── chat/            # AI chatbot edge function
│   ├── github-data/     # GitHub API integration
│   └── send-contact-email/  # Contact form handler
└── config.toml
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/manideep395/portfolio.git
cd portfolio

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:8080`.

### Build for Production

```bash
npm run build
```

---

## 📊 Database Schema

| Table                 | Purpose                              |
| --------------------- | ------------------------------------ |
| `projects`            | Portfolio projects with metadata     |
| `skills`              | Technical skills with proficiency    |
| `experiences`         | Work experience entries              |
| `blogs`               | Blog posts with markdown content     |
| `certifications`      | Professional certifications          |
| `contact_submissions` | Contact form messages                |
| `site_settings`       | Key-value site configuration         |

---

## 🎨 Key Sections

| Section        | Description                                                |
| -------------- | ---------------------------------------------------------- |
| **Hero**       | Animated intro with name, title, and CTA buttons           |
| **About**      | Bio, education, and personal background                    |
| **Skills**     | Categorized skills with animated progress bars             |
| **Projects**   | Featured projects with filtering, GitHub links, and demos  |
| **Experience** | Timeline of work experience and internships                |
| **GitHub**     | Live stats pulled from GitHub API                          |
| **Blog**       | Published articles with tags and markdown rendering        |
| **Contact**    | Form with backend email integration                        |

---

## 👤 Author

**Kasireddy Manideep Reddy**

- GitHub: [@manideep395](https://github.com/manideep395)
- LinkedIn: [kasireddymr](https://www.linkedin.com/in/kasireddymr/)
- Email: kasireddymanideepreddy405@gmail.com

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
