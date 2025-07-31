# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

This is a Next.js 14 TypeScript project for image annotation with the following key features:

## Project Context
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives (Dialog, Select, Label, Separator, Toast)
- **Icons**: Lucide React
- **Canvas**: HTML5 Canvas for annotation rendering
- **PDF Processing**: PDF.js for converting PDF pages to 300 DPI images
- **Purpose**: Web application for annotating images with circular annotations

## Key Features
1. **Multi-Image Upload**: Support for multiple web-compatible image formats (PNG, JPG, GIF, WebP)
2. **PDF Support**: Upload PDF files that are automatically converted to high-resolution images (300 DPI) per page
3. **Interactive Circle Annotations**: Click-and-drag to create circles with dynamic radius
4. **Advanced Annotation Management**: Five distinct modes - draw, select, move, resize, pan, and delete annotations
5. **Comprehensive Zoom Controls**: Zoom in/out, fit-to-screen, actual size with percentage display and real-time feedback
6. **Maximum Canvas Utilization**: Canvas automatically uses all available width and height for optimal workspace
7. **Smart Canvas Resizing**: Dynamic canvas with automatic resize triggers on image selection and zoom operations
8. **Independent Scrolling Interface**: Image list container scrolls separately from main application
9. **Spacebar Pan Navigation**: Hold spacebar + drag for temporary panning in any mode (like Photoshop)
10. **Enhanced Pan Controls**: Dedicated pan mode with keyboard shortcuts (spacebar + drag, Ctrl/Cmd + drag)
11. **Smart Auto-Fit**: Images automatically fit to screen when selected for optimal viewing
12. **Labeling System**: Add custom labels to each annotation with real-time editing
13. **Data Export/Import**: Export annotations as JSON and import previous sessions
14. **Full Viewport Layout**: Horizontal toolbar with 8-column grid layout for maximum workspace
15. **Performance Optimized**: Debounced resize events, requestAnimationFrame rendering, fast PDF loading, production-ready build

## UI Architecture
- **Horizontal Toolbar**: All annotation and navigation controls in a single row above the workspace
  - Drawing modes, zoom controls, annotation management, data import/export
- **8-Column Grid Layout**: Responsive grid using full viewport width
- **Compact Sidebar**: Image upload and management (1 column on large screens) with support for images and PDF files
- **Dynamic Canvas Area**: Main annotation workspace (7 columns on large screens)
  - Maximum space utilization using all available width and height
  - Automatic resize triggers on image selection and zoom operations
  - Real-time responsiveness to window resize
  - Independent scrolling for image list container
- **Canvas-Based Drawing**: HTML5 Canvas with zoom/pan transformations and precise interaction

## Drawing & Navigation Modes
1. **Draw**: Create new circular annotations by clicking and dragging
2. **Select**: Click on annotations to select them for editing
3. **Move**: Drag selected annotations to reposition them
4. **Resize**: Drag the edge of selected annotations to adjust size
5. **Pan**: Navigate around the image (especially useful when zoomed in)

## Zoom & Navigation Features
- **Zoom Controls**: Zoom in/out with 1.5x steps, fit-to-screen, actual size (100%)
- **Pan Navigation**: Dedicated pan mode with grab/grabbing cursor feedback
- **Spacebar Panning**: Hold spacebar + drag for temporary panning in any mode (like Photoshop)
- **Keyboard Shortcuts**: Spacebar + drag and Ctrl/Cmd + drag for temporary panning
- **Smart Auto-Fit**: Images automatically fit to screen when first loaded for optimal viewing
- **Dynamic Canvas**: Responsive canvas sizing with maximum space utilization
- **Smart Resize Triggers**: Canvas automatically resizes on image selection and zoom operations
- **Performance**: Debounced resize events, requestAnimationFrame rendering, and fast PDF loading

## Code Patterns
- Use TypeScript with strict typing and proper interfaces
- Follow Next.js 14 App Router conventions
- Implement responsive design with Tailwind CSS and CSS Grid
- Use Radix UI components for accessible UI elements
- Canvas-based drawing for precise annotation control with zoom/pan transformations
- State management with React hooks (useState, useCallback, useMemo)
- Clean component separation with clear responsibilities
- Performance optimization with debouncing and requestAnimationFrame

## Project Structure
```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx              # Main application with state management
├── components/
│   ├── AnnotationCanvas.tsx  # Canvas-based annotation interface
│   ├── AnnotationToolbar.tsx # Horizontal toolbar with all controls
│   └── ImageUploader.tsx     # Compact image upload and management
├── lib/
│   └── utils.ts             # Utility functions and helpers
└── types/
    └── annotation.ts        # TypeScript type definitions
```

## Data Structure
The annotation export format follows this structure:
```json
[
  {
    "filename": "image1.jpg", 
    "annotations": [
      {
        "id": "unique-id-string",
        "x": 150,
        "y": 200, 
        "radius": 25,
        "label": "Object 1"
      }
    ]
  }
]
```

## TypeScript Types
```typescript
interface Annotation {
  id: string;
  x: number;
  y: number;
  radius: number;
  label: string;
}

interface ImageAnnotation {
  filename: string;
  annotations: Annotation[];
}

interface CanvasViewState {
  zoom: number;
  panX: number;
  panY: number;
}

interface AnnotationCanvasProps {
  imageUrl: string;
  annotations: Annotation[];
  onAnnotationsChange: (annotations: Annotation[]) => void;
  selectedAnnotationId: string | null;
  onAnnotationSelect: (id: string | null) => void;
  mode: DrawingMode;
  viewState: CanvasViewState;
  onViewStateChange: (viewState: CanvasViewState) => void;
  resizeTrigger?: number; // Increment to trigger canvas resize
}

type AnnotationData = ImageAnnotation[];
type DrawingMode = 'draw' | 'select' | 'resize' | 'move' | 'pan';
type ZoomMode = 'zoom-in' | 'zoom-out' | 'fit-screen' | 'actual-size';
```

## Development Guidelines
When suggesting code, prioritize:
- Type safety with strict TypeScript interfaces
- Accessibility with proper ARIA labels and keyboard navigation
- Clean component architecture with clear separation of concerns
- Responsive design that works across desktop and tablet devices
- Performance optimization for canvas operations and large images
- Consistent state management patterns using React hooks
- Proper handling of zoom/pan transformations in canvas coordinates
- Debounced event handling for resize operations
- requestAnimationFrame for smooth rendering performance
- Circular dependency prevention in useEffect hooks
- Canvas workspace maximization for optimal annotation efficiency
- Proper resizeTrigger implementation for dynamic canvas sizing
- Independent scrolling containers with fixed heights and overflow handling
- Local asset management for PDF.js worker files to avoid CDN dependencies
