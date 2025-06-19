import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../redux/auth/loginSlice';
import Navbar from '../landingSite/Navbar';
import Footer from '../landingSite/Footer';
import LoginBackground from '../../assets/images/download.jpg';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('user[email]', formData.email);
    data.append('user[password]', formData.password);

    dispatch(loginUser(data)).then((action) => {
      console.log('Login result:', action);

      if (action.meta.requestStatus === 'fulfilled') {
        const role = action.payload?.role;

        setFormData({ email: '', password: '' });

        // ✅ Navigate based on role
        if (role === 'parent') {
          navigate('/parent-dashboard');
        } else if (role === 'learner') {
          navigate('/student-dashboard');
        } else if (role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/'); // fallback
        }
      } else {
        console.error('Login failed:', action.error.message);
      }
    });
  };

  return (
    <div className="bg-gray-50">
      <Navbar />
      <div
        className="min-h-screen bg-cover bg-center flex flex-col justify-center items-center relative"
        style={{ backgroundImage: `url(${LoginBackground})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
        <div className="bg-white bg-opacity-70 p-8 rounded-lg shadow-md w-full max-w-md z-10 mt-20 mb-12">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Login</h1>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
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
            <button
              type="submit"
              className="bg-amber-500 text-white p-3 w-full rounded mt-4 hover:bg-amber-400"
            >
              Login
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
