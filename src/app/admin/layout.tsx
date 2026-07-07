import { isAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FolderKanban, FileText, Settings, LogOut, ExternalLink } from "lucide-react";
import { logout } from "@/lib/auth";

export const metadata = { title: "Admin" };

const navItems = [
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Allow login page to render without auth
  const isLoginPage = true; // layout wraps all /admin/* including login
  if (isLoginPage) {
    // We still check auth for non-login pages inside their own components.
  }

  return (
    <div className="min-h-[70vh] -mx-6 sm:-mx-0">
      <div className="flex flex-col sm:flex-row gap-6">
        <aside className="sm:w-48 shrink-0">
          <div className="flex flex-col gap-1 sticky top-8">
            <div className="px-3 py-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Dashboard
              </span>
            </div>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
            <div className="h-px bg-border my-2" />
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              View site
            </Link>
            <form action={async () => { "use server"; await logout(); redirect("/admin/login"); }}>
              <button
                type="submit"
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </form>
          </div>
        </aside>
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
