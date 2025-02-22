import Navigation from "@/components/navigation";
import AnimatedPath from "@/components/animated-path";
import FeatureSection from "@/components/feature-section";
import { Lightbulb, Bot, Presentation, Trophy } from "lucide-react";

export default function Page() {
  // Pass only icon names as strings instead of React components
  const icons = [
    { iconName: "lightbulb", label: "From Ideation", sectionId: "browse" },
    { iconName: "bot", label: "To Discussion", sectionId: "discuss" },
    { iconName: "presentation", label: "To Documentation", sectionId: "readme" },
    { iconName: "trophy", label: "To Victory", sectionId: "why-use" },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="bg-gradient-to-b from-white via-white to-transparent pb-[50vh] relative">
        <Navigation />
        <main className="container mx-auto px-4">
          {/* Hero Section */}
          <section className="pt-20 pb-32">
            <h1 className="text-6xl md:text-7xl font-bold mb-16 text-center animate-fade-in text-black">
              HackSherpa
            </h1>

            <div className="relative h-[600px]">
              {/* Passing the icons array to the Client Component */}
              <AnimatedPath icons={icons} />

              <div className="absolute bottom-8 right-8 max-w-md text-right">
                <h2 className="text-3xl md:text-4xl font-medium leading-tight text-black">
                  Your Guide in Scaling Your Next Hackathon
                </h2>
              </div>
            </div>
          </section>
        </main>
      </div>

      <div className="bg-gradient-to-b from-black via-black to-white">
        {/* Feature Sections */}
        <FeatureSection
          id="browse"
          title="Browse Winning Ideas"
          description="Get inspired by successful hackathon projects and learn from winners' experiences."
          icon={<Lightbulb className="w-12 h-12 text-white" />}
        />

        <FeatureSection
          id="discuss"
          title="Discuss Ideas"
          description="Connect with fellow hackers, share insights, and refine your concepts."
          icon={<Bot className="w-12 h-12 text-white" />}
          reverse
        />

        <FeatureSection
          id="readme"
          title="Create Startup ReadMe"
          description="Generate professional documentation that helps your project stand out."
          icon={<Presentation className="w-12 h-12 text-white" />}
        />

        {/* Why Use Section */}
        <section id="why-use" className="py-32 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <Trophy className="w-16 h-16 mx-auto mb-8 text-white" />
            <h2 className="text-4xl font-bold mb-8 text-white">Why Use HackSherpa?</h2>
            <p className="text-xl text-gray-300">
              HackSherpa is your all-in-one platform for hackathon success. From ideation to presentation, we provide
              the tools and guidance you need to transform your hackathon project into a winning venture. Join thousands
              of successful hackers who've scaled their projects with HackSherpa.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
