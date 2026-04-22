import React from 'react';
import Navbar from '../Common/Navbar';
import Footer from '../Common/Footer';

export default function MainLayout({ children }) {
  return (
    <div className="client-shell min-h-screen flex flex-col">
      <Navbar />
      <main className="client-shell-main flex-grow w-full px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
