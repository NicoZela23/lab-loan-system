export interface Return {
  id: number;
  loanRequestId: number;
  equipmentId: number;
  equipmentName: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  returnDate: string;
  equipmentCondition: 'excellent' | 'good' | 'fair' | 'damaged';
  studentComments?: string;
  createdAt: Date;
}

export interface ReturnFormData {
  loanRequestId: number;
  equipmentCondition: 'excellent' | 'good' | 'fair' | 'damaged';
  studentComments?: string;
}

// Estados de condición del equipo
export const EQUIPMENT_CONDITION = {
  excellent: 'Excelente',
  good: 'Bueno',
  fair: 'Regular',
  damaged: 'Dañado'
} as const;

// Colores para los estados de condición
export const EQUIPMENT_CONDITION_COLORS = {
  excellent: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  good: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  fair: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  damaged: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
} as const;