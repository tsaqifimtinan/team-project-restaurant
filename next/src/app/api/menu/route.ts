import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const menuItems = await prisma.menuItem.findMany();
        const itemsWithFullImageUrl = menuItems.map(item => ({
            ...item,
            image: item.image.startsWith('/') ? item.image : `/uploads/${item.image}`
        }));
        return NextResponse.json(itemsWithFullImageUrl);
    } catch (error) {
        return NextResponse.json(
            { error: 'Error fetching menu items' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const name = formData.get('name') as string;
        const price = formData.get('price') as string;
        const description = formData.get('description') as string;
        const category = formData.get('category') as string;
        const imageFile = formData.get('image') as File;

        let imagePath = '';
        if (imageFile) {
            // Create unique filename
            const bytes = await imageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const filename = `${Date.now()}-${imageFile.name}`;
            const filepath = path.join(process.cwd(), 'public/uploads', filename);
            
            // Save file
            await writeFile(filepath, buffer);
            imagePath = `/uploads/${filename}`;
        }

        const menuItem = await prisma.menuItem.create({
            data: {
                name,
                price: parseFloat(price),
                description,
                category,
                image: imagePath
            }
        });

        return NextResponse.json(menuItem);
    } catch (error) {
        console.error('Error creating menu item:', error);
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