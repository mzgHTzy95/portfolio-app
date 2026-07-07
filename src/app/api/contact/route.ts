import { NextRequest, NextResponse } from 'next/server';
import { createContactSubmission, getAllContactSubmissions, getContactSubmissionById, updateContactSubmission, deleteContactSubmission } from '@/lib/db';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(1),
});

export async function GET(request: NextRequest) {
  // In a real app, you'd check admin authentication here
  try {
    const submissions = getAllContactSubmissions();
    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = contactSchema.parse(body);
    const submission = createContactSubmission(data);
    
    // TODO: Send email notification here
    console.log('[v0] Contact submission received:', submission);
    
    return NextResponse.json({ success: true, id: submission.id }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error creating contact submission:', error);
    return NextResponse.json({ error: 'Failed to create submission' }, { status: 500 });
  }
}
