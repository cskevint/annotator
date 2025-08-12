'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (annotation) {
      setLabel(annotation.label);
      // Focus the input after a brief delay to ensure dialog is rendered
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 10);
    }
  }, [annotation]);

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

  if (!annotation || !position) {
    return null;
  }

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
        <input
          ref={inputRef}
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Enter label..."
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
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
