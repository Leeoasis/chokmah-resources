import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchResources, uploadResource } from "../../../../redux/parent/resourcesSlice"; // ✅ corrected path if centralized

const ResourcesSection = ({ profile }) => {
  const dispatch = useDispatch();
  const { resources, isLoading, error } = useSelector((state) => state.resources);

  useEffect(() => {
    dispatch(fetchResources());
  }, [dispatch]);

  const handleUpload = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    dispatch(uploadResource(formData));
    e.target.reset();
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg text-gray-900">
      <h2 className="text-xl font-bold mb-4">Learning Resources</h2>

      {isLoading && <p>Loading resources...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {/* Upload form (visible for teachers/admins) */}
      {profile?.role === "teacher" || profile?.role === "admin" ? (
        <form onSubmit={handleUpload} className="mb-6 space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            required
            className="w-full p-2 border rounded"
          />
          <textarea
            name="description"
            placeholder="Description"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="grade"
            placeholder="Grade"
            className="w-full p-2 border rounded"
          />
          <input type="file" name="file" required className="w-full" />
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded"
          >
            Upload Resource
          </button>
        </form>
      ) : null}

      {/* Resources List */}
      {resources.length === 0 ? (
        <p>No resources found.</p>
      ) : (
        <ul>
          {resources.map((res) => (
            <li key={res.id} className="mb-3 border-b pb-2">
              <strong>{res.title}</strong>{" "}
              {res.subject && <>— {res.subject}</>}{" "}
              {res.grade && <>(Grade {res.grade})</>} <br />
              {res.url ? (
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="text-blue-600 underline"
                >
                  View / Download
                </a>
              ) : (
                <span className="text-gray-500">No file attached</span>
              )}
              {res.description && (
                <p className="text-sm text-gray-600 mt-1">{res.description}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ResourcesSection;
