"use client";
import { useEffect, useState } from "react";

interface Education {
  id: string;
  school: string;
  degree: string;
}

export default function EducationAdmin() {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const res = await fetch("/api/education");
        const data = await res.json();
        setEducation(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("[v0] Error fetching education:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/education/${id}`, { method: "DELETE" });
      if (res.ok) setEducation(education.filter(e => e.id !== id));
    } catch (err) {
      console.error("[v0] Error:", err);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Education</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left">School</th>
                <th className="px-4 py-3 text-left">Degree</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {education.map((edu) => (
                <tr key={edu.id} className="border-t hover:bg-muted/50">
                  <td className="px-4 py-3">{edu.school}</td>
                  <td className="px-4 py-3 text-muted-foreground">{edu.degree}</td>
                  <td className="px-4 py-3 space-x-2">
                    <a href={`/admin/education/${edu.id}`} className="text-blue-500 hover:underline text-sm">Edit</a>
                    <button onClick={() => handleDelete(edu.id)} className="text-red-500 hover:underline text-sm">Delete</button>
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
