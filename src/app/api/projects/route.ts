import { NextRequest, NextResponse } from 'next/server';
import { getAllProjects, createProject } from '@/lib/db';
import { z } from 'zod';

const projectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  dates: z.string().min(1),
  active: z.boolean().optional(),
  technologies: z.array(z.string()).optional(),
  links: z.array(z.object({
    type: z.string(),
    href: z.string(),
  })).optional(),
  video: z.string().optional(),
  image: z.string().optional(),
});

export async function GET() {
  try {
    const projects = getAllProjects();
    const parsed = projects.map((project: any) => ({
      ...project,
      technologies: Array.isArray(project.technologies) ? project.technologies : (project.technologies ? JSON.parse(project.technologies) : []),
      links: Array.isArray(project.links) ? project.links : (project.links ? JSON.parse(project.links) : []),
      active: Boolean(project.active),
    }));
    return NextResponse.json(parsed);
  } catch (error) {
    console.error('[v0] Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = projectSchema.parse(body);
    const project = createProject(data);
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
