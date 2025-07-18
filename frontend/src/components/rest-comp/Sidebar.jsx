import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: 'Admin Dashboard', path: '/admindashboard' },
    { name: 'Add Product', path: '/admindashboard/addproduct' },
    { name: 'Manage Product', path: '/admindashboard/manageproduct' },
    { name: 'View Users', path: '/admindashboard/viewusers' },
    { name: 'Manage Categories', path: '/admindashboard/addcategory' },
  ];

  return (
    <>
      {/* Hamburger for small screens */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 text-[#FFD700] bg-black p-2 rounded focus:outline-none"
        onClick={() => setIsOpen(true)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 lg:static h-screen w-64 bg-black text-[#FFD700] transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:translate-x-0 z-40 overflow-y-auto shadow-lg`}
      >
        {/* Close button on mobile */}
        <div className="lg:hidden flex justify-end p-4">
          <button onClick={() => setIsOpen(false)} className="text-[#FFD700] text-xl">×</button>
        </div>

        {/* Navigation */}
        <nav className="p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-[#FFD700] mb-4">Dashboard</h2>
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="block hover:text-white transition duration-300"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
