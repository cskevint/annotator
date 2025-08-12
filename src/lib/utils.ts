import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generate unique ID for annotations
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Calculate distance between two points
export function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// Check if point is inside circle
export function isPointInCircle(
  pointX: number,
  pointY: number,
  circleX: number,
  circleY: number,
  radius: number
): boolean {
  return distance(pointX, pointY, circleX, circleY) <= radius;
}

// Check if point is on circle edge (for resizing)
export function isPointOnCircleEdge(
  pointX: number,
  pointY: number,
  circleX: number,
  circleY: number,
  radius: number,
  tolerance: number = 5
): boolean {
  const dist = distance(pointX, pointY, circleX, circleY);
  return Math.abs(dist - radius) <= tolerance;
}

// Check if point is on resize handle
export function isPointOnResizeHandle(
  pointX: number,
  pointY: number,
  circleX: number,
  circleY: number,
  radius: number,
  zoom: number = 1
): boolean {
  const handleX = circleX + radius;
  const handleY = circleY;
  
  // Calculate the visual resize button radius with extra padding for better click target
  const baseResizeRadius = 14;
  const resizeScaleFactor = 1 / Math.max(0.3, zoom);
  const minRadius = 10;
  const maxRadius = 45;
  const visualResizeRadius = Math.max(minRadius, Math.min(maxRadius, baseResizeRadius * resizeScaleFactor));
  
  // Add extra padding for better click target (25% larger than visual)
  const clickTargetRadius = visualResizeRadius * 1.25;
  
  // Check if point is within the expanded click target area
  return distance(pointX, pointY, handleX, handleY) <= clickTargetRadius;
}

// Check if point is on delete button
export function isPointOnDeleteButton(
  pointX: number,
  pointY: number,
  circleX: number,
  circleY: number,
  radius: number,
  zoom: number = 1,
  tolerance: number = 16
): boolean {
  const deleteX = circleX + radius * 0.7;
  const deleteY = circleY - radius * 0.7;
  // Inverse scaling: larger tolerance when zoomed out
  const scaleFactor = 1 / Math.max(0.3, zoom);
  const minTolerance = 12;
  const maxTolerance = 55;
  const scaledTolerance = Math.max(minTolerance, Math.min(maxTolerance, tolerance * scaleFactor));
  return distance(pointX, pointY, deleteX, deleteY) <= scaledTolerance;
}

// Format file size for display
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Zoom utility functions
export function calculateFitToScreenZoom(
  imageWidth: number,
  imageHeight: number,
  canvasWidth: number,
  canvasHeight: number
): number {
  const scaleX = canvasWidth / imageWidth;
  const scaleY = canvasHeight / imageHeight;
  return Math.min(scaleX, scaleY, 1); // Don't zoom beyond 100%
}

export function calculateCenterPan(
  imageWidth: number,
  imageHeight: number,
  canvasWidth: number,
  canvasHeight: number,
  zoom: number
): { x: number; y: number } {
  const scaledImageWidth = imageWidth * zoom;
  const scaledImageHeight = imageHeight * zoom;
  
  return {
    x: (canvasWidth - scaledImageWidth) / 2,
    y: (canvasHeight - scaledImageHeight) / 2
  };
}

export function clampZoom(zoom: number, minZoom: number = 0.1, maxZoom: number = 5): number {
  return Math.max(minZoom, Math.min(maxZoom, zoom));
}

// Calculate optimal zoom and pan to focus on a specific annotation
export function calculateAnnotationFocusView(
  annotation: { x: number; y: number; radius: number },
  canvasWidth: number,
  canvasHeight: number
): { zoom: number; panX: number; panY: number } {
  // Calculate zoom level to ensure the entire annotation fits within the canvas with padding
  const padding = 50; // 50px padding on each side
  const availableWidth = canvasWidth - (padding * 2);
  const availableHeight = canvasHeight - (padding * 2);
  
  // The annotation needs to fit within both width and height constraints
  const annotationDiameter = annotation.radius * 2;
  
  // Calculate maximum zoom that ensures the annotation fits in both dimensions
  const maxZoomForWidth = availableWidth / annotationDiameter;
  const maxZoomForHeight = availableHeight / annotationDiameter;
  let optimalZoom = Math.min(maxZoomForWidth, maxZoomForHeight);
  
  // Also ensure it's not too small - annotation should be at least 20% of the smaller dimension
  const minSize = Math.min(canvasWidth, canvasHeight) * 0.2;
  const minZoom = minSize / annotationDiameter;
  
  // Use the larger of the two zoom values to ensure both constraints are met
  optimalZoom = Math.max(minZoom, optimalZoom);
  
  // Clamp zoom to reasonable bounds (minimum 0.5x, maximum 8x)
  optimalZoom = Math.max(0.5, Math.min(8, optimalZoom));
  
  // Calculate pan to center the annotation
  const scaledAnnotationX = annotation.x * optimalZoom;
  const scaledAnnotationY = annotation.y * optimalZoom;
  
  const panX = (canvasWidth / 2) - scaledAnnotationX;
  const panY = (canvasHeight / 2) - scaledAnnotationY;
  
  return {
    zoom: optimalZoom,
    panX,
    panY
  };
}

// Convert PDF pages to image files
export async function convertPdfToImages(file: File): Promise<File[]> {
  try {
    // Dynamic import to avoid SSR issues
    const pdfjsLib = await import('pdfjs-dist');
    
    // Set up worker path for Next.js - use local worker first
    if (typeof window !== 'undefined') {
      // Try different worker sources in order of preference
      const workerSources = [
        '/pdf.worker.min.js', // Local worker file
        `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`,
        `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`
      ];
      
      // Use the first available worker source
      pdfjsLib.GlobalWorkerOptions.workerSrc = workerSources[0];
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    const imageFiles: File[] = [];
    const baseName = file.name.replace(/\.pdf$/i, '');
    
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      
      // Calculate scale for 300 DPI
      const scale = 300 / 72; // Convert from 72 DPI to 300 DPI
      const scaledViewport = page.getViewport({ scale });
      
      // Create canvas
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      canvas.height = scaledViewport.height;
      canvas.width = scaledViewport.width;
      
      // Render page to canvas
      const renderContext = {
        canvasContext: context,
        viewport: scaledViewport,
        canvas: canvas,
      };
      
      await page.render(renderContext).promise;
      
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob!);
        }, 'image/png');
      });
      
      // Create file with appropriate name
      const fileName = `${baseName}_page_${pageNum.toString().padStart(3, '0')}.png`;
      const imageFile = new File([blob], fileName, { type: 'image/png' });
      imageFiles.push(imageFile);
    }
    
    return imageFiles;
  } catch (error) {
    console.error('Error converting PDF to images:', error);
    
    // If worker fails, try without worker
    if (error instanceof Error && error.message.includes('worker')) {
      return convertPdfToImagesWithoutWorker(file);
    }
    
    throw new Error('Failed to convert PDF to images. Please ensure the PDF is valid.');
  }
}

// Fallback function that doesn't use worker
async function convertPdfToImagesWithoutWorker(file: File): Promise<File[]> {
  try {
    const pdfjsLib = await import('pdfjs-dist');
    
    // Disable worker entirely
    pdfjsLib.GlobalWorkerOptions.workerSrc = '';
    
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    const imageFiles: File[] = [];
    const baseName = file.name.replace(/\.pdf$/i, '');
    
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      
      // Calculate scale for 300 DPI
      const scale = 300 / 72;
      const scaledViewport = page.getViewport({ scale });
      
      // Create canvas
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      canvas.height = scaledViewport.height;
      canvas.width = scaledViewport.width;
      
      // Render page to canvas
      const renderContext = {
        canvasContext: context,
        viewport: scaledViewport,
        canvas: canvas,
      };
      
      await page.render(renderContext).promise;
      
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob!);
        }, 'image/png');
      });
      
      // Create file with appropriate name
      const fileName = `${baseName}_page_${pageNum.toString().padStart(3, '0')}.png`;
      const imageFile = new File([blob], fileName, { type: 'image/png' });
      imageFiles.push(imageFile);
    }
    
    return imageFiles;
  } catch (error) {
    console.error('Error converting PDF to images without worker:', error);
    throw new Error('Failed to convert PDF to images. Please try a different PDF file.');
  }
}
