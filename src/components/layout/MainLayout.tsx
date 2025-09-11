import React from 'react';
import BottomNav from './BottomNav';

const MainLayout = ({ children }) => {
  return (
    <div className="bg-black text-white min-h-screen">
      <main className="pb-20">{children}</main>
      <BottomNav />
    </div>
  );
};

export default MainLayout;
