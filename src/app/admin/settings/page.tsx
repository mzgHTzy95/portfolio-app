import { adminClient } from "@/lib/admin-client";
import { isAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = { title: "Admin · Settings" };

interface Settings {
  key: string;
  name: string;
  bio: string;
  email: string;
  social_links: Record<string, string>;
}

async function saveSettings(formData: FormData) {
  "use server";
  const name = formData.get("name") as string;
  const bio = formData.get("bio") as string;
  const email = formData.get("email") as string;
  const github = formData.get("github") as string;
  const linkedin = formData.get("linkedin") as string;
  const x = formData.get("x") as string;
  const youtube = formData.get("youtube") as string;

  const socialLinks: Record<string, string> = {};
  if (github) socialLinks.github = github;
  if (linkedin) socialLinks.linkedin = linkedin;
  if (x) socialLinks.x = x;
  if (youtube) socialLinks.youtube = youtube;

  const supabase = adminClient();
  await supabase
    .from("admin_settings")
    .upsert({
      key: "profile",
      name,
      bio,
      email,
      social_links: socialLinks,
      updated_at: new Date().toISOString(),
    });
  redirect("/admin/settings");
}

export default async function SettingsPage() {
  if (!(await isAuthenticated())) redirect("/admin/login");

  const supabase = adminClient();
  const { data } = await supabase
    .from("admin_settings")
    .select("*")
    .eq("key", "profile")
    .maybeSingle();

  const s = (data ?? { name: "", bio: "", email: "", social_links: {} }) as Settings;
  const links = s.social_links ?? {};

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <Link
          href="/admin/projects"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 mb-3"
        >
          <ChevronLeft className="size-3" /> Dashboard
        </Link>
        <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Update your profile and social links.
        </p>
      </div>

      <form action={saveSettings} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Name</label>
          <input
            name="name"
            defaultValue={s.name}
            className="h-10 px-3 rounded-lg border border-border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Bio</label>
          <textarea
            name="bio"
            defaultValue={s.bio}
            rows={4}
            className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Email</label>
          <input
            name="email"
            type="email"
            defaultValue={s.email}
            className="h-10 px-3 rounded-lg border border-border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div className="h-px bg-border my-2" />
        <p className="text-sm font-medium">Social links</p>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">GitHub</label>
          <input
            name="github"
            defaultValue={links.github ?? ""}
            placeholder="https://github.com/…"
            className="h-10 px-3 rounded-lg border border-border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">LinkedIn</label>
          <input
            name="linkedin"
            defaultValue={links.linkedin ?? ""}
            placeholder="https://linkedin.com/…"
            className="h-10 px-3 rounded-lg border border-border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">X (Twitter)</label>
          <input
            name="x"
            defaultValue={links.x ?? ""}
            placeholder="https://x.com/…"
            className="h-10 px-3 rounded-lg border border-border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">YouTube</label>
          <input
            name="youtube"
            defaultValue={links.youtube ?? ""}
            placeholder="https://youtube.com/…"
            className="h-10 px-3 rounded-lg border border-border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <button
          type="submit"
          className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors w-fit"
        >
          Save settings
        </button>
      </form>
    </div>
  );
}
