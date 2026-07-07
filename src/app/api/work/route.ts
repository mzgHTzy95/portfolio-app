import { NextRequest, NextResponse } from 'next/server';
import { getAllWorkExperience, createWorkExperience } from '@/lib/db';
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

export async function GET() {
  try {
    const work = getAllWorkExperience();
    const parsed = work.map((item: any) => ({
      ...item,
      badges: Array.isArray(item.badges) ? item.badges : (item.badges ? JSON.parse(item.badges) : []),
    }));
    return NextResponse.json(parsed);
  } catch (error) {
    console.error('[v0] Error fetching work experience:', error);
    return NextResponse.json({ error: 'Failed to fetch work experience' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = workSchema.parse(body);
    const work = createWorkExperience(data);
    return NextResponse.json(work, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error creating work experience:', error);
    return NextResponse.json({ error: 'Failed to create work experience' }, { status: 500 });
  }
}
