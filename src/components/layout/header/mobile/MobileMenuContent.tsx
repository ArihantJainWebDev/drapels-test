"use client"
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { User, LogOut, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import DynamicMenuGenerator from '@/components/navigation/DynamicMenuGenerator';
import { useHeaderAuth } from '@/hooks/header/useHeaderAuth';

interface MobileMenuContentProps {
  onClose: () => void;
  menuReady: boolean;
}

// Memoize the component to prevent unnecessary re-renders
const MobileMenuContent: React.FC<MobileMenuContentProps> = memo(({ onClose, menuReady }) => {
  const { 
    isAuthenticated, 
    user, 
    profilePic, 
    firstName, 
    logout, 
    navigateToLogin,
    navigateToProfile 
  } = useHeaderAuth();

  const handleLogout = () => {
    logout();
    onClose();
  };

  const handleNavigateToProfile = () => {
    onClose();
    navigateToProfile();
  };

  const handleNavigateToLogin = () => {
    onClose();
    navigateToLogin();
  };

  // Early return if menu is not ready
  if (!menuReady) return null;

  return (
    <>
      <div className="flex-1 overflow-y-auto custom-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
        <DynamicMenuGenerator
          variant="mobile"
          className="p-0"
        />
      </div>

      {/* Enhanced Mobile Menu Footer */}
      <motion.div
        className="border-t border-gray-200/30 dark:border-gray-800/30 p-3 bg-gradient-to-r from-gray-50/50 to-indigo-50/50 dark:from-gray-900/50 dark:to-indigo-950/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        {isAuthenticated ? (
          <div className="space-y-2.5">
            {/* User Info Card */}
            <motion.div
              className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white dark:bg-gray-900/40 border border-gray-200/50 dark:border-gray-800/50 shadow"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative">
                {profilePic ? (
                  <Image
                    src={profilePic}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-indigo-500/30 shadow"
                  />
                ) : user?.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-indigo-500/30 shadow"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xs shadow">
                    {firstName[0]}
                  </div>
                )}
                <motion.div
                  className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                  Welcome, {firstName}
                </p>
                <p className="text-[11px] text-gray-600 dark:text-gray-400 truncate">
                  {user?.email}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span className="text-[11px] text-green-600 dark:text-green-400 font-medium">Online</span>
                </div>
              </div>
            </motion.div>

            {/* Profile Actions */}
            <div className="space-y-1.5">
              <motion.div
                whileHover={{ x: 4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start h-10 px-2.5 rounded-md hover:bg-gray-100/60 dark:hover:bg-gray-800/60 group transition-all duration-300"
                  onClick={handleNavigateToProfile}
                >
                  <div className="p-1 rounded-md bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mr-2.5 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/50 transition-colors duration-300">
                    <User className="h-3.5 w-3.5" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-medium text-sm text-gray-900 dark:text-gray-100">Profile</div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400">View your profile</div>
                  </div>
                  <ChevronDown className="w-3 h-3 text-gray-400 rotate-[-90deg] group-hover:text-indigo-500 transition-colors duration-300" />
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ x: 4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start h-10 px-2.5 rounded-md text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 group transition-all duration-300"
                  onClick={handleLogout}
                >
                  <div className="p-1 rounded-md bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mr-2.5 group-hover:bg-red-200 dark:group-hover:bg-red-800/50 transition-colors duration-300">
                    <LogOut className="h-3.5 w-3.5" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-medium text-sm">Sign Out</div>
                    <div className="text-[10px] opacity-70">Logout from your account</div>
                  </div>
                  <ChevronDown className="w-3 h-3 rotate-[-90deg] group-hover:text-red-600 transition-colors duration-300" />
                </Button>
              </motion.div>
            </div>
          </div>
        ) : (
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="space-y-3"
          >
            <Button
              className="w-full h-14 bg-[#1EB36B] text-white hover:bg-[#1EB36B]/90 dark:bg-[#1EB36B]/90 dark:text-gray-900 dark:hover:bg-[#1EB36B]/80 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
              onClick={handleNavigateToLogin}
            >
              <motion.div
                className="absolute inset-0 bg-[#1EB36B]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              <User className="w-5 h-5 mr-3 relative z-10" />
              <div className="text-left flex-1 relative z-10">
                <div className="font-bold">Get Started Free</div>
                <div className="text-xs opacity-90">Join 50,000+ developers</div>
              </div>
              <motion.div
                className="relative z-10"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
              </motion.div>
            </Button>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              No credit card required • Free forever
            </p>
          </motion.div>
        )}
      </motion.div>
    </>
  );
});

export default MobileMenuContent