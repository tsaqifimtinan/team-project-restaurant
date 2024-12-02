// src/app/api/promotions/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const promotions = await prisma.promotion.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      where: {
        isActive: true
      }
    });
    return NextResponse.json(promotions);
  } catch (error) {
    console.error('Error fetching promotions:', error);
    return NextResponse.json(
      { error: 'Error fetching promotions' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Check if code already exists
    const existingPromotion = await prisma.promotion.findUnique({
      where: {
        code: formData.get('code') as string
      }
    });

    if (existingPromotion) {
      return NextResponse.json(
        { error: 'Promotion code already exists' },
        { status: 400 }
      );
    }

    const promotion = await prisma.promotion.create({
      data: {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        validUntil: new Date(formData.get('validUntil') as string),
        discountAmount: formData.get('discountAmount') as string,
        code: formData.get('code') as string,
        isActive: true
      }
    });

    return NextResponse.json({ success: true, promotion });
  } catch (error) {
    console.error('Detailed server error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    return NextResponse.json({ 
      error: error.message || 'Error creating promotion'
    }, { 
      status: 500 
    });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    const updatedPromotion = await prisma.promotion.update({
      where: {
        id: parseInt(id)
      },
      data: {
        title: updateData.title,
        description: updateData.description,
        validUntil: new Date(updateData.validUntil),
        discountAmount: updateData.discountAmount,
        code: updateData.code,
        isActive: updateData.isActive
      }
    });

    return NextResponse.json(updatedPromotion);
  } catch (error) {
    console.error('Error updating promotion:', error);
    return NextResponse.json(
      { error: 'Error updating promotion' },
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
        { error: 'Promotion ID is required' },
        { status: 400 }
      );
    }

    // Using soft delete by updating isActive to false
    await prisma.promotion.update({
      where: {
        id: parseInt(id)
      },
      data: {
        isActive: false
      }
    });

    return NextResponse.json({ message: 'Promotion deleted successfully' });
  } catch (error) {
    console.error('Error deleting promotion:', error);
    return NextResponse.json(
      { error: 'Error deleting promotion' },
      { status: 500 }
    );
  }
}