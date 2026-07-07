"use client";
import { useEffect, useState } from "react";

interface WorkExperience {
  id: string;
  company: string;
  title: string;
  start: string;
  end: string;
}

export default function ExperienceAdmin() {
  const [work, setWork] = useState<WorkExperience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWork = async () => {
      try {
        const res = await fetch("/api/work");
        const data = await res.json();
        setWork(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("[v0] Error fetching work:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWork();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/work/${id}`, { method: "DELETE" });
      if (res.ok) setWork(work.filter(w => w.id !== id));
    } catch (err) {
      console.error("[v0] Error:", err);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Work Experience</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left">Company</th>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Period</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {work.map((w) => (
                <tr key={w.id} className="border-t hover:bg-muted/50">
                  <td className="px-4 py-3">{w.company}</td>
                  <td className="px-4 py-3">{w.title}</td>
                  <td className="px-4 py-3 text-muted-foreground text-sm">{w.start} - {w.end}</td>
                  <td className="px-4 py-3 space-x-2">
                    <a href={`/admin/experience/${w.id}`} className="text-blue-500 hover:underline text-sm">Edit</a>
                    <button onClick={() => handleDelete(w.id)} className="text-red-500 hover:underline text-sm">Delete</button>
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
