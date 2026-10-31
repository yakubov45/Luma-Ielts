import { HomeHeader } from "@/components/home/HomeHeader";
import { HeroSection } from "@/components/home/HeroSection";
import { MiniReadingDemo } from "@/components/home/MiniReadingDemo";
import { FourSkillsSection } from "@/components/home/FourSkillsSection";
import { LearningLoopSection } from "@/components/home/LearningLoopSection";
import { StudyPlanSection } from "@/components/home/StudyPlanSection";
import { GroupStudySection } from "@/components/home/GroupStudySection";
import { FaqSection } from "@/components/home/FaqSection";
import { HomeFooter } from "@/components/home/HomeFooter";

export const metadata = {
  title: "Lumo IELTS — lumoielts.uz | IELTS Academic & General",
  description:
    "IELTS’ga har kuni aniq bir qadam. To‘rtta ko‘nikmani mashq qiling, xatolaringizni tushuning va o‘zingizga mos reja bilan tayyorlaning.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--primary)] selection:text-white">
      {/* Header */}
      <HomeHeader />

      {/* Main Content Sections */}
      <main className="flex-1 flex flex-col space-y-6 sm:space-y-10">
        {/* 1. Hero Section with Bounded Animation */}
        <HeroSection />

        {/* 2. Interactive Mini Reading Demo (Guest-accessible) */}
        <MiniReadingDemo />

        {/* 3. Four Core Skills (Reading, Listening, Writing, Speaking) */}
        <FourSkillsSection />

        {/* 4. Methodology / Learning Loop (01-04) */}
        <LearningLoopSection />

        {/* 5. Personalized Study Plan & 8-Question Questionnaire */}
        <StudyPlanSection />

        {/* 6. Teacher-Led Group Study (5-15 Learners) */}
        <GroupStudySection />

        {/* 7. Frequently Asked Questions (Accessible Accordion) */}
        <FaqSection />
      </main>

      {/* Footer & Final Call to Action */}
      <HomeFooter />
    </div>
  );
}
