import { Suspense } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import ExperienceSection from "@/components/ExperienceSection";
import GithubStatsSection from "@/components/GithubStatsSection";
import BlogSection from "@/components/BlogSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ParticleField from "@/components/ParticleField";
import AIChatbot from "@/components/AIChatbot";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      <Suspense fallback={null}>
        <ParticleField />
      </Suspense>
      <Navigation />
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <GithubStatsSection />
      <ExperienceSection />
      <BlogSection />
      <ContactSection />
      <Footer />
      <AIChatbot />
    </div>
  );
};

export default Index;
