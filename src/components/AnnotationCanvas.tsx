'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Annotation, CanvasState, DrawingMode } from '@/types/annotation';
import { distance, isPointInCircle, isPointOnCircleEdge, generateId } from '@/lib/utils';

interface AnnotationCanvasProps {
  imageUrl: string;
  annotations: Annotation[];
  onAnnotationsChange: (annotations: Annotation[]) => void;
  selectedAnnotationId: string | null;
  onAnnotationSelect: (id: string | null) => void;
  mode: DrawingMode;
}

export default function AnnotationCanvas({
  imageUrl,
  annotations,
  onAnnotationsChange,
  selectedAnnotationId,
  onAnnotationSelect,
  mode
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

  // Draw the canvas with image and annotations
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

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
  }, [annotations, selectedAnnotationId, canvasState, mode]);

  // Handle image load
  useEffect(() => {
    const image = imageRef.current;
    const canvas = canvasRef.current;
    
    if (!image || !canvas) return;

    const handleImageLoad = () => {
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      draw();
    };

    if (image.complete) {
      handleImageLoad();
    } else {
      image.addEventListener('load', handleImageLoad);
      return () => image.removeEventListener('load', handleImageLoad);
    }
  }, [imageUrl, draw]);

  // Redraw when annotations or selection changes
  useEffect(() => {
    draw();
  }, [draw]);

  // Get mouse position relative to canvas
  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  // Handle mouse down
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);
    const selectedAnnotation = annotations.find(a => a.id === selectedAnnotationId);

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
    if (canvas && selectedAnnotation) {
      if (mode === 'move' && isPointInCircle(pos.x, pos.y, selectedAnnotation.x, selectedAnnotation.y, selectedAnnotation.radius)) {
        canvas.style.cursor = 'move';
      } else if (mode === 'resize' && isPointOnCircleEdge(pos.x, pos.y, selectedAnnotation.x, selectedAnnotation.y, selectedAnnotation.radius)) {
        canvas.style.cursor = 'nw-resize';
      } else {
        canvas.style.cursor = mode === 'draw' ? 'crosshair' : 'default';
      }
    } else if (canvas) {
      canvas.style.cursor = mode === 'draw' ? 'crosshair' : 'default';
    }
  };

  // Handle mouse up
  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
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
    <div className="relative">
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
        className="border border-gray-300 max-w-full max-h-[80vh] object-contain"
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
        }}
      />
    </div>
  );
}
