import React, { createContext, useContext, useEffect, useState } from 'react';
import supabase from '../Supabase/supabase';

// Types for AuthContext
const AuthContext = createContext(undefined);

export default function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    session: null, // Session from Supabase
    loading: true,
    user: null,
    isAdmin: false,
    isHcp: false,
    resetPending: false,
  });

  const setResetPending = (value) => {
    setAuthState((prev) => ({ ...prev, resetPending: value }));
  };

  useEffect(() => {
    if (authState.resetPending) return;

    const fetchSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error);
        setAuthState((prev) => ({ ...prev, loading: false }));
        return;
      }

      if (session) {
        await fetchUserProfile(session.user.id, session);
      } else {
        setAuthState((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchUserProfile(session.user.id, session);
      } else {
        setAuthState((prev) => ({
          session: null,
          loading: false,
          user: null,
          isAdmin: false,
          isHcp: false,
          resetPending: false,
        }));
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [authState.resetPending]);

  const fetchUserProfile = async (userId, session = authState.session) => {
    if (authState.resetPending) return;

    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      setAuthState((prev) => ({
        ...prev,
        session,
        loading: false,
        user: data,
        isAdmin: data.role === 'admin',
        isHcp: data.role === 'hcp',
      }));
    } catch (err) {
      console.error('Unexpected error fetching user profile:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session: authState.session,
        loading: authState.loading,
        user: authState.user,
        isAdmin: authState.isAdmin,
        isHcp: authState.isHcp,
        resetPending: authState.resetPending,
        setResetPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
