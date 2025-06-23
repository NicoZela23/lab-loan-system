import { useState } from 'react';
import { XMarkIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { LoanRequest } from '../../../types/loanRequest';
import { ReturnFormData, EQUIPMENT_CONDITION } from '../../../types/return';

interface ReturnModalProps {
  loanRequest: LoanRequest;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (returnData: ReturnFormData) => void;
}

export default function ReturnModal({ loanRequest, isOpen, onClose, onSubmit }: ReturnModalProps) {
  const [formData, setFormData] = useState({
    equipmentCondition: 'good' as 'excellent' | 'good' | 'fair' | 'damaged',
    studentComments: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas
    const newErrors: Record<string, string> = {};

    if (!formData.equipmentCondition) {
      newErrors.equipmentCondition = 'Debes seleccionar el estado del equipo';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const returnData: ReturnFormData = {
        loanRequestId: loanRequest.id,
        equipmentCondition: formData.equipmentCondition,
        studentComments: formData.studentComments || undefined
      };

      onSubmit(returnData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      equipmentCondition: 'good',
      studentComments: ''
    });
    setErrors({});
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case 'excellent':
      case 'good':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'fair':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'damaged':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent':
      case 'good':
        return 'border-green-300 bg-green-50 dark:border-green-600 dark:bg-green-900/20';
      case 'fair':
        return 'border-yellow-300 bg-yellow-50 dark:border-yellow-600 dark:bg-yellow-900/20';
      case 'damaged':
        return 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20';
      default:
        return 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <CheckCircleIcon className="h-6 w-6 text-purple-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Registrar Devolución
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
            <div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                {loanRequest.equipmentName}
              </h4>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                <span>Préstamo desde: {new Date(loanRequest.startDate).toLocaleDateString('es-ES')}</span>
                <span>Fecha límite: {new Date(loanRequest.endDate).toLocaleDateString('es-ES')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Estado del Equipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Estado del Equipo *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(EQUIPMENT_CONDITION).map(([key, label]) => (
                <label
                  key={key}
                  className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                    formData.equipmentCondition === key
                      ? getConditionColor(key)
                      : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="equipmentCondition"
                    value={key}
                    checked={formData.equipmentCondition === key}
                    onChange={(e) => handleInputChange('equipmentCondition', e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-3">
                    {getConditionIcon(key)}
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {label}
                    </span>
                  </div>
                  {formData.equipmentCondition === key && (
                    <div className="absolute top-2 right-2">
                      <CheckCircleIcon className="h-5 w-5 text-purple-600" />
                    </div>
                  )}
                </label>
              ))}
            </div>
            {errors.equipmentCondition && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.equipmentCondition}</p>
            )}
          </div>

          {/* Descripción de estados */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
              Descripción de Estados:
            </h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li><strong>Excelente:</strong> Sin daños, funciona perfectamente</li>
              <li><strong>Bueno:</strong> Signos mínimos de uso, funciona correctamente</li>
              <li><strong>Regular:</strong> Desgaste visible pero funcional</li>
              <li><strong>Dañado:</strong> Problemas de funcionamiento o daños físicos</li>
            </ul>
          </div>

          {/* Comentarios del estudiante */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Observaciones Adicionales (Opcional)
            </label>
            <textarea
              value={formData.studentComments}
              onChange={(e) => handleInputChange('studentComments', e.target.value)}
              placeholder="Describe cualquier detalle relevante sobre el estado del material o su uso..."
              rows={4}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
            />
          </div>

          {/* Warning para equipos dañados */}
          {formData.equipmentCondition === 'damaged' && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
              <div className="flex items-start">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
                    Equipo Dañado
                  </h4>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    Al reportar el equipo como dañado, se enviará una notificación al personal técnico 
                    para evaluación y posibles acciones correctivas.
                  </p>
                </div>
              </div>
            </div>
          )}

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
              className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
            >
              Registrar Devolución
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
