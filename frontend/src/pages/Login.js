import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, Loader } from 'lucide-react';
import { authAPI } from '../services/api';

const Login = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await authAPI.login(password);
      if (response.success) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/admin');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Incorrect password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-6 py-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-md w-full">
        <motion.div 
          className="bg-white border-4 border-[#1A1A1A] p-8 md:p-12"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div 
              className="inline-flex items-center justify-center w-16 h-16 bg-[#0066FF] mb-6"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Lock className="text-white" size={32} />
            </motion.div>
            <motion.h1 
              className="text-3xl font-bold text-[#1A1A1A] uppercase mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Admin Login
            </motion.h1>
            <motion.p 
              className="text-[#666]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Enter password to access admin panel
            </motion.p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-xs uppercase tracking-widest text-[#666] mb-2 font-mono">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="w-full border-2 border-[#E0E0E0] px-4 py-3 pr-12 focus:border-[#0066FF] focus:outline-none transition-colors"
                  placeholder="Enter password"
                  required
                  disabled={loading}
                />
                <User className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999]" size={20} />
              </div>
              {error && (
                <motion.p 
                  className="mt-2 text-sm text-red-600 flex items-center gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                  {error}
                </motion.p>
              )}
            </motion.div>

            <motion.button
              type="submit"
              className="w-full bg-[#0066FF] text-white px-8 py-4 uppercase text-sm tracking-wider font-semibold hover:bg-[#0052CC] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Loader size={18} />
                  </motion.div>
                  Logging in...
                </>
              ) : (
                'Login to Admin Panel'
              )}
            </motion.button>
          </form>

          {/* Info */}
          <motion.div 
            className="mt-8 pt-6 border-t-2 border-[#E0E0E0]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <p className="text-xs text-[#999] text-center">
              Access restricted to authorized users only
            </p>
          </motion.div>
        </motion.div>

        {/* Decorative Border */}
        <motion.div 
          className="relative -mt-8 -ml-8 w-full h-full border-4 border-[#0066FF] -z-10"
          initial={{ x: 0, y: 0 }}
          animate={{ x: 32, y: 32 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        ></motion.div>
      </div>
    </motion.div>
  );
};

export default Login;