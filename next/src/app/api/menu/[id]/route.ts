import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.menuItem.delete({
            where: {
                id: parseInt(params.id)
            }
        });
        return NextResponse.json({ message: 'Menu item deleted' });
    } catch (error) {
        return NextResponse.json(
            { error: 'Error deleting menu item' },
            { status: 500 }
        );
    }
}