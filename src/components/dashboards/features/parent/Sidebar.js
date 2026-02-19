import React from 'react';

const ParentSidebar = ({ selectedOption, setSelectedOption }) => (
  <div className="w-full lg:w-64 bg-secondary p-4 lg:p-6 shadow-lg">
    <h2 className="text-3xl font-bold text-primary mb-4 lg:mb-8">Parent Dashboard</h2>
    <nav className="space-y-2 lg:space-y-4">
      {[
        'Reports',
        'Resources',
        'PACEs',
        'Profile',
        'Notifications',
        'Calendar',
      ].map((option) => (
        <button
          key={option}
          className={`w-full text-left px-4 py-2 rounded-lg ${
            selectedOption === option
              ? 'bg-primary text-secondary'
              : 'bg-secondary-light text-primary-light hover:bg-primary hover:text-secondary'
          }`}
          onClick={() => setSelectedOption(option)}
        >
          {option}
        </button>
      ))}
    </nav>
  </div>
);

export default ParentSidebar;
