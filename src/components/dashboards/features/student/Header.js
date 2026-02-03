import React from 'react';
import { FaSignOutAlt } from 'react-icons/fa';

const Header = ({ handleLogout, profile, title = "Dashboard" }) => (
  <div className="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:items-center lg:space-y-0 mb-4 lg:mb-8">
    <h1 className="text-2xl lg:text-4xl font-bold text-primary">{title}</h1>
    <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
      <div className="flex items-center space-x-2">
        <span className="text-sm lg:text-lg">Welcome, {profile.name}</span>
        <div className="w-8 h-8 lg:w-12 lg:h-12 bg-secondary rounded-full flex items-center justify-center text-primary font-bold text-sm lg:text-base">
          {profile.name ? profile.name.charAt(0) : 'U'}
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center justify-center bg-primary text-secondary px-3 py-2 lg:px-4 lg:py-2 rounded hover:bg-primary-light text-sm lg:text-base"
      >
        <FaSignOutAlt className="mr-1 lg:mr-2" /> Logout
      </button>
    </div>
  </div>
);

export default Header;
