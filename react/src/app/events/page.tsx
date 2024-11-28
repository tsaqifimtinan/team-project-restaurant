"use client";
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Event {
    id: number;
    title: string;
    date: string;
    time: string;
    description: string;
    image: string;
    rsvpCount: number;
  }

interface Promotion {
  id: number;
  title: string;
  description: string;
  validUntil: string;
  discountAmount: string;
  code: string;
}

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<'events' | 'promotions' | 'happyHour'>('events');

  const events: Event[] = [
    {
      id: 1,
      title: "Jazz Night",
      date: "Every Friday",
      time: "19:00 - 22:00",
      description: "Live jazz performance with our house band while enjoying our signature cocktails",
      image: "/jazz-night.jpg",
      rsvpCount: 24
    },
    {
      id: 2,
      title: "Wine Tasting",
      date: "Last Saturday of Month",
      time: "16:00 - 18:00",
      description: "Discover our curated wine selection with expert sommeliers",
      image: "/wine-tasting.jpg",
      rsvpCount: 12
    }
  ];

  const promotions: Promotion[] = [
    {
      id: 1,
      title: "Early Bird Coffee",
      description: "20% off all coffee orders before 9AM",
      validUntil: "2024-12-31",
      discountAmount: "20%",
      code: "EARLYBIRD"
    },
    {
      id: 2,
      title: "Lunch Special",
      description: "Get a free dessert with any main course",
      validUntil: "2024-12-31",
      discountAmount: "Free Dessert",
      code: "SWEETLUNCH"
    }
  ];

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
                    <div className="relative h-48">
                    <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover"
                    />
                    </div>
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
                        className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                        <span>RSVP</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
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
                  <p className="text-sm text-gray-400">Valid until: {promo.validUntil}</p>
                  <p className="text-lg font-semibold text-blue-400">Use code: {promo.code}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Happy Hour Section */}
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