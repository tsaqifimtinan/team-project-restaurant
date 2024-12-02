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

  useEffect(() => {
    fetchEvents();
    fetchPromotions();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/events');
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      setEvents(data);
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
    try {
      const response = await fetch(`/api/events/${eventId}/rsvp`, {
        method: 'POST'
      });

      if (!response.ok) throw new Error('Failed to RSVP');

      // Refresh events to update RSVP count
      await fetchEvents();
    } catch (error) {
      console.error('Error RSVPing:', error);
      alert('Failed to RSVP for this event');
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
            {events.map((event) => (
              <div key={event.id} className="bg-gray-800 rounded-lg overflow-hidden">
                {event.image && (
                  <div className="relative h-48">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                  <p className="text-gray-400 mb-2">{event.date} | {event.time}</p>
                  <p className="text-gray-300 mb-4">{event.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                      {event.rsvpCount} people attending
                    </span>
                    <button
                      onClick={() => handleRSVP(event.id)}
                      className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
                    >
                      RSVP
                    </button>
                  </div>
                </div>
              </div>
            ))}
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