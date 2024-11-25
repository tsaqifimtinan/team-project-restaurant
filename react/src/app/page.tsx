"use client";
import Image from "next/image";
import Link from 'next/link';

export default function Home() {
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
    </div>
  );
}