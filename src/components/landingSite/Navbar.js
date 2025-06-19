// src/components/auth/Navbar.js
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const getLinkClass = (path) => {
    return location.pathname === path
      ? "bg-amber-400 text-gray-900 px-4 py-2 rounded transition duration-300 flex items-center"
      : "hover:text-amber-400 transition duration-300 flex items-center";
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900 text-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-amber-400">
          SPPS Chokmah
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8">
          <Link to="/" className={getLinkClass("/")}>
            Home
          </Link>
          <Link to="/register" className={getLinkClass("/register")}>
            Sign Up
          </Link>
          <Link to="/login" className={getLinkClass("/login")}>
            Login
          </Link>
        </div>

        {/* Hamburger Icon */}
        <button className="md:hidden flex items-center" onClick={toggleMobileMenu}>
          <span className="text-amber-400 text-2xl">
            <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-900 text-white shadow-lg">
          <div className="flex flex-col space-y-4 p-4">
            <Link to="/" className={getLinkClass("/")} onClick={closeMobileMenu}>
              Home
            </Link>
            <Link to="/register" className={getLinkClass("/register")} onClick={closeMobileMenu}>
              Sign Up
            </Link>
            <Link to="/login" className={getLinkClass("/login")} onClick={closeMobileMenu}>
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
