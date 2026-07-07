import { adminClient } from "@/lib/admin-client";
import { isAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ProjectForm } from "@/components/admin/project-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = { title: "Admin · New Project" };

async function createProject(formData: FormData) {
  "use server";
  const techStack = JSON.parse((formData.get("techStack") as string) || "[]");
  const supabase = adminClient();
  await supabase.from("admin_projects").insert({
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
  });
  redirect("/admin/projects");
}

export default async function NewProjectPage() {
  if (!(await isAuthenticated())) redirect("/admin/login");

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <Link
          href="/admin/projects"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 mb-3"
        >
          <ChevronLeft className="size-3" /> Back to projects
        </Link>
        <h1 className="text-xl font-semibold tracking-tight">New project</h1>
      </div>
      <ProjectForm action={createProject} submitLabel="Create project" />
    </div>
  );
}
