import { useState } from 'react';
import { Equipment, EquipmentCondition, EquipmentConditionRecord } from '../../../types/equipment';
import { ExclamationTriangleIcon, PaperAirplaneIcon, CameraIcon } from '@heroicons/react/24/outline';

interface EquipmentConditionFormProps {
  equipment: Equipment;
  onSubmit: (data: Omit<EquipmentConditionRecord, 'recordedAt' | 'recordedBy'>) => void;
  onCancel?: () => void;
  initialData?: Partial<EquipmentConditionRecord>;
  formTitle?: string;
  submitLabel?: string;
}

// Componente reutilizable para registrar el estado físico del equipo
// Se puede usar tanto para el registro inicial como final
export default function EquipmentConditionForm({
  equipment,
  onSubmit,
  onCancel,
  initialData,
  formTitle = "Registro de estado del equipo",
  submitLabel = "Guardar registro"
}: EquipmentConditionFormProps) {
  // Estado del componente
  const [condition, setCondition] = useState<EquipmentCondition>(initialData?.condition || 'bueno');
  const [observations, setObservations] = useState(initialData?.observations || '');
  const [imageUrls, setImageUrls] = useState<string[]>(initialData?.imageUrls || []);
  const [observationsError, setObservationsError] = useState('');
  
  // Opciones de estado del equipo
  const conditionOptions: { value: EquipmentCondition; label: string; color: string }[] = [
    { value: 'excelente', label: 'Excelente', color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' },
    { value: 'bueno', label: 'Bueno', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' },
    { value: 'regular', label: 'Regular', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' },
    { value: 'deficiente', label: 'Deficiente', color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' }
  ];
  
  // Función para manejar la subida de imágenes
  const handleImageUpload = (newImageUrls: string[]) => {
    setImageUrls(newImageUrls);
  };
  
  // Validación del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let hasError = false;
    
    // Si el estado no es excelente o bueno, requerimos observaciones
    if ((condition === 'regular' || condition === 'deficiente') && !observations.trim()) {
      setObservationsError('Por favor detalla las condiciones o problemas del equipo');
      hasError = true;
    } else {
      setObservationsError('');
    }
    
    if (hasError) return;
    
    // Preparar datos para envío
    const conditionData = {
      equipmentId: equipment.id,
      condition,
      observations: observations.trim() || 'Equipo en buen estado, sin observaciones.',
      imageUrls
    };
    
    onSubmit(conditionData);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
          {formTitle}
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
          Registra el estado físico del equipo con fotografías y observaciones detalladas
        </p>
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:px-6">
        <div className="flex items-start space-x-4 mb-6">
          {equipment.imageUrl && (
            <img 
              src={equipment.imageUrl} 
              alt={equipment.name} 
              className="w-24 h-24 object-cover rounded-md"
            />
          )}
          <div>
            <h4 className="text-md font-semibold text-gray-900 dark:text-white">{equipment.name}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{equipment.description}</p>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="px-4 py-5 sm:px-6 border-t border-gray-200 dark:border-gray-700">
        <div className="space-y-6">
          {/* Estado del equipo */}
          <div>
            <label className="text-base font-medium text-gray-900 dark:text-white">
              Estado del equipo
            </label>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Selecciona el estado actual del equipo
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              {conditionOptions.map((option) => (
                <div key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    id={`condition-${option.value}`}
                    name="condition"
                    value={option.value}
                    checked={condition === option.value}
                    onChange={() => setCondition(option.value)}
                    className="hidden peer"
                  />
                  <label
                    htmlFor={`condition-${option.value}`}
                    className={`w-full text-center px-3 py-2 rounded-md cursor-pointer border transition-all ${
                      condition === option.value
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
          
          {/* Documentación fotográfica */}
          <div>
            <div className="flex items-center mb-4">
              <CameraIcon className="h-5 w-5 text-primary-600 mr-2" />
              <label className="block text-base font-medium text-gray-900 dark:text-white">
                Documentación fotográfica
              </label>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Sube fotos que documenten el estado actual del equipo
            </p>
            
            {/* Aquí se añadirá el componente de carga de imágenes */}
            {/* Por ahora solo mostraremos un placeholder */}
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <CameraIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                    <span>Subir fotos</span>
                    <input 
                      id="file-upload" 
                      name="file-upload" 
                      type="file" 
                      multiple
                      className="sr-only" 
                      accept="image/*"
                      onChange={() => {}} // Placeholder para manejo de imágenes
                    />
                  </label>
                  <p className="pl-1">o arrastra y suelta</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG, GIF hasta 10MB
                </p>
              </div>
            </div>
            
            {/* Aquí se mostrarían las imágenes previsualizadas */}
            {imageUrls.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={url} 
                      alt={`Imagen ${index + 1}`} 
                      className="h-24 w-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => setImageUrls(imageUrls.filter((_, i) => i !== index))}
                      className="absolute top-1 right-1 p-1 bg-gray-900/60 rounded-full text-white hover:bg-gray-900"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Observaciones */}
          <div>
            <label htmlFor="observations" className="block text-base font-medium text-gray-900 dark:text-white">
              Observaciones
            </label>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Describe el estado físico del equipo, anotando cualquier detalle relevante
            </p>
            <div className="mt-1">
              <textarea
                id="observations"
                name="observations"
                rows={4}
                className={`shadow-sm block w-full sm:text-sm border-gray-300 rounded-md
                  ${observationsError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'focus:ring-primary-500 focus:border-primary-500'}
                  dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                placeholder="Describe el estado del equipo, incluyendo detalles específicos sobre su condición física y funcionamiento"
                value={observations}
                onChange={(e) => {
                  setObservations(e.target.value);
                  if (e.target.value.trim()) {
                    setObservationsError('');
                  }
                }}
              />
              {observationsError && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-500 inline mr-1" />
                  {observationsError}
                </p>
              )}
              {(condition === 'regular' || condition === 'deficiente') && !observationsError && (
                <p className="mt-2 text-sm text-amber-600 dark:text-amber-500">
                  <ExclamationTriangleIcon className="h-5 w-5 text-amber-500 inline mr-1" />
                  Por favor incluye detalles específicos sobre los problemas o daños observados
                </p>
              )}
            </div>
          </div>
          
          {/* Botones de acción */}
          <div className="flex justify-end space-x-3 pt-4">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              className="inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PaperAirplaneIcon className="h-4 w-4 mr-2" />
              {submitLabel}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}