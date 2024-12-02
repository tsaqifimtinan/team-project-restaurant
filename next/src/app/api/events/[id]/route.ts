import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const formData = await request.formData();
        const updateData: any = {};

        // Extract data from FormData
        for (const [key, value] of formData.entries()) {
            if (key === 'date') {
                updateData[key] = new Date(value as string);
            } else if (key === 'capacity') {
                updateData[key] = parseInt(value as string);
            } else if (key === 'image' && value instanceof File) {
                // Handle image upload
                const bytes = await value.arrayBuffer();
                const buffer = Buffer.from(bytes);
                const filename = `${Date.now()}-${value.name}`;
                const filepath = path.join(process.cwd(), 'public/uploads', filename);
                
                await writeFile(filepath, buffer);
                updateData[key] = `/uploads/${filename}`;
            } else {
                updateData[key] = value;
            }
        }

        const updatedEvent = await prisma.event.update({
            where: {
                id: parseInt(params.id)
            },
            data: updateData
        });

        return NextResponse.json(updatedEvent);
    } catch (error) {
        console.error('Error updating event:', error);
        return NextResponse.json(
            { error: 'Error updating event' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.event.delete({
            where: {
                id: parseInt(params.id)
            }
        });
        return NextResponse.json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        return NextResponse.json(
            { error: 'Error deleting event' },
            { status: 500 }
        );
    }
}