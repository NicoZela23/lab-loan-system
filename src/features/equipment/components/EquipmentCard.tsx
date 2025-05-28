import { Equipment } from '../../../types/equipment';
import { PencilIcon, TrashIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

interface EquipmentCardProps {
  equipment: Equipment;
  onEdit?: (equipment: Equipment) => void;
  onDelete?: (id: number) => void;
  onReserve?: (equipment: Equipment) => void;
  showReserveButton?: boolean;
}

export default function EquipmentCard({ 
  equipment, 
  onEdit, 
  onDelete, 
  onReserve,
  showReserveButton = false 
}: EquipmentCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl border border-transparent hover:border-primary-300 transform hover:-translate-y-1">
      <div className="h-48 overflow-hidden relative">
        <img 
          src={equipment.imageUrl || '/placeholder-equipment.jpg'} 
          alt={equipment.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="p-5">
        <div className="font-bold text-xl mb-2 text-gray-800 dark:text-white">{equipment.name}</div>
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
          {equipment.description}
        </p>
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          ID: {equipment.id}
        </div>

        {showReserveButton && onReserve && (
          <div className="mt-4">
            <button
              onClick={() => onReserve(equipment)}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors"
            >
              <CalendarDaysIcon className="w-5 h-5" />
              <span>Reservar Equipo</span>
            </button>
          </div>
        )}

        {(onEdit || onDelete) && (
          <div className="mt-4 flex justify-end space-x-2">
            {onEdit && (
              <button 
                onClick={() => onEdit(equipment)} 
                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full transition-colors"
                title="Editar"
              >
                <PencilIcon className="w-5 h-5" />
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
