import React from "react";

const NotificationsSection = ({ notifications }) => {
  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h2 className="text-lg font-bold text-white mb-3">Notifications</h2>
      {notifications.length > 0 ? (
        <ul className="space-y-2">
          {notifications.map((notif, index) => (
            <li key={index} className="p-2 bg-gray-700 rounded">
              {notif.message}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No new notifications.</p>
      )}
    </div>
  );
};

export default NotificationsSection;
