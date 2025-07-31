# Image Annotation Tool

A modern web application built with Next.js 14 for annotating images with circular annotations. Create precise annotations with labels and export your work as JSON data.

## Features

- **Multi-Image Upload**: Upload and manage multiple images simultaneously
- **Interactive Annotation**: Click and drag to create circular annotations with dynamic radius
- **Annotation Management**: Select, move, resize, and delete annotations with ease
- **Labeling System**: Add custom labels to each annotation
- **Data Export/Import**: Export annotations as JSON and import previous sessions
- **Responsive Design**: Works on desktop and tablet devices

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd annotator
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Basic Workflow

1. **Upload Images**: Drag and drop images or use the file picker to upload web-compatible images (PNG, JPG, GIF, WebP)

2. **Select Image**: Click on an uploaded image to begin annotation

3. **Create Annotations**: 
   - Select "Draw" mode
   - Click and drag on the image to create circular annotations
   - The radius expands as you move away from the initial click point

4. **Manage Annotations**:
   - **Select**: Use "Select" mode to choose annotations
   - **Move**: Use "Move" mode to drag annotations to new positions
   - **Resize**: Use "Resize" mode to adjust annotation size by dragging the edge
   - **Delete**: Select an annotation and click the delete button
   - **Label**: Add descriptive labels to annotations in the controls panel

5. **Export Data**: Click "Export Annotations" to download a JSON file with all annotation data

6. **Import Data**: Use "Import Annotations" to load previously saved annotation sessions

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

## Project Structure

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── AnnotationCanvas.tsx    # Canvas-based annotation interface
│   ├── AnnotationControls.tsx  # Tool panel and controls
│   └── ImageUploader.tsx       # Image upload and management
├── lib/
│   └── utils.ts               # Utility functions
└── types/
    └── annotation.ts          # TypeScript type definitions
```

## Development

### Key Components

- **AnnotationCanvas**: Handles all canvas drawing, mouse interactions, and annotation rendering
- **AnnotationControls**: Provides mode switching, annotation editing, and data management
- **ImageUploader**: Manages file upload, image selection, and file display

### Drawing Modes

- **Draw**: Create new circular annotations by clicking and dragging
- **Select**: Click on annotations to select them
- **Move**: Drag selected annotations to reposition them
- **Resize**: Drag the edge of selected annotations to resize

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For questions or issues, please create an issue in the repository.
