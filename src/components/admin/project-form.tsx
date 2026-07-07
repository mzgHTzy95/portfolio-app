"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProjectFormProps {
  action: (formData: FormData) => void;
  initial?: {
    title?: string;
    slug?: string;
    description?: string;
    category?: string;
    techStack?: string[];
    featured?: boolean;
    coverImage?: string;
    githubUrl?: string;
    liveUrl?: string;
    publishedAt?: string;
    body?: string;
  };
  submitLabel?: string;
}

const categories = [
  { value: "web-app", label: "Web App" },
  { value: "website", label: "Website" },
  { value: "open-source", label: "Open Source" },
  { value: "other", label: "Other" },
];

export function ProjectForm({ action, initial = {}, submitLabel = "Save" }: ProjectFormProps) {
  const router = useRouter();
  const [techInput, setTechInput] = useState("");
  const [techs, setTechs] = useState<string[]>(initial.techStack ?? []);
  const [body, setBody] = useState(initial.body ?? "");

  function addTech() {
    const t = techInput.trim();
    if (t && !techs.includes(t)) setTechs([...techs, t]);
    setTechInput("");
  }

  function removeTech(t: string) {
    setTechs(techs.filter((x) => x !== t));
  }

  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Title</label>
        <input
          name="title"
          defaultValue={initial.title}
          required
          className="h-10 px-3 rounded-lg border border-border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Slug</label>
        <input
          name="slug"
          defaultValue={initial.slug}
          required
          placeholder="my-project"
          className="h-10 px-3 rounded-lg border border-border bg-background text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Description</label>
        <textarea
          name="description"
          defaultValue={initial.description}
          required
          rows={2}
          className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Category</label>
          <select
            name="category"
            defaultValue={initial.category ?? "web-app"}
            className="h-10 px-3 rounded-lg border border-border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Published date</label>
          <input
            name="publishedAt"
            type="date"
            defaultValue={initial.publishedAt}
            required
            className="h-10 px-3 rounded-lg border border-border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Tech stack</label>
        <div className="flex gap-2">
          <input
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTech();
              }
            }}
            placeholder="Add a technology…"
            className="h-10 flex-1 px-3 rounded-lg border border-border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <button
            type="button"
            onClick={addTech}
            className="h-10 px-3 rounded-lg border border-border text-sm hover:bg-accent/50 transition-colors"
          >
            Add
          </button>
        </div>
        <input type="hidden" name="techStack" value={JSON.stringify(techs)} />
        <div className="flex flex-wrap gap-1.5 mt-1">
          {techs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => removeTech(t)}
              className="inline-flex items-center gap-1 text-xs border border-border rounded px-2 py-1 hover:bg-accent/50 transition-colors"
            >
              {t} <span className="text-muted-foreground">×</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Cover image URL</label>
          <input
            name="coverImage"
            defaultValue={initial.coverImage}
            placeholder="https://…"
            className="h-10 px-3 rounded-lg border border-border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">GitHub URL</label>
          <input
            name="githubUrl"
            defaultValue={initial.githubUrl}
            placeholder="https://github.com/…"
            className="h-10 px-3 rounded-lg border border-border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Live URL</label>
        <input
          name="liveUrl"
          defaultValue={initial.liveUrl}
          placeholder="https://…"
          className="h-10 px-3 rounded-lg border border-border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={initial.featured}
          className="h-4 w-4 rounded border-border"
        />
        Featured project
      </label>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Case study body (Markdown/MDX)</label>
        <textarea
          name="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={14}
          placeholder="## Overview&#10;&#10;Describe the project…"
          className="px-3 py-2 rounded-lg border border-border bg-background text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          {submitLabel}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="h-10 px-4 rounded-lg border border-border text-sm hover:bg-accent/50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
