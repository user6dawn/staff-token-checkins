import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogOut, Home, User, BarChart3 } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const isAdminPath = location.pathname === '/admin';
  const isProfilePath = location.pathname === '/profile';
  const isCheckInPath = location.pathname === '/checkin';
  const isLoginPath = location.pathname === '/';

  return (
    <div className={`min-h-screen ${isAdminPath ? 'bg-dark-950' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
      {currentUser && !isCheckInPath && !isAdminPath && (
        <header className="bg-white shadow-lg border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <Link 
                  to="/profile" 
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                    isProfilePath 
                      ? 'text-primary-600 bg-primary-50' 
                      : 'text-gray-500 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  <User size={20} />
                  <span>Profile</span>
                </Link>
                <Link 
                  to="/admin" 
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                    isAdminPath 
                      ? 'text-primary-600 bg-primary-50' 
                      : 'text-gray-500 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  <BarChart3 size={20} />
                  <span>Dashboard</span>
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                  {currentUser.staffname}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium"
                >
                  <LogOut size={16} />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>
      )}
      <main>
        {children}
      </main>
    </div>
  );
}