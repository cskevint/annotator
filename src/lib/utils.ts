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
  tolerance: number = 8
): boolean {
  const handleX = circleX + radius;
  const handleY = circleY;
  return distance(pointX, pointY, handleX, handleY) <= tolerance;
}

// Check if point is on delete button
export function isPointOnDeleteButton(
  pointX: number,
  pointY: number,
  circleX: number,
  circleY: number,
  radius: number,
  tolerance: number = 10
): boolean {
  const deleteX = circleX + radius * 0.7;
  const deleteY = circleY - radius * 0.7;
  return distance(pointX, pointY, deleteX, deleteY) <= tolerance;
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
