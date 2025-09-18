'use client';

import React, { useState, useRef } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Register = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cream-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl overflow-hidden shadow-lg border border-cream-200 dark:border-gray-700">
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-green-800 dark:text-green-300 mb-2">Create Account</h2>
            <p className="text-cream-700 dark:text-gray-300">Join our community</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-green-800 dark:text-green-200">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-cream-50 dark:bg-gray-700 border border-cream-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent text-green-900 dark:text-white"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-green-800 dark:text-green-200">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-cream-50 dark:bg-gray-700 border border-cream-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent text-green-900 dark:text-white"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-green-800 dark:text-green-200">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-cream-50 dark:bg-gray-700 border border-cream-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent text-green-900 dark:text-white"
                required
              />
            </div>
            
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-medium rounded-full transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-70"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
            
            <div className="text-center">
              <p className="text-sm text-cream-700 dark:text-gray-300">
                Already have an account?{' '}
                <Link href="/login" className="text-green-700 dark:text-green-300 hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;