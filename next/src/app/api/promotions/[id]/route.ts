import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

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
            if (key === 'validUntil') {
                updateData[key] = new Date(value as string);
            } else {
                updateData[key] = value;
            }
        }

        const updatedPromotion = await prisma.promotion.update({
            where: {
                id: parseInt(params.id)
            },
            data: {
                title: updateData.title,
                description: updateData.description,
                validUntil: updateData.validUntil,
                discountAmount: updateData.discountAmount,
                code: updateData.code,
                isActive: updateData.isActive !== undefined ? 
                    updateData.isActive === 'true' : true
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

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Soft delete by setting isActive to false
        const updatedPromotion = await prisma.promotion.update({
            where: {
                id: parseInt(params.id)
            },
            data: {
                isActive: false
            }
        });

        return NextResponse.json({ 
            message: 'Promotion deleted successfully',
            promotion: updatedPromotion
        });
    } catch (error) {
        console.error('Error deleting promotion:', error);
        return NextResponse.json(
            { error: 'Error deleting promotion' },
            { status: 500 }
        );
    }
}