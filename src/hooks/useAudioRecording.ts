import { useState, useRef, useCallback, useEffect } from 'react';
import { AudioRecordingState } from '@/types/practice';

export const useAudioRecording = () => {
  const [state, setState] = useState<AudioRecordingState>({
    isRecording: false,
    isSupported: false,
    error: null,
    duration: 0,
    audioBlob: null,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check if audio recording is supported
  useEffect(() => {
    const isSupported = !!(navigator.mediaDevices && window.MediaRecorder);
    setState(prev => ({ ...prev, isSupported }));
  }, []);

  const startRecording = useCallback(async () => {
    if (!state.isSupported) {
      setState(prev => ({ ...prev, error: 'Audio recording is not supported in this browser' }));
      return;
    }

    try {
      setState(prev => ({ ...prev, error: null, duration: 0, audioBlob: null }));
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        } 
      });
      
      streamRef.current = stream;
      chunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      });
      
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { 
          type: mediaRecorder.mimeType || 'audio/webm' 
        });
        setState(prev => ({ ...prev, audioBlob, isRecording: false }));
        
        // Clean up stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorder.onerror = (event) => {
        setState(prev => ({ 
          ...prev, 
          error: 'Recording failed: ' + (event as any).error?.message || 'Unknown error',
          isRecording: false 
        }));
      };

      mediaRecorder.start(100); // Collect data every 100ms
      setState(prev => ({ ...prev, isRecording: true }));

      // Start duration timer
      intervalRef.current = setInterval(() => {
        setState(prev => ({ ...prev, duration: prev.duration + 1 }));
      }, 1000);

    } catch (error: any) {
      let errorMessage = 'Failed to start recording';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Microphone access denied. Please allow microphone access and try again.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No microphone found. Please connect a microphone and try again.';
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'Audio recording is not supported in this browser.';
      }

      setState(prev => ({ ...prev, error: errorMessage, isRecording: false }));
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
  }, [state.isRecording]);

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
      audioBlob: null, 
      duration: 0, 
      error: null 
    }));
    chunksRef.current = [];
  }, []);

  const downloadRecording = useCallback(() => {
    if (state.audioBlob) {
      const url = URL.createObjectURL(state.audioBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recording-${new Date().toISOString()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, [state.audioBlob]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const formatDuration = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
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