import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Client, Post, PostTemplate } from '../types';
import { supabase, handleSupabaseError } from '../lib/supabase';
import sanitizeHtml from 'sanitize-html';
import { User } from '@supabase/supabase-js';

interface AppContextType {
  clients: Client[];
  posts: Post[];
  templates: PostTemplate[];
  currentView: 'calendar' | 'clients' | 'templates' | 'post-editor';
  selectedClient: string | null;
  selectedDate: string | null;
  selectedPost: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  setCurrentView: (view: 'calendar' | 'clients' | 'templates' | 'post-editor') => void;
  setSelectedClient: (clientId: string | null) => void;
  setSelectedDate: (date: string | null) => void;
  setSelectedPost: (postId: string | null) => void;
  addClient: (client: Omit<Client, 'id'>) => Promise<void>;
  addPost: (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updatePost: (postId: string, updates: Partial<Post>) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [templates, setTemplates] = useState<PostTemplate[]>([]);
  const [currentView, setCurrentView] = useState<'calendar' | 'clients' | 'templates' | 'post-editor'>('calendar');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check active session and set up auth listener
    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load all data in parallel
      const [
        { data: clientsData, error: clientsError },
        { data: postsData, error: postsError },
        { data: templatesData, error: templatesError }
      ] = await Promise.all([
        supabase.from('clients').select('*').order('name'),
        supabase.from('posts').select('*').order('scheduledFor'),
        supabase.from('templates').select('*')
      ]);

      if (clientsError) throw clientsError;
      if (postsError) throw postsError;
      if (templatesError) throw templatesError;

      setClients(clientsData || []);
      setPosts(postsData || []);
      setTemplates(templatesData || []);
    } catch (err) {
      setError(handleSupabaseError(err));
    } finally {
      setLoading(false);
    }
  };

  const addClient = async (client: Omit<Client, 'id'>) => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('clients')
        .insert([{ ...client, user_id: user?.id }])
        .select()
        .single();
      
      if (error) throw error;
      setClients([...clients, data]);
    } catch (err) {
      const errorMessage = handleSupabaseError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const addPost = async (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      const sanitizedContent = sanitizeHtml(post.content);
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('posts')
        .insert([{
          ...post,
          content: sanitizedContent,
          createdAt: now,
          updatedAt: now
        }])
        .select()
        .single();
      
      if (error) throw error;
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
        updates.content = sanitizeHtml(updates.content);
      }
      updates.updatedAt = new Date().toISOString();

      const { data, error } = await supabase
        .from('posts')
        .update(updates)
        .eq('id', postId)
        .select()
        .single();
      
      if (error) throw error;
      setPosts(posts.map(post => post.id === postId ? data : post));
    } catch (err) {
      const errorMessage = handleSupabaseError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deletePost = async (postId: string) => {
    try {
      setError(null);
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);
      
      if (error) throw error;
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
      const { error } = await supabase.auth.signInWithPassword({
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

  const signOut = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (err) {
      const errorMessage = handleSupabaseError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

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
        loading,
        error,
        setCurrentView,
        setSelectedClient,
        setSelectedDate,
        setSelectedPost,
        addClient,
        addPost,
        updatePost,
        deletePost,
        signIn,
        signOut,
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