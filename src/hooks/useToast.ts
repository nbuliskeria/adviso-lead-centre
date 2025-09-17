import { useContext } from 'react';
import { ToastContext } from '../context/ToastContext';

/**
 * Hook to access toast context
 * @returns Toast context with addToast and removeToast functions
 * @throws Error if used outside ToastProvider
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
};
