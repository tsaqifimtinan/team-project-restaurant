import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      );
    }

    // Get all time slots for the given date
    const existingReservations = await prisma.reservation.findMany({
      where: {
        date: new Date(date),
      },
      select: {
        time: true,
      },
    });

    // Define all possible time slots (restaurant operating hours)
    const allTimeSlots = [
      "11:00", "11:30", 
      "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
      "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"
    ];

    // Filter out booked time slots
    const bookedTimes = existingReservations.map(r => r.time);
    const availableSlots = allTimeSlots.filter(time => !bookedTimes.includes(time));

    return NextResponse.json({ availableSlots });
  } catch (error) {
    console.error('Error fetching available times:', error);
    return NextResponse.json(
      { error: 'Error fetching available times' },
      { status: 500 }
    );
  }
}