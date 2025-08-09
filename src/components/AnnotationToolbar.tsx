'use client';

import React from 'react';
import { MousePointer, RotateCcw, Trash2, Download, Upload, ZoomIn, ZoomOut, Maximize, RotateCw, Target } from 'lucide-react';
import { Annotation, DrawingMode, ZoomMode } from '@/types/annotation';

interface AnnotationToolbarProps {
  mode: DrawingMode;
  onModeChange: (mode: DrawingMode) => void;
  selectedAnnotation: Annotation | null;
  onDeleteAnnotation: () => void;
  onAnnotationLabelChange: (label: string) => void;
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  annotationCount: number;
  onZoomAction: (action: ZoomMode) => void;
  currentZoom: number;
}

export default function AnnotationToolbar({
  mode,
  onModeChange,
  selectedAnnotation,
  onDeleteAnnotation,
  onAnnotationLabelChange,
  onExport,
  onImport,
  annotationCount,
  onZoomAction,
  currentZoom
}: AnnotationToolbarProps) {
  const modes = [
    { id: 'draw' as DrawingMode, label: 'Draw', icon: RotateCcw },
    { id: 'select' as DrawingMode, label: 'Select', icon: MousePointer }
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        {/* Mode Selection */}
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            {modes.map((modeOption) => {
              const Icon = modeOption.icon;
              return (
                <button
                  key={modeOption.id}
                  onClick={() => onModeChange(modeOption.id)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    mode === modeOption.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                  }`}
                  title={modeOption.label}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{modeOption.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-300 hidden md:block" />

        {/* Zoom Controls */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onZoomAction('zoom-in')}
            className="flex items-center space-x-1 px-2 py-2 bg-gray-50 text-gray-700 border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => onZoomAction('zoom-out')}
            className="flex items-center space-x-1 px-2 py-2 bg-gray-50 text-gray-700 border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => onZoomAction('fit-screen')}
            className="flex items-center space-x-1 px-2 py-2 bg-gray-50 text-gray-700 border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
            title="Fit to Screen"
          >
            <Maximize className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => onZoomAction('actual-size')}
            className="flex items-center space-x-1 px-2 py-2 bg-gray-50 text-gray-700 border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
            title="Actual Size (100%)"
          >
            <RotateCw className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => onZoomAction('focus-annotation')}
            disabled={!selectedAnnotation}
            className={`flex items-center space-x-1 px-2 py-2 border border-gray-200 rounded-md text-sm font-medium transition-colors ${
              selectedAnnotation 
                ? 'bg-gray-50 text-gray-700 hover:bg-gray-100' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            title="Focus on Selected Annotation"
          >
            <Target className="h-4 w-4" />
          </button>
          
          <span className="text-xs text-gray-500 ml-2">
            {Math.round(currentZoom * 100)}%
          </span>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-300 hidden md:block" />

        {/* Selected Annotation Controls */}
        {selectedAnnotation && (
          <>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Label:</span>
              <input
                type="text"
                value={selectedAnnotation.label}
                onChange={(e) => onAnnotationLabelChange(e.target.value)}
                placeholder="Enter label..."
                className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-32"
              />
            </div>

            <button
              onClick={onDeleteAnnotation}
              className="flex items-center space-x-1 px-3 py-2 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm font-medium hover:bg-red-100 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Delete</span>
            </button>

            <div className="h-6 w-px bg-gray-300 hidden md:block" />
          </>
        )}

        {/* Data Management */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onExport}
            disabled={annotationCount === 0}
            className="flex items-center space-x-1 px-3 py-2 bg-green-50 text-green-700 border border-green-200 rounded-md text-sm font-medium hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <label className="flex items-center space-x-1 px-3 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors cursor-pointer">
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Import</span>
            <input
              type="file"
              accept=".json"
              onChange={onImport}
              className="hidden"
            />
          </label>
        </div>

        {/* Annotation Count */}
        <div className="flex items-center ml-auto">
          <span className="text-sm text-gray-500">
            {annotationCount} total annotation{annotationCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Selected Annotation Info (Mobile) */}
      {selectedAnnotation && (
        <div className="mt-3 pt-3 border-t border-gray-200 sm:hidden">
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
        </div>
      )}
    </div>
  );
}
