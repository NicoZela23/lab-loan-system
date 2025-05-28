import { Equipment } from '../../../types/equipment';
import EquipmentCard from './EquipmentCard';

interface EquipmentListProps {
  equipments: Equipment[];
  onEdit?: (equipment: Equipment) => void;
  onDelete?: (id: number) => void;
  onReserve?: (equipment: Equipment) => void;
  showReserveButton?: boolean;
}

export default function EquipmentList({ 
  equipments, 
  onEdit, 
  onDelete, 
  onReserve,
  showReserveButton = false 
}: EquipmentListProps) {
  if (!equipments.length) {
    return (
      <div className="text-center py-10 bg-white/10 dark:bg-gray-800/40 rounded-lg shadow-inner">
        <p className="text-gray-300 dark:text-gray-400">No hay equipos registrados.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {equipments.map((equipment) => (
        <EquipmentCard 
          key={equipment.id} 
          equipment={equipment} 
          onEdit={onEdit}
          onDelete={onDelete}
          onReserve={onReserve}
          showReserveButton={showReserveButton}
        />
      ))}
    </div>
  );
}
