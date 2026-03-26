// pages/Settings/Settings.jsx
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { Button } from "@heroui/react";
import { ChangePass } from '../../service/LoginApi';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Settings() {
  const [formData, setFormData] = useState({
    password: '',        // Changed from currentPassword to password
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const changePasswordMutation = useMutation({
    mutationFn: () => ChangePass({
      password: formData.password,
      newPassword: formData.newPassword
    }),
    onSuccess: (data) => {
      if (data?.success) {
        toast.success('Password changed successfully!');
        setFormData({
          password: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        toast.error(data?.message || 'Failed to change password');
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to change password');
    }
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.password) {
      toast.error('Please enter current password');
      return;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (formData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    changePasswordMutation.mutate();
  };
  
  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };
  
  return (
    <>
      <Helmet>
        <title>Settings</title>
      </Helmet>
      
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Change Password</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.current ? <FaEye size={16} /> : <FaEyeSlash size={16} />}
              </button>
            </div>
          </div>
          
          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.new ? <FaEye size={16} /> : <FaEyeSlash size={16} />}
              </button>
            </div>
          </div>
          
          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.confirm ?  <FaEye size={16} /> : <FaEyeSlash size={16} /> }
              </button>
            </div>
          </div>
          
          <Button
            type="submit"
            color="primary"
            isLoading={changePasswordMutation.isLoading}
            className="w-full"
          >
            Change Password
          </Button>
        </form>
      </div>
    </>
  );
}

export default Settings;