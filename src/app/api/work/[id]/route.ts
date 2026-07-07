import { NextRequest, NextResponse } from 'next/server';
import { getWorkById, updateWorkExperience, deleteWorkExperience } from '@/lib/db';
import { z } from 'zod';

const workSchema = z.object({
  company: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  location: z.string().optional(),
  badges: z.array(z.string()).optional(),
  logoUrl: z.string().optional(),
  href: z.string().optional(),
  start: z.string().min(1),
  end: z.string().min(1),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const work = getWorkById(id);
    if (!work) {
      return NextResponse.json({ error: 'Work experience not found' }, { status: 404 });
    }
    return NextResponse.json({
      ...work,
      badges: Array.isArray(work.badges) ? work.badges : (work.badges ? JSON.parse(work.badges) : []),
    });
  } catch (error) {
    console.error('[v0] Error fetching work experience:', error);
    return NextResponse.json({ error: 'Failed to fetch work experience' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = workSchema.parse(body);
    updateWorkExperience(id, data);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error updating work experience:', error);
    return NextResponse.json({ error: 'Failed to update work experience' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    deleteWorkExperience(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting work experience:', error);
    return NextResponse.json({ error: 'Failed to delete work experience' }, { status: 500 });
  }
}
