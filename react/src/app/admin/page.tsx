// src/app/admin/page.tsx
"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { FiUpload, FiEdit2, FiTrash2 } from 'react-icons/fi';

interface MenuItem {
    id: number;
    name: string;
    price: number;
    description: string;
    category: string;
    image?: string;
  }

  type TabType = 'menu' | 'events' | 'promotions' | 'transactions' | 'reservations';

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
            {(['menu', 'events', 'promotions', 'transactions', 'reservations'] as TabType[]).map((tab) => (
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
        {activeTab === 'transactions' && <TransactionManager />}
        {activeTab === 'reservations' && <ReservationManager />}
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
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    const [editFormData, setEditFormData] = useState<Partial<MenuItem>>({});
    const [showEditModal, setShowEditModal] = useState(false);

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
    const handleEdit = (item: MenuItem) => {
      setEditingItem(item);
      setEditFormData({}); // Start with empty changes
      setShowEditModal(true);
    };
  
    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setEditFormData({
        ...editFormData,
        [e.target.name]: e.target.value
      });
    };
  
    const handleEditSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingItem) return;
    
      try {
        const formDataToSend = new FormData();
        // Only append changed fields
        Object.keys(editFormData).forEach(key => {
          if (editFormData[key] !== undefined) {
            formDataToSend.append(key, editFormData[key]!.toString());
          }
        });
    
        const response = await fetch(`http://localhost:3001/api/menu/${editingItem.id}`, {
          method: 'PUT',
          // Do not set Content-Type header when sending FormData
          body: formDataToSend
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const result = await response.json();
        if (result.error) {
          throw new Error(result.error);
        }
    
        setShowEditModal(false);
        setEditingItem(null);
        setEditFormData({});
        fetchMenuItems();
      } catch (error) {
        console.error('Error updating menu item:', error);
      }
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

            {showEditModal && editingItem && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-2xl mx-4">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold">Edit Menu Item</h3>
                    <button 
                      onClick={() => setShowEditModal(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleEditSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm text-gray-400">Item Name</label>
                        <input
                          type="text"
                          name="name"
                          defaultValue={editingItem.name}
                          onChange={handleEditChange}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm text-gray-400">Price</label>
                        <input
                          type="number"
                          name="price"
                          step="0.01"
                          min="0"
                          defaultValue={editingItem.price}
                          onChange={handleEditChange}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm text-gray-400">Category</label>
                        <input
                          type="text"
                          name="category"
                          defaultValue={editingItem.category}
                          onChange={handleEditChange}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm text-gray-400">Description</label>
                        <textarea
                          name="description"
                          defaultValue={editingItem.description}
                          onChange={handleEditChange}
                          rows={4}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                      <button
                        type="button"
                        onClick={() => setShowEditModal(false)}
                        className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
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

function TransactionManager() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/transactions');
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Transaction History</h2>

      <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Order #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{transaction.orderNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{transaction.customerName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${transaction.total.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      transaction.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      transaction.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{transaction.paymentMethod}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(transaction.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ReservationManager() {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/reservations');
      if (response.ok) {
        const data = await response.json();
        setReservations(data);
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/reservations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchReservations();
      }
    } catch (error) {
      console.error('Error updating reservation:', error);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Reservation Management</h2>

      <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Guests</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {reservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{reservation.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {new Date(reservation.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{reservation.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{reservation.guests}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      reservation.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                      reservation.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {reservation.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <select 
                      value={reservation.status}
                      onChange={(e) => handleStatusChange(reservation.id, e.target.value)}
                      className="bg-gray-700 border border-gray-600 rounded px-2 py-1"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirm</option>
                      <option value="cancelled">Cancel</option>
                    </select>
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