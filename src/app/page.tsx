/* eslint-disable @next/next/no-img-element */
import { DATA } from "@/data/resume";
import Link from "next/link";
import Markdown from "react-markdown";
import ContactSection from "@/components/section/contact-section";
import ProjectsSection from "@/components/section/projects-section";
import WorkSection from "@/components/section/work-section";
import EducationSection from "@/components/section/education-section";

export default function Page() {
  return (
    <main className="min-h-dvh flex flex-col gap-20 relative">
      <section id="hero">
        <div className="space-y-6">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground">
              {DATA.name.split(" ")[0]}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mt-4 font-light">
              {DATA.description}
            </p>
          </div>
          <nav className="flex gap-6 pt-4 border-t border-border">
            {[
              { name: "Work", href: "#work" },
              { name: "Projects", href: "#projects" },
              { name: "Contact", href: "#contact" }
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </section>
      <section id="about">
        <div className="flex min-h-0 flex-col gap-y-4">
          <h2 className="text-2xl font-semibold">About</h2>
          <div className="prose max-w-full text-pretty font-sans leading-relaxed text-muted-foreground dark:prose-invert">
            <Markdown>
              {DATA.summary}
            </Markdown>
          </div>
        </div>
      </section>
      <section id="work">
        <div className="flex min-h-0 flex-col gap-y-6">
          <h2 className="text-2xl font-semibold">Work Experience</h2>
          <WorkSection />
        </div>
      </section>
      <section id="education">
        <div className="flex min-h-0 flex-col gap-y-6">
          <h2 className="text-2xl font-semibold">Education</h2>
          <EducationSection />
        </div>
      </section>
      <section id="skills">
        <div className="flex min-h-0 flex-col gap-y-4">
          <h2 className="text-2xl font-semibold">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {DATA.skills.map((skill) => (
              <div key={skill.name} className="text-sm text-muted-foreground border-l border-foreground pl-3 py-1">
                {skill.name}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="projects">
        <ProjectsSection />
      </section>
      <section id="contact">
        <ContactSection />
      </section>
    </main>
  );
}
