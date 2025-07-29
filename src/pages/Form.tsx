import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { UserPlus, Save, ArrowLeft } from 'lucide-react';

export function Form() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    staffid: '',
    staffname: '',
    tag: '',
    email: '',
    lab: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.staffid.trim() || !formData.staffname.trim() || !formData.tag.trim() || !formData.email.trim() || !formData.lab.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Insert into staff table
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .insert([{
          staffid: parseInt(formData.staffid.trim()),
          staffname: formData.staffname.trim(),
          tag: parseInt(formData.tag.trim()),
          email: formData.email.trim(),
          lab: formData.lab.trim()
        }])
        .select()
        .single();

      if (staffError) {
        throw staffError;
      }

      // Insert into control table with default mode 'register'
      const { error: controlError } = await supabase
        .from('control')
        .insert([{
          mode: 'register',
          staffid: parseInt(formData.staffid.trim())
        }]);

      if (controlError) {
        throw controlError;
      }

      setSuccess(true);
      setFormData({
        staffid: '',
        staffname: '',
        tag: '',
        email: '',
        lab: ''
      });

      // Redirect to admin dashboard after 2 seconds
      setTimeout(() => {
        navigate('/admin');
      }, 2000);

    } catch (err: any) {
      console.error('Error adding staff member:', err);
      setError(err.message || 'Failed to add staff member');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <UserPlus size={48} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-light text-gray-900 mb-2">Staff Added Successfully</h1>
          <p className="text-gray-600 mb-4">The new staff member has been added to the system.</p>
          <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center space-x-2 text-gray-400 hover:text-primary-400 transition-colors mb-6 bg-dark-800 border border-dark-700 px-4 py-2 rounded-lg hover:bg-dark-700"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </button>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Add New Staff Member</h1>
            <p className="text-xl text-gray-400">Enter the details for the new staff member</p>
          </div>
        </div>

        <div className="bg-dark-900 rounded-xl border border-dark-800">
          <div className="bg-dark-800 border-b border-dark-700 p-6">
            <h2 className="text-xl font-bold text-white flex items-center space-x-3">
              <UserPlus size={24} />
              <span>Staff Information</span>
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {error && (
              <div className="bg-red-900/20 border border-red-800 text-red-400 px-6 py-4 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-8">
              <div>
                <label htmlFor="staffid" className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
                  Staff ID (Number) *
                </label>
                <input
                  type="number"
                  id="staffID"
                  name="staffid"
                  value={formData.staffid}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-white font-medium placeholder-gray-400"
                  placeholder="Enter staff ID (number)"
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div>
                <label htmlFor="staffname" className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
                  Staff Name *
                </label>
                <input
                  type="text"
                  id="staffname"
                  name="staffname"
                  value={formData.staffname}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-white font-medium placeholder-gray-400"
                  placeholder="Enter full name"
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div>
                <label htmlFor="tag" className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
                  Tag (Number) *
                </label>
                <input
                  type="number"
                  id="tag"
                  name="tag"
                  value={formData.tag}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-white font-medium placeholder-gray-400"
                  placeholder="Enter tag (number)"
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-white font-medium placeholder-gray-400"
                  placeholder="Enter email address"
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div>
                <label htmlFor="lab" className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
                  Lab *
                </label>
                <input
                  type="text"
                  id="lab"
                  name="lab"
                  value={formData.lab}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-white font-medium placeholder-gray-400"
                  placeholder="Enter lab assignment"
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 pt-8 border-t border-dark-700">
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="px-6 py-3 text-gray-300 bg-dark-800 border border-dark-700 hover:bg-dark-700 rounded-lg transition-all duration-200 font-medium"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-8 py-3 bg-primary-600 text-white hover:bg-primary-700 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                <Save size={18} />
                <span>{isSubmitting ? 'Adding...' : 'Add Staff Member'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}