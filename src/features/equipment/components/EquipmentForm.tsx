import { useState, ChangeEvent, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Equipment, EquipmentFormData } from '../../../types/equipment';
import { PhotoIcon } from '@heroicons/react/24/outline';

interface EquipmentFormProps {
  onSubmit: (data: EquipmentFormData) => void;
  onCancel?: () => void;
  initialData?: Equipment;
  submitLabel?: string;
}

export default function EquipmentForm({ 
  onSubmit, 
  onCancel,
  initialData,
  submitLabel = "Registrar Equipo"
}: EquipmentFormProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(initialData?.imageUrl || null);
  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<EquipmentFormData>({
    defaultValues: initialData || {
      name: '',
      description: '',
      imageUrl: ''
    }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        description: initialData.description,
        imageUrl: initialData.imageUrl,
      });
      
      setPreviewImage(initialData.imageUrl);
    }
  }, [initialData, reset]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        setValue('imageUrl', result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className="form-label">Nombre del Equipo</label>
        <input
          id="name"
          type="text"
          className={`input-field ${errors.name ? 'border-red-500' : ''}`}
          {...register('name', { required: 'El nombre es obligatorio' })}
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className="form-label">Descripción</label>
        <textarea
          id="description"
          rows={4}
          className={`input-field ${errors.description ? 'border-red-500' : ''}`}
          {...register('description', { required: 'La descripción es obligatoria' })}
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
      </div>

      <div>
        <label className="form-label">Foto del Equipo</label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            {previewImage ? (
              <div className="flex flex-col items-center">
                <img src={previewImage} alt="Preview" className="h-32 w-32 object-cover rounded-md" />
                <button 
                  type="button" 
                  className="mt-2 text-sm text-primary-600 hover:text-primary-800"
                  onClick={() => { setPreviewImage(null); setValue('imageUrl', ''); }}
                >
                  Cambiar imagen
                </button>
              </div>
            ) : (
              <>
                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                    <span>Subir un archivo</span>
                    <input 
                      id="file-upload" 
                      name="file-upload" 
                      type="file" 
                      className="sr-only" 
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                  <p className="pl-1">o arrastra y suelta</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
              </>
            )}
          </div>
        </div>
        <input type="hidden" {...register('imageUrl', { required: 'La imagen es obligatoria' })} />
        {errors.imageUrl && <p className="mt-1 text-sm text-red-600">La imagen es obligatoria</p>}
      </div>

      <div className="flex space-x-2 justify-end">
        {onCancel && (
          <button 
            type="button" 
            onClick={onCancel}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Cancelar
          </button>
        )}
        <button type="submit" className="btn-primary">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
