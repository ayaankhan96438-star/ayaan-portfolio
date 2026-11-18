import { HeroSection } from "@/components/HeroSection";
import { IntroSection } from "@/components/IntroSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { PlaygroundSection } from "@/components/PlaygroundSection";
import { ContactSection } from "@/components/ContactSection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <IntroSection />
      <ProjectsSection />
      <PlaygroundSection />
      <ContactSection />
    </main>
  );
}
