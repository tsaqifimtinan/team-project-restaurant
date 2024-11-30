import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const reservation = await prisma.reservation.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        date: new Date(data.date),
        time: data.time,
        guests: parseInt(data.guests),
        specialRequests: data.specialRequests,
        status: 'pending'
      }
    });
    return NextResponse.json(reservation);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error creating reservation' },
      { status: 500 }
    );
  }
}