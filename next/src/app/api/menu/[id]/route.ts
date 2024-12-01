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
        updateData[key] = value;
      }
  
      // Convert price to float if it exists
      if (updateData.price) {
        updateData.price = parseFloat(updateData.price);
      }
  
      const updatedMenuItem = await prisma.menuItem.update({
        where: {
          id: parseInt(params.id)
        },
        data: updateData
      });
  
      return NextResponse.json(updatedMenuItem);
    } catch (error) {
      console.error('Error updating menu item:', error);
      return NextResponse.json(
        { error: 'Error updating menu item' },
        { status: 500 }
      );
    }
}

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