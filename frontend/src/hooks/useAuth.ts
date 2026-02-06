/**
 * Auth Hook - Wrapper around useAuthStore
 *
 * Provides a simplified interface to the auth store
 */

import { useAuthStore } from '@/store/auth.store';

export const useAuth = () => {
  const { user, session, isLoading, isAuthenticated, signOut } = useAuthStore();

  return {
    user,
    session,
    isLoading,
    isAuthenticated,
    signOut,
  };
};

export default useAuth;
