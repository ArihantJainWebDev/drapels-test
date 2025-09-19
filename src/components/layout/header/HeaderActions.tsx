"use client"
import DarkModeToggle from '@/components/layout/DarkModeToggle';
import CreditsDisplay from './CreditsDisplay';
import ProfileSection from './ProfileSection';
import { useHeaderAuth } from '@/hooks/header/useHeaderAuth';

interface HeaderActionsProps {
  isHome: boolean;
  isScrolled: boolean;
  variant?: 'desktop' | 'mobile';
}

const HeaderActions: React.FC<HeaderActionsProps> = ({ isHome, isScrolled, variant = 'desktop' }) => {
  const { isAuthenticated } = useHeaderAuth();

  if (variant === 'mobile') {
    return (
      <div className="lg:hidden flex items-center gap-2">
        <DarkModeToggle />
        {isAuthenticated && (
          <CreditsDisplay 
            isHome={isHome} 
            isScrolled={isScrolled} 
            variant="mobile" 
          />
        )}
      </div>
    );
  }

  return (
    <div className="hidden lg:flex items-center gap-2">
      <DarkModeToggle />
      
      {isAuthenticated && (
        <CreditsDisplay 
          isHome={isHome} 
          isScrolled={isScrolled} 
          variant="desktop" 
        />
      )}
      
      <ProfileSection isHome={isHome} isScrolled={isScrolled} />
    </div>
  );

};

export default HeaderActions;