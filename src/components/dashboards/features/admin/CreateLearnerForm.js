import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createLearner,
  clearLearnerState,
} from "../../../../redux/admin/learnerFormSlice";

const CreateLearnerForm = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    child_name: "",
    child_grade: "",
  });

  const [copied, setCopied] = useState(false);

  const { invitationToken, isLoading, error, success } = useSelector(
    (state) => state.learners
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createLearner(formData));
  };

  useEffect(() => {
    if (success) {
      // ✅ Clear form after successful creation
      setFormData({ child_name: "", child_grade: "" });
      setCopied(false); // reset copy state
    }
  }, [success]);

  useEffect(() => {
    return () => {
      dispatch(clearLearnerState());
    };
  }, [dispatch]);

  const handleCopy = () => {
    if (!invitationToken) return;
    navigator.clipboard?.writeText(invitationToken);
    setCopied(true);

    // Reset after 2 seconds
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-2xl border border-white/10 max-w-xl mx-auto mt-6">
      <header className="mb-4">
        <h2 className="text-2xl font-bold text-amber-400">Create Learner Profile</h2>
        <p className="text-sm text-gray-400 mt-1">
          Add a child’s name and grade to generate an invitation.
        </p>
      </header>

      {/* Alerts */}
      {success && (
        <div className="mb-4 p-3 rounded border border-green-600 bg-green-900/30 text-green-200">
          Learner created successfully. Invitation token generated below.
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 rounded border border-red-700 bg-red-900/30 text-red-200">
          {Array.isArray(error) ? (
            <ul className="list-disc ml-4">
              {error.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          ) : (
            error
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Child Full Name *</label>
          <input
            name="child_name"
            type="text"
            autoComplete="off"
            placeholder="e.g., Thandi Ndlovu"
            value={formData.child_name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/60"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Child Grade *</label>
          <input
            name="child_grade"
            type="text"
            autoComplete="off"
            placeholder="e.g., Grade 7"
            value={formData.child_grade}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/60"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 bg-amber-500 text-gray-900 font-semibold w-full py-2.5 rounded-xl hover:bg-amber-400 transition disabled:opacity-50"
        >
          {isLoading ? "Creating…" : "Create Learner"}
        </button>
      </form>

      {success && (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-gray-300 mb-2 font-medium">Invitation Token</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 break-words text-amber-200 bg-gray-900/60 border border-white/10 rounded-xl px-3 py-2">
              {invitationToken}
            </code>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!invitationToken}
              className={`shrink-0 px-3 py-2 rounded-xl border transition ${
                copied
                  ? "border-green-400 text-green-200 bg-green-900/40"
                  : "border-amber-400 text-amber-200 hover:bg-amber-400/10"
              }`}
            >
              {copied ? "✔ Copied!" : "Copy"}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Share this token with the parent to complete account setup.
          </p>
        </div>
      )}
    </div>
  );
};

export default CreateLearnerForm;
