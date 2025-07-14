import React from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaTwitter, FaLinkedin, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* App Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-blue-600 mb-4">Safety Alert</h3>
            <p className="text-gray-600 mb-4">
              Real-time safety alerts, danger zone monitoring, and emergency contact management for your peace of mind.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/your-repo"
                className="text-gray-400 hover:text-blue-600"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub size={20} />
              </a>
              <a
                href="https://twitter.com/your-handle"
                className="text-gray-400 hover:text-blue-600"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="https://linkedin.com/in/your-profile"
                className="text-gray-400 hover:text-blue-600"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin size={20} />
              </a>
              <a
                href="mailto:support@safetyalert.com"
                className="text-gray-400 hover:text-blue-600"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaEnvelope size={20} />
              </a>
            </div>
          </div>

          {/* App Sections */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              App Sections
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-600 hover:text-blue-600">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/contacts" className="text-gray-600 hover:text-blue-600">
                  Contacts
                </Link>
              </li>
              <li>
                <Link to="/danger-zones" className="text-gray-600 hover:text-blue-600">
                  Danger Zones
                </Link>
              </li>
              <li>
                <Link to="/alerts" className="text-gray-600 hover:text-blue-600">
                  Alerts
                </Link>
              </li>
              <li>
                <Link to="/settings" className="text-gray-600 hover:text-blue-600">
                  Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Support
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  Help Center
                </a>
              </li>
              <li>
                <a href="mailto:support@safetyalert.com" className="text-gray-600 hover:text-blue-600">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Safety Alert. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 