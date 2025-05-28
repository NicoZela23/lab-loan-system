// filepath: c:\Users\simon\OneDrive\Escritorio\labLoan\lab-loan-system\front\src\components\common\MultiImageUploader.tsx
import { useState, useRef } from 'react';
import { XMarkIcon, ArrowUpTrayIcon, PhotoIcon } from '@heroicons/react/24/outline';

interface MultiImageUploaderProps {
  onChange: (urls: string[]) => void;
  maxImages?: number;
  initialImages?: string[];
}

export default function MultiImageUploader({ onChange, maxImages = 5, initialImages = [] }: MultiImageUploaderProps) {
  const [images, setImages] = useState<string[]>(initialImages);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    if (images.length + files.length > maxImages) {
      alert(`Solo puedes subir un máximo de ${maxImages} imágenes.`);
      return;
    }

    // Simular subida de imágenes y obtener URLs
    // En un entorno real, aquí subirías los archivos a un servidor o servicio de almacenamiento
    const newImages = files.map(file => {
      // Crear una URL temporal para previsualizar la imagen
      return URL.createObjectURL(file);
    });

    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);
    onChange(updatedImages);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onChange(updatedImages);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div 
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          isDragging 
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
            : 'border-gray-300 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <div className="flex flex-col items-center">
          <ArrowUpTrayIcon className="h-10 w-10 text-gray-400 dark:text-gray-500 mb-2" />
          <p className="text-gray-600 dark:text-gray-400 mb-1">
            Arrastra y suelta imágenes aquí o haz clic para seleccionarlas
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            JPG, PNG o GIF • Máximo {maxImages} imágenes
          </p>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          multiple
          accept="image/*"
          className="hidden"
        />
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                <img
                  src={image}
                  alt={`Imagen ${index + 1}`}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
                className="absolute top-1 right-1 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md opacity-70 hover:opacity-100 focus:outline-none"
              >
                <XMarkIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          ))}
          
          {images.length < maxImages && (
            <div 
              className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600"
              onClick={triggerFileInput}
            >
              <div className="text-center p-4">
                <PhotoIcon className="h-8 w-8 mx-auto text-gray-400 dark:text-gray-500" />
                <span className="mt-1 block text-sm text-gray-500 dark:text-gray-400">
                  Añadir más
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}