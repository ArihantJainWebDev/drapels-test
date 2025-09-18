'use client';

import { createContext, useContext, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type CreditsDialogContextType = {
  openLowCredits: (message?: string) => void;
};

const CreditsDialogContext = createContext<CreditsDialogContextType | null>(null);

export const CreditsDialogProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const openLowCredits = (msg = '') => {
    setMessage(msg);
    setOpen(true);
  };

  return (
    <CreditsDialogContext.Provider value={{ openLowCredits }}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Low Credits</DialogTitle>
            <DialogDescription>
              {message || 'You don\'t have enough credits to perform this action'}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </CreditsDialogContext.Provider>
  );
};

export const useCreditsDialog = () => {
  const context = useContext(CreditsDialogContext);
  if (!context) {
    throw new Error('useCreditsDialog must be used within a CreditsDialogProvider');
  }
  return context;
};
