import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const menuItems = await prisma.menuItem.findMany();
        return NextResponse.json(menuItems);
    } catch (error) {
        return NextResponse.json(
            { error: 'Error fetching menu items' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const menuItem = await prisma.menuItem.create({
            data: {
                name: data.name,
                price: parseFloat(data.price),
                description: data.description,
                category: data.category,
                image: data.image
            }
        });
        return NextResponse.json(menuItem);
    } catch (error) {
        return NextResponse.json(
            { error: 'Error creating menu item' },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const data = await request.json();
        const { id, ...updateData } = data;

        // Convert price to float if it exists
        if (updateData.price) {
            updateData.price = parseFloat(updateData.price);
        }

        const updatedMenuItem = await prisma.menuItem.update({
            where: {
                id: parseInt(id)
            },
            data: updateData
        });

        return NextResponse.json(updatedMenuItem);
    } catch (error) {
        return NextResponse.json(
            { error: 'Error updating menu item' },
            { status: 500 }
        );
    }
}