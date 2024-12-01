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