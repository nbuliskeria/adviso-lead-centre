import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div 
      className="h-screen flex"
      style={{
        background: 'var(--color-background-secondary)',
      } as React.CSSProperties}
    >
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md"
            onClick={toggleMobileMenu}
          />
          <div className="fixed inset-y-0 left-0 w-64 glass-card">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={toggleMobileMenu} />
        
        <main 
          className="flex-1 overflow-auto relative"
          style={{
            background: 'var(--color-background-secondary)',
          } as React.CSSProperties}
        >
          {/* Gradient mesh overlay for dark mode */}
          <div className="absolute inset-0 gradient-mesh dark:opacity-100 opacity-0 pointer-events-none" />
          
          <div className="relative p-6 space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout;
