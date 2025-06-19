import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchreg } from '../../redux/auth/registerSlice';
import Navbar from '../landingSite/Navbar';
import Footer from '../landingSite/Footer';
import RegisterBackground from '../../assets/images/download.jpg';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password_confirmation: '',
    parent_name: '',
    child_name: '',
    child_grade: '',
    invitation_token: '',
    role: 'parent',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInvitationTokenBlur = async () => {
    if (formData.invitation_token.trim()) {
      try {
        const res = await fetch(`http://localhost:3000/api/v1/users/learner_by_token/${formData.invitation_token}`);
        if (res.ok) {
          const data = await res.json();
          setFormData((prev) => ({
            ...prev,
            child_name: data.child_name,
            child_grade: data.child_grade,
          }));
        } else {
          alert("Invalid invitation code.");
        }
      } catch (error) {
        console.error("Error validating token:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    for (const key in formData) {
      data.append(`user[${key}]`, formData[key]);
    }

    dispatch(fetchreg(data)).then((action) => {
      if (action.meta.requestStatus === 'fulfilled') {
        setFormData({
          email: '',
          password: '',
          password_confirmation: '',
          parent_name: '',
          child_name: '',
          child_grade: '',
          invitation_token: '',
          role: 'parent',
        });

        const role = action.payload.role;
        if (role === 'parent') {
          navigate('/parent-dashboard');
        } else if (role === 'learner') {
          navigate('/student-dashboard');
        } else if (role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/login');
        }
      } else {
        console.error('Registration failed:', action.error.message);
      }
    });
  };

  return (
    <div className="bg-gray-50">
      <Navbar />
      <div
        className="min-h-screen bg-cover bg-center flex flex-col justify-center items-center relative"
        style={{ backgroundImage: `url(${RegisterBackground})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
        <div className="bg-white bg-opacity-70 p-8 rounded-lg shadow-md w-full max-w-md z-10 mt-20 mb-12">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Registration</h1>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="mb-4 p-3 w-full border rounded bg-white"
            >
              <option value="parent">Parent</option>
              <option value="learner">Learner</option>
            </select>

            {formData.role === 'parent' && (
              <input
                name="invitation_token"
                type="text"
                value={formData.invitation_token}
                onChange={handleChange}
                onBlur={handleInvitationTokenBlur}
                placeholder="Invitation Code"
                required
                className="mb-4 p-3 w-full border rounded"
              />
            )}

            {formData.role === 'parent' && (
              <>
                <input
                  name="parent_name"
                  type="text"
                  value={formData.parent_name}
                  onChange={handleChange}
                  placeholder="Parent Full Name"
                  required
                  className="mb-4 p-3 w-full border rounded"
                />
                <input
                  name="child_name"
                  type="text"
                  value={formData.child_name}
                  readOnly
                  placeholder="Child's Full Name"
                  className="mb-4 p-3 w-full border rounded bg-gray-100"
                />
                <input
                  name="child_grade"
                  type="text"
                  value={formData.child_grade}
                  readOnly
                  placeholder="Child's Grade"
                  className="mb-4 p-3 w-full border rounded bg-gray-100"
                />
              </>
            )}

            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="mb-4 p-3 w-full border rounded"
            />
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="mb-4 p-3 w-full border rounded"
            />
            <input
              name="password_confirmation"
              type="password"
              value={formData.password_confirmation}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
              className="mb-4 p-3 w-full border rounded"
            />
            <button
              type="submit"
              className="bg-amber-500 text-white p-3 w-full rounded mt-4 hover:bg-amber-400"
            >
              Register
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
