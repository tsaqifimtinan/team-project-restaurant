"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

interface ReservationDetails {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  specialRequests?: string;
}

export default function ReservationConfirmation() {
  const [reservation, setReservation] = useState<ReservationDetails | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    // Get reservation details from localStorage
    const savedReservation = localStorage.getItem('lastReservation');
    if (savedReservation) {
      setReservation(JSON.parse(savedReservation));
    } else {
      // If no reservation details found, redirect to reservation page
      router.push('/reservation');
    }
  }, [router]);

  if (!reservation) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p>Loading reservation details...</p>
        </div>
      </div>
    );
  }

  // Format date for display
  const formattedDate = new Date(reservation.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="mb-4">
              <svg 
                className="w-16 h-16 text-green-500 mx-auto" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold">Reservation Confirmed!</h1>
            <p className="text-gray-400 mt-2">Thank you for choosing our restaurant</p>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-700/50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Reservation Details</h2>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400">Name</p>
                    <p className="font-medium">{reservation.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Number of Guests</p>
                    <p className="font-medium">{reservation.guests} {reservation.guests === 1 ? 'Guest' : 'Guests'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Date</p>
                    <p className="font-medium">{formattedDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Time</p>
                    <p className="font-medium">{reservation.time}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Phone</p>
                    <p className="font-medium">{reservation.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Email</p>
                    <p className="font-medium">{reservation.email}</p>
                  </div>
                </div>
                {reservation.specialRequests && (
                  <div className="mt-4">
                    <p className="text-gray-400">Special Requests</p>
                    <p className="font-medium">{reservation.specialRequests}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="text-center space-y-4">
              <p className="text-gray-400">
                A confirmation email has been sent to {reservation.email}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/"
                  className="inline-block bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Return to Home
                </Link>
                <button 
                  onClick={() => window.print()} 
                  className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Print Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}