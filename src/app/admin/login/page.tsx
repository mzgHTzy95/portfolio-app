import { loginWithPassword, isAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Lock } from "lucide-react";

export const metadata = { title: "Admin Login" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const authed = await isAuthenticated();
  if (authed) redirect("/admin/projects");

  async function login(formData: FormData) {
    "use server";
    const password = formData.get("password") as string;
    const from = (formData.get("from") as string) || "/admin/projects";
    const ok = await loginWithPassword(password);
    if (!ok) redirect(`/admin/login?error=1&from=${encodeURIComponent(from)}`);
    redirect(from);
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <form action={login} className="w-full max-w-sm flex flex-col gap-4">
        <div className="flex flex-col items-center gap-2 mb-2">
          <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Admin Login</h1>
          <p className="text-sm text-muted-foreground text-center">
            Enter your password to manage content.
          </p>
        </div>
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          autoFocus
          className="h-10 px-3 rounded-lg border border-border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <input type="hidden" name="from" value={(await searchParams).from || "/admin/projects"} />
        <button
          type="submit"
          className="h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
