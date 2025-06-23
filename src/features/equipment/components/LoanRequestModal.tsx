import { useState } from 'react';
import { XMarkIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { Equipment } from '../../../types/equipment';

interface LoanRequestModalProps {
  equipment: Equipment;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (requestData: LoanRequestData) => void;
}

export interface LoanRequestData {
  equipmentId: number;
  equipmentName: string;
  startDate: string;
  endDate: string;
  purpose: string;
  subject: string;
}

export default function LoanRequestModal({ equipment, isOpen, onClose, onSubmit }: LoanRequestModalProps) {  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    purpose: '',
    subject: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    const newErrors: Record<string, string> = {};

    if (!formData.startDate) newErrors.startDate = 'La fecha de inicio es requerida';
    if (!formData.endDate) newErrors.endDate = 'La fecha de fin es requerida';
    if (!formData.purpose) newErrors.purpose = 'El propósito es requerido';
    if (!formData.subject) newErrors.subject = 'La asignatura es requerida';

    // Validar que la fecha de inicio no sea en el pasado
    const today = new Date().toISOString().split('T')[0];
    if (formData.startDate < today) {
      newErrors.startDate = 'La fecha de inicio no puede ser en el pasado';
    }

    // Validar que la fecha de fin sea después de la de inicio
    if (formData.endDate < formData.startDate) {
      newErrors.endDate = 'La fecha de fin debe ser posterior a la de inicio';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const requestData: LoanRequestData = {
        equipmentId: equipment.id,
        equipmentName: equipment.name,
        startDate: formData.startDate,
        endDate: formData.endDate,
        purpose: formData.purpose,
        subject: formData.subject
      };

      onSubmit(requestData);
      handleClose();
    }
  };
  const handleClose = () => {
    setFormData({
      startDate: '',
      endDate: '',
      purpose: '',
      subject: ''
    });
    setErrors({});
    onClose();
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Calcular duración del préstamo
  const calculateDuration = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <CalendarIcon className="h-6 w-6 text-primary-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Solicitar Préstamo
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Equipment Info */}
        <div className="p-6 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-start space-x-4">
            {equipment.imageUrl && (
              <img 
                src={equipment.imageUrl} 
                alt={equipment.name}
                className="w-16 h-16 object-cover rounded-md"
              />
            )}
            <div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                {equipment.name}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {equipment.description}
              </p>
              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span>Categoría: {equipment.category}</span>
                <span>Ubicación: {equipment.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Fechas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fecha de Inicio *
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  errors.startDate ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.startDate && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.startDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fecha de Fin *
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                min={formData.startDate || new Date().toISOString().split('T')[0]}
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  errors.endDate ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.endDate && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.endDate}</p>
              )}
            </div>          </div>

          {/* Duración */}
          {calculateDuration() > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-sm text-blue-800 dark:text-blue-200">
                  Duración del préstamo: {calculateDuration()} día{calculateDuration() > 1 ? 's' : ''}
                </span>
              </div>
            </div>
          )}          {/* Propósito y Asignatura */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Asignatura/Materia *
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                placeholder="ej: Química Orgánica, Física II..."
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  errors.subject ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.subject && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.subject}</p>
              )}
            </div>

            {/* Propósito */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Propósito/Justificación *
              </label>
              <textarea
                value={formData.purpose}
                onChange={(e) => handleInputChange('purpose', e.target.value)}
                placeholder="Describe para qué necesitas este material y cómo lo vas a utilizar..."
                rows={3}
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none ${
                  errors.purpose ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.purpose && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.purpose}</p>
              )}
            </div>          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
            >
              Enviar Solicitud
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
