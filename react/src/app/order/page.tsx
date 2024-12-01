"use client";
import Image from "next/image";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import MenuItem from '../components/MenuItem';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

export default function OrderPage() {

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState<{
    id: number;
    name: string;
    price: number;
    quantity: number;
  }[]>([]);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/menu');
      if (response.ok) {
        const data = await response.json();
        // Format image URLs properly
        const formattedData = data.map(item => ({
          ...item,
          // If the image URL is not absolute, prepend the API base URL
          image: item.image.startsWith('http') 
            ? item.image 
            : `http://localhost:3001${item.image.startsWith('/') ? '' : '/'}${item.image}`
        }));
        setMenuItems(formattedData);
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = (item: MenuItem) => {
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
        
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Loading menu items...</p>
          </div>
        ) : menuItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No menu items available.</p>
          </div>
        ) : (
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
        )}
      </main>
    </div>
  );
}