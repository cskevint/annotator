'use client';

import React, { useCallback, useEffect } from 'react';

interface ResizableDividerProps {
  onResize: (width: number) => void;
  isResizing: boolean;
  onResizeStart: () => void;
  onResizeEnd: () => void;
  minWidth?: number;
  maxWidth?: number;
  containerPadding?: number;
}

export default function ResizableDivider({
  onResize,
  isResizing,
  onResizeStart,
  onResizeEnd,
  minWidth = 280,
  maxWidth = 600,
  containerPadding = 16
}: ResizableDividerProps) {
  
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    onResizeStart();
  }, [onResizeStart]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    // Prevent default to avoid any unwanted behavior
    e.preventDefault();
    
    // Calculate new width with bounds checking
    const mouseX = e.clientX;
    const newWidth = Math.max(minWidth, Math.min(maxWidth, mouseX - containerPadding));
    
    // Only update if the calculated width is within reasonable bounds
    if (mouseX > 0 && mouseX < window.innerWidth) {
      onResize(newWidth);
    }
  }, [isResizing, minWidth, maxWidth, containerPadding, onResize]);

  const handleMouseUp = useCallback(() => {
    onResizeEnd();
  }, [onResizeEnd]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Allow escape key to cancel resize operation
    if (e.key === 'Escape' && isResizing) {
      onResizeEnd();
    }
  }, [isResizing, onResizeEnd]);

  // Add global mouse event listeners for resize
  useEffect(() => {
    if (isResizing) {
      // Use document for global mouse tracking
      document.addEventListener('mousemove', handleMouseMove, { passive: false });
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('keydown', handleKeyDown);
      
      // Also listen for mouse leaving the window entirely
      window.addEventListener('mouseleave', handleMouseUp);
      
      // Prevent text selection and show resize cursor globally
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';
      
      // Prevent default behavior on document to avoid any interference
      const preventDefaults = (e: Event) => {
        e.preventDefault();
      };
      document.addEventListener('selectstart', preventDefaults);
      document.addEventListener('dragstart', preventDefaults);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('mouseleave', handleMouseUp);
        document.removeEventListener('selectstart', preventDefaults);
        document.removeEventListener('dragstart', preventDefaults);
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp, handleKeyDown]);

  return (
    <div 
      className={`cursor-col-resize bg-transparent hover:bg-gray-300 transition-colors duration-150 flex-shrink-0 ${
        isResizing ? 'bg-blue-300' : ''
      }`}
      onMouseDown={handleMouseDown}
      style={{ 
        width: '8px',
        marginLeft: '4px',
        marginRight: '4px'
      }}
      title="Drag to resize sidebar"
    />
  );
}
