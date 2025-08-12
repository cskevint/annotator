'use client';

import React, { useState, useCallback, useMemo } from 'react';
import ImageUploader from '@/components/ImageUploader';
import AnnotationCanvas from '@/components/AnnotationCanvas';
import AnnotationToolbar from '@/components/AnnotationToolbar';
import LabelDialog from '@/components/LabelDialog';
import { Annotation, ImageAnnotation, AnnotationData, CanvasViewState, ZoomMode } from '@/types/annotation';
import { calculateFitToScreenZoom, calculateCenterPan, clampZoom, calculateAnnotationFocusView } from '@/lib/utils';

export default function Home() {
  const [images, setImages] = useState<File[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(-1);
  const [annotationData, setAnnotationData] = useState<AnnotationData>([]);
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(null);
  // mode removed - now contextual based on user actions
  const [viewState, setViewState] = useState<CanvasViewState>({
    zoom: 1,
    panX: 0,
    panY: 0
  });
  const [resizeTrigger, setResizeTrigger] = useState<number>(0);
  const [labelDialogAnnotation, setLabelDialogAnnotation] = useState<Annotation | null>(null);
  const [labelDialogPosition, setLabelDialogPosition] = useState<{ x: number; y: number } | null>(null);

  // Get current image URL
  const currentImageUrl = useMemo(() => {
    if (currentImageIndex >= 0 && images[currentImageIndex]) {
      return URL.createObjectURL(images[currentImageIndex]);
    }
    return null;
  }, [images, currentImageIndex]);

  // Get current image annotations
  const currentAnnotations = useMemo(() => {
    if (currentImageIndex >= 0 && images[currentImageIndex]) {
      const filename = images[currentImageIndex].name;
      const imageData = annotationData.find((data: ImageAnnotation) => data.filename === filename);
      return imageData?.annotations || [];
    }
    return [];
  }, [annotationData, images, currentImageIndex]);

  // Get selected annotation
  const selectedAnnotation = useMemo(() => {
    return currentAnnotations.find((a: Annotation) => a.id === selectedAnnotationId) || null;
  }, [currentAnnotations, selectedAnnotationId]);

  // Handle image selection
  const handleImageSelect = useCallback((index: number) => {
    setCurrentImageIndex(index);
    setSelectedAnnotationId(null);
    // Don't reset zoom here - let AnnotationCanvas handle fit-to-screen
    // The resizeTrigger will cause the canvas to auto-fit the new image
    requestAnimationFrame(() => {
      setResizeTrigger(prev => prev + 1);
    });
  }, []);

  // Handle annotations change
  const handleAnnotationsChange = useCallback((newAnnotations: Annotation[]) => {
    if (currentImageIndex >= 0 && images[currentImageIndex]) {
      const filename = images[currentImageIndex].name;
      const newAnnotationData = [...annotationData];
      const existingIndex = newAnnotationData.findIndex((data: ImageAnnotation) => data.filename === filename);

      if (existingIndex >= 0) {
        newAnnotationData[existingIndex] = {
          filename,
          annotations: newAnnotations
        };
      } else {
        newAnnotationData.push({
          filename,
          annotations: newAnnotations
        });
      }

      setAnnotationData(newAnnotationData);
    }
  }, [annotationData, images, currentImageIndex]);

  // Handle double-click on annotation to show label dialog
  const handleAnnotationDoubleClick = useCallback((annotation: Annotation, canvasPosition: { x: number; y: number }) => {
    // Calculate dialog position with smart placement
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const canvasRect = canvas.getBoundingClientRect();
    const dialogWidth = 200;
    const dialogHeight = 120;
    
    // Convert canvas coordinates to screen coordinates
    const screenX = canvasRect.left + canvasPosition.x;
    const screenY = canvasRect.top + canvasPosition.y;
    
    // Smart positioning: prefer right side, but use left if not enough space
    let dialogX = screenX + 20; // Default to right of annotation
    let dialogY = screenY - dialogHeight / 2; // Center vertically on annotation
    
    // Check if dialog would go off screen on the right
    if (dialogX + dialogWidth > window.innerWidth - 20) {
      dialogX = screenX - dialogWidth - 20; // Position to left instead
    }
    
    // Ensure dialog stays within vertical bounds
    if (dialogY < 20) {
      dialogY = 20;
    } else if (dialogY + dialogHeight > window.innerHeight - 20) {
      dialogY = window.innerHeight - dialogHeight - 20;
    }

    setLabelDialogAnnotation(annotation);
    setLabelDialogPosition({ x: dialogX, y: dialogY });
  }, []);

  // Handle label dialog save
  const handleLabelDialogSave = useCallback((label: string) => {
    if (!labelDialogAnnotation || currentImageIndex < 0) return;

    const filename = images[currentImageIndex].name;
    const updatedData = annotationData.map((imageData: ImageAnnotation) => {
      if (imageData.filename === filename) {
        return {
          ...imageData,
          annotations: imageData.annotations.map((annotation: Annotation) =>
            annotation.id === labelDialogAnnotation.id
              ? { ...annotation, label }
              : annotation
          )
        };
      }
      return imageData;
    });

    setAnnotationData(updatedData);
    setLabelDialogAnnotation(null);
    setLabelDialogPosition(null);
  }, [labelDialogAnnotation, currentImageIndex, images, annotationData]);

  // Handle label dialog cancel
  const handleLabelDialogCancel = useCallback(() => {
    setLabelDialogAnnotation(null);
    setLabelDialogPosition(null);
  }, []);

  // Handle zoom actions
  const handleZoomAction = useCallback((action: ZoomMode) => {
    const image = document.querySelector('img[src="' + currentImageUrl + '"]') as HTMLImageElement;
    if (!image || !image.complete) return;

    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const containerWidth = canvas.clientWidth;
    const containerHeight = canvas.clientHeight;
    const imageWidth = image.naturalWidth;
    const imageHeight = image.naturalHeight;

    let newZoom = viewState.zoom;
    let newPanX = viewState.panX;
    let newPanY = viewState.panY;

    switch (action) {
      case 'zoom-in':
        {
          const newZoomLevel = clampZoom(viewState.zoom * 1.5);
          const zoomFactor = newZoomLevel / viewState.zoom;
          
          // Calculate the center of the canvas
          const centerX = containerWidth / 2;
          const centerY = containerHeight / 2;
          
          // Adjust pan to keep the center fixed
          newPanX = centerX - (centerX - viewState.panX) * zoomFactor;
          newPanY = centerY - (centerY - viewState.panY) * zoomFactor;
          newZoom = newZoomLevel;
        }
        break;
      case 'zoom-out':
        {
          const newZoomLevel = clampZoom(viewState.zoom / 1.5);
          const zoomFactor = newZoomLevel / viewState.zoom;
          
          // Calculate the center of the canvas
          const centerX = containerWidth / 2;
          const centerY = containerHeight / 2;
          
          // Adjust pan to keep the center fixed
          newPanX = centerX - (centerX - viewState.panX) * zoomFactor;
          newPanY = centerY - (centerY - viewState.panY) * zoomFactor;
          newZoom = newZoomLevel;
        }
        break;
      case 'fit-screen':
        newZoom = calculateFitToScreenZoom(imageWidth, imageHeight, containerWidth, containerHeight);
        const centerPan = calculateCenterPan(imageWidth, imageHeight, containerWidth, containerHeight, newZoom);
        newPanX = centerPan.x;
        newPanY = centerPan.y;
        break;
      case 'actual-size':
        newZoom = 1;
        const actualCenterPan = calculateCenterPan(imageWidth, imageHeight, containerWidth, containerHeight, 1);
        newPanX = actualCenterPan.x;
        newPanY = actualCenterPan.y;
        break;
      case 'focus-annotation':
        if (selectedAnnotation) {
          const focusView = calculateAnnotationFocusView(
            selectedAnnotation,
            containerWidth,
            containerHeight
          );
          newZoom = clampZoom(focusView.zoom);
          newPanX = focusView.panX;
          newPanY = focusView.panY;
        }
        break;
    }

    setViewState({
      zoom: newZoom,
      panX: newPanX,
      panY: newPanY
    });
    // Trigger canvas resize after zoom change
    setResizeTrigger(prev => prev + 1);
  }, [viewState, currentImageUrl, selectedAnnotation]);

  // Handle export
  const handleExport = useCallback(() => {
    const dataStr = JSON.stringify(annotationData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `annotations-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [annotationData]);

  // Handle import
  const handleImport = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData: AnnotationData = JSON.parse(e.target?.result as string);
          setAnnotationData(importedData);
          setSelectedAnnotationId(null);
        } catch (error) {
          alert('Error importing file. Please check the file format.');
          console.error('Import error:', error);
        }
      };
      reader.readAsText(file);
    }
    event.target.value = ''; // Reset input
  }, []);

  // Calculate total annotation count
  const totalAnnotations = useMemo(() => {
    return annotationData.reduce((total: number, imageData: ImageAnnotation) => total + imageData.annotations.length, 0);
  }, [annotationData]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-4">
        {/* Toolbar */}
        <AnnotationToolbar
          onExport={handleExport}
          onImport={handleImport}
          annotationCount={totalAnnotations}
          onZoomAction={handleZoomAction}
          currentZoom={viewState.zoom}
        />

        <div className="grid grid-cols-1 lg:grid-cols-8 gap-4" style={{ height: 'calc(100vh - 160px)' }}>
          {/* Left Panel - Image Upload */}
          <div className="lg:col-span-1 h-full overflow-y-auto">
            <ImageUploader
              images={images}
              onImagesChange={setImages}
              currentImageIndex={currentImageIndex}
              onImageSelect={handleImageSelect}
            />
          </div>

          {/* Center Panel - Canvas */}
          <div className="lg:col-span-7">
            {currentImageUrl ? (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {images[currentImageIndex]?.name}
                  </h2>
                  <span className="text-sm text-gray-500">
                    {currentAnnotations.length} annotation{currentAnnotations.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="relative w-full flex justify-center" style={{ height: 'calc(100vh - 220px)' }}>
                  <AnnotationCanvas
                    imageUrl={currentImageUrl}
                    annotations={currentAnnotations}
                    onAnnotationsChange={handleAnnotationsChange}
                    selectedAnnotationId={selectedAnnotationId}
                    onAnnotationSelect={setSelectedAnnotationId}
                    viewState={viewState}
                    onViewStateChange={setViewState}
                    onZoomAction={handleZoomAction}
                    resizeTrigger={resizeTrigger}
                    onAnnotationDoubleClick={handleAnnotationDoubleClick}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Image Selected</h3>
                <p className="text-gray-500">Upload and select an image to start annotating</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Label Dialog */}
      <LabelDialog
        annotation={labelDialogAnnotation}
        onSave={handleLabelDialogSave}
        onCancel={handleLabelDialogCancel}
        position={labelDialogPosition}
      />
    </div>
  );
}
