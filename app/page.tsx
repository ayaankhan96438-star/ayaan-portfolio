import { HeroSection } from "@/components/HeroSection";
import { IntroSection } from "@/components/IntroSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { PlaygroundSection } from "@/components/PlaygroundSection";
import { JourneySection } from "@/components/JourneySection";
import { DeveloperTerminal } from "@/components/DeveloperTerminal";
import { ContactSection } from "@/components/ContactSection";

export default function HomePage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <HeroSection />
      <IntroSection />
      <ProjectsSection />
      <PlaygroundSection />
      <JourneySection />
      <DeveloperTerminal />
      <ContactSection />
    </main>
  );
}
