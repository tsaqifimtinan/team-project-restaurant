import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Add OPTIONS handler for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}

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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID provided' },
        { status: 400, headers }
      );
    }

    // Delete the RSVP
    await prisma.eventRSVP.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: 'RSVP deleted successfully' },
      { headers }
    );
  } catch (error) {
    console.error('Error deleting RSVP:', error);
    return NextResponse.json(
      { error: 'Error deleting RSVP' },
      { status: 500, headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }}
    );
  }
}