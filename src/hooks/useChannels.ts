import { useEffect, useState, useMemo, useCallback } from 'react';
import {
  getChannels,
  joinChannel as svcJoinChannel,
  leaveChannel as svcLeaveChannel,
} from '../services/communityService';

export interface ChannelDoc {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  avatarUrl?: string;
  createdAt?: any;
  updatedAt?: any;
  memberCount?: number;
  postCount?: number;
  lastActivity?: any;
  members?: string[];
  admins?: string[];
}

export function useChannels(currentUserId?: string | null) {
  const [channels, setChannels] = useState<ChannelDoc[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsub = getChannels((snapshot: any) => {
      try {
        const list: ChannelDoc[] = snapshot.docs.map((d: any) => ({ id: d.id, ...d.data() }));
        setChannels(list);
        setError(null);
      } catch (e: any) {
        setError(e?.message || 'Failed to load channels');
      } finally {
        setLoading(false);
      }
    });
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, []);

  const myJoined = useMemo(() => {
    if (!currentUserId) return new Set<string>();
    const joined = channels.filter(c => Array.isArray(c.members) && c.members.includes(currentUserId)).map(c => c.id);
    return new Set(joined);
  }, [channels, currentUserId]);

  const join = useCallback(async (channelId: string) => {
    if (!currentUserId) throw new Error('Not authenticated');
    return svcJoinChannel(channelId, currentUserId);
  }, [currentUserId]);

  const leave = useCallback(async (channelId: string) => {
    if (!currentUserId) throw new Error('Not authenticated');
    return svcLeaveChannel(channelId, currentUserId);
  }, [currentUserId]);

  return { channels, loading, error, myJoined, join, leave };
}
