'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Annotation, CanvasState, AnnotationCanvasProps } from '@/types/annotation';
import { distance, isPointInCircle, isPointOnCircleEdge, generateId, calculateFitToScreenZoom, calculateCenterPan } from '@/lib/utils';

export default function AnnotationCanvas({
  imageUrl,
  annotations,
  onAnnotationsChange,
  selectedAnnotationId,
  onAnnotationSelect,
  mode,
  viewState,
  onViewStateChange,
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
      ctx.lineWidth = isSelected ? 3 : 2;
      ctx.stroke();

      // Draw center dot
      ctx.beginPath();
      ctx.arc(annotation.x, annotation.y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = isSelected ? '#ef4444' : '#3b82f6';
      ctx.fill();

      // Draw resize handle for selected annotation
      if (isSelected) {
        ctx.beginPath();
        ctx.arc(annotation.x + annotation.radius, annotation.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#ef4444';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
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
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
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
      
      // Redraw without calling draw() to avoid circular dependency
      requestAnimationFrame(() => {
        draw();
      });
    }
  }, [draw]);

  // Handle image load and initial canvas sizing
  useEffect(() => {
    const image = imageRef.current;
    
    if (!image) return;

    const handleImageLoad = () => {
      resizeCanvas();
    };

    if (image.complete) {
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
    
    if (!image || !canvas || !image.complete) return;

    // Only auto-fit when image URL changes (not on every resize)
    if (image.naturalWidth > 0 && image.naturalHeight > 0) {
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
      requestAnimationFrame(() => {
        resizeCanvas();
      });
    }
  }, [resizeTrigger, resizeCanvas]);

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

    // Handle panning mode or Space key + mouse for any mode
    if (mode === 'pan' || e.ctrlKey || e.metaKey) {
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
      // Find clicked annotation
      const clickedAnnotation = annotations.find(annotation =>
        isPointInCircle(pos.x, pos.y, annotation.x, annotation.y, annotation.radius)
      );
      onAnnotationSelect(clickedAnnotation?.id || null);
    } else if (mode === 'move' && selectedAnnotation) {
      if (isPointInCircle(pos.x, pos.y, selectedAnnotation.x, selectedAnnotation.y, selectedAnnotation.radius)) {
        setDragOffset({
          x: pos.x - selectedAnnotation.x,
          y: pos.y - selectedAnnotation.y
        });
        setCanvasState({ ...canvasState, isDrawing: true });
      }
    } else if (mode === 'resize' && selectedAnnotation) {
      if (isPointOnCircleEdge(pos.x, pos.y, selectedAnnotation.x, selectedAnnotation.y, selectedAnnotation.radius)) {
        setCanvasState({ ...canvasState, isDrawing: true });
      }
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
          ctx.lineWidth = 2 / viewState.zoom;
          ctx.setLineDash([5 / viewState.zoom, 5 / viewState.zoom]);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.restore();
        }
      } else if (mode === 'move' && selectedAnnotation && dragOffset) {
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
      } else if (mode === 'resize' && selectedAnnotation) {
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

    // Update cursor based on mode and hover state
    const canvas = canvasRef.current;
    if (canvas) {
      if (mode === 'pan' || isPanning) {
        canvas.style.cursor = isPanning ? 'grabbing' : 'grab';
      } else if (selectedAnnotation) {
        if (mode === 'move' && isPointInCircle(pos.x, pos.y, selectedAnnotation.x, selectedAnnotation.y, selectedAnnotation.radius)) {
          canvas.style.cursor = 'move';
        } else if (mode === 'resize' && isPointOnCircleEdge(pos.x, pos.y, selectedAnnotation.x, selectedAnnotation.y, selectedAnnotation.radius)) {
          canvas.style.cursor = 'nw-resize';
        } else {
          canvas.style.cursor = mode === 'draw' ? 'crosshair' : 'default';
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
      }
    }

    setCanvasState({
      ...canvasState,
      isDrawing: false,
      drawingStartPoint: null
    });
    setDragOffset(null);
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
