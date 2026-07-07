import { adminClient } from "@/lib/admin-client";
import { isAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Admin · Blog" };

interface AdminPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  tags: string[];
  featured: boolean;
  published_at: string;
}

async function deletePost(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const supabase = adminClient();
  await supabase.from("admin_posts").delete().eq("id", id);
  redirect("/admin/blog");
}

export default async function AdminBlogPage() {
  if (!(await isAuthenticated())) redirect("/admin/login");

  const supabase = adminClient();
  const { data } = await supabase
    .from("admin_posts")
    .select("*")
    .order("created_at", { ascending: false });

  const posts = (data ?? []) as unknown as AdminPost[];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Blog posts</h1>
          <p className="text-sm text-muted-foreground">
            {posts.length} managed post{posts.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" /> New
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="border border-border rounded-xl p-8 text-center">
          <p className="text-muted-foreground text-sm">
            No managed posts yet. Create one to get started.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {posts.map((p) => (
            <div
              key={p.id}
              className="flex items-start gap-3 border border-border rounded-lg p-4 hover:bg-accent/30 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium truncate">{p.title}</h3>
                  {p.featured && (
                    <Badge className="bg-primary text-primary-foreground text-[10px]">
                      Featured
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                  {p.summary}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {p.tags.slice(0, 3).map((t) => (
                    <Badge key={t} variant="outline" className="text-[10px]">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Link
                  href={`/admin/blog/${p.id}`}
                  className="h-8 w-8 flex items-center justify-center rounded-lg border border-border hover:bg-accent/50 transition-colors"
                  aria-label="Edit"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Link>
                <form action={deletePost}>
                  <input type="hidden" name="id" value={p.id} />
                  <button
                    type="submit"
                    className="h-8 w-8 flex items-center justify-center rounded-lg border border-border hover:bg-destructive/10 hover:text-destructive transition-colors"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
