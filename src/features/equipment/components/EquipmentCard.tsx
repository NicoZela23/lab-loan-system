import { Equipment } from '../../../types/equipment';
import { PencilIcon, TrashIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface EquipmentCardProps {
  equipment: Equipment;
  onEdit?: (equipment: Equipment) => void;
  onDelete?: (id: number) => void;
  onReserve?: (equipment: Equipment) => void;
  onReportDamage?: (equipment: Equipment) => void;
  showReserveButton?: boolean;
  showAdminActions?: boolean;
}

// Función auxiliar para obtener el color del estado
const getStatusColor = (status: string) => {
  switch (status) {
    case 'disponible':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case 'prestado':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    case 'mantenimiento':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    case 'dañado':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    case 'baja':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  }
};

// Función auxiliar para obtener el texto del estado
const getStatusText = (status: string) => {
  switch (status) {
    case 'disponible':
      return 'Disponible';
    case 'prestado':
      return 'En préstamo';
    case 'mantenimiento':
      return 'En mantenimiento';
    case 'dañado':
      return 'Dañado';
    case 'baja':
      return 'Dado de baja';
    default:
      return 'Sin estado';
  }
};

export default function EquipmentCard({ 
  equipment, 
  onEdit, 
  onDelete, 
  onReserve,
  onReportDamage,
  showReserveButton = false,
  showAdminActions = false
}: EquipmentCardProps) {
  const isAvailable = equipment.status === 'disponible' && equipment.isAvailableForLoan !== false;
  const isDamaged = equipment.status === 'dañado';

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 ${isDamaged ? 'border-2 border-red-300 dark:border-red-700' : ''}`}>
      {/* Imagen del equipo */}
      {equipment.imageUrl && (
        <div className="h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <img 
            src={equipment.imageUrl} 
            alt={equipment.name} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-4">
        {/* Encabezado con estado */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {equipment.name}
          </h3>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(equipment.status || 'disponible')}`}>
            {getStatusText(equipment.status || 'disponible')}
          </span>
        </div>
        
        {/* Descripción */}
        {equipment.description && (
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
            {equipment.description}
          </p>
        )}
        
        {/* Información adicional */}
        <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400 mb-4">
          {equipment.category && (
            <p><span className="font-medium">Categoría:</span> {equipment.category}</p>
          )}
          {equipment.location && (
            <p><span className="font-medium">Ubicación:</span> {equipment.location}</p>
          )}
          {equipment.serialNumber && (
            <p><span className="font-medium">Serie:</span> {equipment.serialNumber}</p>
          )}
        </div>

        {/* Alerta de daño si aplica */}
        {isDamaged && equipment.currentDamageReport && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  Equipo dañado
                </p>
                <p className="text-xs text-red-600 dark:text-red-300 mt-1">
                  {equipment.currentDamageReport.description.substring(0, 100)}...
                </p>
                <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                  Severidad: {equipment.currentDamageReport.severity}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Botón de reserva para estudiantes */}
        {showReserveButton && isAvailable && onReserve && (
          <button 
            onClick={() => onReserve(equipment)} 
            className="w-full mb-3 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
          >
            Reservar
          </button>
        )}

        {/* Mensaje de no disponible */}
        {showReserveButton && !isAvailable && (
          <div className="w-full mb-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-4 py-2 rounded-md text-center text-sm">
            {isDamaged ? 'No disponible - Dañado' : 'No disponible'}
          </div>
        )}

        {/* Acciones de administrador */}
        {showAdminActions && (onEdit || onDelete || onReportDamage) && (
          <div className="flex justify-end space-x-2">
            {onEdit && (
              <button 
                onClick={() => onEdit(equipment)} 
                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full transition-colors"
                title="Editar"
              >
                <PencilIcon className="w-5 h-5" />
              </button>
            )}
            
            {onReportDamage && !isDamaged && (
              <button 
                onClick={() => onReportDamage(equipment)} 
                className="p-2 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/30 rounded-full transition-colors"
                title="Reportar daño"
              >
                <ExclamationTriangleIcon className="w-5 h-5" />
              </button>
            )}
            
            {onDelete && (
              <button 
                onClick={() => onDelete(equipment.id)} 
                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors"
                title="Eliminar"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
