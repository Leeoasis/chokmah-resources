import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchResources } from "../../../../redux/parent/resourcesSlice";

const LearningMaterialsSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const dispatch = useDispatch();
  const { items: materials = [], isLoading, error } = useSelector((state) => state.resources || {});

  useEffect(() => {
    dispatch(fetchResources());
  }, [dispatch]);

  const filteredMaterials = materials.filter((material) => {
    const matchesCategory = selectedCategory
      ? material.subject === selectedCategory
      : true;
    const matchesSearch = material.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const learningCategories = [...new Set(materials.map(m => m.subject).filter(Boolean))];

  if (isLoading) return <p className="text-white">Loading materials...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

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
          {filteredMaterials.map((material) => (
            <li
              key={material.id}
              className="bg-secondary-light p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-primary"
            >
              <h3 className="text-primary font-semibold text-lg">{material.title}</h3>
              <p className="text-white mt-1">{material.description}</p>
              <p className="text-olive-green mt-2 font-medium">
                Subject: {material.subject} | Type: {material.resource_type}
              </p>
              {material.file_url && (
                <a
                  href={material.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline mt-2 inline-block"
                >
                  Download/View Material
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LearningMaterialsSection;
