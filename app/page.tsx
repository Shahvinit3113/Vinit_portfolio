import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";
import Hero from "@/components/ui/hero";
import BlogServer from "./(sections)/blog/BlogServer";
import ProjectsServer from "./(sections)/projects/ProjectsServer";
import SkillsServer from "./(sections)/skills/SkillsServer";
import ExperienceServer from "./(sections)/experience/ExperienceServer";
import ContactClient from "./(sections)/contact/ContactClient";

// Force dynamic rendering for this page (required for Dev.to API with no-cache)
export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <ProjectsServer />
      <SkillsServer />
      <ExperienceServer />
      <BlogServer />
      <ContactClient />
      <Footer />
    </>
  );
}
