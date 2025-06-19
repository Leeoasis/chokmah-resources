import React, { useState, useEffect } from "react";

// Mock implementation of SubscribeToNotifications
const SubscribeToNotifications = (profileId, callback) => {
  // This mock sends a dummy notification every 10 seconds
  const intervalId = setInterval(() => {
    const dummyNotification = {
      message: `New notification for user ${profileId} at ${new Date().toLocaleTimeString()}`,
    };
    callback(dummyNotification);
  }, 10000);

  // Return an object with unsubscribe method to clear the interval
  return {
    unsubscribe: () => clearInterval(intervalId),
  };
};

const NotificationsSection = ({ profile }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (profile?.id) {
      const subscription = SubscribeToNotifications(profile.id, (notification) => {
        setNotifications((prev) => [...prev, notification]);

        if (notification.message.includes("No classes match")) {
          alert(notification.message); // Customize or replace with better UI
        }
      });

      return () => subscription.unsubscribe();
    }
  }, [profile?.id]);

  return (
    <div>
      <h4>Your School Notifications</h4>
      {notifications.length === 0 ? (
        <p>No new notifications.</p>
      ) : (
        <ul>
          {notifications.map((notification, index) => (
            <li key={index}>{notification.message}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsSection;
