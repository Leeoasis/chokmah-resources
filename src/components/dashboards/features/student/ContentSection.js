import React from 'react';

const ContentSection = ({ title, description, buttonText }) => (
  <div>
    <h2 className="text-2xl font-semibold text-primary-light mb-4">{title}</h2>
    <p className="text-secondary-light mb-4">{description}</p>
    <button className="bg-primary text-secondary px-4 py-2 rounded hover:bg-primary-light">{buttonText}</button>
  </div>
);

export default ContentSection;
