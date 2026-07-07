"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Stats {
  projects: number;
  work: number;
  education: number;
  messages: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    projects: 0,
    work: 0,
    education: 0,
    messages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projects, work, education, messages] = await Promise.all([
          fetch("/api/projects").then(r => r.json()),
          fetch("/api/work").then(r => r.json()),
          fetch("/api/education").then(r => r.json()),
          fetch("/api/contact").then(r => r.json()),
        ]);

        setStats({
          projects: Array.isArray(projects) ? projects.length : 0,
          work: Array.isArray(work) ? work.length : 0,
          education: Array.isArray(education) ? education.length : 0,
          messages: Array.isArray(messages) ? messages.length : 0,
        });
      } catch (err) {
        console.error("[v0] Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome to your portfolio admin panel</p>
      </div>

      {loading ? (
        <div className="text-muted-foreground">Loading statistics...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/admin/projects">
            <div className="border border-border rounded-lg p-6 hover:bg-muted transition-colors cursor-pointer">
              <div className="text-4xl font-bold">{stats.projects}</div>
              <div className="text-sm text-muted-foreground mt-1">Projects</div>
            </div>
          </Link>

          <Link href="/admin/experience">
            <div className="border border-border rounded-lg p-6 hover:bg-muted transition-colors cursor-pointer">
              <div className="text-4xl font-bold">{stats.work}</div>
              <div className="text-sm text-muted-foreground mt-1">Work Experience</div>
            </div>
          </Link>

          <Link href="/admin/education">
            <div className="border border-border rounded-lg p-6 hover:bg-muted transition-colors cursor-pointer">
              <div className="text-4xl font-bold">{stats.education}</div>
              <div className="text-sm text-muted-foreground mt-1">Education</div>
            </div>
          </Link>

          <Link href="/admin/messages">
            <div className="border border-border rounded-lg p-6 hover:bg-muted transition-colors cursor-pointer">
              <div className="text-4xl font-bold">{stats.messages}</div>
              <div className="text-sm text-muted-foreground mt-1">Messages</div>
            </div>
          </Link>
        </div>
      )}

      <div className="border border-border rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Quick Start</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Create, update, and delete portfolio items from the admin panels</li>
          <li>• All changes are saved to the database automatically</li>
          <li>• Contact form submissions appear in the Messages section</li>
          <li>• Use the API directly at /api/projects, /api/work, /api/education, /api/blog, /api/contact</li>
        </ul>
      </div>
    </div>
  );
}
