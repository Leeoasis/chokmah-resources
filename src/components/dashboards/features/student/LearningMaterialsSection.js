import React, { useState } from "react";

const learningCategories = [
  "Mathematics",
  "Science",
  "History",
  "Languages",
  "Computer Science",
];

const sampleMaterials = [
  {
    id: 1,
    title: "Algebra Basics",
    description: "Introduction to algebraic expressions and equations.",
    category: "Mathematics",
    url: "https://example.com/algebra-basics",
  },
  {
    id: 2,
    title: "Newton's Laws",
    description: "Fundamentals of motion and forces.",
    category: "Science",
    url: "https://example.com/newtons-laws",
  },
  {
    id: 3,
    title: "World War II Overview",
    description: "Major events and consequences of WWII.",
    category: "History",
    url: "https://example.com/ww2-overview",
  },
  {
    id: 4,
    title: "Spanish for Beginners",
    description: "Basic Spanish vocabulary and grammar.",
    category: "Languages",
    url: "https://example.com/spanish-beginners",
  },
  {
    id: 5,
    title: "Intro to Python",
    description: "Learn Python programming from scratch.",
    category: "Computer Science",
    url: "https://example.com/intro-python",
  },
];

const LearningMaterialsSection = ({ materials = sampleMaterials }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const filteredMaterials = materials.filter((material) => {
    const matchesCategory = selectedCategory
      ? material.category === selectedCategory
      : true;
    const matchesSearch = material.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-primary-light mb-4">
        Learning Materials
      </h2>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
        <input
          type="text"
          placeholder="Search materials..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 rounded-lg bg-secondary-light text-primary border border-primary focus:outline-none focus:ring-2 focus:ring-primary w-full md:w-1/2"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 rounded-lg bg-secondary-light text-black border border-primary focus:outline-none focus:ring-2 focus:ring-primary w-full md:w-1/3"
        >
          <option value="" className="text-black">
            All Categories
          </option>
          {learningCategories.map((cat) => (
            <option key={cat} value={cat} className="text-black">
              {cat}
            </option>
          ))}
        </select>
      </div>

      {filteredMaterials.length === 0 ? (
        <p className="text-white">No materials found.</p>
      ) : (
        <ul className="space-y-4">
          {filteredMaterials.map(({ id, title, description, category, url }) => (
            <li
              key={id}
              className="bg-secondary-light p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-primary"
            >
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-semibold text-lg hover:underline"
              >
                {title}
              </a>
              <p className="text-white mt-1">{description}</p>
              <p className="text-olive-green mt-2 font-medium">
                Category: {category}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LearningMaterialsSection;
