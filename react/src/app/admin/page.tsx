// src/app/admin/page.tsx
"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/prisma';

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
    const [items, setItems] = useState<MenuItem[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: '',
        image: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string>('');

    // Add useEffect to fetch menu items when component mounts
    useEffect(() => {
        fetchMenuItems();
    }, []);

    // Function to fetch menu items
    const fetchMenuItems = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/menu');
            if (response.ok) {
                const data = await response.json();
                setItems(data);
            }
        } catch (error) {
            console.error('Error fetching menu items:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Add file change handler
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          setSelectedFile(file);
          // Create preview URL
          const reader = new FileReader();
          reader.onloadend = () => {
              setFilePreview(reader.result as string);
          };
          reader.readAsDataURL(file);
      }
  };

  // Modify handleSubmit to include file upload
  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          const formDataToSend = new FormData();
          formDataToSend.append('name', formData.name);
          formDataToSend.append('price', formData.price);
          formDataToSend.append('description', formData.description);
          formDataToSend.append('category', formData.category);
          if (selectedFile) {
              formDataToSend.append('image', selectedFile);
          }

          const response = await fetch('http://localhost:3001/api/menu', {
              method: 'POST',
              body: formDataToSend
          });
        
          if (response.ok) {
              setFormData({
                  name: '',
                  price: '',
                  description: '',
                  category: '',
                  image: ''
              });
              setSelectedFile(null);
              setFilePreview('');
              fetchMenuItems();
          }
      } catch (error) {
          console.error('Error adding menu item:', error);
      }
  };

    // Add delete handler
    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:3001/api/menu/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                fetchMenuItems();
            }
        } catch (error) {
            console.error('Error deleting menu item:', error);
        }
    };

    // Add edit handler
    const handleEdit = async (item: MenuItem) => {
        setFormData({
            name: item.name,
            price: item.price.toString(),
            description: item.description,
            category: item.category,
            image: item.image || ''
        });
        setIsEditing(true);
    };
  
    return (
      <div className="space-y-8">
        <h2 className="text-2xl font-bold">Menu Management</h2>
        
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Item Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Item Name"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Price</label>
                <input
                  type="number"
                  name="price"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="Price"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
              </div>
        
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  placeholder="Category"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
              </div>
        
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Image</label>
                <div className="relative">
                  <input
                    type="file"
                    id="menu-image"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="menu-image"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
                  >
                    <FiUpload className="w-5 h-5" />
                    <span>{selectedFile ? selectedFile.name : 'Upload Image'}</span>
                  </label>
                </div>
              </div>
        
              <div className="space-y-2 col-span-full">
                <label className="text-sm text-gray-400">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  placeholder="Description"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
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
                    {isLoading ? (
                        <div className="p-4 text-center text-gray-400">Loading menu items...</div>
                    ) : items.length === 0 ? (
                        <div className="p-4 text-center text-gray-400">No menu items found</div>
                    ) : (
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
                                                    onClick={() => handleEdit(item)}
                                                >
                                                    <FiEdit2 className="w-5 h-5" />
                                                </button>
                                                <button 
                                                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-red-400 hover:text-red-300"
                                                    onClick={() => handleDelete(item.id)}
                                                >
                                                    <FiTrash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
      </div>
    );
}

// Event Management Component
function EventManager() {
  const [events, setEvents] = useState<Event[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    image: '',
    capacity: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setFormData({
          title: '',
          description: '',
          date: '',
          time: '',
          image: '',
          capacity: ''
        });
        // Refresh events list
      }
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Event Management</h2>
      
      {/* Event Form */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Event Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Time</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Capacity</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-gray-400">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-gray-400">Image URL</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Event
          </button>
        </form>
      </div>

      {/* Events List */}
      <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Capacity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {events.map((event) => (
                <tr key={event.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{event.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{event.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{event.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{event.capacity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <div className="flex gap-3">
                      <button className="text-blue-400 hover:text-blue-300">Edit</button>
                      <button className="text-red-400 hover:text-red-300">Delete</button>
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

// Promotion Management Component
function PromotionManager() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    validUntil: '',
    discountAmount: '',
    code: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/promotions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setFormData({
          title: '',
          description: '',
          validUntil: '',
          discountAmount: '',
          code: ''
        });
        // Refresh promotions list
      }
    } catch (error) {
      console.error('Error adding promotion:', error);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Promotion Management</h2>
      
      {/* Promotion Form */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Promotion Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Valid Until</label>
              <input
                type="date"
                name="validUntil"
                value={formData.validUntil}
                onChange={(e) => setFormData({...formData, validUntil: e.target.value})}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Discount Amount</label>
              <input
                type="text"
                name="discountAmount"
                value={formData.discountAmount}
                onChange={(e) => setFormData({...formData, discountAmount: e.target.value})}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="e.g., 20% or Free Dessert"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Promo Code</label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value})}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-gray-400">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Promotion
          </button>
        </form>
      </div>

      {/* Promotions List */}
      <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Discount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Valid Until</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {promotions.map((promo) => (
                <tr key={promo.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{promo.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{promo.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{promo.discountAmount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{promo.validUntil}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <div className="flex gap-3">
                      <button className="text-blue-400 hover:text-blue-300">Edit</button>
                      <button className="text-red-400 hover:text-red-300">Delete</button>
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