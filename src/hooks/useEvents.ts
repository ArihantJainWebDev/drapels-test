import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import * as eventService from '@/services/eventService';
import { Event, EventFilters } from '@/types/events';

export const useEnhancedEvents = (filters?: EventFilters) => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = eventService.getEvents((eventsData) => {
      try {
        // Add registration status for current user
        const eventsWithRegistration = eventsData.map(event => ({
          ...event,
          isRegistered: user ? (event.attendees || []).includes(user.uid) : false
        }));
        
        setEvents(eventsWithRegistration);
        setLoading(false);
        setError(null);
      } catch (err: any) {
        console.error('Error processing events:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while processing events');
        setLoading(false);
      }
    }, filters);

    return unsubscribe;
  }, [user, filters]);

  const registerForEvent = useCallback(async (eventId: string) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const result = await eventService.registerForEvent(eventId, user.uid);
      if (result.success) {
        // Update local state immediately
        setEvents(prev => prev.map(event => 
          event.id === eventId 
            ? { ...event, isRegistered: true, attendeeCount: (event.attendeeCount || 0) + 1 }
            : event
        ));
      }
      return result;
    } catch (error) {
      console.error('Error registering for event:', error);
      throw error;
    }
  }, [user]);

  const unregisterFromEvent = useCallback(async (eventId: string) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const result = await eventService.unregisterFromEvent(eventId, user.uid);
      if (result.success) {
        // Update local state immediately
        setEvents(prev => prev.map(event => 
          event.id === eventId 
            ? { ...event, isRegistered: false, attendeeCount: Math.max((event.attendeeCount || 1) - 1, 0) }
            : event
        ));
      }
      return result;
    } catch (error) {
      console.error('Error unregistering from event:', error);
      throw error;
    }
  }, [user]);

  const createEvent = useCallback(async (eventData: any) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const result = await eventService.createEvent(eventData, user.uid);
      return result;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }, [user]);

  const searchEvents = useCallback(async (searchTerm: string, searchFilters?: EventFilters) => {
    try {
      const result = await eventService.searchEvents(searchTerm, searchFilters);
      return result;
    } catch (error) {
      console.error('Error searching events:', error);
      throw error;
    }
  }, []);

  return { 
    events, 
    loading, 
    error, 
    registerForEvent, 
    unregisterFromEvent,
    createEvent,
    searchEvents
  };
};
