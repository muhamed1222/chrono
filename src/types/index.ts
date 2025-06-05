export interface Client {
  id: string;
  name: string;
  industry: string;
  logo?: string;
  color: string;
  socialAccounts: SocialAccount[];
}

export interface SocialAccount {
  id: string;
  platform: 'telegram' | 'vk' | 'instagram';
  handle: string;
  connected: boolean;
  accountName?: string;
}

export interface Post {
  id: string;
  clientId: string;
  content: string;
  media?: string[];
  platforms: ('telegram' | 'vk' | 'instagram')[];
  scheduledFor: string;
  status: 'draft' | 'scheduled' | 'published';
  createdAt: string;
  updatedAt: string;
}

export interface CalendarDay {
  date: string;
  posts: Post[];
}

export interface PostTemplate {
  id: string;
  title: string;
  description: string;
  content: string;
  industry?: string;
}

export type UserRole = 'viewer' | 'editor' | 'admin';
