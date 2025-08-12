# Image Annotation Tool

A modern, production-ready web application built with Next.js 14 for annotating images with circular annotations. Create precise annotations with labels and export your work as JSON data.

🔗 **Live Demo:** https://annotator-kohl.vercel.app/  
📚 **Repository:** https://github.com/cskevint/annotator

## Features

- **Multi-Image Upload**: Upload and manage multiple images simultaneously with drag-and-drop support
- **PDF Support**: Upload PDF files that are automatically converted to high-resolution images (300 DPI) per page
- **Interactive Annotation**: Click and drag to create circular annotations with thick, high-visibility styling (8-10px lines)
- **Contextual Interaction System**: Intelligent operation - click outside annotations to draw, click on annotations to select (no mode switching needed)
- **Enhanced Selection**: Click to select, drag to move, resize via handles, and delete with X button (controls scale with zoom for visibility)
- **Smart Workflow**: Automatically selects newly created annotations for immediate editing
- **Auto-Selection**: First uploaded image is automatically selected when no images are loaded
- **Intelligent Focus Zoom**: Smart zoom that ensures entire annotations fit within viewport with comfortable padding
- **Floating Zoom Controls**: Top-right corner overlay with zoom in/out, fit-to-screen, actual size, and focus-annotation (disabled when no annotation selected)
- **Zoom-Responsive UI**: Delete and resize buttons automatically scale for optimal visibility at all zoom levels
- **Double-Click Label Editing**: Context-sensitive label dialog with smart positioning that appears on double-click
- **High-Contrast Label Text**: Labels with thick white stroke outline for readability against any background
- **Zoom-Responsive Labels**: Annotation labels scale with zoom and maintain readability at all levels
- **Smart Auto-Fit**: Images automatically fit to screen when selected for optimal viewing
- **Spacebar Panning**: Hold spacebar + drag for temporary panning in any mode (like Photoshop)
- **Maximum Canvas Utilization**: Canvas automatically uses all available width and height for optimal workspace

## Keyboard Shortcuts

- **Cmd/Ctrl + Plus**: Zoom in (1.5x steps) while keeping canvas center fixed
- **Cmd/Ctrl + Minus**: Zoom out (1.5x steps) while keeping canvas center fixed
- **Spacebar + Drag**: Temporary panning in any mode (works like Photoshop/design tools)

## Advanced Features

- **Multi-Format Support**: Upload PNG, JPG, GIF, WebP images or PDF files
- **PDF Processing**: Automatically converts PDF pages to high-resolution images (300 DPI)
- **Smart Canvas Resizing**: Maximizes workspace by using all available screen space
- **Performance Optimized**: Fast rendering with requestAnimationFrame and optimized PDF loading
- **Export/Import**: Save and load annotation data as JSON files
- **Real-time Feedback**: Live zoom percentage display and responsive UI updates
- **Independent Scrolling**: Image list scrolls separately from the main workspace
- **Memory Efficient**: Optimized image handling for large PDFs and multiple images
- **Labeling System**: Add custom labels to each annotation with real-time editing
- **Data Export/Import**: Export annotations as JSON and import previous sessions
- **Responsive Design**: Optimized for desktop and tablet devices with dynamic window resizing
- **Full Viewport Layout**: Utilizes entire screen width for maximum workspace efficiency

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/cskevint/annotator.git
cd annotator
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Basic Workflow

1. **Upload Images**: Drag and drop images or PDF files, or use the file picker to upload web-compatible images (PNG, JPG, GIF, WebP) and PDF documents

2. **Auto-Selection**: The first uploaded image is automatically selected when no images are loaded, ready for immediate annotation

3. **Create Annotations**: 
   - Click and drag anywhere on the image to create circular annotations
   - The radius expands as you move away from the initial click point  
   - **Newly created annotations are automatically selected** for immediate editing

4. **Manage Annotations**:
   - **Contextual Operation**: The interface intelligently switches between drawing and selecting based on your actions:
     - **Click and drag outside annotations**: Creates new annotations (drawing context)
     - **Click on existing annotations**: Selects them for editing (selection context)
   - **Selected Annotation Actions**:
     - **Delete**: Click the red X button in the top-right corner of the selected annotation
     - **Move**: Click and drag anywhere inside the selected annotation to move it
     - **Resize**: Click and drag the red resize handle (circle on the right edge) to adjust size
     - **Edit Label**: Double-click anywhere inside the annotation to open the label editing dialog with smart positioning

5. **Navigate & Zoom**:
   - **Auto-Fit**: Images automatically fit to screen when first selected for optimal viewing
   - **Zoom In/Out**: Use zoom controls to get closer or farther from the image
   - **Fit to Screen**: Automatically fit the entire image in the viewport
   - **Actual Size**: View image at 100% (1:1 pixel ratio)
   - **Focus Annotation**: Intelligently zoom and position to show the entire selected annotation with comfortable padding
   - **Spacebar Panning**: Hold spacebar + drag for temporary panning in any mode (works like Photoshop)
   - **Smart Resize**: Canvas automatically resizes to use full available space on zoom operations

6. **Export Data**: Click "Export" in the toolbar to download a JSON file with all annotation data

7. **Import Data**: Use "Import" to load previously saved annotation sessions

### Interface Layout

- **Vertical Sidebar**: Data management and image upload in single column for maximum canvas space
  - **Data Management**: Import/export buttons and total annotation count at top
  - **Image Upload**: Upload area and image list below data controls
  - **Independent Scrolling**: Image list scrolls separately with fixed height container
  - **PDF Conversion**: Visual feedback during PDF-to-image conversion process
- **Dynamic Canvas Area**: Main annotation workspace (87.5% width) with maximum space utilization
  - **Floating Zoom Controls**: Top-right corner overlay with all zoom functions and percentage display
  - **Contextual Interaction**: Click outside annotations to draw, click on annotations to select (seamless contextual workflow)
  - **Full Space Usage**: Canvas automatically uses all available width and height
  - **Smart Resizing**: Automatic resize triggers on image selection and zoom operations
  - **Real-time Resize**: Canvas adjusts on window resize with optimal performance
- **Full Viewport**: Utilizes entire browser width for maximum workspace efficiency

### Data Format

Exported JSON follows this structure:

```json
[
  {
    "filename": "image1.jpg",
    "annotations": [
      {
        "id": "unique-id",
        "x": 150,
        "y": 200,
        "radius": 25,
        "label": "Object 1"
      }
    ]
  }
]
```

## Technical Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Canvas**: HTML5 Canvas for precise annotation rendering
- **PDF Processing**: PDF.js for converting PDF pages to high-resolution images

## Project Structure

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── AnnotationCanvas.tsx     # Canvas-based annotation interface
│   ├── AnnotationToolbar.tsx    # Horizontal toolbar with all controls
│   └── ImageUploader.tsx        # Image upload and management
├── lib/
│   └── utils.ts                # Utility functions
└── types/
    └── annotation.ts           # TypeScript type definitions
```

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Key Components

- **AnnotationCanvas**: Handles all canvas drawing, mouse interactions, zoom/pan transformations, and dynamic full-space resizing
  - Canvas-based rendering with zoom and pan support
  - Maximum space utilization with automatic resize triggers
  - Performance-optimized with requestAnimationFrame and debounced resize events
  - Floating zoom controls overlay in top-right corner
- **ImageUploader**: Manages file upload, image selection, and file display in a compact single-column layout
- **LabelDialog**: Context-sensitive label editing dialog with smart positioning

### Contextual Interaction System

**No explicit modes** - behavior is determined by user actions:

- **Drawing Context**: Click and drag outside annotations to create new circular annotations
- **Selection Context**: Click on any annotation to select it, then:
  - **Move**: Click and drag annotation body to move it
  - **Resize**: Click and drag the red resize handle on the right edge
  - **Delete**: Click the red X button in the top-right corner
  - **Edit Label**: Double-click annotation to open label editing dialog
- **Smart Cursor Feedback**: 
  - Pointer cursor when hovering over annotations
  - Crosshair cursor for drawing areas
  - Specific cursors for resize/move actions

### Zoom & Navigation Features

- **Zoom In/Out**: Step zoom with 1.5x increments (10% - 500% range)
- **Fit to Screen**: Automatically calculate optimal zoom to fit entire image
- **Actual Size**: Reset to 100% zoom (1:1 pixel ratio)
- **Pan Navigation**: Smooth panning with grab/grabbing cursor feedback
- **Auto-Fit**: Images automatically fit to screen when first loaded
- **Spacebar Panning**: Hold spacebar + drag for temporary panning (works in any context)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For questions or issues, please create an issue in the [GitHub repository](https://github.com/cskevint/annotator/issues).

## Roadmap

### ✅ Recently Completed
- [x] **Independent Scrolling Interface** - Image list container scrolls separately from main application
- [x] **PDF Upload Support** - Upload PDF files with automatic conversion to 300 DPI images per page
- [x] **Local PDF Worker Configuration** - Reliable PDF processing without external CDN dependencies
- [x] **Full canvas space utilization** - Canvas uses all available width and height for maximum workspace
- [x] **Auto-resize triggers** - Canvas automatically resizes on image selection and zoom operations
- [x] **Zoom and pan controls** - Full zoom in/out, fit-to-screen, actual size with percentage display
- [x] **Dynamic canvas resizing** - Smart responsive canvas with optimal space usage
- [x] **Contextual interaction system** - Intelligent behavior based on user actions (no mode switching needed)
- [x] **Performance optimization** - Debounced resize events and smooth rendering
- [x] **Production build optimization** - Zero warnings, clean TypeScript, optimized bundle

### 🚧 Future Enhancements
- [ ] **Undo/Redo functionality** - Step-by-step annotation history
- [ ] **Keyboard shortcuts** - Hotkeys for common actions and navigation
- [ ] **Batch annotation operations** - Multi-select and bulk editing
- [ ] **Additional annotation shapes** - Rectangles, polygons, freehand drawing
- [ ] **Export formats** - COCO, YOLO, Pascal VOC compatibility
- [ ] **Advanced zoom features** - Mouse wheel zoom, zoom to selection
- [ ] **Annotation templates** - Predefined label sets and quick tools
- [ ] **Collaborative editing** - Real-time multi-user annotation sessions
