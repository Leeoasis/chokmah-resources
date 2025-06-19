// src/components/NotificationBell.js
import React, { useState } from 'react';
import { FaBell } from 'react-icons/fa';

const NotificationBell = ({ notifications }) => {
  const [open, setOpen] = useState(false);

  const toggleDropdown = () => setOpen(!open);

  return (
    <div className="relative inline-block text-left">
      <button onClick={toggleDropdown} className="relative">
        <FaBell className="text-white text-xl" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-600 text-xs rounded-full px-1">
            {notifications.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white text-black border rounded shadow-lg z-50 max-h-64 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="p-2 text-sm">No new notifications</p>
          ) : (
            <ul className="p-2 space-y-1 text-sm">
              {notifications.map((n, idx) => (
                <li key={idx} className="border-b last:border-none pb-1">
                  {n.message}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
