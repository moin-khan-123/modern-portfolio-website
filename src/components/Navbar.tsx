import React from 'react';
import Link from 'next/link';
import { Button } from './ui/Button';

const Navbar: React.FC = () => {
  return (
    <header className="w-full border-b bg-white/50 backdrop-blur sticky top-0 z-40">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold">Your App</Link>
        <div className="flex items-center gap-3">
          <Link href="#about">About</Link>
          <Link href="#hero">Hero</Link>
          <Button variant="outline">Contact</Button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
