'use client';

import React from 'react';
import { MousePointer, Move, RotateCcw, Trash2, Download, Upload } from 'lucide-react';
import { Annotation, DrawingMode } from '@/types/annotation';

interface AnnotationControlsProps {
  mode: DrawingMode;
  onModeChange: (mode: DrawingMode) => void;
  selectedAnnotation: Annotation | null;
  onDeleteAnnotation: () => void;
  onAnnotationLabelChange: (label: string) => void;
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  annotationCount: number;
}

export default function AnnotationControls({
  mode,
  onModeChange,
  selectedAnnotation,
  onDeleteAnnotation,
  onAnnotationLabelChange,
  onExport,
  onImport,
  annotationCount
}: AnnotationControlsProps) {
  const modes = [
    { id: 'draw' as DrawingMode, label: 'Draw', icon: RotateCcw, description: 'Click and drag to create circles' },
    { id: 'select' as DrawingMode, label: 'Select', icon: MousePointer, description: 'Select annotations' },
    { id: 'move' as DrawingMode, label: 'Move', icon: Move, description: 'Move selected annotation' },
    { id: 'resize' as DrawingMode, label: 'Resize', icon: RotateCcw, description: 'Resize selected annotation' }
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Annotation Tools</h2>
        <span className="text-sm text-gray-500">
          {annotationCount} annotation{annotationCount !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Mode Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Mode</label>
        <div className="grid grid-cols-2 gap-2">
          {modes.map((modeOption) => {
            const Icon = modeOption.icon;
            return (
              <button
                key={modeOption.id}
                onClick={() => onModeChange(modeOption.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  mode === modeOption.id
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
                title={modeOption.description}
              >
                <Icon className="h-4 w-4" />
                <span>{modeOption.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Annotation Controls */}
      {selectedAnnotation && (
        <div className="space-y-3 border-t pt-4">
          <h3 className="text-sm font-medium text-gray-700">Selected Annotation</h3>
          
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600">Label</label>
            <input
              type="text"
              value={selectedAnnotation.label}
              onChange={(e) => onAnnotationLabelChange(e.target.value)}
              placeholder="Enter annotation label..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
            <div>
              <span className="font-medium">X:</span> {Math.round(selectedAnnotation.x)}
            </div>
            <div>
              <span className="font-medium">Y:</span> {Math.round(selectedAnnotation.y)}
            </div>
            <div>
              <span className="font-medium">R:</span> {Math.round(selectedAnnotation.radius)}
            </div>
          </div>

          <button
            onClick={onDeleteAnnotation}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm font-medium hover:bg-red-100 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete Annotation</span>
          </button>
        </div>
      )}

      {/* Import/Export Controls */}
      <div className="space-y-3 border-t pt-4">
        <h3 className="text-sm font-medium text-gray-700">Data Management</h3>
        
        <div className="grid grid-cols-1 gap-2">
          <button
            onClick={onExport}
            disabled={annotationCount === 0}
            className="flex items-center justify-center space-x-2 px-3 py-2 bg-green-50 text-green-700 border border-green-200 rounded-md text-sm font-medium hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4" />
            <span>Export Annotations</span>
          </button>

          <label className="flex items-center justify-center space-x-2 px-3 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors cursor-pointer">
            <Upload className="h-4 w-4" />
            <span>Import Annotations</span>
            <input
              type="file"
              accept=".json"
              onChange={onImport}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Instructions */}
      <div className="border-t pt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Instructions</h3>
        <div className="text-xs text-gray-600 space-y-1">
          <p><strong>Draw:</strong> Click and drag to create circles</p>
          <p><strong>Select:</strong> Click on annotations to select them</p>
          <p><strong>Move:</strong> Drag selected annotation to move</p>
          <p><strong>Resize:</strong> Drag the edge of selected annotation</p>
        </div>
      </div>
    </div>
  );
}
