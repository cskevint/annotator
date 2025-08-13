"use client";

import React, { useState, useEffect } from "react";
import { X, Upload, MousePointer, Keyboard, Circle } from "lucide-react";

interface WelcomeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WelcomeDialog({ isOpen, onClose }: WelcomeDialogProps) {
  const [showOnStartup, setShowOnStartup] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("annotator-show-on-startup");
    if (saved !== null) {
      setShowOnStartup(saved === "true");
    }
  }, []);

  // Handle checkbox change and save to localStorage immediately
  const handleShowOnStartupChange = (checked: boolean) => {
    setShowOnStartup(checked);
    localStorage.setItem("annotator-show-on-startup", checked.toString());
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Welcome to the Annotator
            </h2>
            <p className="text-sm text-gray-600 mt-0.5">
              Learn how to annotate PDFs and images efficiently
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close welcome dialog"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Key Features */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
              <MousePointer className="h-5 w-5 text-blue-500 mr-2" />
              Key Features
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Upload className="h-5 w-5 text-sm text-green-500 flex-shrink-0" />
                <div>
                  <strong>Multi-Format Support:</strong> Upload images (PNG,
                  JPG, GIF, WebP) or PDF files
                </div>
              </li>
              <li className="flex items-center space-x-2">
                <Circle className="h-5 w-5 text-sm text-green-500 flex-shrink-0" />
                <div>
                  <strong>Circular Annotations:</strong> Click and drag to
                  create precise circular annotations
                </div>
              </li>
            </ul>
          </div>

          {/* How to Use */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              How to Use
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-medium mt-0.5">
                  1
                </div>
                <p className="text-sm text-gray-700">
                  <strong>Upload images:</strong> Drag and drop or click to
                  upload images or PDF files
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-medium mt-0.5">
                  2
                </div>
                <p className="text-sm text-gray-700">
                  <strong>Create annotations:</strong> Click and drag outside
                  existing annotations to create new circles
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-medium mt-0.5">
                  3
                </div>
                <p className="text-sm text-gray-700">
                  <strong>Edit annotations:</strong> Click on annotations to
                  select, move, resize, or delete them
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-medium mt-0.5">
                  4
                </div>
                <p className="text-sm text-gray-700">
                  <strong>Add labels:</strong> Double-click annotations to add
                  or edit labels
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-medium mt-0.5">
                  5
                </div>
                <p className="text-sm text-gray-700">
                  <strong>Export/Import:</strong> Save your work as JSON and
                  import it later to continue annotating
                </p>
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
              <Keyboard className="h-5 w-5 text-indigo-500 mr-2" />
              Keyboard Shortcuts
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
                <span className="text-sm text-gray-700">Zoom In</span>
                <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono">
                  Cmd/Ctrl +
                </kbd>
              </div>
              <div className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
                <span className="text-sm text-gray-700">Zoom Out</span>
                <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono">
                  Cmd/Ctrl -
                </kbd>
              </div>
              <div className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
                <span className="text-sm text-gray-700">Pan Mode</span>
                <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono">
                  Spacebar + Drag
                </kbd>
              </div>
              <div className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
                <span className="text-sm text-gray-700">Middle Mouse Pan</span>
                <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono">
                  Wheel Click + Drag
                </kbd>
              </div>
              <div className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
                <span className="text-sm text-gray-700">Mouse Wheel</span>
                <span className="text-xs text-gray-500">Zoom In/Out</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showOnStartup}
                onChange={(e) => handleShowOnStartupChange(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                Show on startup
              </span>
            </label>
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
