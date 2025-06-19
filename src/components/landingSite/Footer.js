import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEnvelope,
    faPhone,
} from "@fortawesome/free-solid-svg-icons";
import {
    faFacebookF,
    faTwitter,
    faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-8">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* About Section */}
                <div>
                    <h3 className="text-lg font-bold mb-4 text-amber-400">About SPPS Chokmah</h3>
                    <p className="text-gray-400">
                        SPPS Chokmah is dedicated to providing personalized learning resources and reports tailored to each class and learner.
                    </p>
                </div>
                {/* Quick Links */}
                <div>
                    <h3 className="text-lg font-bold mb-4 text-amber-400">Quick Links</h3>
                    <ul className="space-y-2">
                        <li>
                            <Link to="/" className="hover:text-amber-400">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/register" className="hover:text-amber-400">
                                Sign Up
                            </Link>
                        </li>
                        <li>
                            <Link to="/login" className="hover:text-amber-400">
                                Login
                            </Link>
                        </li>
                        <li>
                            <Link to="/student-dashboard" className="hover:text-amber-400">
                                Student Dashboard
                            </Link>
                        </li>
                    </ul>
                </div>
                {/* Contact Info */}
                <div>
                    <h3 className="text-lg font-bold mb-4 text-amber-400">Contact Us</h3>
                    <p className="text-gray-400">
                        <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                        info@sppschokmah.school
                    </p>
                    <p className="text-gray-400">
                        <FontAwesomeIcon icon={faPhone} className="mr-2" />
                        +27 123 456 7890
                    </p>
                    <div className="flex space-x-4 mt-4">
                        <a href="#" className="hover:text-amber-400" aria-label="Facebook">
                            <FontAwesomeIcon icon={faFacebookF} />
                        </a>
                        <a href="#" className="hover:text-amber-400" aria-label="Twitter">
                            <FontAwesomeIcon icon={faTwitter} />
                        </a>
                        <a href="#" className="hover:text-amber-400" aria-label="LinkedIn">
                            <FontAwesomeIcon icon={faLinkedinIn} />
                        </a>
                    </div>
                </div>
            </div>
            <div className="text-center text-gray-600 mt-8">
                &copy; {new Date().getFullYear()} SPPS Chokmah. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
