import { ContactCTA } from "@/components/sections/ContactCTA";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { Hero } from "@/components/sections/Hero";
import { ValueSection } from "@/components/sections/ValueSection";
import { getProjects } from "@/lib/api";

export const dynamic = "force-dynamic";

async function getFeaturedProjects() {
  try {
    const projects = await getProjects();

    return {
      hasError: false,
      projects: projects.filter((project) => project.featured),
    };
  } catch {
    return {
      hasError: true,
      projects: [],
    };
  }
}

export default async function Home() {
  const featuredProjects = await getFeaturedProjects();

  return (
    <>
      <Hero />
      <ValueSection />
      <FeaturedProjects {...featuredProjects} />
      <ContactCTA />
    </>
  );
}
