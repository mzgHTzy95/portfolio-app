"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Project {
  id: string;
  title: string;
  dates: string;
  active: boolean;
}

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("[v0] Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects(projects.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error("[v0] Error deleting project:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Link href="/admin/projects/new">
          <Button>Add Project</Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-muted-foreground">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="text-muted-foreground">No projects found</div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Title</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Dates</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Active</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-t border-border hover:bg-muted/50">
                  <td className="px-4 py-3 text-sm">{project.title}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{project.dates}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${project.active ? 'bg-green-500/20 text-green-700 dark:text-green-400' : 'bg-gray-500/20 text-gray-700 dark:text-gray-400'}`}>
                      {project.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm space-x-2">
                    <Link href={`/admin/projects/${project.id}`} className="text-blue-500 hover:underline">
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
