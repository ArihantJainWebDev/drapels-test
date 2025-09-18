import React, { useState, useCallback } from 'react';

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  className?: string;
  action?: React.ReactNode;
}

// Create a toast utility that can be used outside components
const toastInstance = {
  current: null as ReturnType<typeof useToast> | null
};

export const toast = {
  show: (props: Omit<Toast, 'id'>) => {
    if (!toastInstance.current) {
      throw new Error('Toast provider not initialized');
    }
    return toastInstance.current.toast(props);
  },
  dismiss: (id: string) => {
    if (!toastInstance.current) {
      throw new Error('Toast provider not initialized');
    }
    toastInstance.current.dismiss(id);
  }
};

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(({ title, description, variant = 'default' }: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = { id, title, description, variant };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
    
    return {
      id,
      dismiss: () => setToasts(prev => prev.filter(t => t.id !== id)),
    };
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return {
    toasts,
    toast,
    dismiss,
  };
}

export function useToastProvider() {
  const toast = useToast();
  toastInstance.current = toast;
  return toast;
}