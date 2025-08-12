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
export type DrawingMode = 'draw' | 'select';

// Zoom modes for canvas view
export type ZoomMode = 'zoom-in' | 'zoom-out' | 'fit-screen' | 'actual-size' | 'focus-annotation';

// Canvas interaction state
export interface CanvasState {
  isDrawing: boolean;
  selectedAnnotation: string | null;
  drawingStartPoint: { x: number; y: number } | null;
  mode: DrawingMode;
}

// Canvas zoom and pan state
export interface CanvasViewState {
  zoom: number;
  panX: number;
  panY: number;
}

// Props for AnnotationCanvas component
export interface AnnotationCanvasProps {
  imageUrl: string;
  annotations: Annotation[];
  onAnnotationsChange: (annotations: Annotation[]) => void;
  selectedAnnotationId: string | null;
  onAnnotationSelect: (id: string | null) => void;
  mode: DrawingMode;
  onModeChange: (mode: DrawingMode) => void;
  viewState: CanvasViewState;
  onViewStateChange: (viewState: CanvasViewState) => void;
  onZoomAction: (action: ZoomMode) => void;
  resizeTrigger?: number; // Increment to trigger canvas resize
  onAnnotationDoubleClick?: (annotation: Annotation, canvasPosition: { x: number; y: number }) => void;
}
