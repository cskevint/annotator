// Types for annotation data structure
export interface Annotation {
  id: string;
  x: number;
  y: number;
  radius: number;
  label: string;
}

export interface ImageAnnotation {
  filename: string;
  annotations: Annotation[];
}

export type AnnotationData = ImageAnnotation[];

// Drawing modes for the canvas
export type DrawingMode = 'draw' | 'select' | 'resize' | 'move';

// Canvas interaction state
export interface CanvasState {
  isDrawing: boolean;
  selectedAnnotation: string | null;
  drawingStartPoint: { x: number; y: number } | null;
  mode: DrawingMode;
}
