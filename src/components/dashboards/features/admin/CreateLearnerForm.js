// src/pages/.../CreateLearnerForm.js
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
    return () => {
      dispatch(clearLearnerState());
    };
  }, [dispatch]);

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
          {String(error)}
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
          <p className="mt-1 text-xs text-gray-500">
            Tip: Use a clear format like <span className="text-gray-300">“Grade 7”</span> or <span className="text-gray-300">“Grade R”</span>.
          </p>
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
              onClick={() => navigator.clipboard?.writeText(invitationToken || "")}
              className="shrink-0 px-3 py-2 rounded-xl border border-amber-400 text-amber-200 hover:bg-amber-400/10 transition"
            >
              Copy
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
