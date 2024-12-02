import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    // If date parameter is provided, return available time slots
    if (date) {
      const existingReservations = await prisma.reservation.findMany({
        where: {
          date: new Date(date),
        },
        select: {
          time: true,
        },
      });

      const allTimeSlots = [
        "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
        "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"
      ];

      const bookedTimes = existingReservations.map(r => r.time);
      const availableSlots = allTimeSlots.filter(time => !bookedTimes.includes(time));

      return NextResponse.json({ availableSlots });
    }

    // If no date parameter, return all reservations
    const reservations = await prisma.reservation.findMany({
      orderBy: {
        date: 'desc'
      }
    });

    return NextResponse.json(reservations);

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Error processing request' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate that the time slot is still available
    const existingReservation = await prisma.reservation.findFirst({
      where: {
        date: new Date(data.date),
        time: data.time,
      },
    });

    if (existingReservation) {
      return NextResponse.json(
        { error: 'This time slot is no longer available' },
        { status: 409 }
      );
    }

    // Create the reservation
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
    console.error('Error creating reservation:', error);
    return NextResponse.json(
      { error: 'Error creating reservation' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const reservation = await prisma.reservation.update({
      where: {
        id: parseInt(params.id)
      },
      data: {
        status: data.status
      }
    });

    return NextResponse.json(reservation);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error updating reservation' },
      { status: 500 }
    );
  }
}