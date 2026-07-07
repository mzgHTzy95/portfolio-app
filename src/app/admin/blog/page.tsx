"use client";
import { useEffect, useState } from "react";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  featured: boolean;
}

export default function BlogAdmin() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/blog");
        const data = await res.json();
        setPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("[v0] Error fetching blog posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/blog/${id}`, { method: "DELETE" });
      if (res.ok) setPosts(posts.filter(p => p.id !== id));
    } catch (err) {
      console.error("[v0] Error:", err);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Blog Posts</h1>
      {loading ? (
        <div>Loading...</div>
      ) : posts.length === 0 ? (
        <div className="text-muted-foreground">No blog posts yet</div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Slug</th>
                <th className="px-4 py-3 text-left">Featured</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-t hover:bg-muted/50">
                  <td className="px-4 py-3">{post.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{post.slug}</td>
                  <td className="px-4 py-3">
                    <span className={post.featured ? 'text-green-600' : 'text-gray-500'}>
                      {post.featured ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    <a href={`/admin/blog/${post.id}`} className="text-blue-500 hover:underline text-sm">Edit</a>
                    <button onClick={() => handleDelete(post.id)} className="text-red-500 hover:underline text-sm">Delete</button>
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
