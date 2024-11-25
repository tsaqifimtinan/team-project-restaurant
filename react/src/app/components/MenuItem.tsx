// Create a new file: src/app/components/MenuItem.tsx
'use client';

import Image from "next/image";

type MenuItemProps = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

export default function MenuItem({ id, name, description, price, image }: MenuItemProps) {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
      <div className="relative h-48 w-full">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold">{name}</h3>
          <span className="text-lg">${price.toFixed(2)}</span>
        </div>
        <p className="text-gray-400 mb-4">{description}</p>
        <button 
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
          onClick={() => {
            console.log(`Ordered: ${name}`);
          }}
        >
          Add to Order
        </button>
      </div>
    </div>
  );
}