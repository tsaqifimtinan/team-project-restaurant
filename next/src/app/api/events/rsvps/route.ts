import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const rsvps = await prisma.eventRSVP.findMany({
      include: {
        event: {
          select: {
            title: true
          }
        }
      }
    });
    return NextResponse.json(rsvps);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching RSVPs' },
      { status: 500 }
    );
  }
}