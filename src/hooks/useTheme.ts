import { useContext } from 'react';
import { ThemeProviderContext } from '../context/ThemeContext';

/**
 * Hook to access theme context
 * @returns Theme context with current theme and setTheme function
 * @throws Error if used outside ThemeProvider
 */
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
