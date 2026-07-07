import { NextRequest, NextResponse } from 'next/server';
import { getEducationById, updateEducation, deleteEducation } from '@/lib/db';
import { z } from 'zod';

const educationSchema = z.object({
  school: z.string().min(1),
  degree: z.string().min(1),
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
    const edu = getEducationById(id);
    if (!edu) {
      return NextResponse.json({ error: 'Education not found' }, { status: 404 });
    }
    return NextResponse.json(edu);
  } catch (error) {
    console.error('Error fetching education:', error);
    return NextResponse.json({ error: 'Failed to fetch education' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = educationSchema.parse(body);
    updateEducation(id, data);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error updating education:', error);
    return NextResponse.json({ error: 'Failed to update education' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    deleteEducation(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting education:', error);
    return NextResponse.json({ error: 'Failed to delete education' }, { status: 500 });
  }
}
