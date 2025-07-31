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
