"use client";
import Image from "next/image";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    // Check authentication status on component mount
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userStr));
    }
  }, []);

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    router.push('/');
  };

  // Modify handleLogout to show modal first
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  // Final logout function
  const confirmLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setShowLogoutModal(false);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-[family-name:var(--font-geist-sans)]">
      {/* Hero Section with Background */}
      <div className="relative h-screen">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/rain-report-beans.jpg"
            alt="Background"
            fill
            className="object-cover brightness-50"
            priority
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
            <div className="text-center">
              <h1 className="text-4xl sm:text-6xl font-bold mb-6 text-white drop-shadow-lg">
                Welcome to Rain Report
              </h1>
              <p className="text-xl text-gray-100 mb-8 drop-shadow-lg">
                Experience authentic cuisine & coffee in a cozy atmosphere
              </p>
              <Link 
                href="/order" 
                className="inline-block bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Order Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h2 className="text-3xl font-bold text-center mb-12">Our Story</h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Image
              src="/rain-report.jpg"
              alt="Restaurant interior"
              width={500}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>
          <div className="space-y-4">
            <p className="text-gray-300">
              Founded in 2020, our restaurant has been serving delicious meals made
              with love and the finest ingredients. We take pride in creating
              memorable dining experiences for our guests.
            </p>
            <p className="text-gray-300">
              Our expert chefs combine traditional recipes with modern techniques
              to bring you extraordinary flavors that will delight your palate.
            </p>
            <p className="text-gray-300">
              We believe in sustainable practices and work closely with local
              farmers to source the freshest ingredients for our dishes.
            </p>
            <p className="text-gray-300">
              In 2023, we expanded our vision by introducing a unique café concept
              where art meets culinary excellence. Our café space doubles as an
              art gallery, featuring rotating exhibitions from local artists while
              serving artisanal coffee and freshly baked pastries.
            </p>
            <p className="text-gray-300">
              The café atmosphere transforms throughout the day - from a serene
              morning coffee spot to an evening wine bar, complete with live jazz
              performances and carefully curated small plates. This fusion of dining,
              art, and music creates an immersive experience that goes beyond
              traditional dining.
            </p>
          </div>
        </div>
      </section>

      <footer className="bg-gray-800 text-gray-300 mt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* About Column */}
            <div>
              <h3 className="text-xl font-semibold mb-4">About Rain Report</h3>
              <p className="text-gray-400">
                A unique dining experience where culinary excellence meets artistic expression.
                Join us for coffee, cuisine, and culture.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/reservation" className="text-gray-400 hover:text-white transition-colors">
                    Reservation
                  </Link>
                </li>
                <li>
                  <Link href="/order" className="text-gray-400 hover:text-white transition-colors">
                    Order Online
                  </Link>
                </li>
                <li>
                  <Link href="/events" className="text-gray-400 hover:text-white transition-colors">
                    Events
                  </Link>
                </li>
                <li>
                  {isLoggedIn ? (
                    <button
                      onClick={handleLogoutClick}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Logout
                    </button>
                  ) : (
                    <Link href="/login" className="text-gray-400 hover:text-white transition-colors">
                      Login
                    </Link>
                  )}
                </li>
                {user?.isAdmin && (
                  <li>
                    <Link href="/admin" className="text-gray-400 hover:text-white transition-colors">
                      Admin Dashboard
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
                      <h2 className="text-xl font-bold mb-4">Confirm Logout</h2>
                      <p className="text-gray-300 mb-6">
                        Are you sure you want to log out?
                      </p>
                      <div className="flex justify-end space-x-4">
                        <button
                          onClick={() => setShowLogoutModal(false)}
                          className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={confirmLogout}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                  </div>
              </div>
            )}

            {/* Contact Info */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
              <address className="text-gray-400 not-italic">
                <p>123 Coffee Street</p>
                <p>Jakarta, Indonesia</p>
                <p className="mt-2">Phone: (123) 456-7890</p>
                <p>Email: hello@rainreport.com</p>
              </address>
              <div className="flex gap-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <FaInstagram className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <FaTwitter className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <FaFacebook className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Rain Report. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}