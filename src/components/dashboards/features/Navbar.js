import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-emerald-800 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-lg font-bold hover:text-yellow-300 transition duration-300">
          Lawyer Dashboard
        </Link>
        <div className="flex space-x-6">
          <Link
            to="/"
            className="text-white hover:text-yellow-300 transition duration-300"
          >
            Home
          </Link>
          <Link
            to="/profile"
            className="text-white hover:text-yellow-300 transition duration-300"
          >
            Profile
          </Link>
          <Link
            to="/logout"
            className="text-white hover:text-yellow-300 transition duration-300"
          >
            Logout
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
