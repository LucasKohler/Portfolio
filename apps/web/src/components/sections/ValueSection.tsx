import { Bot, Gauge, Layers3, Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";

const values = [
  {
    title: "Product-minded engineering",
    description:
      "Translating business goals into technical architecture, ensuring features solve real user problems efficiently.",
    icon: Lightbulb,
  },
  {
    title: "Fullstack execution",
    description:
      "Seamless delivery across the stack, from database schema design in SQL to responsive frontend components in React.",
    icon: Layers3,
  },
  {
    title: "Performance & maintainability",
    description:
      "Writing clean, testable code and optimizing system performance for long-term scalability and reliability.",
    icon: Gauge,
  },
  {
    title: "AI-assisted productivity",
    description:
      "Leveraging modern AI tools to accelerate development cycles, improve code review, and prototype faster.",
    icon: Bot,
  },
] as const;

export function ValueSection() {
  return (
    <SectionContainer
      className="border-t border-border py-18 md:py-20"
      id="skills"
    >
      <SectionHeading
        align="center"
        className="mb-14"
        title="What I bring to engineering teams"
      />

      <div className="grid gap-5 md:grid-cols-2">
        {values.map((value) => {
          const Icon = value.icon;

          return (
            <Card key={value.title} className="min-h-48 p-7 md:p-8">
              <Icon aria-hidden="true" className="text-primary" size={24} />
              <h3 className="mt-8 text-lg font-semibold tracking-normal text-foreground">
                {value.title}
              </h3>
              <p className="mt-5 text-base leading-7 text-muted">
                {value.description}
              </p>
            </Card>
          );
        })}
      </div>
    </SectionContainer>
  );
}
