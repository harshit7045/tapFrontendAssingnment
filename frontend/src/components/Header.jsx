import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const checkAuthStatus = () => {
    try {
      const token = localStorage.getItem("token");
      const storedUserData = localStorage.getItem("userData");
      if (token) {
        setIsLoggedIn(true);
        setUserData(storedUserData ? JSON.parse(storedUserData) : null);
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    } catch (error) {
      console.error("Error checking authentication status:", error);
    }
  };

  useEffect(() => {
    checkAuthStatus();
    const authChangeHandler = () => checkAuthStatus();
    window.addEventListener("authChanged", authChangeHandler);
    return () => window.removeEventListener("authChanged", authChangeHandler);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserData(null);
    navigate("/login");
    window.dispatchEvent(new Event("authChanged"));
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 w-full z-50">
      <nav className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600 flex items-center">
            <span className="h-8 w-auto mr-2">🛡️</span>
            Safety Alert
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition duration-200">
              Dashboard
            </Link>
            <Link to="/contacts" className="text-gray-700 hover:text-blue-600 transition duration-200">
              Contacts
            </Link>
            <Link to="/danger-zones" className="text-gray-700 hover:text-blue-600 transition duration-200">
              Danger Zones
            </Link>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 transition duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-gray-700 hover:text-blue-600 transition duration-200"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 bg-white rounded-lg shadow-lg p-4 space-y-3">
            <Link
              to="/"
              className="block text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-4 py-2 rounded transition duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/contacts"
              className="block text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-4 py-2 rounded transition duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contacts
            </Link>
            <Link
              to="/danger-zones"
              className="block text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-4 py-2 rounded transition duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Danger Zones
            </Link>
            {isLoggedIn ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center space-x-2 w-full text-left text-red-500 hover:text-red-600 hover:bg-gray-50 px-4 py-2 rounded transition duration-200"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-4 py-2 rounded transition duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block bg-blue-600 text-white text-center px-4 py-2 rounded-full hover:bg-blue-700 transition duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
