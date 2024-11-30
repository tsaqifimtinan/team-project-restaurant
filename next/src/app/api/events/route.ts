import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const event = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        date: new Date(data.date),
        time: data.time,
        capacity: parseInt(data.capacity),
        image: data.image
      }
    });
    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error creating event' },
      { status: 500 }
    );
  }
}