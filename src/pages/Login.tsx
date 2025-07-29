import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, LogOut } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      return;
    }

    setIsSubmitting(true);

    // Simple delay to simulate processing
    setTimeout(() => {
      navigate('/admin');
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <header className="bg-dark-900 border-b border-dark-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 rounded-lg flex items-center justify-center overflow-hidden">
                <img 
                  src="/Innov8 Logo-01.png" 
                  alt="Innov8 Logo" 
                  className="w-fill h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Staff Food Token Management</h1>
                <p className="text-primary-400 text-lg">Admin Access Portal</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Login Form */}
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="w-full max-w-md">
          <div className="bg-dark-900 border border-dark-800 rounded-lg p-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-30 h-30 rounded-lg flex items-center justify-center overflow-hidden">
                  <img 
                    src="/logo for home page.png" 
                    alt="Innov8 Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Admin Access</h1>
              <p className="text-gray-400">Enter your credentials to continue</p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-6 pb-6">
              <div className="pb-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors text-white placeholder-gray-400"
                  disabled={isSubmitting}
                  autoFocus
                />
              </div>
              <div className="pb-6">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors text-white placeholder-gray-400"
                  disabled={isSubmitting}
                />
              </div>

              <button
                type="submit"
                onClick={() => navigate('/admin')}
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            {/* <div className="mt-8 text-center">
              <button
                onClick={() => navigate('/admin')}
                className="text-sm text-gray-400 hover:text-primary-400 transition-colors"
              >
                ← Back to Staff Login
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}