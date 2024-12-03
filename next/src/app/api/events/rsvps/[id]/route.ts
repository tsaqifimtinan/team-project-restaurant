import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };

  try {
    const data = await request.json();
    const rsvp = await prisma.eventRSVP.update({
      where: { id: parseInt(params.id) },
      data: { status: data.status }
    });

    return NextResponse.json(rsvp, { headers });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error updating RSVP' },
      { status: 500, headers }
    );
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };

  try {
    const data = await request.json();
    const rsvp = await prisma.eventRSVP.update({
      where: { id: parseInt(params.id) },
      data: { status: data.status }
    });

    return NextResponse.json(rsvp, { headers });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error updating RSVP' },
      { status: 500, headers }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}