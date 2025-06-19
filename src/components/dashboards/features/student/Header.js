import React from 'react';
import { FaSignOutAlt } from 'react-icons/fa';

const Header = ({ handleLogout, profile }) => (
  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 lg:mb-8">
    <h1 className="text-4xl font-bold text-primary mb-4 lg:mb-0">Student Dashboard</h1>
    <div className="flex items-center space-x-4">
      <span className="text-lg">Welcome, {profile.name}</span>
      <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-primary font-bold">
        {profile.name ? profile.name.charAt(0) : 'S'}
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center bg-primary text-secondary px-4 py-2 rounded hover:bg-primary-light"
      >
        <FaSignOutAlt className="mr-2" /> Logout
      </button>
    </div>
  </div>
);

export default Header;
