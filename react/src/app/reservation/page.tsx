"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ReservationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    specialRequests: ''
  });

  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch available time slots when date changes
  useEffect(() => {
    if (formData.date) {
      fetchAvailableTimeSlots(formData.date);
    }
  }, [formData.date]);

  const fetchAvailableTimeSlots = async (date: string) => {
    try {
      setIsLoading(true); // Add loading state
      const response = await fetch(`http://localhost:3001/api/reservations/available-times?date=${date}`);
      if (response.ok) {
        const data = await response.json();
        if (data.availableSlots) {
          // Sort the time slots
          const sortedSlots = data.availableSlots.sort((a: string, b: string) => {
            return a.localeCompare(b);
          });
          setAvailableTimeSlots(sortedSlots);
        }
      } else {
        console.error('Failed to fetch time slots');
        setAvailableTimeSlots([]); // Set empty array on error
      }
    } catch (error) {
      console.error('Error fetching available times:', error);
      setAvailableTimeSlots([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        localStorage.setItem('lastReservation', JSON.stringify(formData));
        // Redirect to confirmation page or show success message
        router.push('/reservation-confirmation');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to make reservation');
      }
    } catch (error) {
      console.error('Error making reservation:', error);
      alert('Failed to make reservation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-gray-800 rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8">Make a Reservation</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Phone Input */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            {/* Date & Time Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="date" className="block text-sm font-medium mb-2">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium mb-2">
                  Time
                </label>
                <select
                  id="time"
                  name="time"
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.time}
                  onChange={handleChange}
                  disabled={isLoading || !formData.date} // Disable if loading or no date selected
                  style={{ height: '44px' }} // Match date input height
                >
                  <option value="">
                    {!formData.date 
                      ? 'Please select a date first'
                      : isLoading 
                        ? 'Loading times...' 
                        : 'Select a time'
                    }
                  </option>
                  {availableTimeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                  {!isLoading && availableTimeSlots.length === 0 && formData.date && (
                    <option value="" disabled>
                      No available times for selected date
                    </option>
                  )}
                </select>
              </div>
            </div>

            {/* Number of Guests */}
            <div>
              <label htmlFor="guests" className="block text-sm font-medium mb-2">
                Number of Guests
              </label>
              <select
                id="guests"
                name="guests"
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.guests}
                onChange={handleChange}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
            </div>

            {/* Special Requests */}
            <div>
              <label htmlFor="specialRequests" className="block text-sm font-medium mb-2">
                Special Requests (Optional)
              </label>
              <textarea
                id="specialRequests"
                name="specialRequests"
                rows={4}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.specialRequests}
                onChange={handleChange}
                placeholder="Any dietary restrictions or special occasions?"
              />
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Confirm Reservation
              </button>
            </div>
          </form>

          {/* Back to Home Link */}
          <div className="mt-6 text-center">
            <Link 
              href="/"
              className="text-gray-400 hover:text-white transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}