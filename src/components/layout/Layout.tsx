import React from 'react';
// import CursorTrail from '../CursorTrail';
// import Navbar from '../Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen">
      {/* <Navbar /> */}
      {/* <CursorTrail/> */}
      <main className="">{children}</main>
    </div>
  );
};