
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { feedbackId, userFeedback, rating, comment } = await req.json();

    if (!feedbackId) {
      return NextResponse.json({ error: 'Feedback ID is required' }, { status: 400 });
    }

    // 3. Atualize o registro com o feedback do usuário
    const updatedFeedback = await prisma.feedback.update({
      where: { id: feedbackId },
      data: {
        userFeedback,
        rating,
        comment,
      },
    });

    return NextResponse.json({ message: 'Feedback received successfully', updatedFeedback }, { status: 200 });

  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}