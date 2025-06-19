import React, { useState, useEffect } from 'react';

const StudentProfileSection = ({ student, onUpdate, loading, error, successMessage }) => {
  const [formData, setFormData] = useState({
    name: student.user?.name || '',
    email: student.user?.email || '',
    class_name: student.class_name || '',
    password: '',
  });

  useEffect(() => {
    setFormData({
      name: student.user?.name || '',
      email: student.user?.email || '',
      class_name: student.class_name || '',
      password: '',
    });
  }, [student]);

  useEffect(() => {
    if (successMessage) {
      setFormData({
        name: student.user?.name || '',
        email: student.user?.email || '',
        class_name: student.class_name || '',
        password: '',
      });
    }
  }, [successMessage, student]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData); // you can adjust structure if backend expects nested `user` data
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-primary-light mb-4">Student Profile</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

          <div className="mb-4">
            <label className="block text-secondary-light mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 rounded-lg bg-secondary-light text-primary"
            />
          </div>

          <div className="mb-4">
            <label className="block text-secondary-light mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 rounded-lg bg-secondary-light text-primary"
            />
          </div>

          <div className="mb-4">
            <label className="block text-secondary-light mb-2">Class</label>
            <input
              type="text"
              name="class_name"
              value={formData.class_name}
              onChange={handleChange}
              className="w-full p-2 rounded-lg bg-secondary-light text-primary"
            />
          </div>

          <div className="mb-4">
            <label className="block text-secondary-light mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 rounded-lg bg-secondary-light text-primary"
            />
          </div>

          <button type="submit" className="bg-primary text-secondary px-4 py-2 rounded hover:bg-primary-light">
            Update Profile
          </button>
        </form>
      )}
    </div>
  );
};

export default StudentProfileSection;
