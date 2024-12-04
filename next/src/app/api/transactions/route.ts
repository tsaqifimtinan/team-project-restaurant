import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all transactions
export async function GET() {
    try {
        const transactions = await prisma.transaction.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        return NextResponse.json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return NextResponse.json(
            { error: 'Error fetching transactions' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Generate unique order number
    const orderNumber = `ORD${Date.now()}${Math.random().toString(36).substring(2, 7)}`.toUpperCase();
    
    const transactionData = {
      orderNumber,
      customerName: data.name,
      customerEmail: data.email,
      items: data.cart,
      subtotal: Number(data.subtotal),
      tax: Number(data.tax),
      total: Number(data.total), // This should be the final total after discount
      discountAmount: data.discountAmount ? Number(data.discountAmount) : 0,
      promoCode: data.promoCode || null,
      status: 'pending',
      paymentMethod: data.paymentMethod || 'card'
    };

    // Validate numeric values
    if (isNaN(transactionData.subtotal) || 
        isNaN(transactionData.tax) || 
        isNaN(transactionData.total)) {
      return NextResponse.json(
        { error: 'Invalid price values in transaction data' },
        { status: 400 }
      );
    }

    const transaction = await prisma.transaction.create({
      data: transactionData
    });

    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Transaction creation error:', error);
    return NextResponse.json(
      { error: 'Error creating transaction' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    // Add these headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
  
    // Handle OPTIONS preflight request
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers });
    }
  
    try {
      const data = await request.json();
      const transaction = await prisma.transaction.update({
        where: { id: parseInt(params.id) },
        data: { status: data.status }
      });
  
      return NextResponse.json(transaction, { headers });
    } catch (error) {
      return NextResponse.json(
        { error: 'Error updating transaction' },
        { status: 500, headers }
      );
    }
  }