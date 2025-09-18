export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  timezone: string; // Added timezone field
  location: string;
  hostId: string;
  hostName?: string;
  hostAvatar?: string;
  type: 'live' | 'recorded';
  status: 'upcoming' | 'live' | 'ended' | 'cancelled';
  attendeeCount: number;
  attendees: string[];
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  thumbnail?: string;
  isRegistered?: boolean;
  canEdit?: boolean; // Added admin control flag
  canStart?: boolean; // Added start control flag
  isLocked?: boolean; // Added passcode protection flag
  passcode?: string; // Added passcode field
  streamUrl?: string; // Added stream URL field
  allowParticipantScreenShare?: boolean; // Added participant screen share permission
  allowParticipantWhiteboard?: boolean; // Added participant whiteboard permission
}

export interface LiveEvent extends Event {
  type: 'live';
  streamKey?: string;
  streamUrl?: string;
  isStreaming: boolean;
  startedAt?: Date;
  endedAt?: Date;
  maxAttendees?: number;
  chatEnabled: boolean;
  qaEnabled: boolean;
  canStartImmediately?: boolean; // Added immediate start flag
}

export interface RecordedEvent extends Event {
  type: 'recorded';
  videoUrl: string;
  duration: number; // in seconds
  transcript?: string;
  chapters?: VideoChapter[];
  questions?: TimestampedQuestion[];
}

export interface VideoChapter {
  timestamp: number; // in seconds
  title: string;
  description?: string;
}

export interface TimestampedQuestion {
  id: string;
  timestamp: number; // in seconds
  question: string;
  answer?: string;
  askedBy: string;
  askedByName?: string;
  askedAt: Date;
  answeredAt?: Date;
  answeredBy?: string;
  answeredByName?: string;
}

export interface ChatMessage {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  message: string;
  timestamp: Date;
  type: 'chat' | 'question' | 'hand_raise';
}

export interface LiveStreamStats {
  viewers: number;
  peakViewers: number;
  totalWatchTime: number;
  chatMessages: number;
  questions: number;
  handRaises: number;
}

export interface EventFilters {
  type?: 'live' | 'recorded' | 'all';
  status?: 'upcoming' | 'live' | 'ended' | 'all';
  dateRange?: 'today' | 'week' | 'month' | 'all';
  tags?: string[];
}

export interface CreateEventData {
  title: string;
  description: string;
  date: string;
  time: string;
  timezone: string; // Added timezone
  type: 'live' | 'recorded';
  tags?: string[];
  maxAttendees?: '100' | '500' | '1000+';
  videoFile?: File; // for recorded events
  startImmediately?: boolean; // Added immediate start option
  isLocked?: boolean;
  passcode?: string;
}

export interface UpdateEventData {
  title?: string;
  description?: string;
  date?: string;
  time?: string;
  timezone?: string;
  location?: string;
  tags?: string[];
  maxAttendees?: number;
  chatEnabled?: boolean;
  qaEnabled?: boolean;
  startImmediately?: boolean;
}

export interface EventAdminControls {
  canEdit: boolean;
  canStart: boolean;
  canDelete: boolean;
  canManageAttendees: boolean;
}

export interface JoinEventData {
  eventId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
}

export interface StreamControlData {
  eventId: string;
  action: 'start' | 'stop' | 'pause' | 'resume';
  streamKey?: string;
  streamUrl?: string;
}
