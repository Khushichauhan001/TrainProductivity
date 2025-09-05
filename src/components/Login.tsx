import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Train, Lock, User, UserPlus } from 'lucide-react';

interface LoginProps {
  onLogin: (credentials: { username: string; password: string }) => Promise<void>;
  error?: string;
}

export const Login: React.FC<LoginProps> = ({ onLogin, error }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await onLogin(formData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-green-700 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-full mb-4"
          >
            <Train className="text-white" size={24} />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Train Traffic Controller</h1>
          <p className="text-gray-600">
            {isSignup ? 'Create your account' : 'Sign in to access the AI-powered dashboard'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder={isSignup ? "Choose a username" : "Enter your username"}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder={isSignup ? "Create a password (min 6 characters)" : "Enter your password"}
                minLength={isSignup ? 6 : undefined}
                required
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-green-700 transition-all duration-200 disabled:opacity-50"
          >
            {isLoading ? (isSignup ? 'Creating Account...' : 'Signing in...') : (isSignup ? 'Create Account' : 'Sign In')}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => setIsSignup(!isSignup)}
            className="flex items-center justify-center space-x-2 w-full py-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            {isSignup ? <User size={16} /> : <UserPlus size={16} />}
            <span>
              {isSignup ? 'Already have an account? Sign In' : 'New user? Create Account'}
            </span>
          </motion.button>
        </div>

        {!isSignup && (
          <div className="mt-4 text-center">
            <div className="text-sm text-gray-600">
              <p className="mb-2">Demo Credentials:</p>
              <p><strong>Admin:</strong> admin / admin123</p>
              <p><strong>Operator:</strong> operator / operator123</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};