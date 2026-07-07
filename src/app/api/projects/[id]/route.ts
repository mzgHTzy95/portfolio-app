import { NextRequest, NextResponse } from 'next/server';
import { getProjectById, updateProject, deleteProject } from '@/lib/db';
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = getProjectById(id);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json({
      ...project,
      technologies: Array.isArray(project.technologies) ? project.technologies : (project.technologies ? JSON.parse(project.technologies) : []),
      links: Array.isArray(project.links) ? project.links : (project.links ? JSON.parse(project.links) : []),
      active: Boolean(project.active),
    });
  } catch (error) {
    console.error('[v0] Error fetching project:', error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = projectSchema.parse(body);
    updateProject(id, data);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    deleteProject(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
