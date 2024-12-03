import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      include: {
        rsvps: true
      },
      orderBy: {
        date: 'desc'
      }
    });
    
    // Format image URLs similarly to menu items
    const eventsWithFullImageUrl = events.map(event => ({
      ...event,
      image: event.image?.startsWith('/') ? event.image : `/uploads/${event.image}`
    }));

    return NextResponse.json(eventsWithFullImageUrl);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching events' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const data: any = {
      title: formData.get('title'),
      description: formData.get('description'),
      date: new Date(formData.get('date') as string),
      time: formData.get('time'),
      capacity: parseInt(formData.get('capacity') as string),
    };

    // Handle image upload
    const image = formData.get('image');
    if (image instanceof File) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${image.name}`;
      const filepath = path.join(process.cwd(), 'public/uploads', filename);
      await writeFile(filepath, buffer);
      data.image = `/uploads/${filename}`;
    }

    const event = await prisma.event.create({ data });
    return NextResponse.json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Error creating event' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData();
    const id = params.id;
    
    const updateData: any = {
      title: formData.get('title'),
      description: formData.get('description'),
      date: new Date(formData.get('date') as string),
      time: formData.get('time'),
      capacity: parseInt(formData.get('capacity') as string),
    };

    // Handle image upload
    const image = formData.get('image');
    if (image instanceof File) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${image.name}`;
      const filepath = path.join(process.cwd(), 'public/uploads', filename);
      await writeFile(filepath, buffer);
      updateData.image = `/uploads/${filename}`;
    }

    const updatedEvent = await prisma.event.update({
      where: {
        id: parseInt(id)
      },
      data: updateData
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