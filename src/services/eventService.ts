import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where, 
  onSnapshot,
  increment,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  getDoc,
  writeBatch,
  limit
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { 
  Event, 
  LiveEvent, 
  RecordedEvent, 
  CreateEventData, 
  UpdateEventData,
  ChatMessage, 
  EventFilters,
  EventAdminControls
} from '../types/events';

// ============ EVENT MANAGEMENT ============
export const createEvent = async (eventData: CreateEventData, hostId: string): Promise<{ success: boolean; id?: string; error?: string }> => {
  try {
    const batch = writeBatch(db);
    
    // Create event document reference first
    const eventRef = doc(collection(db, 'events'));
    
    // Create event document
    const eventDoc: any = {
      title: eventData.title,
      description: eventData.description,
      date: new Date(eventData.date),
      timezone: eventData.timezone || 'UTC',
      hostId,
      type: eventData.type,
      status: eventData.startImmediately ? 'live' : 'upcoming',
      attendeeCount: 0,
      attendees: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      tags: eventData.tags || [],
      chatEnabled: true, // Always enabled
      qaEnabled: true, // Always enabled
      canEdit: true, // Host can always edit
      canStart: true, // Host can always start
      canStartImmediately: eventData.startImmediately || false,
      isLocked: eventData.isLocked || false,
      passcode: eventData.passcode || null,
      allowParticipantScreenShare: false, // Default to false, host controls this
      allowParticipantWhiteboard: false // Default to false, host controls this
    };

    // Only add maxAttendees if it's provided and valid
    if (eventData.maxAttendees && eventData.maxAttendees !== '1000+') {
      eventDoc.maxAttendees = parseInt(eventData.maxAttendees);
    } else if (eventData.maxAttendees === '1000+') {
      eventDoc.maxAttendees = 1000;
    }

    if (eventData.type === 'live') {
      // Generate stream key for live events
      const streamKey = `live_${eventRef.id}_${Date.now()}`;
      eventDoc.streamKey = streamKey;
      eventDoc.isStreaming = eventData.startImmediately || false;
      
      if (eventData.startImmediately) {
        eventDoc.startedAt = serverTimestamp();
        // Don't set streamUrl until actual stream starts
        eventDoc.streamUrl = null;
      } else {
        // For upcoming live events, no stream URL yet
        eventDoc.streamUrl = null;
      }
    } else if (eventData.type === 'recorded' && eventData.videoFile) {
      // Upload video file for recorded events
      const videoRef = ref(storage, `events/${eventRef.id}/video.mp4`);
      const videoSnapshot = await uploadBytes(videoRef, eventData.videoFile);
      const videoUrl = await getDownloadURL(videoSnapshot.ref);
      
      eventDoc.videoUrl = videoUrl;
      eventDoc.duration = 0; // Will be updated after processing
    }

    batch.set(eventRef, eventDoc);

    // Create chat collection for the event
    const chatRef = doc(collection(db, 'eventChats'));
    batch.set(chatRef, {
      eventId: eventRef.id,
      createdAt: serverTimestamp(),
      messages: []
    });

    await batch.commit();
    return { success: true, id: eventRef.id };
  } catch (error: any) {
    console.error('Error creating event:', error);
    return { success: false, error: error.message };
  }
};

export const getEvents = (callback: (events: Event[]) => void, filters?: EventFilters) => {
  let q = query(collection(db, 'events'));
  
  // Apply filters
  if (filters?.type && filters.type !== 'all') {
    q = query(q, where('type', '==', filters.type));
  }
  
  if (filters?.status && filters.status !== 'all') {
    q = query(q, where('status', '==', filters.status));
  }
  
  if (filters?.dateRange && filters.dateRange !== 'all') {
    const now = new Date();
    let startDate: Date;
    
    switch (filters.dateRange) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      default:
        startDate = new Date(0);
    }
    
    q = query(q, where('date', '>=', startDate));
  }
  
  q = query(q, orderBy('date', 'asc'), limit(50));
  
  return onSnapshot(q, (snapshot) => {
    const events: Event[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      events.push({
        id: doc.id,
        ...data,
        date: data.date?.toDate ? data.date.toDate() : new Date(data.date),
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt)
      } as Event);
    });
    callback(events);
  }, (error) => {
    console.error('Error fetching events:', error);
  });
};

export const getEventById = async (eventId: string): Promise<{ success: boolean; event?: Event; error?: string }> => {
  try {
    const eventDoc = await getDoc(doc(db, 'events', eventId));
    if (!eventDoc.exists()) {
      return { success: false, error: 'Event not found' };
    }
    
    const data = eventDoc.data();
    const event: Event = {
      id: eventDoc.id,
      ...data,
      date: data.date?.toDate ? data.date.toDate() : new Date(data.date),
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt)
    } as Event;
    
    return { success: true, event };
  } catch (error: any) {
    console.error('Error fetching event:', error);
    return { success: false, error: error.message };
  }
};

// ============ ADMIN CONTROLS ============
export const getEventAdminControls = async (eventId: string, userId: string): Promise<EventAdminControls> => {
  try {
    const eventDoc = await getDoc(doc(db, 'events', eventId));
    if (!eventDoc.exists()) {
      return {
        canEdit: false,
        canStart: false,
        canDelete: false,
        canManageAttendees: false
      };
    }
    
    const eventData = eventDoc.data();
    const isHost = eventData.hostId === userId;
    
    return {
      canEdit: isHost,
      canStart: isHost && eventData.type === 'live' && eventData.status === 'upcoming',
      canDelete: isHost && eventData.status === 'upcoming',
      canManageAttendees: isHost
    };
  } catch (error: any) {
    console.error('Error getting admin controls:', error);
    return {
      canEdit: false,
      canStart: false,
      canDelete: false,
      canManageAttendees: false
    };
  }
};

export const updateEvent = async (eventId: string, updates: UpdateEventData, userId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // Check if user can edit this event
    const adminControls = await getEventAdminControls(eventId, userId);
    if (!adminControls.canEdit) {
      return { success: false, error: 'You do not have permission to edit this event' };
    }

    const eventRef = doc(db, 'events', eventId);
    const updateData: any = {
      updatedAt: serverTimestamp()
    };

    // Handle date and time updates
    if (updates.date || updates.time) {
      const currentEvent = await getDoc(eventRef);
      if (currentEvent.exists()) {
        const currentData = currentEvent.data();
        const currentDate = currentData.date?.toDate ? currentData.date.toDate() : new Date(currentData.date);
        
        if (updates.date && updates.time) {
          // Both date and time provided
          updateData.date = new Date(`${updates.date}T${updates.time}`);
        } else if (updates.date) {
          // Only date provided, keep current time
          const currentTime = currentDate.toTimeString().split(' ')[0];
          updateData.date = new Date(`${updates.date}T${currentTime}`);
        } else if (updates.time) {
          // Only time provided, keep current date
          const currentDateStr = currentDate.toISOString().split('T')[0];
          updateData.date = new Date(`${currentDateStr}T${updates.time}`);
        }
      }
    }

    // Handle other updates
    if (updates.title) updateData.title = updates.title;
    if (updates.description) updateData.description = updates.description;
    if (updates.timezone) updateData.timezone = updates.timezone;
    if (updates.location) updateData.location = updates.location;
    if (updates.tags) updateData.tags = updates.tags;
    if (updates.maxAttendees !== undefined) {
      if (updates.maxAttendees && updates.maxAttendees > 0) {
        updateData.maxAttendees = updates.maxAttendees;
      } else {
        updateData.maxAttendees = null; // Remove the field
      }
    }
    if (updates.chatEnabled !== undefined) updateData.chatEnabled = updates.chatEnabled;
    if (updates.qaEnabled !== undefined) updateData.qaEnabled = updates.qaEnabled;

    await updateDoc(eventRef, updateData);
    return { success: true };
  } catch (error: any) {
    console.error('Error updating event:', error);
    return { success: false, error: error.message };
  }
};

export const startEventImmediately = async (eventId: string, userId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // Check if user can start this event
    const adminControls = await getEventAdminControls(eventId, userId);
    if (!adminControls.canStart) {
      return { success: false, error: 'You do not have permission to start this event' };
    }

    const eventRef = doc(db, 'events', eventId);
    const eventDoc = await getDoc(eventRef);
    
    if (!eventDoc.exists()) {
      return { success: false, error: 'Event not found' };
    }

    const eventData = eventDoc.data();
    if (eventData.type !== 'live') {
      return { success: false, error: 'Only live events can be started immediately' };
    }

    if (eventData.status !== 'upcoming') {
      return { success: false, error: 'Event is not in upcoming status' };
    }

    // Start the event
    await updateDoc(eventRef, {
      status: 'live',
      isStreaming: true,
      startedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error starting event immediately:', error);
    return { success: false, error: error.message };
  }
};

export const deleteEvent = async (eventId: string, userId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // Check if user can delete this event
    const adminControls = await getEventAdminControls(eventId, userId);
    if (!adminControls.canDelete) {
      return { success: false, error: 'You do not have permission to delete this event' };
    }

    const batch = writeBatch(db);
    
    // Delete event
    batch.delete(doc(db, 'events', eventId));
    
    // Delete chat messages
    const chatQuery = query(collection(db, 'eventChats'), where('eventId', '==', eventId));
    const chatSnapshot = await getDocs(chatQuery);
    chatSnapshot.forEach((chatDoc) => {
      batch.delete(chatDoc.ref);
    });
    
    await batch.commit();
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting event:', error);
    return { success: false, error: error.message };
  }
};

// ============ LIVE STREAMING ============
export const startLiveStream = async (eventId: string, streamUrl?: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const eventRef = doc(db, 'events', eventId);
    
    // Ensure streamUrl is never undefined or mock
    const updateData: any = {
      status: 'live',
      isStreaming: true,
      startedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    // Only add streamUrl if it's provided and not a mock URL
    if (streamUrl && streamUrl.trim() !== '' && !streamUrl.includes('commondatastorage.googleapis.com')) {
      updateData.streamUrl = streamUrl;
    } else {
      // Don't set streamUrl if it's invalid or mock
      updateData.streamUrl = null;
    }
    
    await updateDoc(eventRef, updateData);
    return { success: true };
  } catch (error: any) {
    console.error('Error starting live stream:', error);
    return { success: false, error: error.message };
  }
};

export const stopLiveStream = async (eventId: string, recordingBlob?: Blob): Promise<{ success: boolean; error?: string }> => {
  try {
    const eventRef = doc(db, 'events', eventId);
    
    // Update event status
    await updateDoc(eventRef, {
      status: 'ended',
      endedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // If recording exists, save it
    if (recordingBlob) {
      try {
        // Convert blob to base64 for storage (or upload to Firebase Storage)
        const reader = new FileReader();
        reader.readAsDataURL(recordingBlob);
        reader.onload = async () => {
          const base64Data = reader.result as string;
          
          // Save recording metadata to event
          await updateDoc(eventRef, {
            hasRecording: true,
            recordingUrl: base64Data, // In production, upload to Firebase Storage
            recordingSize: recordingBlob.size,
            recordingDuration: Date.now() // You'd calculate actual duration
          });
        };
      } catch (recordingError) {
        console.error('Error saving recording:', recordingError);
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error stopping live stream:', error);
    return { success: false, error: 'Failed to stop live stream' };
  }
};

export const getLiveStreamStats = (eventId: string, callback: (stats: any) => void) => {
  const q = query(
    collection(db, 'eventStats'),
    where('eventId', '==', eventId)
  );
  
  return onSnapshot(q, (snapshot) => {
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      callback(data);
    }
  });
};

// ============ CHAT & Q&A ============
export const sendChatMessage = async (eventId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<{ success: boolean; id?: string; error?: string }> => {
  try {
    const chatDoc = {
      eventId,
      userId: message.userId,
      userName: message.userName,
      userAvatar: message.userAvatar,
      message: message.message,
      type: message.type,
      timestamp: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'eventChats'), chatDoc);
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error('Error sending chat message:', error);
    return { success: false, error: error.message };
  }
};

export const getEventChat = (eventId: string, callback: (messages: ChatMessage[]) => void) => {
  const q = query(
    collection(db, 'eventChats'),
    where('eventId', '==', eventId),
    orderBy('timestamp', 'asc'),
    limit(100)
  );
  
  return onSnapshot(q, (snapshot) => {
    const messages: ChatMessage[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      messages.push({
        id: doc.id,
        ...data,
        timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : new Date(data.timestamp)
      } as ChatMessage);
    });
    callback(messages);
  });
};

export const raiseHand = async (eventId: string, userId: string, userName: string): Promise<{ success: boolean; error?: string }> => {
  try {
    await addDoc(collection(db, 'eventChats'), {
      eventId,
      userId,
      userName,
      message: '👋 Raised hand',
      type: 'hand_raise',
      timestamp: serverTimestamp()
    });
    return { success: true };
  } catch (error: any) {
    console.error('Error raising hand:', error);
    return { success: false, error: error.message };
  }
};

// ============ EVENT REGISTRATION ============
export const registerForEvent = async (eventId: string, userId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const eventRef = doc(db, 'events', eventId);
    const eventDoc = await getDoc(eventRef);
    
    if (!eventDoc.exists()) {
      return { success: false, error: 'Event not found' };
    }
    
    const eventData = eventDoc.data();
    const attendees = eventData.attendees || [];
    
    if (attendees.includes(userId)) {
      return { success: false, error: 'Already registered' };
    }
    
    // Check max attendees for live events
    if (eventData.type === 'live' && eventData.maxAttendees && eventData.attendeeCount >= eventData.maxAttendees) {
      return { success: false, error: 'Event is at full capacity' };
    }
    
    await updateDoc(eventRef, {
      attendeeCount: increment(1),
      attendees: arrayUnion(userId)
    });
    
    return { success: true };
  } catch (error: any) {
    console.error('Error registering for event:', error);
    return { success: false, error: error.message };
  }
};

export const unregisterFromEvent = async (eventId: string, userId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const eventRef = doc(db, 'events', eventId);
    await updateDoc(eventRef, {
      attendeeCount: increment(-1),
      attendees: arrayRemove(userId)
    });
    
    return { success: true };
  } catch (error: any) {
    console.error('Error unregistering from event:', error);
    return { success: false, error: error.message };
  }
};

// ============ RECORDED EVENTS ============
export const addTimestampedQuestion = async (eventId: string, question: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<{ success: boolean; id?: string; error?: string }> => {
  try {
    const questionDoc = {
      eventId,
      userId: question.userId,
      userName: question.userName,
      userAvatar: question.userAvatar,
      question: question.message,
      timestamp: serverTimestamp(),
      answered: false
    };
    
    const docRef = await addDoc(collection(db, 'eventQuestions'), questionDoc);
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error('Error adding timestamped question:', error);
    return { success: false, error: error.message };
  }
};

export const answerQuestion = async (questionId: string, answer: string, answeredBy: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const questionRef = doc(db, 'eventQuestions', questionId);
    await updateDoc(questionRef, {
      answer,
      answeredBy,
      answeredAt: serverTimestamp(),
      answered: true
    });
    
    return { success: true };
  } catch (error: any) {
    console.error('Error answering question:', error);
    return { success: false, error: error.message };
  }
};

export const getEventQuestions = (eventId: string, callback: (questions: any[]) => void) => {
  const q = query(
    collection(db, 'eventQuestions'),
    where('eventId', '==', eventId),
    orderBy('timestamp', 'asc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const questions: any[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      questions.push({
        id: doc.id,
        ...data,
        timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : new Date(data.timestamp),
        answeredAt: data.answeredAt?.toDate ? data.answeredAt.toDate() : new Date(data.answeredAt)
      });
    });
    callback(questions);
  });
};

// ============ SEARCH & FILTERS ============
export const searchEvents = async (searchTerm: string, filters?: EventFilters): Promise<{ success: boolean; events?: Event[]; error?: string }> => {
  try {
    let q = query(collection(db, 'events'));
    
    // Apply search filters
    if (filters?.type && filters.type !== 'all') {
      q = query(q, where('type', '==', filters.type));
    }
    
    if (filters?.status && filters.status !== 'all') {
      q = query(q, where('status', '==', filters.status));
    }
    
    q = query(q, orderBy('date', 'desc'), limit(20));
    
    const snapshot = await getDocs(q);
    const events: Event[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      const event: Event = {
        id: doc.id,
        ...data,
        date: data.date?.toDate ? data.date.toDate() : new Date(data.date),
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt)
      } as Event;
      
      // Filter by search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        if (
          event.title.toLowerCase().includes(searchLower) ||
          event.description.toLowerCase().includes(searchLower) ||
          event.tags?.some(tag => tag.toLowerCase().includes(searchLower))
        ) {
          events.push(event);
        }
      } else {
        events.push(event);
      }
    });
    
    return { success: true, events };
  } catch (error: any) {
    console.error('Error searching events:', error);
    return { success: false, error: error.message };
  }
};

// ============ TIMEZONE UTILITIES ============
export const getAvailableTimezones = (): string[] => {
  // Common timezones - you can expand this list
  return [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Kolkata',
    'Australia/Sydney',
    'Pacific/Auckland'
  ];
};

export const formatEventTime = (date: Date, timezone: string): string => {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    }).format(date);
  } catch (error) {
    // Fallback to UTC if timezone is invalid
    return date.toLocaleString('en-US', { timeZone: 'UTC' });
  }
};

export const getCurrentTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

// Get working video source for events
export const getWorkingVideoSource = (event: Event): string => {
  if (event.type === 'recorded' && (event as RecordedEvent).videoUrl) {
    return (event as RecordedEvent).videoUrl;
  }
  
  if (event.type === 'live') {
    // For live events, return a working video source
    if (event.status === 'live' && (event as LiveEvent).streamUrl) {
      return (event as RecordedEvent).videoUrl ?? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
    }
    
    // For upcoming live events, return a placeholder video
    return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  }
  
  // Fallback to a working video
  return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
};
