import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        date: 'asc'
      }
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Error fetching events' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    console.log('Received data:', formData);

    // Test database connection
    await prisma.$connect();
    console.log('Database connected');

    const event = await prisma.event.create({
      data: {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        date: new Date(formData.get('date') as string),
        time: formData.get('time') as string,
        capacity: parseInt(formData.get('capacity') as string),
        image: '',
      }
    });

    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error('Detailed server error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    const updatedEvent = await prisma.event.update({
      where: {
        id: parseInt(id)
      },
      data: {
        title: updateData.title,
        description: updateData.description,
        date: new Date(updateData.date),
        time: updateData.time,
        capacity: parseInt(updateData.capacity),
        image: updateData.image
      }
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Error updating event' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    await prisma.event.delete({
      where: {
        id: parseInt(id)
      }
    });

    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Error deleting event' },
      { status: 500 }
    );
  }
}