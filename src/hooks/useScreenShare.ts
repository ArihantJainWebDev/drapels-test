import { useState, useRef, useCallback, useEffect } from 'react';
import { ScreenShareState } from '@/types/mockInterview';

export const useScreenShare = () => {
  const [state, setState] = useState<ScreenShareState>({
    isSharing: false,
    isSupported: false,
    error: null,
    stream: null,
  });

  const streamRef = useRef<MediaStream | null>(null);

  // Check if screen sharing is supported
  useEffect(() => {
    const isSupported = !!(
      navigator.mediaDevices && 
      navigator.mediaDevices.getDisplayMedia
    );
    setState(prev => ({ ...prev, isSupported }));
  }, []);

  const startScreenShare = useCallback(async (options?: {
    video?: boolean | MediaTrackConstraints;
    audio?: boolean | MediaTrackConstraints;
  }) => {
    if (!state.isSupported) {
      setState(prev => ({ 
        ...prev, 
        error: 'Screen sharing is not supported in this browser' 
      }));
      return;
    }

    try {
      setState(prev => ({ ...prev, error: null }));
      
      const constraints = {
        video: options?.video || {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 }
        },
        audio: options?.audio || false // Usually don't want system audio for interviews
      };

      const stream = await navigator.mediaDevices.getDisplayMedia(constraints);
      
      streamRef.current = stream;
      setState(prev => ({ 
        ...prev, 
        stream, 
        isSharing: true 
      }));

      // Listen for when user stops sharing via browser UI
      stream.getVideoTracks()[0].addEventListener('ended', () => {
        stopScreenShare();
      });

    } catch (error: any) {
      let errorMessage = 'Failed to start screen sharing';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Screen sharing permission denied. Please allow access and try again.';
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'Screen sharing is not supported in this browser.';
      } else if (error.name === 'AbortError') {
        errorMessage = 'Screen sharing was cancelled by user.';
      }

      setState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        isSharing: false 
      }));
    }
  }, [state.isSupported]);

  const stopScreenShare = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    setState(prev => ({ 
      ...prev, 
      stream: null, 
      isSharing: false 
    }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return {
    ...state,
    startScreenShare,
    stopScreenShare,
  };
};