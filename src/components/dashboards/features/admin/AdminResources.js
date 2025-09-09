import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLearners } from "../../../../redux/admin/reportsSlice"; // reusing learners slice
import { uploadResource, clearResourceMessages } from "../../../../redux/parent/resourcesSlice"; // new resources slice

const AdminResourceUploadForm = () => {
  const dispatch = useDispatch();

  const [selectedLearner, setSelectedLearner] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  // learners still come from reports slice
  const { learners = [], isLoading, error } = useSelector(
    (state) => state.reports || {}
  );

  // success comes from resources slice
  const { success, successMessage } = useSelector(
    (state) => state.resources || {}
  );

  useEffect(() => {
    dispatch(fetchLearners());
  }, [dispatch]);

  // ✅ Reset form when upload succeeds
  useEffect(() => {
    if (success) {
      setMessage(successMessage || "Resource uploaded successfully.");
      setTitle("");
      setDescription("");
      setSubject("");
      setGrade("");
      setFile(null);
      setSelectedLearner("");
      // clear the success state after reset
      const timer = setTimeout(() => {
        dispatch(clearResourceMessages());
        setMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, successMessage, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedLearner || !title || !file) return;

    const formData = new FormData();
    formData.append("resource[title]", title);
    formData.append("resource[description]", description);
    formData.append("resource[subject]", subject);
    formData.append("resource[grade]", grade);
    formData.append("resource[file]", file);
    formData.append("resource[learner_id]", selectedLearner);

    dispatch(uploadResource(formData));
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow max-w-xl mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4 text-gray-900">Upload Learner Resource</h2>
      {message && <p className="mb-4 text-green-700">{message}</p>}
      {error && <p className="mb-4 text-red-600">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Learner</label>
        <select
          value={selectedLearner}
          onChange={(e) => setSelectedLearner(e.target.value)}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded text-black"
        >
          <option value="">Choose a learner</option>
          {learners.map((learner) => (
            <option key={learner.id} value={learner.id}>
              {learner.child_name} (Grade {learner.child_grade})
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Resource Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded text-black"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded text-black"
        />

        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded text-black"
        />

        <input
          type="text"
          placeholder="Grade"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded text-black"
        />

        <input
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.png,.mp4"
          onChange={(e) => setFile(e.target.files[0])}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded text-black"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="bg-amber-500 text-white w-full py-2 rounded hover:bg-amber-600"
        >
          {isLoading ? "Uploading..." : "Upload Resource"}
        </button>
      </form>
    </div>
  );
};

export default AdminResourceUploadForm;
