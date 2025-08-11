'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Annotation, CanvasState, AnnotationCanvasProps } from '@/types/annotation';
import { distance, isPointInCircle, isPointOnResizeHandle, isPointOnDeleteButton, generateId, calculateFitToScreenZoom, calculateCenterPan } from '@/lib/utils';

export default function AnnotationCanvas({
  imageUrl,
  annotations,
  onAnnotationsChange,
  selectedAnnotationId,
  onAnnotationSelect,
  mode,
  onModeChange,
  viewState,
  onViewStateChange,
  onZoomAction,
  resizeTrigger
}: AnnotationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [canvasState, setCanvasState] = useState<CanvasState>({
    isDrawing: false,
    selectedAnnotation: null,
    drawingStartPoint: null,
    mode: 'draw'
  });
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number } | null>(null);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [selectAction, setSelectAction] = useState<'none' | 'move' | 'resize'>('none');

  // Draw the canvas with image and annotations
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save context for transformations
    ctx.save();

    // Apply zoom and pan transformations
    ctx.translate(viewState.panX, viewState.panY);
    ctx.scale(viewState.zoom, viewState.zoom);

    // Draw image
    ctx.drawImage(image, 0, 0);

    // Draw annotations
    annotations.forEach((annotation) => {
      const isSelected = annotation.id === selectedAnnotationId;
      
      // Draw circle
      ctx.beginPath();
      ctx.arc(annotation.x, annotation.y, annotation.radius, 0, 2 * Math.PI);
    ctx.strokeStyle = isSelected ? '#ef4444' : '#3b82f6';
    ctx.lineWidth = isSelected ? 10 : 8;
    ctx.stroke();

      // Draw center dot
      ctx.beginPath();
      ctx.arc(annotation.x, annotation.y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = isSelected ? '#ef4444' : '#3b82f6';
      ctx.fill();

            // Draw resize handle for selected annotation
      if (isSelected) {
        // Inverse scaling: larger when zoomed out, smaller when zoomed in
        const baseResizeRadius = 12;
        const resizeScaleFactor = 1 / Math.max(0.3, viewState.zoom); // Prevent division by very small numbers
        const minRadius = 8;
        const maxRadius = 40;
        const resizeRadius = Math.max(minRadius, Math.min(maxRadius, baseResizeRadius * resizeScaleFactor));
        
        ctx.beginPath();
        ctx.arc(annotation.x + annotation.radius, annotation.y, resizeRadius, 0, 2 * Math.PI);
        ctx.fillStyle = '#ef4444';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = Math.max(1, 2 / Math.max(0.3, viewState.zoom)); // Inverse scaling for stroke width
        ctx.stroke();        // Draw delete button (X in circle) at top-right of annotation
        const deleteX = annotation.x + annotation.radius * 0.7;
        const deleteY = annotation.y - annotation.radius * 0.7;
        
        // Inverse scaling: larger when zoomed out, smaller when zoomed in
        const baseDeleteRadius = 14;
        const deleteScaleFactor = 1 / Math.max(0.3, viewState.zoom); // Prevent division by very small numbers
        const minDeleteRadius = 10;
        const maxDeleteRadius = 45;
        const deleteRadius = Math.max(minDeleteRadius, Math.min(maxDeleteRadius, baseDeleteRadius * deleteScaleFactor));
        
        const baseXSize = 8;
        const minXSize = 6;
        const maxXSize = 20;
        const xSize = Math.max(minXSize, Math.min(maxXSize, baseXSize * deleteScaleFactor));
        
        // Delete button background circle
        ctx.beginPath();
        ctx.arc(deleteX, deleteY, deleteRadius, 0, 2 * Math.PI);
        ctx.fillStyle = '#ef4444';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = Math.max(1, 2 / Math.max(0.3, viewState.zoom)); // Inverse scaling for stroke width
        ctx.stroke();

        // Draw X inside delete button
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = Math.max(2, 3 / Math.max(0.3, viewState.zoom)); // Inverse scaling for X stroke width
        ctx.beginPath();
        ctx.moveTo(deleteX - xSize, deleteY - xSize);
        ctx.lineTo(deleteX + xSize, deleteY + xSize);
        ctx.moveTo(deleteX + xSize, deleteY - xSize);
        ctx.lineTo(deleteX - xSize, deleteY + xSize);
        ctx.stroke();
      }

      // Draw label
      if (annotation.label) {
        ctx.fillStyle = isSelected ? '#ef4444' : '#3b82f6';
        ctx.font = '14px Inter, sans-serif';
        ctx.fillText(
          annotation.label,
          annotation.x - annotation.radius,
          annotation.y - annotation.radius - 10
        );
      }
    });

    // Draw current drawing circle
    if (canvasState.isDrawing && canvasState.drawingStartPoint && mode === 'draw') {
      const currentRadius = distance(
        canvasState.drawingStartPoint.x,
        canvasState.drawingStartPoint.y,
        canvasState.drawingStartPoint.x,
        canvasState.drawingStartPoint.y
      );
      
      ctx.beginPath();
      ctx.arc(
        canvasState.drawingStartPoint.x,
        canvasState.drawingStartPoint.y,
        currentRadius,
        0,
        2 * Math.PI
      );
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 8;
  ctx.setLineDash([10, 10]);
  ctx.stroke();
  ctx.setLineDash([]);
    }

    // Restore context
    ctx.restore();
  }, [annotations, selectedAnnotationId, canvasState, mode, viewState]);

  // Handle canvas resizing based on container and image dimensions
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;
    
    if (!canvas || !container) return;

    // Get container dimensions
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    // Always use full container space
    const canvasWidth = containerWidth;
    const canvasHeight = containerHeight;
    
    // Only update if dimensions actually changed
    if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
      // Set canvas dimensions to use full available space
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      
      // Set CSS dimensions to match
      canvas.style.width = `${canvasWidth}px`;
      canvas.style.height = `${canvasHeight}px`;
      
      // Immediate redraw for faster response
      draw();
    } else {
      // If dimensions haven't changed, just redraw
      draw();
    }
  }, [draw]);

  // Handle image load and initial canvas sizing
  useEffect(() => {
    const image = imageRef.current;
    
    if (!image) return;

    const handleImageLoad = () => {
      // Use requestAnimationFrame for faster rendering
      requestAnimationFrame(() => {
        resizeCanvas();
      });
    };

    // For blob URLs (like PDF images), images are typically already cached
    if (image.complete && image.naturalWidth > 0) {
      handleImageLoad();
    } else {
      image.addEventListener('load', handleImageLoad);
      return () => image.removeEventListener('load', handleImageLoad);
    }
  }, [imageUrl, resizeCanvas]);

  // Handle auto-fit to screen when image loads (separate effect to avoid circular dependency)
  useEffect(() => {
    const image = imageRef.current;
    const canvas = canvasRef.current;
    
    if (!image || !canvas || !imageUrl) return;

    // Always auto-fit when image URL changes, regardless of load state
    const applyFitToScreen = () => {
      if (image.naturalWidth > 0 && image.naturalHeight > 0 && canvas.width > 0 && canvas.height > 0) {
        const fitZoom = calculateFitToScreenZoom(
          image.naturalWidth,
          image.naturalHeight,
          canvas.width,
          canvas.height
        );
        const centerPan = calculateCenterPan(
          image.naturalWidth,
          image.naturalHeight,
          canvas.width,
          canvas.height,
          fitZoom
        );
        
        onViewStateChange({
          zoom: fitZoom,
          panX: centerPan.x,
          panY: centerPan.y
        });
      }
    };

    // Try to apply fit immediately if image is ready
    if (image.complete && image.naturalWidth > 0) {
      requestAnimationFrame(applyFitToScreen);
    } else {
      // Wait for image to load
      const handleLoad = () => {
        requestAnimationFrame(applyFitToScreen);
      };
      image.addEventListener('load', handleLoad);
      return () => image.removeEventListener('load', handleLoad);
    }
  }, [imageUrl, onViewStateChange]);

  // Handle window resize and container size changes
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleResize = () => {
      // Clear previous timeout
      clearTimeout(timeoutId);
      // Debounce resize events
      timeoutId = setTimeout(() => {
        resizeCanvas();
      }, 100);
    };

    window.addEventListener('resize', handleResize);

    // Use ResizeObserver for container size changes
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;
    
    let resizeObserver: ResizeObserver | null = null;
    
    if (container && 'ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      resizeObserver.observe(container);
    }

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [resizeCanvas]);

  // Redraw when annotations or selection changes
  useEffect(() => {
    draw();
  }, [draw]);

  // Resize canvas when resizeTrigger changes
  useEffect(() => {
    if (resizeTrigger !== undefined) {
      // Immediate resize for faster response when switching images
      resizeCanvas();
    }
  }, [resizeTrigger, resizeCanvas]);

  // Handle spacebar key press for temporary panning
  useEffect(() => {
    // Helper function to check if user is currently typing in an input field
    const isInputFocused = (): boolean => {
      const activeElement = document.activeElement as HTMLElement;
      return activeElement && (
        activeElement.tagName === 'INPUT' || 
        activeElement.tagName === 'TEXTAREA' || 
        activeElement.contentEditable === 'true' ||
        activeElement.isContentEditable
      );
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle shortcuts if user is typing in an input field
      if (isInputFocused()) {
        return;
      }

      // Handle zoom shortcuts
      if ((e.metaKey || e.ctrlKey) && !e.repeat) {
        if (e.key === '=' || e.key === '+') {
          e.preventDefault();
          onZoomAction('zoom-in');
          return;
        }
        if (e.key === '-') {
          e.preventDefault();
          onZoomAction('zoom-out');
          return;
        }
      }

      // Handle spacebar for panning
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        setIsSpacePressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // Don't handle spacebar if user is typing in an input field
      if (isInputFocused()) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        setIsSpacePressed(false);
        // End panning if we were panning with space
        if (isPanning) {
          setIsPanning(false);
          setPanStart(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPanning, onZoomAction]);

  // Get mouse position relative to canvas with zoom/pan adjustments
  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, canvasX: 0, canvasY: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    // Get canvas coordinates
    const canvasX = (e.clientX - rect.left) * scaleX;
    const canvasY = (e.clientY - rect.top) * scaleY;

    // Transform to image coordinates accounting for zoom and pan
    const imageX = (canvasX - viewState.panX) / viewState.zoom;
    const imageY = (canvasY - viewState.panY) / viewState.zoom;

    return {
      x: imageX,
      y: imageY,
      canvasX,
      canvasY
    };
  };

  // Handle mouse down
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);
    const selectedAnnotation = annotations.find(a => a.id === selectedAnnotationId);

    // Handle spacebar panning for any mode
    if (isSpacePressed) {
      setIsPanning(true);
      setPanStart({ x: pos.canvasX, y: pos.canvasY });
      return;
    }

    if (mode === 'draw') {
      setCanvasState({
        ...canvasState,
        isDrawing: true,
        drawingStartPoint: pos
      });
    } else if (mode === 'select') {
      // Check if clicking on delete button of selected annotation
      if (selectedAnnotation && isPointOnDeleteButton(pos.x, pos.y, selectedAnnotation.x, selectedAnnotation.y, selectedAnnotation.radius, viewState.zoom)) {
        const newAnnotations = annotations.filter(a => a.id !== selectedAnnotation.id);
        onAnnotationsChange(newAnnotations);
        onAnnotationSelect(null);
        return;
      }

      // Check if clicking on resize handle of selected annotation
      if (selectedAnnotation && isPointOnResizeHandle(pos.x, pos.y, selectedAnnotation.x, selectedAnnotation.y, selectedAnnotation.radius, viewState.zoom)) {
        setSelectAction('resize');
        setCanvasState({ ...canvasState, isDrawing: true });
        return;
      }

      // Check if clicking inside selected annotation for moving
      if (selectedAnnotation && isPointInCircle(pos.x, pos.y, selectedAnnotation.x, selectedAnnotation.y, selectedAnnotation.radius)) {
        setSelectAction('move');
        setDragOffset({
          x: pos.x - selectedAnnotation.x,
          y: pos.y - selectedAnnotation.y
        });
        setCanvasState({ ...canvasState, isDrawing: true });
        return;
      }

      // Find clicked annotation for selection
      const clickedAnnotation = annotations.find(annotation =>
        isPointInCircle(pos.x, pos.y, annotation.x, annotation.y, annotation.radius)
      );
      onAnnotationSelect(clickedAnnotation?.id || null);
      setSelectAction('none');
    }
  };

  // Handle mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);
    const selectedAnnotation = annotations.find(a => a.id === selectedAnnotationId);

    // Handle panning
    if (isPanning && panStart) {
      const deltaX = pos.canvasX - panStart.x;
      const deltaY = pos.canvasY - panStart.y;
      
      onViewStateChange({
        ...viewState,
        panX: viewState.panX + deltaX,
        panY: viewState.panY + deltaY
      });
      
      setPanStart({ x: pos.canvasX, y: pos.canvasY });
      return;
    }

    if (canvasState.isDrawing) {
      if (mode === 'draw' && canvasState.drawingStartPoint) {
        // Update preview circle radius
        const currentRadius = distance(
          canvasState.drawingStartPoint.x,
          canvasState.drawingStartPoint.y,
          pos.x,
          pos.y
        );
        
        // Redraw with current radius
        draw();
        
        // Draw preview circle
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (ctx && canvasState.drawingStartPoint) {
          ctx.save();
          ctx.translate(viewState.panX, viewState.panY);
          ctx.scale(viewState.zoom, viewState.zoom);
          
          ctx.beginPath();
          ctx.arc(
            canvasState.drawingStartPoint.x,
            canvasState.drawingStartPoint.y,
            currentRadius,
            0,
            2 * Math.PI
          );
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 8 / viewState.zoom;
          ctx.setLineDash([10 / viewState.zoom, 10 / viewState.zoom]);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.restore();
        }
      } else if (mode === 'select' && selectedAnnotation) {
        if (selectAction === 'move' && dragOffset) {
          // Move annotation
          const newAnnotations = annotations.map(annotation =>
            annotation.id === selectedAnnotation.id
              ? {
                  ...annotation,
                  x: pos.x - dragOffset.x,
                  y: pos.y - dragOffset.y
                }
              : annotation
          );
          onAnnotationsChange(newAnnotations);
        } else if (selectAction === 'resize') {
          // Resize annotation
          const newRadius = distance(selectedAnnotation.x, selectedAnnotation.y, pos.x, pos.y);
          const newAnnotations = annotations.map(annotation =>
            annotation.id === selectedAnnotation.id
              ? { ...annotation, radius: Math.max(10, newRadius) }
              : annotation
          );
          onAnnotationsChange(newAnnotations);
        }
      }
    }

    // Update cursor based on mode and hover state
    const canvas = canvasRef.current;
    if (canvas) {
      if (isPanning || isSpacePressed) {
        canvas.style.cursor = isPanning ? 'grabbing' : 'grab';
      } else if (mode === 'select' && selectedAnnotation) {
        if (isPointOnDeleteButton(pos.x, pos.y, selectedAnnotation.x, selectedAnnotation.y, selectedAnnotation.radius, viewState.zoom)) {
          canvas.style.cursor = 'pointer';
        } else if (isPointOnResizeHandle(pos.x, pos.y, selectedAnnotation.x, selectedAnnotation.y, selectedAnnotation.radius, viewState.zoom)) {
          canvas.style.cursor = 'nw-resize';
        } else if (isPointInCircle(pos.x, pos.y, selectedAnnotation.x, selectedAnnotation.y, selectedAnnotation.radius)) {
          canvas.style.cursor = 'move';
        } else {
          canvas.style.cursor = 'default';
        }
      } else {
        canvas.style.cursor = mode === 'draw' ? 'crosshair' : 'default';
      }
    }
  };

  // Handle mouse up
  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // End panning
    if (isPanning) {
      setIsPanning(false);
      setPanStart(null);
      return;
    }

    if (canvasState.isDrawing && mode === 'draw' && canvasState.drawingStartPoint) {
      const pos = getMousePos(e);
      const radius = distance(
        canvasState.drawingStartPoint.x,
        canvasState.drawingStartPoint.y,
        pos.x,
        pos.y
      );

      if (radius > 10) { // Minimum radius
        const newAnnotation: Annotation = {
          id: generateId(),
          x: canvasState.drawingStartPoint.x,
          y: canvasState.drawingStartPoint.y,
          radius,
          label: ''
        };
        onAnnotationsChange([...annotations, newAnnotation]);
        onAnnotationSelect(newAnnotation.id);
        onModeChange('select'); // Switch to select mode after drawing
      }
    }

    // Reset states
    setCanvasState({
      ...canvasState,
      isDrawing: false,
      drawingStartPoint: null
    });
    setDragOffset(null);
    setSelectAction('none');
  };

  return (
    <div className="relative flex items-center justify-center w-full h-full">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imageRef}
        src={imageUrl}
        alt="Annotation target"
        className="hidden"
        crossOrigin="anonymous"
      />
      <canvas
        ref={canvasRef}
        className="border border-gray-300 shadow-sm"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          setCanvasState({
            ...canvasState,
            isDrawing: false,
            drawingStartPoint: null
          });
          setDragOffset(null);
          setIsPanning(false);
          setPanStart(null);
        }}
      />
    </div>
  );
}
