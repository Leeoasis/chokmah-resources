import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createLearner, clearLearnerState } from '../../../../redux/admin/learnerFormSlice';

const CreateLearnerForm = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    child_name: '',
    child_grade: '',
  });

  const { invitationToken, isLoading, error, success } = useSelector((state) => state.learners);

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
    <div className="bg-white p-6 rounded shadow-md max-w-md mx-auto mt-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Create Learner Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="child_name"
          type="text"
          autoComplete="off"
          placeholder="Child Full Name"
          value={formData.child_name}
          onChange={handleChange}
          required
          className="w-full p-2 mb-3 border rounded text-black"
        />
        <input
          name="child_grade"
          type="text"
          autoComplete="off"
          placeholder="Child Grade"
          value={formData.child_grade}
          onChange={handleChange}
          required
          className="w-full p-2 mb-3 border rounded text-black"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-amber-500 text-white py-2 px-4 rounded hover:bg-amber-600 w-full"
        >
          {isLoading ? 'Creating...' : 'Create Learner'}
        </button>
      </form>

      {success && (
        <div className="mt-4 bg-green-100 text-green-800 p-3 rounded border border-green-300">
          <p className="text-sm font-medium">Invitation Token:</p>
          <code className="break-words">{invitationToken}</code>
        </div>
      )}
      {error && (
        <p className="mt-4 text-red-600 text-sm">
          {error}
        </p>
      )}
    </div>
  );
};

export default CreateLearnerForm;
