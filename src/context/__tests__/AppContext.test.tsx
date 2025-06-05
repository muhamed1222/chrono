import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { AppProvider, useAppContext } from '../AppContext';
import { getSupabase } from '../../lib/supabase';

jest.mock('../../lib/supabase', () => {
  const signInWithPassword = jest.fn();
  const signOut = jest.fn();
  const signUp = jest.fn();
  const onAuthStateChange = jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } }));
  const getSession = jest.fn().mockResolvedValue({ data: { session: null } });
  const supabase = {
    auth: { signInWithPassword, signOut, signUp, onAuthStateChange, getSession },
    from: jest.fn(() => ({ select: jest.fn().mockReturnThis(), order: jest.fn().mockReturnThis() }))
  };
  return {
    getSupabase: jest.fn(() => supabase),
    handleSupabaseError: jest.fn().mockImplementation((e: unknown) => e instanceof Error ? e.message : 'unknown')
  };
});

const supabase = getSupabase();

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AppProvider>{children}</AppProvider>
);

describe('AppContext auth', () => {
  it('signIn calls supabase and clears error', async () => {
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({ error: null });
    const { result } = renderHook(() => useAppContext(), { wrapper });

    await act(async () => {
      await result.current.signIn('a@example.com', 'pass');
    });

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({ email: 'a@example.com', password: 'pass' });
    expect(result.current.error).toBeNull();
  });

  it('signIn sets error on failure', async () => {
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({ error: new Error('fail') });
    const { result } = renderHook(() => useAppContext(), { wrapper });
    await act(async () => {
      await expect(result.current.signIn('a@example.com', 'pass')).rejects.toThrow('fail');
    });

    expect(result.current.error).toBe('fail');
  });
});
