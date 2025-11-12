import React from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-fintech-blue text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">💰 FinTech</span>
              <span className="ml-2 text-fintech-gold font-semibold">Dashboard</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <>
                <span className="text-sm">
                  Welcome, {user.first_name} {user.last_name}
                </span>
                <button
                  onClick={logout}
                  className="bg-fintech-gold text-gray-900 hover:bg-yellow-500 px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;