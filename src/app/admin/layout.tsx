import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-muted/40 p-6">
        <h1 className="text-2xl font-bold mb-8">Portfolio Admin</h1>
        <nav className="space-y-2">
          <Link
            href="/admin"
            className="block px-4 py-2 rounded-lg hover:bg-background transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/projects"
            className="block px-4 py-2 rounded-lg hover:bg-background transition-colors"
          >
            Projects
          </Link>
          <Link
            href="/admin/experience"
            className="block px-4 py-2 rounded-lg hover:bg-background transition-colors"
          >
            Work Experience
          </Link>
          <Link
            href="/admin/education"
            className="block px-4 py-2 rounded-lg hover:bg-background transition-colors"
          >
            Education
          </Link>
          <Link
            href="/admin/blog"
            className="block px-4 py-2 rounded-lg hover:bg-background transition-colors"
          >
            Blog Posts
          </Link>
          <Link
            href="/admin/messages"
            className="block px-4 py-2 rounded-lg hover:bg-background transition-colors"
          >
            Contact Messages
          </Link>
          <Link
            href="/"
            className="block px-4 py-2 rounded-lg hover:bg-background transition-colors text-muted-foreground mt-8"
          >
            ← Back to Portfolio
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
