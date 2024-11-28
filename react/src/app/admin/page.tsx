// src/app/admin/page.tsx
"use client";
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// You can use React Icons instead of Lucide
import { FiUpload, FiEdit2, FiTrash2 } from 'react-icons/fi';

interface MenuItem {
    id: number;
    name: string;
    price: number;
    description: string;
    category: string;
    image?: string;
  }

type TabType = 'menu' | 'events' | 'promotions';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('menu');

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="fixed w-64 h-full bg-gray-800 p-4">
        <div className="mb-8">
            <Link href="/">
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
            </Link>
        </div>
        <nav>
          <ul className="space-y-2">
            {(['menu', 'events', 'promotions'] as TabType[]).map((tab) => (
              <li key={tab}>
                <button
                  onClick={() => setActiveTab(tab)}
                  className={`w-full text-left px-4 py-2 rounded ${
                    activeTab === tab ? 'bg-blue-600' : 'hover:bg-gray-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {activeTab === 'menu' && <MenuManager />}
        {activeTab === 'events' && <EventManager />}
        {activeTab === 'promotions' && <PromotionManager />}
      </div>
    </div>
  );
}

// Menu Management Component
function MenuManager() {
    const [items, setItems] = useState<MenuItem[]>([
      { id: 1, name: 'Signature Coffee', price: 4.50, description: 'Our house blend coffee', category: 'Drinks' }
    ]);
    const [formData, setFormData] = useState<Partial<MenuItem>>({});
    const [isEditing, setIsEditing] = useState(false);
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Add your submit logic here
    };
  
    return (
      <div className="space-y-8">
        <h2 className="text-2xl font-bold">Menu Management</h2>
        
        {/* Improved Form */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Item Name</label>
                <input
                  type="text"
                  placeholder="Item Name"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Price</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Price"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
  
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Category</label>
                <input
                  type="text"
                  placeholder="Category"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
  
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Image</label>
                <div className="relative">
                  <input
                    type="file"
                    className="hidden"
                    id="menu-image"
                    accept="image/*"
                  />
                  <label
                    htmlFor="menu-image"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
                  >
                    <FiUpload className="w-5 h-5" />
                    <span>Upload Image</span>
                  </label>
                </div>
              </div>
  
              <div className="space-y-2 col-span-full">
                <label className="text-sm text-gray-400">Description</label>
                <textarea
                  rows={4}
                  placeholder="Description"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>
  
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              {isEditing ? 'Update Item' : 'Add Item'}
            </button>
          </form>
        </div>
  
        {/* Improved Table */}
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {items.map(item => (
                  <tr key={item.id} className="hover:bg-gray-750">
                    <td className="px-6 py-4">{item.name}</td>
                    <td className="px-6 py-4">${item.price.toFixed(2)}</td>
                    <td className="px-6 py-4">{item.category}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <button 
                          className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-blue-400 hover:text-blue-300"
                          onClick={() => {/* Edit logic */}}
                        >
                          <FiEdit2 className="w-5 h-5" />
                        </button>
                        <button 
                          className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-red-400 hover:text-red-300"
                          onClick={() => {/* Delete logic */}}
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
}

// Event Management Component
function EventManager() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Event Management</h2>
      {/* Similar CRUD interface for events */}
    </div>
  );
}

// Promotion Management Component
function PromotionManager() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Promotion Management</h2>
      {/* Similar CRUD interface for promotions */}
    </div>
  );
}