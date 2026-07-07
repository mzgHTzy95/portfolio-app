import { adminClient } from "@/lib/admin-client";
import { isAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PostForm } from "@/components/admin/post-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = { title: "Admin · New Post" };

async function createPost(formData: FormData) {
  "use server";
  const tags = JSON.parse((formData.get("tags") as string) || "[]");
  const supabase = adminClient();
  await supabase.from("admin_posts").insert({
    title: formData.get("title"),
    slug: formData.get("slug"),
    summary: formData.get("summary"),
    tags,
    published_at: formData.get("publishedAt"),
    featured: formData.get("featured") === "on",
    body: formData.get("body") || "",
  });
  redirect("/admin/blog");
}

export default async function NewPostPage() {
  if (!(await isAuthenticated())) redirect("/admin/login");

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <Link
          href="/admin/blog"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 mb-3"
        >
          <ChevronLeft className="size-3" /> Back to posts
        </Link>
        <h1 className="text-xl font-semibold tracking-tight">New blog post</h1>
      </div>
      <PostForm action={createPost} submitLabel="Create post" />
    </div>
  );
}
