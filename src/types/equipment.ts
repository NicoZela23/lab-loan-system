export type EquipmentCondition = 'excelente' | 'bueno' | 'regular' | 'deficiente';

// Añadir nuevos tipos para la gestión de daños
export type EquipmentStatus = 'disponible' | 'prestado' | 'mantenimiento' | 'dañado' | 'baja';

export type DamageType = 'físico' | 'funcional' | 'eléctrico' | 'mecánico' | 'otro';
export type DamageSeverity = 'leve' | 'moderado' | 'grave';

export interface DamageReport {
  id: number;
  equipmentId: number;
  damageType: DamageType;
  severity: DamageSeverity;
  description: string;
  imageUrls: string[];
  estimatedRepairTime?: string;
  repairCost?: number;
  repairNotes?: string;
  reportedBy: {
    id: string;
    name: string;
    role: 'docente' | 'admin';
  };
  reportedAt: Date;
  repairedAt?: Date;
  repairNotes?: string;
  isResolved: boolean;
}

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
  status?: EquipmentStatus; // Actualizado para usar el nuevo tipo
  location?: string;
  serialNumber?: string;
  acquisitionDate?: Date;
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
  notes?: string;
  // Nuevos campos para gestión de daños
  currentDamageReport?: DamageReport;
  damageHistory?: DamageReport[];
  isAvailableForLoan?: boolean; // Calculado basado en status y daños
}

export type EquipmentFormData = Omit<Equipment, 'id'>;

export interface EquipmentActions {
  onEdit?: (equipment: Equipment) => void;
  onDelete?: (id: number) => void;
  onReportDamage?: (equipment: Equipment) => void; // Nueva acción
  onMarkRepaired?: (equipment: Equipment) => void; // Nueva acción
}
