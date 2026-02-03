import React from "react";

const AdminSidebar = ({ selectedOption, setSelectedOption }) => {
  const options = [
    "Create Teacher",
    "Teachers",
    "Create Learner",
    "Learners",     // ✅ new section
    "Reports",
    "Resources",
    "Profile",
    "Notifications",
    "Calendar",
  ];

  return (
    <div className="w-full lg:w-64 bg-gray-900 text-white p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
      {options.map((option) => (
        <button
          key={option}
          onClick={() => setSelectedOption(option)}
          className={`block w-full text-left px-4 py-2 rounded hover:bg-gray-700 ${
            selectedOption === option ? "bg-amber-500 text-white" : ""
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default AdminSidebar;
