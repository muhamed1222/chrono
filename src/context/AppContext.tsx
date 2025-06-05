import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Client, Post, PostTemplate, UserRole } from '../types';
import { getSupabase, handleSupabaseError } from '../lib/supabase';
import { apiRequest } from '../lib/api';
import { formatLocalISO } from '../utils/time';
import DOMPurify from 'dompurify';
import { User } from '@supabase/supabase-js';
import type { Provider } from '@supabase/auth-js';

interface AppContextType {
  clients: Client[];
  posts: Post[];
  templates: PostTemplate[];
  currentView: 'calendar' | 'clients' | 'templates' | 'post-editor' | 'product-editor';
  selectedClient: string | null;
  selectedDate: string | null;
  selectedPost: string | null;
  user: User | null;
  role: UserRole | null;
  loading: boolean;
  error: string | null;
  toastMessage: string | null;
  showToast: (message: string) => void;
  clearToast: () => void;
  setCurrentView: (view: 'calendar' | 'clients' | 'templates' | 'post-editor' | 'product-editor') => void;
  setSelectedClient: (clientId: string | null) => void;
  setSelectedDate: (date: string | null) => void;
  setSelectedPost: (postId: string | null) => void;
  addClient: (client: Omit<Client, 'id'>) => Promise<void>;
  updateClient: (clientId: string, updates: Partial<Client>) => Promise<void>;
  deleteClient: (clientId: string) => Promise<void>;
  addPost: (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updatePost: (postId: string, updates: Partial<Post>) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithOAuth: (provider: 'telegram' | 'vk' | 'google') => Promise<void>;
  signOut: () => Promise<void>;
  signOutAll: () => Promise<void>;
  lastActivity: number;
  clearError: () => void;
  notification: string | null;
  showNotification: (message: string) => void;
  clearNotification: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [templates, setTemplates] = useState<PostTemplate[]>([]);
  const [currentView, setCurrentView] = useState<'calendar' | 'clients' | 'templates' | 'post-editor' | 'product-editor'>('calendar');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());

  const inactivityMinutes = Number(process.env.VITE_INACTIVITY_TIMEOUT_MINUTES || 0);
  const inactivityMs = inactivityMinutes > 0 ? inactivityMinutes * 60_000 : null;

  useEffect(() => {
    try {
      getSupabase();
    } catch (err) {
      setError(handleSupabaseError(err));
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Check active session and set up auth listener
    const initializeAuth = async () => {
      try {
        const supabase = getSupabase();
        // Get initial session
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        // Set up auth state listener
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user ?? null);
          if (!session) {
            // Clear data on logout
            setClients([]);
            setPosts([]);
            setTemplates([]);
          }
        });

        return () => subscription.unsubscribe();
      } catch (err) {
        setError(handleSupabaseError(err));
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    const load = async () => {
      if (user) {
        const { data } = await getSupabase()
          .from('roles')
          .select('role')
          .eq('user_id', user.id)
          .single();
        setRole((data as { role: UserRole } | null)?.role ?? 'editor');
        await loadData();
      } else {
        setRole(null);
      }
    };
    void load();
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load all data in parallel
      const [clientsData, postsData, templatesData] = await Promise.all([
        apiRequest<Client[]>('/clients'),
        apiRequest<Post[]>('/posts'),
        apiRequest<PostTemplate[]>('/templates')
      ]);

      setClients(clientsData);
      setPosts(postsData);
      setTemplates(templatesData);
    } catch (err) {
      setError(handleSupabaseError(err));
    } finally {
      setLoading(false);
    }
  };

  const addClient = async (client: Omit<Client, 'id'>) => {
    try {
      setError(null);
      const data = await apiRequest<Client>('/clients', {
        method: 'POST',
        body: JSON.stringify({ ...client, user_id: user?.id })
      });
      setClients([...clients, data]);
    } catch (err) {
      const errorMessage = handleSupabaseError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateClient = async (clientId: string, updates: Partial<Client>) => {
    try {
      setError(null);
      const data = await apiRequest<Client>(`/clients/${clientId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      setClients(clients.map(c => (c.id === clientId ? data : c)));
    } catch (err) {
      const errorMessage = handleSupabaseError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteClient = async (clientId: string) => {
    try {
      setError(null);
      await apiRequest(`/clients/${clientId}`, { method: 'DELETE' });
      setClients(clients.filter(c => c.id !== clientId));
    } catch (err) {
      const errorMessage = handleSupabaseError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const addPost = async (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      const sanitizedContent = DOMPurify.sanitize(post.content);
      const now = formatLocalISO(new Date());

      const data = await apiRequest<Post>('/posts', {
        method: 'POST',
        body: JSON.stringify({
          ...post,
          content: sanitizedContent,
          createdAt: now,
          updatedAt: now
        })
      });

      setPosts([...posts, data]);
    } catch (err) {
      const errorMessage = handleSupabaseError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updatePost = async (postId: string, updates: Partial<Post>) => {
    try {
      setError(null);
      if (updates.content) {
        updates.content = DOMPurify.sanitize(updates.content);
      }
      updates.updatedAt = formatLocalISO(new Date());

      const data = await apiRequest<Post>(`/posts/${postId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });

      setPosts(posts.map(post => (post.id === postId ? data : post)));
    } catch (err) {
      const errorMessage = handleSupabaseError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deletePost = async (postId: string) => {
    try {
      setError(null);
      await apiRequest(`/posts/${postId}`, { method: 'DELETE' });
      setPosts(posts.filter(post => post.id !== postId));
    } catch (err) {
      const errorMessage = handleSupabaseError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const { error } = await getSupabase().auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
    } catch (err) {
      const errorMessage = handleSupabaseError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setError(null);
      const { error } = await getSupabase().auth.signUp({
        email,
        password,
      });
      if (error) throw error;
    } catch (err) {
      const errorMessage = handleSupabaseError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const signInWithOAuth = async (
    provider: 'telegram' | 'vk' | 'google'
  ) => {
    try {
      setError(null);
      const { error } = await getSupabase().auth.signInWithOAuth({
        provider: provider as unknown as Provider,
      });
      if (error) throw error;
    } catch (err) {
      const errorMessage = handleSupabaseError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      const { error } = await getSupabase().auth.signOut();
      if (error) throw error;
    } catch (err) {
      const errorMessage = handleSupabaseError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const signOutAll = async () => {
    try {
      setError(null);
      const { error } = await getSupabase().auth.signOut({ scope: 'global' });
      if (error) throw error;
    } catch (err) {
      const errorMessage = handleSupabaseError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    if (!inactivityMs) return;
    const update = () => setLastActivity(Date.now());
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach((e) => window.addEventListener(e, update));
    return () => {
      events.forEach((e) => window.removeEventListener(e, update));
    };
  }, [inactivityMs]);

  useEffect(() => {
    if (!inactivityMs) return;
    const timer = setTimeout(() => {
      signOut();
    }, inactivityMs);
    return () => clearTimeout(timer);
  }, [lastActivity, inactivityMs]);

  const clearError = () => setError(null);

  return (
    <AppContext.Provider
      value={{
        clients,
        posts,
        templates,
        currentView,
        selectedClient,
        selectedDate,
        selectedPost,
        user,
        role,
        loading,
        error,
        toastMessage,
        setCurrentView,
        setSelectedClient,
        setSelectedDate,
        setSelectedPost,
        addClient,
        updateClient,
        deleteClient,
        addPost,
        updatePost,
        deletePost,
        signIn,
        signUp,
        signInWithOAuth,
        signOut,
        signOutAll,
        lastActivity,
        clearError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};