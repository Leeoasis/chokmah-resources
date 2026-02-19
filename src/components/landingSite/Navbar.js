import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/auth/logoutSlice"; // 👈 import thunk
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Read auth state from localStorage
  // const user = JSON.parse(localStorage.getItem("user")); // removed unused variable
  // Only consider logged in if both token and user are present and token is not empty
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const isLoggedIn = Boolean(token && token !== 'undefined' && token !== 'null' && token.trim() !== '' && user && user !== 'undefined' && user !== 'null' && user.trim() !== '');

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const getLinkClass = (path) => {
    return location.pathname === path
      ? "bg-blue-400 text-white px-4 py-2 rounded transition duration-300 flex items-center"
      : "hover:text-amber-400 transition duration-300 flex items-center";
  };

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => {
      navigate("/login");
    });
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#0c1746] text-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <span className="bg-white rounded-full p-1 flex items-center justify-center" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <img src={process.env.PUBLIC_URL + '/chomah-logo-1-removebg-preview.png'} alt="SPPS Chokmah Logo" className="h-14 w-14 object-contain" />
        </span>
        <span className="text-2xl font-bold text-blue-300">SPPS Chokmah Resources</span>
      </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8">
          <Link to="/" className={getLinkClass("/")}>
            Home
          </Link>

          {!isLoggedIn ? (
            <>
              <Link to="/register" className={getLinkClass("/register")}>
                Sign Up
              </Link>
              <Link to="/login" className={getLinkClass("/login")}>
                Login
              </Link>
            </>
          ) : (
          <button
            onClick={handleLogout}
            className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-300 transition duration-300"
          >
            Logout
          </button>
          )}
        </div>

        {/* Hamburger Icon */}
        <button className="md:hidden flex items-center" onClick={toggleMobileMenu}>
        <span className="text-blue-300 text-2xl">
            <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
      <div className="md:hidden bg-blue-900 text-white shadow-lg">
          <div className="flex flex-col space-y-4 p-4">
            <Link to="/" className={getLinkClass("/")} onClick={closeMobileMenu}>
              Home
            </Link>

            {!isLoggedIn ? (
              <>
                <Link
                  to="/register"
                  className={getLinkClass("/register")}
                  onClick={closeMobileMenu}
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className={getLinkClass("/login")}
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
              </>
            ) : (
              <button
                onClick={() => {
                  handleLogout();
                  closeMobileMenu();
                }}
              className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-300 transition duration-300"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
