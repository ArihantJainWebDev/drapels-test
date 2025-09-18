import React from 'react';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface NotificationToastProps {
  message: string;
  type?: ToastType;
  description?: string;
  duration?: number;
}

const toastIcons = {
  success: <CheckCircle className="text-green-500" />,
  error: <XCircle className="text-red-500" />,
  info: <Info className="text-blue-500" />,
  warning: <AlertTriangle className="text-yellow-500" />,
};

const showToast = ({
  message,
  type = 'info',
  description,
  duration = 5000,
}: NotificationToastProps) => {
  toast(message, {
    description: description,
    duration: duration,
    icon: toastIcons[type],
  });
};

export { showToast };