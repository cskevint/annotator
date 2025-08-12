'use client';

import React from 'react';
import { Download, Upload, ZoomIn, ZoomOut, Maximize, RotateCw, Target } from 'lucide-react';
import { ZoomMode } from '@/types/annotation';

interface AnnotationToolbarProps {
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  annotationCount: number;
  onZoomAction: (action: ZoomMode) => void;
  currentZoom: number;
}

export default function AnnotationToolbar({
  onExport,
  onImport,
  annotationCount,
  onZoomAction,
  currentZoom
}: AnnotationToolbarProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        {/* Zoom Controls */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onZoomAction('zoom-out')}
            className="flex items-center space-x-1 px-2 py-2 border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            onClick={() => onZoomAction('zoom-in')}
            className="flex items-center space-x-1 px-2 py-2 border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={() => onZoomAction('fit-screen')}
            className="flex items-center space-x-1 px-2 py-2 border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
            title="Fit to Screen"
          >
            <Maximize className="h-4 w-4" />
          </button>
          <button
            onClick={() => onZoomAction('actual-size')}
            className="flex items-center space-x-1 px-2 py-2 border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
            title="Actual Size (100%)"
          >
            <RotateCw className="h-4 w-4" />
          </button>
          <button
            onClick={() => onZoomAction('focus-annotation')}
            className="flex items-center space-x-1 px-3 py-2 bg-gray-50 text-gray-700 border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
            title="Focus Annotation"
          >
            <Target size={16} />
            <span className="hidden sm:inline">Focus</span>
          </button>
          
          <span className="text-xs text-gray-500 ml-2">
            {Math.round(currentZoom * 100)}%
          </span>
        </div>

        <div className="h-6 w-px bg-gray-300 hidden md:block" />

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
    </div>
  );
}
