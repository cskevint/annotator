# Image Annotation Tool

A modern, production-ready web application built with Next.js 14 for annotating images with circular annotations. Create precise annotations with labels and export your work as JSON data.

🔗 **Live Demo:** https://annotator-kohl.vercel.app/  
📚 **Repository:** https://github.com/cskevint/annotator

## Features

- **Multi-Image Upload**: Upload and manage multiple images simultaneously with drag-and-drop support
- **PDF Support**: Upload PDF files that are automatically converted to high-resolution images (300 DPI) per page
- **Interactive Annotation**: Click and drag to create circular annotations with thick, high-visibility styling (8-10px lines)
- **Simplified Annotation Management**: Two primary modes - Draw and enhanced Select with integrated move, resize, and delete
- **Enhanced Select Mode**: Click to select, drag to move, resize via handles, and delete with X button (controls scale with zoom for visibility)
- **Smart Workflow**: Automatically switches to Select mode after drawing and selects newly created annotations
- **Auto-Selection**: First uploaded image is automatically selected when no images are loaded
- **Focus Zoom**: Intelligent zoom to optimal viewing level for selected annotations
- **Center-Fixed Zoom Controls**: Zoom in/out while maintaining canvas center point, fit-to-screen, actual size, and focus-annotation
- **Zoom-Responsive UI**: Delete and resize buttons automatically scale for optimal visibility at all zoom levels
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
   - Select "Draw" mode in the toolbar
   - Click and drag on the image to create circular annotations
   - The radius expands as you move away from the initial click point
   - **Automatically switches to Select mode** with the new annotation selected for immediate editing

4. **Manage Annotations**:
   - **Select Mode**: Click any annotation to select it, then:
     - **Delete**: Click the red X button in the top-right corner of the selected annotation
     - **Move**: Click and drag anywhere inside the selected annotation to move it
     - **Resize**: Click and drag the red resize handle (circle on the right edge) to adjust size
   - **Label**: Add descriptive labels to annotations using the label input that appears when an annotation is selected

5. **Navigate & Zoom**:
   - **Auto-Fit**: Images automatically fit to screen when first selected for optimal viewing
   - **Zoom In/Out**: Use zoom controls to get closer or farther from the image
   - **Fit to Screen**: Automatically fit the entire image in the viewport
   - **Actual Size**: View image at 100% (1:1 pixel ratio)
   - **Focus Annotation**: Intelligently zoom to optimal viewing level for the selected annotation
   - **Spacebar Panning**: Hold spacebar + drag for temporary panning in any mode (works like Photoshop)
   - **Smart Resize**: Canvas automatically resizes to use full available space on zoom operations

6. **Export Data**: Click "Export" in the toolbar to download a JSON file with all annotation data

7. **Import Data**: Use "Import" to load previously saved annotation sessions

### Interface Layout

- **Horizontal Toolbar**: All annotation and navigation tools in a single row for easy access
  - **Drawing Modes**: Draw and Select (2 streamlined modes with integrated functionality)
  - **Zoom Controls**: Zoom In, Zoom Out, Fit to Screen, Actual Size, and Focus Annotation with percentage display
  - **Data Management**: Export/import functions for annotation data
- **Compact Sidebar**: Image upload and management (12.5% width) with support for images and PDF files
  - **Independent Scrolling**: Image list scrolls separately with fixed height container
  - **PDF Conversion**: Visual feedback during PDF-to-image conversion process
- **Dynamic Canvas Area**: Main annotation workspace (87.5% width) with maximum space utilization
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
- **AnnotationToolbar**: Provides mode switching, zoom controls, annotation editing, and data management
  - Five drawing modes with visual feedback
  - Comprehensive zoom controls with percentage display
  - Integrated annotation management tools
- **ImageUploader**: Manages file upload, image selection, and file display in a compact single-column layout

### Drawing & Navigation Modes

- **Draw**: Create new circular annotations by clicking and dragging
- **Select**: Click on annotations to select them for editing
- **Move**: Drag selected annotations to reposition them
- **Resize**: Drag the edge of selected annotations to resize
- **Pan**: Navigate around the image (especially useful when zoomed in)

### Zoom & Navigation Features

- **Zoom In/Out**: Step zoom with 1.5x increments (10% - 500% range)
- **Fit to Screen**: Automatically calculate optimal zoom to fit entire image
- **Actual Size**: Reset to 100% zoom (1:1 pixel ratio)
- **Pan Navigation**: Smooth panning with grab/grabbing cursor feedback
- **Auto-Fit**: Images automatically fit to screen when first loaded
- **Spacebar Panning**: Hold spacebar + drag for temporary panning in any mode

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
- [x] **Pan navigation mode** - Dedicated pan mode with keyboard shortcuts
- [x] **Performance optimization** - Debounced resize events and smooth rendering
- [x] **Production build optimization** - Zero warnings, clean TypeScript, optimized bundle

### 🚧 Future Enhancements
- [ ] **Undo/Redo functionality** - Step-by-step annotation history
- [ ] **Keyboard shortcuts** - Hotkeys for mode switching and common actions
- [ ] **Batch annotation operations** - Multi-select and bulk editing
- [ ] **Additional annotation shapes** - Rectangles, polygons, freehand drawing
- [ ] **Export formats** - COCO, YOLO, Pascal VOC compatibility
- [ ] **Advanced zoom features** - Mouse wheel zoom, zoom to selection
- [ ] **Annotation templates** - Predefined label sets and quick tools
- [ ] **Collaborative editing** - Real-time multi-user annotation sessions
