// src/app/events/page.tsx
"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  image: string;
  capacity: number;
  rsvpCount: number;
}

interface Promotion {
  id: number;
  title: string;
  description: string;
  validUntil: string;
  discountAmount: string;
  code: string;
  isActive: boolean;
}

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<'events' | 'promotions' | 'happyHour'>('events');
  const [events, setEvents] = useState<Event[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showRSVPModal, setShowRSVPModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [rsvpForm, setRsvpForm] = useState({
    name: '',
    email: '',
    guests: 1
  });
  // Add user state and effect
const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchEvents();
    fetchPromotions();
    // Get logged in user data
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData);
      setRsvpForm({
        name: userData.name || '',
        email: userData.email || '',
        guests: 1
      });
    }
  }, []);

  useEffect(() => {
    if (user) {
      setRsvpForm(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/events');
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      const eventsWithRSVPs = data.map((event: any) => ({
        ...event,
        rsvpCount: event.rsvps?.reduce((sum: number, rsvp: any) => sum + rsvp.guests, 0) || 0,
        image: event.image ? 
          (event.image.startsWith('http') ? event.image : `http://localhost:3001${event.image}`) 
          : null
      }));
      setEvents(eventsWithRSVPs);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchPromotions = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/promotions');
      if (!response.ok) throw new Error('Failed to fetch promotions');
      const data = await response.json();
      setPromotions(data.filter((promo: Promotion) => promo.isActive));
    } catch (error) {
      console.error('Error fetching promotions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRSVP = async (eventId: number) => {
    setSelectedEventId(eventId);
    setShowRSVPModal(true);
  };

  const handleRSVPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`http://localhost:3001/api/events/${selectedEventId}/rsvp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(rsvpForm)
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit RSVP');
      }
  
      setShowRSVPModal(false);
      setRsvpForm({ name: '', email: '', guests: 1 });
      await fetchEvents(); // Refresh events to update RSVP count
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      alert('Failed to submit RSVP');
    }
  };

  const happyHours = {
    weekdays: "16:00 - 18:00",
    weekends: "15:00 - 17:00",
    deals: [
      "50% off selected cocktails",
      "30% off wine by the glass",
      "Buy one get one free on appetizers"
    ]
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <Link href="/">
          <h1 className="text-4xl font-bold text-center mb-12">Events & Promotions</h1>
        </Link>

        {/* Tab Navigation */}
        <div className="flex justify-center space-x-4 mb-12">
          {['events', 'promotions', 'happyHour'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className={`px-6 py-2 rounded-full ${
                activeTab === tab 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/([A-Z])/g, ' $1')}
            </button>
          ))}
        </div>

        {/* Events Section */}
        {activeTab === 'events' && (
          <div className="grid md:grid-cols-2 gap-8">
            {events.map((event) => {
              // Calculate if event is full
              const isFull = event.capacity && event.rsvpCount >= event.capacity;
              
              return (
                <div key={event.id} className="bg-gray-800 rounded-lg overflow-hidden">
                  {event.image && (
                    <div className="relative h-48">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                        // Add this if your images are from an external domain
                        unoptimized={true}
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                    <p className="text-gray-400 mb-2">{event.date} | {event.time}</p>
                    <p className="text-gray-300 mb-4">{event.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">
                        {event.rsvpCount} / {event.capacity} people attending
                      </span>
                      {isFull ? (
                        <span className="px-6 py-2 bg-red-500/20 text-red-400 rounded-full">
                          Event Full
                        </span>
                      ) : (
                        <button
                          onClick={() => handleRSVP(event.id)}
                          className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
                        >
                          RSVP
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showRSVPModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">RSVP for Event</h3>
                <button 
                  onClick={() => setShowRSVPModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleRSVPSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Name</label>
                    <input
                      type="text"
                      required
                      value={rsvpForm.name}
                      onChange={(e) => setRsvpForm({...rsvpForm, name: e.target.value})}
                      className={`w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        user ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      disabled={!!user}
                    />
                  </div>
              
                  <div>
                    <label className="text-sm text-gray-400">Email</label>
                    <input
                      type="email"
                      required
                      value={rsvpForm.email}
                      onChange={(e) => setRsvpForm({...rsvpForm, email: e.target.value})}
                      className={`w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        user ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      disabled={!!user}
                    />
                  </div>
              
                  <div>
                    <label className="text-sm text-gray-400">Number of Guests</label>
                    <select
                      value={rsvpForm.guests}
                      onChange={(e) => setRsvpForm({...rsvpForm, guests: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                </div>
              
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit RSVP
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Promotions Section */}
        {activeTab === 'promotions' && (
          <div className="grid md:grid-cols-2 gap-8">
            {promotions.map((promo) => (
              <div key={promo.id} className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2">{promo.title}</h3>
                <p className="text-gray-300 mb-4">{promo.description}</p>
                <div className="bg-gray-700 rounded p-4">
                  <p className="text-sm text-gray-400">
                    Valid until: {new Date(promo.validUntil).toLocaleDateString()}
                  </p>
                  <p className="text-lg font-semibold text-blue-400">
                    {promo.discountAmount} | Use code: {promo.code}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Happy Hour Section remains the same */}
        {activeTab === 'happyHour' && (
          <div className="bg-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Happy Hour Times</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl mb-4">Hours</h3>
                <p className="text-gray-300 mb-2">Weekdays: {happyHours.weekdays}</p>
                <p className="text-gray-300">Weekends: {happyHours.weekends}</p>
              </div>
              <div>
                <h3 className="text-xl mb-4">Special Deals</h3>
                <ul className="space-y-2">
                  {happyHours.deals.map((deal, index) => (
                    <li key={index} className="text-gray-300">{deal}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}