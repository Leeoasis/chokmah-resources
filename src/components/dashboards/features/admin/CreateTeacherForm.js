import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createLearner,
  clearLearnerState,
} from "../../../../redux/admin/learnerFormSlice";

const CreateTeacherForm = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    parent_name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const { isLoading, error, success } = useSelector(
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
    // Create teacher directly with provided credentials
    dispatch(createLearner({ 
      ...formData, 
      role: "teacher",
      direct_creation: true // Flag to indicate direct creation
    }));
  };

  useEffect(() => {
    if (success) {
      // ✅ Clear form after successful creation
      setFormData({ 
        parent_name: "", 
        email: "", 
        password: "", 
        password_confirmation: "" 
      });
    }
  }, [success]);

  useEffect(() => {
    return () => {
      dispatch(clearLearnerState());
    };
  }, [dispatch]);

  return (
    <div className="p-6 bg-gray-900 text-white rounded-2xl border border-white/10 max-w-xl mx-auto mt-6">
      <header className="mb-4">
        <h2 className="text-2xl font-bold text-amber-400">Create Teacher Account</h2>
        <p className="text-sm text-gray-400 mt-1">
          Create a teacher account with email and password.
        </p>
      </header>

      {/* Alerts */}
      {success && (
        <div className="mb-4 p-3 rounded border border-green-600 bg-green-900/30 text-green-200">
          Teacher account created successfully!
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
          <label className="block text-sm font-medium mb-1">Teacher Full Name *</label>
          <input
            name="parent_name"
            type="text"
            autoComplete="off"
            placeholder="e.g., Ms. Johnson"
            value={formData.parent_name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/60"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email Address *</label>
          <input
            name="email"
            type="email"
            autoComplete="off"
            placeholder="teacher@school.edu"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/60"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password *</label>
          <input
            name="password"
            type="password"
            autoComplete="off"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/60"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Confirm Password *</label>
          <input
            name="password_confirmation"
            type="password"
            autoComplete="off"
            placeholder="Confirm password"
            value={formData.password_confirmation}
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
          {isLoading ? "Creating…" : "Create Teacher"}
        </button>
      </form>
    </div>
  );
};

export default CreateTeacherForm;