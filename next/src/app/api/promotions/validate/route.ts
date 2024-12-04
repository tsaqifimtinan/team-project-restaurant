// src/app/api/promotions/validate/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { code, total, cart } = await request.json();

    const promotion = await prisma.promotion.findFirst({
      where: {
        code: code.toUpperCase(),
        isActive: true,
        validUntil: {
          gte: new Date()
        }
      }
    });

    if (!promotion) {
      return NextResponse.json(
        { error: 'Invalid or expired promotion code' },
        { status: 400 }
      );
    }

    // Extract required item from promo code
    // Assume promo codes for items end with "SPECIAL"
    // Example: CAKESPECIAL, PASTASPECIAL, etc.
    if (promotion.code.endsWith('HOUR')) {
        const requiredItem = promotion.code
          .replace('HOUR', '')
          .toLowerCase();
        
        const hasRequiredItem = cart.some(item => 
          item.name.toLowerCase().includes(requiredItem)
        );
  
        if (!hasRequiredItem) {
          return NextResponse.json(
            { error: `This promotion code requires ${requiredItem} in your cart` },
            { status: 400 }
          );
        }
      }

    // Calculate discount
    const discountAmount = promotion.discountAmount;
    let finalDiscount = 0;

    if (discountAmount.includes('%')) {
      const percentage = parseFloat(discountAmount) / 100;
      finalDiscount = total * percentage;
    } else {
      finalDiscount = parseFloat(discountAmount);
    }

    return NextResponse.json({ promotion, finalDiscount });
  } catch (error) {
    console.error('Error validating promotion:', error);
    return NextResponse.json(
      { error: 'Error validating promotion' },
      { status: 500 }
    );
  }
}