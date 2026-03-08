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
      <Navigation />
      <div className="relative">
        <Suspense fallback={null}>
          <ParticleField />
        </Suspense>
        <HeroSection />
      </div>
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <div className="-mt-6">
        <GithubStatsSection />
      </div>
      <div className="-mt-6">
        <ExperienceSection />
      </div>
      <BlogSection />
      <ContactSection />
      <Footer />
      <AIChatbot />
    </div>
  );
};

export default Index;
