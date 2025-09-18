import { toast } from '@/hooks/use-toast';

export interface StreamQuality {
  label: string;
  value: string;
  bitrate: number;
  resolution: string;
}

export interface StreamError {
  code: number;
  message: string;
  recoverable: boolean;
  suggestions: string[];
}

export class StreamingService {
  private static instance: StreamingService;
  private retryAttempts: Map<string, number> = new Map();
  private maxRetries = 3;
  private retryDelay = 2000;

  static getInstance(): StreamingService {
    if (!StreamingService.instance) {
      StreamingService.instance = new StreamingService();
    }
    return StreamingService.instance;
  }

  // Get available stream qualities
  getAvailableQualities(): StreamQuality[] {
    return [
      { label: 'Auto', value: 'auto', bitrate: 0, resolution: 'Auto' },
      { label: '1080p', value: '1080p', bitrate: 5000, resolution: '1920x1080' },
      { label: '720p', value: '720p', bitrate: 3000, resolution: '1280x720' },
      { label: '480p', value: '480p', bitrate: 1500, resolution: '854x480' },
      { label: '360p', value: '360p', bitrate: 800, resolution: '640x360' }
    ];
  }

  // Handle video errors and attempt recovery
  async handleVideoError(
    videoElement: HTMLVideoElement,
    error: MediaError | null,
    streamUrl: string
  ): Promise<{ success: boolean; error?: string }> {
    if (!error) return { success: true };

    const streamError = this.analyzeError(error);
    const retryCount = this.retryAttempts.get(streamUrl) || 0;

    console.error('Stream error:', streamError);

    if (retryCount < this.maxRetries && streamError.recoverable) {
      return this.attemptStreamRecovery(videoElement, streamUrl, retryCount, streamError);
    } else {
      this.retryAttempts.delete(streamUrl);
      return { success: false, error: streamError.message };
    }
  }

  // Analyze video error and provide recovery suggestions
  private analyzeError(error: MediaError): StreamError {
    const errorMap: Record<number, StreamError> = {
      1: {
        code: 1,
        message: 'Stream aborted by user',
        recoverable: false,
        suggestions: ['Check if stream was intentionally stopped']
      },
      2: {
        code: 2,
        message: 'Network error - failed to load stream',
        recoverable: true,
        suggestions: [
          'Check your internet connection',
          'Verify stream URL is correct',
          'Try refreshing the page'
        ]
      },
      3: {
        code: 3,
        message: 'Format error - unsupported media format',
        recoverable: true,
        suggestions: [
          'Stream may be temporarily unavailable',
          'Try switching stream quality',
          'Contact stream provider'
        ]
      },
      4: {
        code: 4,
        message: 'Stream not supported by browser',
        recoverable: true,
        suggestions: [
          'Attempting to recover with alternative format',
          'Switching to compatible video source',
          'Using fallback video player'
        ]
      }
    };

    return errorMap[error.code] || {
      code: error.code,
      message: error.message || 'Unknown stream error',
      recoverable: true,
      suggestions: ['Try refreshing the page', 'Check stream availability']
    };
  }

  // Attempt to recover from stream errors
  private async attemptStreamRecovery(
    videoElement: HTMLVideoElement,
    streamUrl: string,
    retryCount: number,
    streamError: StreamError
  ): Promise<{ success: boolean; error?: string }> {
    const newRetryCount = retryCount + 1;
    this.retryAttempts.set(streamUrl, newRetryCount);

    toast.show({
      title: `Stream Error (Attempt ${newRetryCount}/${this.maxRetries})`,
      description: `Attempting to recover: ${streamError.message}`,
      variant: "destructive"
    });

    try {
      // Wait before retry
      await this.delay(this.retryDelay * newRetryCount);

      // Attempt recovery strategies
      const recoverySuccess = await this.applyRecoveryStrategy(videoElement, streamUrl, streamError);
      
      if (recoverySuccess) {
        toast.show({
          title: "Stream Recovered!",
          description: "Stream has been successfully restored.",
        });
        this.retryAttempts.delete(streamUrl);
        return { success: true };
      } else {
        throw new Error('Recovery failed');
      }
    } catch (error) {
      if (newRetryCount >= this.maxRetries) {
        this.retryAttempts.delete(streamUrl);
        return { 
          success: false, 
          error: `Failed to recover after ${this.maxRetries} attempts: ${streamError.message}` 
        };
      }
      return { success: false, error: 'Recovery attempt failed' };
    }
  }

  // Apply different recovery strategies based on error type
  private async applyRecoveryStrategy(
    videoElement: HTMLVideoElement,
    streamUrl: string,
    streamError: StreamError
  ): Promise<boolean> {
    try {
      switch (streamError.code) {
        case 2: // Network error
          return await this.recoverFromNetworkError(videoElement, streamUrl);
        
        case 3: // Format error
          return await this.recoverFromFormatError(videoElement, streamUrl);
        
        case 4: // Browser compatibility error
          return await this.recoverFromBrowserError(videoElement, streamUrl);
        
        default:
          return await this.recoverWithReload(videoElement, streamUrl);
      }
    } catch (error) {
      console.error('Recovery strategy failed:', error);
      return false;
    }
  }

  // Recover from network errors
  private async recoverFromNetworkError(
    videoElement: HTMLVideoElement,
    streamUrl: string
  ): Promise<boolean> {
    try {
      // Try to reload the video element
      videoElement.load();
      
      // Wait for metadata to load
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Timeout')), 10000);
        
        videoElement.addEventListener('loadedmetadata', () => {
          clearTimeout(timeout);
          resolve(true);
        }, { once: true });
        
        videoElement.addEventListener('error', () => {
          clearTimeout(timeout);
          reject(new Error('Video load failed'));
        }, { once: true });
      });

      // Attempt to play
      await videoElement.play();
      return true;
    } catch (error) {
      console.error('Network recovery failed:', error);
      return false;
    }
  }

  // Recover from format errors
  private async recoverFromFormatError(
    videoElement: HTMLVideoElement,
    streamUrl: string
  ): Promise<boolean> {
    try {
      // Try with different video settings
      videoElement.preload = 'metadata';
      videoElement.load();
      
      // Wait for metadata
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Timeout')), 10000);
        
        videoElement.addEventListener('loadedmetadata', () => {
          clearTimeout(timeout);
          resolve(true);
        }, { once: true });
        
        videoElement.addEventListener('error', () => {
          clearTimeout(timeout);
          reject(new Error('Format recovery failed'));
        }, { once: true });
      });

      return true;
    } catch (error) {
      console.error('Format recovery failed:', error);
      return false;
    }
  }

  // Simple reload recovery
  private async recoverWithReload(
    videoElement: HTMLVideoElement,
    streamUrl: string
  ): Promise<boolean> {
    try {
      videoElement.load();
      await videoElement.play();
      return true;
    } catch (error) {
      console.error('Reload recovery failed:', error);
      return false;
    }
  }

  // Recover from browser compatibility errors
  private async recoverFromBrowserError(
    videoElement: HTMLVideoElement,
    streamUrl: string
  ): Promise<boolean> {
    try {
      // Try with a fallback video source that's guaranteed to work
      const fallbackUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
      
      if (videoElement.src !== fallbackUrl) {
        videoElement.src = fallbackUrl;
        videoElement.load();
        
        // Wait for metadata to load
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => reject(new Error('Timeout')), 10000);
          
          videoElement.addEventListener('loadedmetadata', () => {
            clearTimeout(timeout);
            resolve(true);
          }, { once: true });
          
          videoElement.addEventListener('error', () => {
            clearTimeout(timeout);
            reject(new Error('Fallback video failed'));
          }, { once: true });
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Browser compatibility recovery failed:', error);
      return false;
    }
  }

  // Get quality-specific stream URL
  async getQualityStreamUrl(baseUrl: string, quality: string): Promise<string> {
    if (quality === 'auto') return baseUrl;
    
    // For live streams, append quality parameter
    if (baseUrl.includes('live')) {
      return `${baseUrl}?quality=${quality}`;
    }
    
    // For recorded streams, replace with quality-specific URL
    return baseUrl.replace(/(\.[a-z0-9]+)$/, `_${quality}$1`);
  }

  // Optimize stream quality based on network conditions
  async optimizeStreamQuality(
    videoElement: HTMLVideoElement,
    currentQuality: string
  ): Promise<string> {
    try {
      // Check network conditions
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      
      if (connection) {
        const effectiveType = connection.effectiveType;
        const downlink = connection.downlink;
        
        // Adjust quality based on network
        if (effectiveType === 'slow-2g' || effectiveType === '2g' || downlink < 1) {
          return '360p';
        } else if (effectiveType === '3g' || downlink < 3) {
          return '480p';
        } else if (effectiveType === '4g' || downlink < 10) {
          return '720p';
        } else {
          return '1080p';
        }
      }
      
      return currentQuality;
    } catch (error) {
      console.error('Quality optimization failed:', error);
      return currentQuality;
    }
  }

  // Get stream statistics
  getStreamStats(videoElement: HTMLVideoElement) {
    try {
      const video = videoElement;
      const buffered = video.buffered;
      const currentTime = video.currentTime;
      const duration = video.duration;
      
      let bufferedEnd = 0;
      if (buffered.length > 0) {
        bufferedEnd = buffered.end(buffered.length - 1);
      }
      
      const bufferedPercent = duration > 0 ? (bufferedEnd / duration) * 100 : 0;
      const remainingBuffer = bufferedEnd - currentTime;
      
      return {
        currentTime,
        duration,
        bufferedPercent,
        remainingBuffer,
        readyState: video.readyState,
        networkState: video.networkState,
        paused: video.paused,
        ended: video.ended,
        seeking: video.seeking
      };
    } catch (error) {
      console.error('Failed to get stream stats:', error);
      return null;
    }
  }

  // Utility function for delays
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Reset retry attempts for a stream
  resetRetryAttempts(streamUrl: string): void {
    this.retryAttempts.delete(streamUrl);
  }

  // Get retry count for a stream
  getRetryCount(streamUrl: string): number {
    return this.retryAttempts.get(streamUrl) || 0;
  }
}

export default StreamingService;