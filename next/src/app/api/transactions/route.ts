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

// Create new transaction
export async function POST(request: Request) {
    try {
        const data = await request.json();
        
        // Generate unique order number (timestamp + random string)
        const orderNumber = `ORD${Date.now()}${Math.random().toString(36).substring(2, 7)}`.toUpperCase();
        
        const transaction = await prisma.transaction.create({
            data: {
                orderNumber,
                items: data.cart, // Store cart items as JSON
                subtotal: data.subtotal,
                tax: data.tax,
                total: data.total,
                status: 'pending',
                paymentMethod: data.paymentMethod,
                customerName: data.name,
                customerEmail: data.email
            }
        });

        return NextResponse.json(transaction);
    } catch (error) {
        console.error('Error creating transaction:', error);
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