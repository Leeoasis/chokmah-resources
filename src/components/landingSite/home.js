import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Hero Section */}
      <header className="flex flex-col items-center justify-center flex-grow text-center px-6 md:px-12 py-20 max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-amber-400">
          Welcome to SPPS Chokmah Resources
        </h1>
        <p className="text-gray-300 text-lg md:text-xl max-w-3xl mb-10">
          Empowering learners with tailored resources and personalized reports to
          support every class and individual pupil’s growth.
        </p>
        <div className="space-x-4">
          <Link
            to="/register"
            className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold py-3 px-6 rounded shadow transition"
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            className="border border-amber-400 hover:bg-amber-400 hover:text-gray-900 text-amber-400 font-semibold py-3 px-6 rounded transition"
          >
            Login
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section className="bg-gray-800 py-16">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <h3 className="text-2xl font-bold text-amber-400 mb-4">Personalized Reports</h3>
            <p className="text-gray-300">
              Each learner receives reports tailored specifically to their progress and class level.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-amber-400 mb-4">Class Resources</h3>
            <p className="text-gray-300">
              Teachers can upload and manage educational resources for every class efficiently.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-amber-400 mb-4">Secure Access</h3>
            <p className="text-gray-300">
              Safe and secure sign up and login system ensures privacy for all users.
            </p>
          </div>
        </div>
      </section>

      {/* Footer Placeholder - if you want it here or just import Footer component */}
    </div>
  );
};

export default HomePage;
