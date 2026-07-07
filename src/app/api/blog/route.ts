import { NextRequest, NextResponse } from 'next/server';
import { getAllBlogPosts, createBlogPost } from '@/lib/db';
import { z } from 'zod';

const blogSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  publishedAt: z.number().optional(),
  featured: z.boolean().optional(),
});

export async function GET() {
  try {
    const posts = getAllBlogPosts();
    const parsed = posts.map((post: any) => ({
      ...post,
      featured: Boolean(post.featured),
    }));
    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = blogSchema.parse(body);
    const post = createBlogPost(data);
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error creating blog post:', error);
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}
