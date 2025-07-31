# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

This is a Next.js 14 TypeScript project for image annotation with the following key features:

## Project Context
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Purpose**: Web application for annotating images with circular annotations

## Key Features
1. **Image Upload**: Support for multiple web-compatible image formats
2. **Circle Annotations**: Click-and-drag to create circles with dynamic radius
3. **Annotation Management**: Resize, move, delete, and label annotations
4. **Data Export**: Export annotations as JSON with filename and coordinate data
5. **Session Management**: Import/export annotation sessions for resuming work

## Code Patterns
- Use TypeScript with strict typing
- Follow Next.js 14 App Router conventions
- Implement responsive design with Tailwind CSS
- Use Radix UI components for accessible UI elements
- Canvas-based drawing for precise annotation control
- State management with React hooks

## Data Structure
The annotation export format should follow this structure:
```json
[
  {
    "filename": "image1.jpg", 
    "annotations": [
      {
        "x": 150,
        "y": 200, 
        "radius": 25,
        "label": "Object 1"
      }
    ]
  }
]
```

When suggesting code, prioritize type safety, accessibility, and clean component architecture.
