import { useState } from 'react';
import { Equipment } from '../../../types/equipment';
import { ExclamationTriangleIcon, PaperAirplaneIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';
import MultiImageUploader from '../../../components/common/MultiImageUploader';

interface DamageReportFormProps {
  equipment: Equipment;
  onSubmit: (damageData: DamageReportData) => void;
  onCancel: () => void;
}

export interface DamageReportData {
  equipmentId: number;
  damageType: 'físico' | 'funcional' | 'eléctrico' | 'mecánico' | 'otro';
  severity: 'leve' | 'moderado' | 'grave';
  description: string;
  imageUrls: string[];
  estimatedRepairTime?: string;
  repairCost?: number;
  repairNotes?: string;
}

export default function DamageReportForm({ equipment, onSubmit, onCancel }: DamageReportFormProps) {
  const [damageType, setDamageType] = useState<'físico' | 'funcional' | 'eléctrico' | 'mecánico' | 'otro'>('físico');
  const [severity, setSeverity] = useState<'leve' | 'moderado' | 'grave'>('moderado');
  const [description, setDescription] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [estimatedRepairTime, setEstimatedRepairTime] = useState('');
  const [repairCost, setRepairCost] = useState<number | undefined>();
  const [repairNotes, setRepairNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const damageTypeOptions = [
    { value: 'físico', label: 'Daño Físico', description: 'Golpes, rayones, roturas visibles' },
    { value: 'funcional', label: 'Daño Funcional', description: 'No funciona correctamente' },
    { value: 'eléctrico', label: 'Daño Eléctrico', description: 'Problemas con circuitos o conexiones' },
    { value: 'mecánico', label: 'Daño Mecánico', description: 'Problemas con partes móviles' },
    { value: 'otro', label: 'Otro', description: 'Otro tipo de daño no especificado' }
  ];

  const severityOptions = [
    { 
      value: 'leve', 
      label: 'Leve', 
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      description: 'El equipo puede seguir usándose con precaución' 
    },
    { 
      value: 'moderado', 
      label: 'Moderado', 
      color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      description: 'El equipo requiere reparación antes del siguiente uso' 
    },
    { 
      value: 'grave', 
      label: 'Grave', 
      color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      description: 'El equipo debe ser retirado inmediatamente de circulación' 
    }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!description.trim()) {
      newErrors.description = 'La descripción del daño es obligatoria';
    } else if (description.trim().length < 10) {
      newErrors.description = 'La descripción debe tener al menos 10 caracteres';
    }

    if (repairCost && repairCost < 0) {
      newErrors.repairCost = 'El costo de reparación no puede ser negativo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const damageData: DamageReportData = {
      equipmentId: equipment.id,
      damageType,
      severity,
      description: description.trim(),
      imageUrls,
      estimatedRepairTime: estimatedRepairTime.trim() || undefined,
      repairCost: repairCost || undefined,
      repairNotes: repairNotes.trim() || undefined
    };

    onSubmit(damageData);
  };

  const handleImagesChange = (newImageUrls: string[]) => {
    setImageUrls(newImageUrls);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <ExclamationTriangleIcon className="h-8 w-8 text-red-600 mr-3" />
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Reportar Daño en Equipo
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Marca este equipo como dañado y proporciona los detalles necesarios para su reparación
            </p>
          </div>
        </div>
      </div>

      {/* Información del equipo */}
      <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start space-x-4">
          {equipment.imageUrl && (
            <img 
              src={equipment.imageUrl} 
              alt={equipment.name} 
              className="w-20 h-20 object-cover rounded-md" 
            />
          )}
          <div>
            <h4 className="text-md font-semibold text-gray-900 dark:text-white">{equipment.name}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{equipment.description}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              ID: {equipment.id} | Ubicación: {equipment.location || 'No especificada'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        {/* Tipo de daño */}
        <div>
          <label className="text-base font-medium text-gray-900 dark:text-white">
            Tipo de daño
          </label>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Selecciona el tipo de daño que presenta el equipo
          </p>
          
          <div className="space-y-3">
            {damageTypeOptions.map((option) => (
              <div key={option.value} className="flex items-start">
                <input
                  type="radio"
                  id={`damage-type-${option.value}`}
                  name="damageType"
                  value={option.value}
                  checked={damageType === option.value}
                  onChange={(e) => setDamageType(e.target.value as any)}
                  className="mt-1 h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <label htmlFor={`damage-type-${option.value}`} className="ml-3 block">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{option.label}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 block">{option.description}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Severidad */}
        <div>
          <label className="text-base font-medium text-gray-900 dark:text-white">
            Severidad del daño
          </label>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Indica qué tan grave es el daño
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {severityOptions.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  id={`severity-${option.value}`}
                  name="severity"
                  value={option.value}
                  checked={severity === option.value}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="hidden peer"
                />
                <label
                  htmlFor={`severity-${option.value}`}
                  className={`w-full text-center px-3 py-3 rounded-md cursor-pointer border transition-all ${
                    severity === option.value
                      ? `${option.color} border-current`
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs mt-1 opacity-75">{option.description}</div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Descripción del daño */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Descripción detallada del daño <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            rows={4}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white ${
              errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Describe detalladamente el daño observado, cómo ocurrió (si se conoce) y cualquier otra información relevante..."
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) {
                setErrors({ ...errors, description: '' });
              }
            }}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Documentación fotográfica */}
        <div>
          <div className="flex items-center mb-2">
            <WrenchScrewdriverIcon className="h-5 w-5 text-primary-600 mr-2" />
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Documentación fotográfica
            </label>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Sube fotografías que muestren claramente el daño para facilitar la evaluación y reparación
          </p>
          
          <MultiImageUploader onChange={handleImagesChange} />
        </div>

        {/* Información adicional de reparación */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="estimatedRepairTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tiempo estimado de reparación
            </label>
            <input
              type="text"
              id="estimatedRepairTime"
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="ej: 2-3 días laborales"
              value={estimatedRepairTime}
              onChange={(e) => setEstimatedRepairTime(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="repairCost" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Costo estimado de reparación (USD)
            </label>
            <input
              type="number"
              id="repairCost"
              min="0"
              step="0.01"
              className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white ${
                errors.repairCost ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="0.00"
              value={repairCost || ''}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                setRepairCost(isNaN(value) ? undefined : value);
                if (errors.repairCost) {
                  setErrors({ ...errors, repairCost: '' });
                }
              }}
            />
            {errors.repairCost && (
              <p className="mt-1 text-sm text-red-600">{errors.repairCost}</p>
            )}
          </div>
        </div>

        {/* Notas adicionales */}
        <div>
          <label htmlFor="repairNotes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Notas adicionales para la reparación
          </label>
          <textarea
            id="repairNotes"
            rows={3}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            placeholder="Información adicional para el técnico, recomendaciones, prioridades, etc."
            value={repairNotes}
            onChange={(e) => setRepairNotes(e.target.value)}
          />
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
            Marcar como Dañado
          </button>
        </div>
      </form>
    </div>
  );
}