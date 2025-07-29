import { useState, useEffect } from 'react';
import type { Staff } from '../lib/supabase';

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<Staff | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      setCurrentUser(JSON.parse(stored));
    }
  }, []);

  const login = (user: Staff) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  return {
    currentUser,
    isLoading,
    setIsLoading,
    login,
    logout
  };
}