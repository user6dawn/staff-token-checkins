import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { CheckCircle } from 'lucide-react';

export function Success() {
  const { currentUser } = useAuth();
  const [checkInTime, setCheckInTime] = useState('');

  useEffect(() => {
    setCheckInTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, []);

  if (!currentUser) {
    return null;
  }

  return (
    <div className="text-center">
      <div className="mb-8">
        <div className="flex justify-center mb-4">
          <CheckCircle size={48} className="text-green-600" />
        </div>
        <h1 className="text-2xl font-light text-gray-900 mb-2">
          Check-in Successful
        </h1>
        <p className="text-gray-600">
          Checked in at <span className="font-medium">{checkInTime}</span>
        </p>
      </div>

      <div className="space-y-4 max-w-sm mx-auto">
        <Link
          to="/admin"
          className="block w-full bg-gray-900 text-white py-3 px-4 hover:bg-gray-800 transition-colors text-center"
        >
          View Dashboard
        </Link>
        <Link
          to="/profile"
          className="block w-full border border-gray-300 text-gray-900 py-3 px-4 hover:bg-gray-50 transition-colors text-center"
        >
          View Profile
        </Link>
      </div>

      <div className="mt-8">
        <Link
          to="/"
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← Back to Login
        </Link>
      </div>
    </div>
  );
}