// AdminResources.js (AdminResourceUploadForm)
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// ✅ Correct: fetch learners from adminLearnerSlice
import { fetchLearners } from "../../../../redux/admin/adminLearnerSlice";
import {
  uploadResource,
  clearResourcesSuccess,
} from "../../../../redux/parent/resourcesSlice";

const Badge = ({ children }) => (
  <span className="text-[10px] px-2 py-0.5 rounded-full border border-amber-400/60 bg-amber-400/10 text-amber-200">
    {children}
  </span>
);

const AdminResourceUploadForm = () => {
  const dispatch = useDispatch();

  // Local form state
  const [selectedLearner, setSelectedLearner] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [resourceType, setResourceType] = useState("Homework");
  const [term, setTerm] = useState("Term 1");
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [file, setFile] = useState(null);

  // ✅ Learners from adminLearners slice
  const { learners = [], isLoading: learnersLoading, error: learnersError } =
    useSelector((state) => state.adminLearners || {});

  // Resources slice (upload + messages)
  const {
    isLoading: resourcesLoading,
    error: resourcesError,
    successMessage,
    items = [],
  } = useSelector((state) => state.resources || {});

  useEffect(() => {
    dispatch(fetchLearners());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      const t = setTimeout(() => dispatch(clearResourcesSuccess()), 3000);
      return () => clearTimeout(t);
    }
  }, [successMessage, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedLearner || !title || !file) return;

    const formData = new FormData();
    formData.append("resource[title]", title);
    if (description) formData.append("resource[description]", description);
    if (subject) formData.append("resource[subject]", subject);
    if (resourceType) formData.append("resource[resource_type]", resourceType);
    if (term) formData.append("resource[term]", term);
    if (year) formData.append("resource[year]", year);
    formData.append("resource[file]", file);
    formData.append("resource[learner_id]", selectedLearner);

    dispatch(uploadResource(formData)).then((res) => {
      if (res.meta?.requestStatus === "fulfilled") {
        setTitle("");
        setDescription("");
        setSubject("");
        setResourceType("Homework");
        setTerm("Term 1");
        setYear(String(new Date().getFullYear()));
        setFile(null);
        setSelectedLearner("");
      }
    });
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (user?.role !== "admin") {
    return (
      <div className="p-6 bg-gray-900 text-white rounded-2xl border border-white/10">
        <h2 className="text-xl font-bold mb-2 text-amber-400">
          Upload Learner Resource
        </h2>
        <p className="p-3 rounded border border-yellow-600 bg-yellow-900/30 text-yellow-200">
          You must be an admin to access this page.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 text-white rounded-2xl border border-white/10">
      <h2 className="text-2xl font-bold mb-4 text-amber-400">
        Admin — Upload Resources
      </h2>

      {/* Success & error banners */}
      {successMessage && (
        <p className="mb-4 p-3 rounded border border-green-600 bg-green-900/30 text-green-200">
          {successMessage}
        </p>
      )}
      {learnersError && (
        <p className="mb-4 p-3 rounded border border-red-700 bg-red-900/30 text-red-200">
          {String(learnersError)}
        </p>
      )}
      {resourcesError && (
        <p className="mb-4 p-3 rounded border border-red-700 bg-red-900/30 text-red-200">
          {String(resourcesError)}
        </p>
      )}

      {/* Upload Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <label className="block text-sm font-medium mb-1">
            Select Learner *
          </label>
          <select
            value={selectedLearner}
            onChange={(e) => setSelectedLearner(e.target.value)}
            required
            className="w-full p-2 border border-white/10 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/60"
          >
            <option value="">Choose a learner</option>
            {learners.map((learner) => (
              <option key={learner.id} value={learner.id}>
                {learner.child_name || learner.email}
                {learner.child_grade ? ` (Grade ${learner.child_grade})` : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input
            type="text"
            placeholder="e.g., Fractions Study Guide"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 border border-white/10 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/60"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">
            Description (optional)
          </label>
          <textarea
            placeholder="Short note for parents/learners"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full p-2 border border-white/10 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/60"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Subject (optional)
          </label>
          <input
            type="text"
            placeholder="e.g., Mathematics"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-2 border border-white/10 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/60"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Resource Type *
          </label>
          <select
            value={resourceType}
            onChange={(e) => setResourceType(e.target.value)}
            required
            className="w-full p-2 border border-white/10 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/60"
          >
            {["Homework", "Textbook", "Worksheet", "Exam Paper", "Notes"].map(
              (rt) => (
                <option key={rt} value={rt}>
                  {rt}
                </option>
              )
            )}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Term *</label>
          <select
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="w-full p-2 border border-white/10 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/60"
            required
          >
            {["Term 1", "Term 2", "Term 3", "Term 4"].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Year *</label>
          <input
            type="number"
            inputMode="numeric"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full p-2 border border-white/10 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/60"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">File *</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.png,.ppt,.pptx,.mp4"
            onChange={(e) => setFile(e.target.files[0])}
            required
            className="w-full p-2 border border-white/10 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/60"
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={resourcesLoading || learnersLoading}
            className="bg-amber-500 text-gray-900 font-semibold w-full py-2 rounded hover:bg-amber-400 transition disabled:opacity-50"
          >
            {resourcesLoading ? "Uploading…" : "Upload Resource"}
          </button>
        </div>
      </form>

      {items.length > 0 && (
        <>
          <h3 className="text-lg font-semibold mt-8 mb-3">
            Recent Resources
          </h3>
          <ul className="space-y-2">
            {items.slice(0, 6).map((r) => (
              <li
                key={r.id}
                className="border border-white/10 bg-gray-800 p-3 rounded text-white flex items-center justify-between"
              >
                <div className="min-w-0">
                  <div className="font-semibold truncate">{r.title}</div>
                  <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                    {r.year && <Badge>{r.year}</Badge>}
                    {r.term && <Badge>{r.term}</Badge>}
                    {r.subject && <Badge>{r.subject}</Badge>}
                    {r.resource_type && <Badge>{r.resource_type}</Badge>}
                  </div>
                </div>
                {r.url && (
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:text-amber-300 font-medium shrink-0"
                  >
                    Download →
                  </a>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default AdminResourceUploadForm;
