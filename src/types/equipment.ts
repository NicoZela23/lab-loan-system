export type EquipmentCondition = 'excelente' | 'bueno' | 'regular' | 'deficiente';

export interface EquipmentConditionRecord {
  equipmentId: number;
  condition: EquipmentCondition;
  observations: string;
  imageUrls: string[];
  recordedAt: Date;
  recordedBy: {
    id: string;
    name: string;
    role: 'docente' | 'admin';
  };
}

export interface Equipment {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  category?: string;
  status?: 'disponible' | 'prestado' | 'mantenimiento' | 'baja';
  location?: string;
  serialNumber?: string;
  acquisitionDate?: Date;
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
  notes?: string;
}

export type EquipmentFormData = Omit<Equipment, 'id'>;

export interface EquipmentActions {
  onEdit?: (equipment: Equipment) => void;
  onDelete?: (id: number) => void;
}
