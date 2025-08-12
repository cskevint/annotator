'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Undo } from 'lucide-react';
import { Annotation } from '@/types/annotation';

interface LabelDialogProps {
  annotation: Annotation | null;
  onSave: (label: string) => void;
  onCancel: () => void;
  position: { x: number; y: number } | null;
}

export default function LabelDialog({ 
  annotation, 
  onSave, 
  onCancel, 
  position 
}: LabelDialogProps) {
  const [label, setLabel] = useState('');
  const [useCustomLabel, setUseCustomLabel] = useState(false);
  const [predefinedLabels, setPredefinedLabels] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Extract labels from URL parameters
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const labelsParam = urlParams.get('labels');
      if (labelsParam) {
        const labels = labelsParam.split(',').map(label => label.trim()).filter(label => label.length > 0);
        setPredefinedLabels(labels);
      }
    }
  }, []);

  useEffect(() => {
    if (annotation) {
      setLabel(annotation.label);
      
      // If we have predefined labels, check if current label matches any
      if (predefinedLabels.length > 0) {
        const isCurrentLabelPredefined = predefinedLabels.includes(annotation.label);
        setUseCustomLabel(!isCurrentLabelPredefined && annotation.label.length > 0);
      } else {
        // No predefined labels, always use custom
        setUseCustomLabel(true);
      }
    }
  }, [annotation, predefinedLabels]);

  // Separate useEffect for focus management to avoid dependency issues
  useEffect(() => {
    if (annotation) {
      // Focus appropriate input after a brief delay
      setTimeout(() => {
        if (predefinedLabels.length === 0 || useCustomLabel) {
          inputRef.current?.focus();
          inputRef.current?.select();
        } else {
          selectRef.current?.focus();
        }
      }, 10);
    }
  }, [annotation, predefinedLabels, useCustomLabel]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        onCancel();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    if (annotation && position) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [annotation, position, onCancel]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(label);
  };

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    if (selectedValue === 'custom') {
      setUseCustomLabel(true);
      setLabel('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 10);
    } else {
      setUseCustomLabel(false);
      setLabel(selectedValue);
    }
  };

  const handleCustomToggle = () => {
    if (useCustomLabel) {
      // Switching back to dropdown - show "Select a label..." option
      setUseCustomLabel(false);
      setLabel(''); // Empty string corresponds to "Select a label..."
      setTimeout(() => {
        selectRef.current?.focus();
      }, 10);
    } else {
      // Switching to custom input
      setUseCustomLabel(true);
      setLabel('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 10);
    }
  };

  if (!annotation || !position) {
    return null;
  }

  const hasDropdown = predefinedLabels.length > 0;

  return (
    <div
      ref={dialogRef}
      className="fixed z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-3"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        minWidth: '200px'
      }}
    >
      <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Annotation Label
        </label>
        
        {/* Case 1: No predefined labels - show simple text input */}
        {!hasDropdown && (
          <input
            ref={inputRef}
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Enter label..."
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        )}
        
        {/* Case 2: Has predefined labels and using dropdown */}
        {hasDropdown && !useCustomLabel && (
          <select
            ref={selectRef}
            value={label}
            onChange={handleDropdownChange}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
          >
            <option value="">Select a label...</option>
            {predefinedLabels.map((predefinedLabel) => (
              <option key={predefinedLabel} value={predefinedLabel}>
                {predefinedLabel}
              </option>
            ))}
            <option value="custom">Custom label...</option>
          </select>
        )}
        
        {/* Case 3: Has predefined labels but "Custom label..." was selected */}
        {hasDropdown && useCustomLabel && (
          <div className="flex items-center space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Enter custom label..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={handleCustomToggle}
              className="px-2 py-1 bg-gray-200 hover:bg-gray-300 border border-gray-300 rounded text-gray-600 hover:text-gray-800 transition-colors"
              title="Back to predefined labels"
            >
              <Undo size={16} />
            </button>
          </div>
        )}
        <div className="flex space-x-2">
          <button
            type="submit"
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
