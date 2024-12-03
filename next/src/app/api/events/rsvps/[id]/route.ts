import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Tambahkan Header CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
  
  export async function OPTIONS() {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  }
  
  // Handler DELETE
  export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
      const id = parseInt(params.id);
      if (isNaN(id)) {
        return NextResponse.json(
          { error: 'Invalid ID provided' },
          { status: 400, headers }
        );
      }
  
      // Periksa apakah RSVP ada
      const rsvp = await prisma.eventRSVP.findUnique({
        where: { id },
      });
  
      if (!rsvp) {
        return NextResponse.json(
          { error: 'RSVP not found' },
          { status: 404, headers }
        );
      }
  
      // Hapus RSVP
      await prisma.eventRSVP.delete({
        where: { id },
      });
  
      return NextResponse.json(
        { message: 'RSVP deleted successfully' },
        { status: 200, headers }
      );
    } catch (error) {
      console.error('Error deleting RSVP:', error);
      return NextResponse.json(
        { error: 'Error deleting RSVP' },
        { status: 500, headers }
      );
    }
  }
  
  // Handler POST untuk membuat RSVP baru
  export async function POST(request: Request, { params }: { params: { id: string } }) {
    try {
      const data = await request.json();
      const eventId = parseInt(params.id);
  
      // Validasi event ID
      if (isNaN(eventId)) {
        return NextResponse.json(
          { error: 'Invalid event ID' },
          { status: 400, headers }
        );
      }
  
      // Cek apakah event ada
      const event = await prisma.event.findUnique({
        where: { id: eventId },
        include: { rsvps: true },
      });
  
      if (!event) {
        return NextResponse.json(
          { error: 'Event not found' },
          { status: 404, headers }
        );
      }
  
      // Cek kapasitas event
      const currentAttendees = event.rsvps.reduce((sum, rsvp) => sum + rsvp.guests, 0);
      if (event.capacity && currentAttendees + data.guests > event.capacity) {
        return NextResponse.json(
          { error: 'Event has reached maximum capacity' },
          { status: 400, headers }
        );
      }
  
      // Buat RSVP
      const rsvp = await prisma.eventRSVP.create({
        data: {
          eventId,
          name: data.name,
          email: data.email,
          guests: data.guests,
        },
      });
  
      return NextResponse.json(rsvp, { status: 201, headers });
    } catch (error) {
      console.error('Error creating RSVP:', error);
      return NextResponse.json(
        { error: 'Error creating RSVP' },
        { status: 500, headers }
      );
    }
  }
  
  export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
  ) {
    // Add CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    };
  
    // Handle preflight request
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers });
    }
  
    try {
      const data = await request.json();
      const id = parseInt(params.id);
  
      const rsvp = await prisma.eventRSVP.update({
        where: { id },
        data: { status: data.status }
      });
  
      return NextResponse.json(rsvp, { headers });
    } catch (error) {
      return NextResponse.json(
        { error: 'Error updating RSVP status' },
        { status: 500, headers }
      );
    }
  }