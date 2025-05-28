// filepath: c:\Users\simon\OneDrive\Escritorio\labLoan\lab-loan-system\front\src\features\incidents\components\IncidentForm.tsx
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { IncidentFormData, IncidentSeverity } from '../../../types/incident';
import { Equipment } from '../../../types/equipment';
import MultiImageUploader from '../../../components/common/MultiImageUploader';
import { ExclamationTriangleIcon, WrenchScrewdriverIcon, DocumentTextIcon, CameraIcon } from '@heroicons/react/24/outline';

interface IncidentFormProps {
  onSubmit: (data: IncidentFormData) => void;
  onCancel?: () => void;
  equipment?: Equipment | null;
  equipments?: Equipment[];
}

export default function IncidentForm({ 
  onSubmit, 
  onCancel, 
  equipment,
  equipments = []
}: IncidentFormProps) {
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(equipment || null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<IncidentFormData>({
    defaultValues: {
      equipmentId: equipment?.id || 0,
      title: '',
      description: '',
      severity: 'media' as IncidentSeverity,
      imageUrls: []
    }
  });

  // Update form when equipment prop changes
  useEffect(() => {
    if (equipment) {
      setSelectedEquipment(equipment);
      setValue('equipmentId', equipment.id);
    }
  }, [equipment, setValue]);

  const severityOptions: { value: IncidentSeverity; label: string; color: string }[] = [
    { value: 'baja', label: 'Baja', color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' },
    { value: 'media', label: 'Media', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' },
    { value: 'alta', label: 'Alta', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300' },
    { value: 'crítica', label: 'Crítica', color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' }
  ];

  const watchedSeverity = watch('severity');
  
  const handleEquipmentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const equipmentId = parseInt(event.target.value);
    setValue('equipmentId', equipmentId);
    
    const newSelectedEquipment = equipments.find(eq => eq.id === equipmentId) || null;
    setSelectedEquipment(newSelectedEquipment);
  };
  
  const handleImagesChange = (newImageUrls: string[]) => {
    setImageUrls(newImageUrls);
    setValue('imageUrls', newImageUrls);
  };
  
  const onFormSubmit = (data: IncidentFormData) => {
    // Make sure images are included
    const formData: IncidentFormData = {
      ...data,
      imageUrls: imageUrls
    };
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <WrenchScrewdriverIcon className="h-6 w-6 text-primary-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Equipo con incidencia</h3>
        </div>

        {equipment ? (
          <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            {equipment.imageUrl && (
              <img 
                src={equipment.imageUrl} 
                alt={equipment.name} 
                className="w-24 h-24 object-cover rounded-md" 
              />
            )}
            <div>
              <h4 className="text-md font-semibold text-gray-900 dark:text-white">{equipment.name}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{equipment.description}</p>
            </div>
          </div>
        ) : (
          <div>
            <label htmlFor="equipmentId" className="form-label">Selecciona el equipo con problemas</label>
            <select
              id="equipmentId"
              {...register('equipmentId', { 
                required: 'Debes seleccionar un equipo',
                validate: value => value > 0 || 'Debes seleccionar un equipo'
              })}
              className={`input-field ${errors.equipmentId ? 'border-red-500' : ''}`}
              onChange={handleEquipmentChange}
            >
              <option value={0}>Selecciona un equipo</option>
              {equipments.map(eq => (
                <option key={eq.id} value={eq.id}>{eq.name}</option>
              ))}
            </select>
            {errors.equipmentId && <p className="mt-1 text-sm text-red-600">{errors.equipmentId.message}</p>}
            
            {selectedEquipment && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-center space-x-4">
                {selectedEquipment.imageUrl && (
                  <img 
                    src={selectedEquipment.imageUrl} 
                    alt={selectedEquipment.name} 
                    className="w-16 h-16 object-cover rounded-md" 
                  />
                )}
                <div className="flex-1">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{selectedEquipment.description}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <ExclamationTriangleIcon className="h-6 w-6 text-primary-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Detalles de la incidencia</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="form-label">Título del problema</label>
            <input
              id="title"
              type="text"
              className={`input-field ${errors.title ? 'border-red-500' : ''}`}
              placeholder="Ej: Microscopio no enciende correctamente"
              {...register('title', { required: 'El título es obligatorio' })}
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
          </div>
          
          <div>
            <label htmlFor="description" className="form-label">Descripción detallada</label>
            <textarea
              id="description"
              rows={4}
              className={`input-field ${errors.description ? 'border-red-500' : ''}`}
              placeholder="Describe detalladamente el problema que has encontrado con el equipo..."
              {...register('description', { 
                required: 'La descripción es obligatoria',
                minLength: { value: 20, message: 'La descripción debe tener al menos 20 caracteres' }
              })}
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
          </div>
          
          <div>
            <label className="form-label">Severidad del problema</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {severityOptions.map((option) => (
                <div key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    id={`severity-${option.value}`}
                    value={option.value}
                    {...register('severity')}
                    className="hidden peer"
                  />
                  <label
                    htmlFor={`severity-${option.value}`}
                    className={`w-full text-center px-3 py-2 rounded-md cursor-pointer border transition-all ${
                      watchedSeverity === option.value
                        ? `${option.color} border-current`
                        : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <CameraIcon className="h-6 w-6 text-primary-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Evidencia fotográfica</h3>
        </div>
        
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
          Sube fotos del problema para ayudar al equipo técnico a entender mejor la incidencia.
        </p>
        
        <MultiImageUploader onChange={handleImagesChange} />
        
        {errors.imageUrls && <p className="mt-1 text-sm text-red-600">{errors.imageUrls.message}</p>}
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="btn-primary"
        >
          Reportar incidencia
        </button>
      </div>
    </form>
  );
}