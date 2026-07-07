import { adminClient } from "@/lib/admin-client";
import { isAuthenticated } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/project-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = { title: "Admin · Edit Project" };

interface AdminProject {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  tech_stack: string[];
  featured: boolean;
  cover_image: string | null;
  github_url: string | null;
  live_url: string | null;
  published_at: string;
  body: string;
}

async function updateProject(id: string, formData: FormData) {
  "use server";
  const techStack = JSON.parse((formData.get("techStack") as string) || "[]");
  const supabase = adminClient();
  await supabase
    .from("admin_projects")
    .update({
      title: formData.get("title"),
      slug: formData.get("slug"),
      description: formData.get("description"),
      category: formData.get("category"),
      tech_stack: techStack,
      featured: formData.get("featured") === "on",
      cover_image: formData.get("coverImage") || null,
      github_url: formData.get("githubUrl") || null,
      live_url: formData.get("liveUrl") || null,
      published_at: formData.get("publishedAt"),
      body: formData.get("body") || "",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  redirect("/admin/projects");
}

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAuthenticated())) redirect("/admin/login");

  const { id } = await params;
  const supabase = adminClient();
  const { data } = await supabase
    .from("admin_projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();
  const p = data as unknown as AdminProject;

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <Link
          href="/admin/projects"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 mb-3"
        >
          <ChevronLeft className="size-3" /> Back to projects
        </Link>
        <h1 className="text-xl font-semibold tracking-tight">Edit project</h1>
      </div>
      <EditFormWrapper id={p.id} initial={p} />
    </div>
  );
}

function EditFormWrapper({ id, initial }: { id: string; initial: AdminProject }) {
  const action = updateProject.bind(null, id);
  return (
    <ProjectForm
      action={action}
      submitLabel="Save changes"
      initial={{
        title: initial.title,
        slug: initial.slug,
        description: initial.description,
        category: initial.category,
        techStack: initial.tech_stack,
        featured: initial.featured,
        coverImage: initial.cover_image ?? undefined,
        githubUrl: initial.github_url ?? undefined,
        liveUrl: initial.live_url ?? undefined,
        publishedAt: initial.published_at,
        body: initial.body,
      }}
    />
  );
}
