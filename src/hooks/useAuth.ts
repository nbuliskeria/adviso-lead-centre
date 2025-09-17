import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Hook to access authentication context
 * @returns Authentication context with session, user, profile, and signOut function
 * @throws Error if used outside AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
