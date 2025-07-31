'use client';

import React, { useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { formatFileSize } from '@/lib/utils';

interface ImageUploaderProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
  currentImageIndex: number;
  onImageSelect: (index: number) => void;
}

export default function ImageUploader({
  images,
  onImagesChange,
  currentImageIndex,
  onImageSelect
}: ImageUploaderProps) {
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith('image/')
    );
    onImagesChange([...images, ...files]);
  }, [images, onImagesChange]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(file =>
      file.type.startsWith('image/')
    );
    onImagesChange([...images, ...files]);
    e.target.value = ''; // Reset input
  }, [images, onImagesChange]);

  const removeImage = useCallback((index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
    
    // Adjust current image index if necessary
    if (currentImageIndex >= newImages.length && newImages.length > 0) {
      onImageSelect(newImages.length - 1);
    } else if (newImages.length === 0) {
      onImageSelect(-1);
    } else if (currentImageIndex > index) {
      onImageSelect(currentImageIndex - 1);
    }
  }, [images, onImagesChange, currentImageIndex, onImageSelect]);

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
        <p className="text-sm font-medium text-gray-700 mb-1">
          Drop images here or click to upload
        </p>
        <p className="text-xs text-gray-500 mb-3">
          Supports PNG, JPG, GIF, WebP
        </p>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
        >
          Choose Files
        </label>
      </div>

      {/* Image List */}
      {images.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-900">
            Images ({images.length})
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {images.map((image, index) => (
              <div
                key={`${image.name}-${index}`}
                className={`relative group border rounded-lg p-2 cursor-pointer transition-all ${
                  currentImageIndex === index
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => onImageSelect(index)}
              >
                <div className="flex items-center space-x-2">
                  <div className="flex-shrink-0">
                    <ImageIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 truncate">
                      {image.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(image.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  className="absolute top-1 right-1 p-0.5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
                {currentImageIndex === index && (
                  <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
