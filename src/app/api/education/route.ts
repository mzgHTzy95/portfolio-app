import { NextRequest, NextResponse } from 'next/server';
import { getAllEducation, createEducation } from '@/lib/db';
import { z } from 'zod';

const educationSchema = z.object({
  school: z.string().min(1),
  degree: z.string().min(1),
  logoUrl: z.string().optional(),
  href: z.string().optional(),
  start: z.string().min(1),
  end: z.string().min(1),
});

export async function GET() {
  try {
    const education = getAllEducation();
    return NextResponse.json(education);
  } catch (error) {
    console.error('Error fetching education:', error);
    return NextResponse.json({ error: 'Failed to fetch education' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = educationSchema.parse(body);
    const edu = createEducation(data);
    return NextResponse.json(edu, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error creating education:', error);
    return NextResponse.json({ error: 'Failed to create education' }, { status: 500 });
  }
}
