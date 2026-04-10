import React from 'react';
import Navbar from '../Common/Navbar';
import Footer from '../Common/Footer';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow mx-auto w-full px-4 sm:px-6 lg:px-8 py-8" style={{ maxWidth: '1200px' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
