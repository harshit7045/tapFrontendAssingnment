import React, { useEffect, useState } from "react";
import { FaWifi, FaMapMarkerAlt, FaUserShield } from "react-icons/fa";
import { Link } from "react-router-dom";
import MapWithSearch from "./MapWithSearch";

const HomeHero = () => {
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCurrentLocation([pos.coords.longitude, pos.coords.latitude]),
        (err) => setCurrentLocation([31.5, 76.1])
      );
    } else {
      setCurrentLocation([31.5, 76.1]);
    }
  }, []);

  return (
    <section className=" mt-[10vh] ml-[-10vw] w-[100vw] bg-gradient-to-br from-blue-50 to-white py-16 px-4 sm:px-6 lg:px-20 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Map Section */}
        <div className="flex justify-center md:justify-start" style={{ minHeight: 400, minWidth: 400 }}>
          <MapWithSearch initialLocation={currentLocation} />
        </div>
        {/* Text Section */}
        <div className="text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
            Stay Safe.
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Monitor your location, detect danger zones, manage emergency contacts, 
            and stay informed even when you're offline. Our intelligent alert 
            system has your back — always.
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-8">
            <span className="flex items-center text-green-600 font-medium">
              <FaWifi className="mr-2" /> Network Monitored
            </span>
            <span className="flex items-center text-red-600 font-medium">
              <FaMapMarkerAlt className="mr-2" /> Danger Zones
            </span>
            <span className="flex items-center text-blue-600 font-medium">
              <FaUserShield className="mr-2" /> Emergency Contacts
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
