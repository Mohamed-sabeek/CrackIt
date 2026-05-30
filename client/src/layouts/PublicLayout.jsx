import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const PublicLayout = ({ sectionRefs }) => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-white text-slate-900 transition-colors duration-300">
      <Navbar sectionRefs={sectionRefs} />
      <main className="flex-grow pt-24">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
