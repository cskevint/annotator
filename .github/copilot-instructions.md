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
3. **Interactive Circle Annotations**: Click and drag to create circles with dynamic radius and thick visual styling
4. **Contextual Mode System**: Intelligent mode switching - click outside annotations to draw, click on annotations to select
5. **Enhanced Select Mode**: Click to select, drag to move, resize via handles, and delete with X button
6. **Smart Workflow**: Automatically selects newly created annotations for immediate editing
7. **Auto-Selection**: First uploaded image is automatically selected when no images are loaded
8. **Intelligent Focus Zoom**: Smart zoom that ensures entire annotations fit within viewport with comfortable padding
9. **Comprehensive Zoom Controls**: Center-fixed zoom in/out, fit-to-screen, actual size, and focus-annotation with percentage display
10. **Mouse Wheel Zoom**: Mouse wheel support for intuitive zoom in/out with center-fixed behavior (trackpad gestures disabled to prevent accidental zooming)
11. **Global Keyboard Shortcuts**: Cmd/Ctrl +/- for zoom operations and spacebar panning
12. **Maximum Canvas Utilization**: Canvas automatically uses all available width and height for optimal workspace
12. **Smart Canvas Resizing**: Dynamic canvas with automatic resize triggers on image selection and zoom operations
13. **Independent Scrolling Interface**: Image list container scrolls separately from main application
14. **Spacebar Pan Navigation**: Hold spacebar + drag for temporary panning in any mode (like Photoshop)
15. **Smart Auto-Fit**: Images automatically fit to screen when selected for optimal viewing
16. **High-Visibility Styling**: Thick annotation lines (8-10px) with color-coded visual feedback (green unselected, blue selected)
17. **Zoom-Responsive Controls**: Delete and resize buttons scale inversely with zoom for consistent visibility at all zoom levels
18. **Enhanced Click Targets**: Resize button click detection uses entire visual circle with 25% padding for improved usability
19. **Double-Click Label Editing**: Context-sensitive label dialog with smart positioning that appears on double-click
20. **Predefined Label Support**: URL parameter `labels` enables dropdown with predefined options plus custom text entry
21. **High-Contrast Label Text**: Labels with thick white stroke outline for readability against any background
22. **Zoom-Responsive Labels**: Annotation labels scale with zoom and maintain readability at all levels
22. **Data Export/Import**: Export annotations as JSON and import previous sessions
23. **Full Viewport Layout**: Horizontal toolbar with streamlined controls for maximum workspace
24. **Performance Optimized**: Debounced resize events, requestAnimationFrame rendering, fast PDF loading, production-ready build

## UI Architecture
- **Vertical Sidebar Layout**: Data management controls above image management (contextual interaction - no mode buttons)
- **8-Column Grid Layout**: Responsive grid using full viewport width with maximum vertical space
- **Compact Sidebar**: Data management (import/export/annotation count) and image upload in vertical stack (1 column on large screens)
- **Dynamic Canvas Area**: Main annotation workspace (7 columns on large screens)
  - Maximum space utilization using all available width and height
  - Floating zoom controls in top-right corner of canvas with conditional focus button state
  - Contextual interaction: click and drag outside annotations to draw, click on annotations to select
  - Automatic resize triggers on image selection and zoom operations
  - Real-time responsiveness to window resize
  - Independent scrolling for image list container
- **Canvas-Based Drawing**: HTML5 Canvas with zoom/pan transformations and precise interaction

## Contextual Interaction System
**No explicit modes** - behavior is determined by user actions:
1. **Drawing Context**: Click and drag outside annotations to create new circular annotations
2. **Selection Context**: Click on any annotation to select it, then:
   - Click red X button in top-right corner to delete selected annotation (scales inversely with zoom for visibility)
   - Click and drag annotation body to move it
   - Click and drag red resize handle on right edge to resize annotation (scales inversely with zoom for visibility, with enhanced click target covering entire visual circle plus 25% padding)
   - All annotation manipulation (delete, move, resize) happens directly on annotations, not via separate toolbar buttons
3. **Smart Cursor Feedback**: Pointer cursor when hovering over annotations, crosshair for drawing areas, specific cursors for resize/move actions

## Zoom & Navigation Features
- **Floating Zoom Controls**: Top-right corner overlay with compact icon-only buttons for zoom in/out, fit-to-screen, actual size (100%), and focus-annotation (disabled when no annotation selected)
- **Center-Fixed Zoom**: Zoom in/out with 1.5x steps while maintaining canvas center point
- **Global Keyboard Shortcuts**: Cmd/Ctrl +/- for zoom in/out operations across the entire application
- **Spacebar Panning**: Hold spacebar + drag for temporary panning in any mode (like Photoshop)
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
│   └── page.tsx              # Main application with state management and zoom controls
├── components/
│   ├── AnnotationCanvas.tsx  # Canvas-based annotation interface
│   ├── ImageUploader.tsx     # Compact image upload and management
│   └── LabelDialog.tsx       # Double-click label editing dialog
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
  viewState: CanvasViewState;
  onViewStateChange: (viewState: CanvasViewState) => void;
  onZoomAction: (action: ZoomMode) => void;
  resizeTrigger?: number; // Increment to trigger canvas resize
  onAnnotationDoubleClick?: (annotation: Annotation, position: { x: number; y: number }) => void;
}

type AnnotationData = ImageAnnotation[];
type ZoomMode = 'zoom-in' | 'zoom-out' | 'fit-screen' | 'actual-size' | 'focus-annotation';
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
