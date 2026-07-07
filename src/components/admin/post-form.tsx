"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface PostFormProps {
  action: (formData: FormData) => void;
  initial?: {
    title?: string;
    slug?: string;
    summary?: string;
    tags?: string[];
    publishedAt?: string;
    featured?: boolean;
    body?: string;
  };
  submitLabel?: string;
}

export function PostForm({ action, initial = {}, submitLabel = "Save" }: PostFormProps) {
  const router = useRouter();
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(initial.tags ?? []);
  const [body, setBody] = useState(initial.body ?? "");
  const [showPreview, setShowPreview] = useState(false);

  function addTag() {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput("");
  }

  function removeTag(t: string) {
    setTags(tags.filter((x) => x !== t));
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
          placeholder="my-post"
          className="h-10 px-3 rounded-lg border border-border bg-background text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Summary</label>
        <textarea
          name="summary"
          defaultValue={initial.summary}
          required
          rows={2}
          className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Tags</label>
          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              placeholder="Add tag…"
              className="h-10 flex-1 px-3 rounded-lg border border-border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <button
              type="button"
              onClick={addTag}
              className="h-10 px-3 rounded-lg border border-border text-sm hover:bg-accent/50 transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <input type="hidden" name="tags" value={JSON.stringify(tags)} />
      <div className="flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => removeTag(t)}
            className="inline-flex items-center gap-1 text-xs border border-border rounded px-2 py-1 hover:bg-accent/50 transition-colors"
          >
            {t} <span className="text-muted-foreground">×</span>
          </button>
        ))}
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={initial.featured}
          className="h-4 w-4 rounded border-border"
        />
        Featured post
      </label>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Content (Markdown)</label>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPreview ? "Edit" : "Preview"}
          </button>
        </div>
        {showPreview ? (
          <div className="prose dark:prose-invert max-w-full min-h-[300px] p-4 rounded-lg border border-border bg-background text-sm">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
          </div>
        ) : (
          <textarea
            name="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={16}
            placeholder="Write your post in markdown…"
            className="px-3 py-2 rounded-lg border border-border bg-background text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        )}
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
