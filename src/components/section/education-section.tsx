/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface Education {
  id: string;
  school: string;
  degree: string;
  logoUrl: string;
  href: string;
  start: string;
  end: string;
}

export default function EducationSection() {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/education");
        if (!response.ok) throw new Error("Failed to fetch education");
        const data = await response.json();
        setEducation(data);
        setError(null);
      } catch (err) {
        console.error("[v0] Error fetching education:", err);
        setError("Failed to load education");
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, []);

  if (loading) return <div className="text-muted-foreground">Loading education...</div>;
  if (error) return <div className="text-destructive">{error}</div>;
  if (education.length === 0) return <div className="text-muted-foreground">No education found</div>;

  return (
    <div className="flex flex-col gap-8">
      {education.map((edu) => (
        <Link
          key={edu.id}
          href={edu.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-x-3 justify-between group"
        >
          <div className="flex items-center gap-x-3 flex-1 min-w-0">
            {edu.logoUrl ? (
              <img
                src={edu.logoUrl}
                alt={edu.school}
                className="size-8 md:size-10 p-1 border rounded-full shadow ring-2 ring-border overflow-hidden object-contain flex-none"
              />
            ) : (
              <div className="size-8 md:size-10 p-1 border rounded-full shadow ring-2 ring-border bg-muted flex-none" />
            )}
            <div className="flex-1 min-w-0 flex flex-col gap-0.5">
              <div className="font-semibold leading-none flex items-center gap-2">
                {edu.school}
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" aria-hidden />
              </div>
              <div className="font-sans text-sm text-muted-foreground">
                {edu.degree}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs tabular-nums text-muted-foreground text-right flex-none">
            <span>
              {edu.start} - {edu.end}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
