import { adminClient } from "@/lib/admin-client";
import { isAuthenticated } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { PostForm } from "@/components/admin/post-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = { title: "Admin · Edit Post" };

interface AdminPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  tags: string[];
  published_at: string;
  featured: boolean;
  body: string;
}

async function updatePost(id: string, formData: FormData) {
  "use server";
  const tags = JSON.parse((formData.get("tags") as string) || "[]");
  const supabase = adminClient();
  await supabase
    .from("admin_posts")
    .update({
      title: formData.get("title"),
      slug: formData.get("slug"),
      summary: formData.get("summary"),
      tags,
      published_at: formData.get("publishedAt"),
      featured: formData.get("featured") === "on",
      body: formData.get("body") || "",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  redirect("/admin/blog");
}

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAuthenticated())) redirect("/admin/login");

  const { id } = await params;
  const supabase = adminClient();
  const { data } = await supabase
    .from("admin_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();
  const p = data as unknown as AdminPost;
  const action = updatePost.bind(null, p.id);

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <Link
          href="/admin/blog"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 mb-3"
        >
          <ChevronLeft className="size-3" /> Back to posts
        </Link>
        <h1 className="text-xl font-semibold tracking-tight">Edit post</h1>
      </div>
      <PostForm
        action={action}
        submitLabel="Save changes"
        initial={{
          title: p.title,
          slug: p.slug,
          summary: p.summary,
          tags: p.tags,
          publishedAt: p.published_at,
          featured: p.featured,
          body: p.body,
        }}
      />
    </div>
  );
}
