import Image from "next/image";
import Link from 'next/link';

// src/app/order/page.tsx
import MenuItem from '../components/MenuItem';

const menuItems = [
  {
    id: 1,
    name: "Signature Coffee",
    description: "Our house blend coffee, perfectly roasted and brewed",
    price: 4.50,
    image: "/coffee.jpg"
  },
  {
    id: 2,
    name: "Artisan Croissant",
    description: "Freshly baked butter croissant with a flaky, golden crust",
    price: 3.50,
    image: "/croissant.jpg"
  },
  {
    id: 3,
    name: "Avocado Toast",
    description: "Sourdough bread topped with fresh avocado, cherry tomatoes, and microgreens",
    price: 12.00,
    image: "/avocado-toast.jpg"
  },
  {
    id: 4,
    name: "Matcha Latte",
    description: "Premium grade matcha green tea with steamed milk and a touch of honey",
    price: 5.50,
    image: "/matcha.jpg"
  },
  {
    id: 5,
    name: "Eggs Benedict",
    description: "Poached eggs on English muffin with hollandaise sauce and smoked ham",
    price: 14.50,
    image: "/eggs-benedict.jpg"
  },
  {
    id: 6,
    name: "Quinoa Bowl",
    description: "Mixed grains with roasted vegetables, chickpeas, and tahini dressing",
    price: 13.50,
    image: "/quinoa-bowl.jpg"
  },
  {
    id: 7,
    name: "Berry Pancakes",
    description: "Fluffy buttermilk pancakes with fresh berries and maple syrup",
    price: 11.00,
    image: "/pancakes.jpg"
  },
  {
    id: 8,
    name: "Iced Chai Latte",
    description: "Spiced black tea blend with milk over ice and honey drizzle",
    price: 5.00,
    image: "/chai-latte.jpg"
  },
  {
    id: 9,
    name: "Classic Club Sandwich",
    description: "Triple-decker with turkey, bacon, lettuce, tomato, and mayo",
    price: 13.50,
    image: "/club-sandwich.jpg"
  }
];

export default function OrderPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h1 className="text-4xl sm:text-6xl font-bold mb-6">Order Online</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {menuItems.map((item) => (
            <MenuItem key={item.id} {...item} />
          ))}
        </div>
      </main>
    </div>
  );
}