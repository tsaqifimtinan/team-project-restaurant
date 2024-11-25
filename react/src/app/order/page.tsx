"use client";
import Image from "next/image";
import Link from 'next/link';
import { useState } from 'react';
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
  const [cart, setCart] = useState<{
    id: number;
    name: string;
    price: number;
    quantity: number;
  }[]>([]);

  const addToCart = (item: typeof menuItems[0]) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex justify-between items-center mb-12">
          <Link href="/">
            <h1 className="text-4xl sm:text-6xl font-bold hover:text-blue-400 transition-colors cursor-pointer">
              Order Online
            </h1>
          </Link>
          
          <Link href="/cart" className="relative group">
            <div className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-full hover:bg-blue-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="font-semibold">{cartItemCount}</span>
              {cartItemCount > 0 && (
                <span className="ml-2 hidden group-hover:inline">
                  ${cartTotal.toFixed(2)}
                </span>
              )}
            </div>
          </Link>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {menuItems.map((item) => (
            <MenuItem 
              key={item.id} 
              {...item} 
              onAddToCart={() => addToCart(item)}
              quantity={cart.find(cartItem => cartItem.id === item.id)?.quantity || 0}
            />
          ))}
        </div>
      </main>
    </div>
  );
}