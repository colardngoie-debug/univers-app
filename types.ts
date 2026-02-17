
export enum ViewType {
  FEED = 'FEED',
  PULSE = 'PULSE',
  ACTUALITE = 'ACTUALITE',
  SHOP = 'SHOP',
  LIVE = 'LIVE',
  STUDIO = 'STUDIO',
  PROFILE = 'PROFILE',
  MESSENGER = 'MESSENGER'
}

export type Theme = 'light' | 'dark';
export type LangCode = string;

export interface Comment {
  id: string;
  handle: string;
  avatar: string;
  text: string;
  likes: number;
  time: string;
  isLiked?: boolean;
  replies?: Comment[];
}

export interface Post {
  id: string;
  user: {
    name: string;
    handle: string;
    avatar: string;
    verified?: boolean;
  };
  content: string;
  mediaUrl: string; // Image principale ou vidéo
  mediaUrls?: string[]; // Pour le multi-images du shop
  mediaType: 'image' | 'video';
  likes: number;
  comments: number;
  commentList?: Comment[];
  isLiked?: boolean;
  timestamp: number;
  isNews?: boolean;
  isReel?: boolean;
  isStory?: boolean;
  title?: string;
  source?: string;
  isProduct?: boolean;
  price?: string;
  currency?: string;
  category?: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  isMe: boolean;
}

export interface Conversation {
  id: string;
  user: {
    name: string;
    handle: string;
    avatar: string;
    online: boolean;
  };
  lastMessage: string;
  time: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export type MaritalStatus = 'single' | 'married' | 'widowed' | 'divorcing' | 'separated' | 'other';
