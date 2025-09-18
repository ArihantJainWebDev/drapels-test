import { useState, useRef, useCallback, useEffect } from 'react';
import { VideoRecordingState } from '@/types/mockInterview';

export const useVideoRecording = () => {
  const [state, setState] = useState<VideoRecordingState>({
    isRecording: false,
    isSupported: false,
    error: null,
    duration: 0,
    videoBlob: null,
    stream: null,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check if video recording is supported
  useEffect(() => {
    const isSupported = !!(
      navigator.mediaDevices && 
      typeof navigator.mediaDevices.getUserMedia === 'function' && 
      window.MediaRecorder
    );
    setState(prev => ({ ...prev, isSupported }));
  }, []);

  const startRecording = useCallback(async (options?: {
    video?: boolean | MediaTrackConstraints;
    audio?: boolean | MediaTrackConstraints;
  }) => {
    if (!state.isSupported) {
      setState(prev => ({ 
        ...prev, 
        error: 'Video recording is not supported in this browser' 
      }));
      return;
    }

    try {
      setState(prev => ({ 
        ...prev, 
        error: null, 
        duration: 0, 
        videoBlob: null 
      }));
      
      const constraints = {
        video: options?.video || {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 },
          facingMode: 'user'
        },
        audio: options?.audio || {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      setState(prev => ({ ...prev, stream }));
      chunksRef.current = [];

      // Determine the best MIME type
      let mimeType = 'video/webm;codecs=vp9,opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm;codecs=vp8,opus';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/mp4';
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 2500000, // 2.5 Mbps
        audioBitsPerSecond: 128000,  // 128 kbps
      });
      
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const videoBlob = new Blob(chunksRef.current, { 
          type: mimeType 
        });
        setState(prev => ({ 
          ...prev, 
          videoBlob, 
          isRecording: false 
        }));
        
        // Clean up stream
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorder.onerror = (event) => {
        setState(prev => ({ 
          ...prev, 
          error: 'Recording failed: ' + (event as any).error?.message || 'Unknown error',
          isRecording: false 
        }));
      };

      mediaRecorder.start(1000); // Collect data every second
      setState(prev => ({ ...prev, isRecording: true }));

      // Start duration timer
      intervalRef.current = setInterval(() => {
        setState(prev => ({ ...prev, duration: prev.duration + 1 }));
      }, 1000);

    } catch (error: any) {
      let errorMessage = 'Failed to start video recording';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Camera and microphone access denied. Please allow access and try again.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No camera or microphone found. Please connect devices and try again.';
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'Video recording is not supported in this browser.';
      } else if (error.name === 'OverconstrainedError') {
        errorMessage = 'Camera constraints could not be satisfied. Please try with different settings.';
      }

      setState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        isRecording: false 
      }));
    }
  }, [state.isSupported]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop();
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (state.stream) {
      state.stream.getTracks().forEach(track => track.stop());
      setState(prev => ({ ...prev, stream: null }));
    }
  }, [state.isRecording, state.stream]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.pause();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [state.isRecording]);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.resume();
      intervalRef.current = setInterval(() => {
        setState(prev => ({ ...prev, duration: prev.duration + 1 }));
      }, 1000);
    }
  }, [state.isRecording]);

  const clearRecording = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      videoBlob: null, 
      duration: 0, 
      error: null 
    }));
    chunksRef.current = [];
  }, []);

  const downloadRecording = useCallback(() => {
    if (state.videoBlob) {
      const url = URL.createObjectURL(state.videoBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `interview-recording-${new Date().toISOString()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, [state.videoBlob]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (state.stream) {
        state.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [state.stream]);

  const formatDuration = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    ...state,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    clearRecording,
    downloadRecording,
    formatDuration,
  };
};