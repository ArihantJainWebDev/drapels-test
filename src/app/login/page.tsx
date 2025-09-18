'use client';

import { useState } from 'react';

export const dynamic = 'force-dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import Login from '@/components/auth/Login';
import Register from '@/components/auth/Register';
import GoogleSignIn from '@/components/auth/GoogleSignIn';
import GithubSignIn from '@/components/auth/GithubSignIn';
import MagnetLines from '@/components/MagnetLines';
import Link from 'next/link';

export default function LoginPage() {
  const [login, setLogin] = useState(true);
  
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background with reduced opacity magnet lines */}
      <div className="absolute inset-0 -z-10 opacity-10">
        <MagnetLines 
          rows={9} 
          columns={9} 
          containerSize="100vw" 
          lineHeight="4vmin"
          lineColor="hsl(var(--primary))"
        />
      </div>
      
      <div className="max-w-6xl w-full bg-background rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-input mx-auto my-8">
        {/* Left Container - Welcome Message */}
        <div className="md:w-1/2 bg-gradient-to-br from-primary to-primary/90 p-10 text-primary-foreground flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Welcome to Drapels</h1>
            <p className="text-xl opacity-90">Your journey to success starts here</p>
          </div>

          {/* Magnet lines effect illustration */}
          <div className="flex-1 flex items-center justify-center">
            <MagnetLines
              rows={9}
              columns={9}
              containerSize="60vmin"
              lineColor="hsl(var(--primary-foreground))"
              lineWidth="0.5vmin"
              lineHeight="4vmin"
              baseAngle={0}
              style={{ margin: '2rem auto' }}
            />
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm opacity-80">Join thousands of developers building their future</p>
          </div>
        </div>

        {/* Right Container - Auth Forms */}
        <div className="md:w-1/2 p-10 flex flex-col justify-center bg-background text-foreground">
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => setLogin(true)}
              className={`px-4 py-2 font-medium rounded-lg transition-colors ${login ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setLogin(false)}
              className={`px-4 py-2 font-medium rounded-lg transition-colors ${!login ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Create Account
            </button>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={login ? 'login' : 'register'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {login ? <Login /> : <Register />}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <GoogleSignIn />
              <GithubSignIn />
            </div>
          </div>
          
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <Link href="/" className="hover:underline hover:text-foreground">
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
