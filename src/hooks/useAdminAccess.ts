// src/hooks/useAdminAccess.ts
import { useAuth } from './useAuth';

/**
 * Hook to check if current user has admin access
 * @returns Object with admin status and role information
 */
export const useAdminAccess = () => {
  const { profile, loading } = useAuth();

  const isAdmin = profile?.role === 'admin';
  const isManager = profile?.role === 'manager';
  const isUser = profile?.role === 'user';
  
  // Admin and Manager have elevated privileges
  const hasElevatedAccess = isAdmin || isManager;
  
  // Only admin has full admin panel access
  const hasAdminPanelAccess = isAdmin;

  return {
    isAdmin,
    isManager,
    isUser,
    hasElevatedAccess,
    hasAdminPanelAccess,
    role: profile?.role || null,
    loading,
    profile,
  };
};

/**
 * Hook to require admin access - throws error if not admin
 * @returns Admin user profile
 */
export const useRequireAdmin = () => {
  const { hasAdminPanelAccess, profile, loading } = useAdminAccess();

  if (!loading && !hasAdminPanelAccess) {
    throw new Error('Admin access required');
  }

  return {
    profile,
    loading,
    isAdmin: hasAdminPanelAccess,
  };
};
