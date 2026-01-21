import { useEffect } from 'react';
import { useMinistryData } from '@/contexts/MinistryDataContext';

export const useEditShortcut = () => {
  const { isEditMode, setIsEditMode } = useMinistryData();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+E or Cmd+Shift+E to toggle edit mode
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        setIsEditMode(!isEditMode);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditMode, setIsEditMode]);
};
