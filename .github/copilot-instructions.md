# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

This is a Next.js 14 TypeScript project for image annotation with the following key features:

## Project Context
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives (Dialog, Select, Label, Separator, Toast)
- **Icons**: Lucide React
- **Purpose**: Web application for annotating images with circular annotations

## Key Features
1. **Multi-Image Upload**: Support for multiple web-compatible image formats (PNG, JPG, GIF, WebP)
2. **Interactive Circle Annotations**: Click-and-drag to create circles with dynamic radius
3. **Annotation Management**: Four distinct modes - draw, select, move, resize, and delete annotations
4. **Labeling System**: Add custom labels to each annotation with real-time editing
5. **Data Export/Import**: Export annotations as JSON and import previous sessions
6. **Full Viewport Layout**: Horizontal toolbar with 8-column grid layout for maximum workspace

## UI Architecture
- **Horizontal Toolbar**: All annotation controls in a single row above the workspace
- **8-Column Grid Layout**: Responsive grid using full viewport width
- **Compact Sidebar**: Image upload and management (1 column on large screens)
- **Large Canvas Area**: Main annotation workspace (7 columns on large screens)
- **Canvas-Based Drawing**: HTML5 Canvas for precise annotation rendering and interaction

## Drawing Modes
1. **Draw**: Create new circular annotations by clicking and dragging
2. **Select**: Click on annotations to select them for editing
3. **Move**: Drag selected annotations to reposition them
4. **Resize**: Drag the edge of selected annotations to adjust size

## Code Patterns
- Use TypeScript with strict typing and proper interfaces
- Follow Next.js 14 App Router conventions
- Implement responsive design with Tailwind CSS and CSS Grid
- Use Radix UI components for accessible UI elements
- Canvas-based drawing for precise annotation control
- State management with React hooks (useState, useCallback, useMemo)
- Clean component separation with clear responsibilities

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

type AnnotationData = ImageAnnotation[];
type DrawingMode = 'draw' | 'select' | 'resize' | 'move';
```

## Development Guidelines
When suggesting code, prioritize:
- Type safety with strict TypeScript interfaces
- Accessibility with proper ARIA labels and keyboard navigation
- Clean component architecture with clear separation of concerns
- Responsive design that works across desktop and tablet devices
- Performance optimization for canvas operations and large images
- Consistent state management patterns using React hooks
