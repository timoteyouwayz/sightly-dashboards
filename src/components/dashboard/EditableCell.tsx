import { useState, useRef, useEffect } from 'react';
import { useMinistryData } from '@/contexts/MinistryDataContext';
import { cn } from '@/lib/utils';

interface EditableCellProps {
  value: number;
  onSave: (value: number) => void;
  className?: string;
}

export const EditableCell = ({ value, onSave, className }: EditableCellProps) => {
  const { isEditMode } = useMinistryData();
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    const numValue = parseInt(inputValue.replace(/,/g, ''), 10) || 0;
    onSave(numValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setInputValue(value.toString());
      setIsEditing(false);
    }
  };

  if (!isEditMode) {
    return <span className={className}>{value.toLocaleString()}</span>;
  }

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={cn(
          'w-full px-1 py-0.5 text-right bg-background border border-primary rounded text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50',
          className
        )}
      />
    );
  }

  return (
    <span
      onClick={() => setIsEditing(true)}
      className={cn(
        'cursor-pointer px-1 py-0.5 rounded hover:bg-primary/10 transition-colors border border-transparent hover:border-primary/30',
        className
      )}
      title="Click to edit"
    >
      {value.toLocaleString()}
    </span>
  );
};
