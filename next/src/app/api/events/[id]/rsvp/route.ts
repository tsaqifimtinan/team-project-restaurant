import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const eventId = parseInt(params.id);

    // Check if event exists and has capacity
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { rsvps: true }
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Check if event has reached capacity
    const currentAttendees = event.rsvps.reduce((sum, rsvp) => sum + rsvp.guests, 0);
    if (event.capacity && currentAttendees + data.guests > event.capacity) {
      return NextResponse.json(
        { error: 'Event has reached maximum capacity' },
        { status: 400 }
      );
    }

    // Create RSVP
    const rsvp = await prisma.eventRSVP.create({
      data: {
        eventId,
        name: data.name,
        email: data.email,
        guests: data.guests
      }
    });

    return NextResponse.json(rsvp);
  } catch (error) {
    console.error('Error creating RSVP:', error);
    return NextResponse.json(
      { error: 'Error creating RSVP' },
      { status: 500 }
    );
  }
}