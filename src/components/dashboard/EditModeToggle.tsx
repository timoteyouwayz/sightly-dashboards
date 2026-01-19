import { useMinistryData } from '@/contexts/MinistryDataContext';
import { Pencil, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const EditModeToggle = () => {
  const { isEditMode, setIsEditMode } = useMinistryData();

  return (
    <Button
      onClick={() => setIsEditMode(!isEditMode)}
      variant={isEditMode ? 'default' : 'outline'}
      size="sm"
      className="gap-2"
    >
      {isEditMode ? (
        <>
          <Check className="w-4 h-4" />
          Done Editing
        </>
      ) : (
        <>
          <Pencil className="w-4 h-4" />
          Edit Data
        </>
      )}
    </Button>
  );
};
