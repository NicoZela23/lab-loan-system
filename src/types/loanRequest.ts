export interface LoanRequest {
  id: number;
  equipmentId: number;
  equipmentName: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  startDate: string;
  endDate: string;
  purpose: string;
  subject: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled' | 'returned';
  teacherNotes?: string;
  approvedBy?: string;
  approvedAt?: Date;
  rejectedBy?: string;
  rejectedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoanRequestFormData {
  equipmentId: number;
  equipmentName: string;
  startDate: string;
  endDate: string;
  purpose: string;
  subject: string;
}

export interface LoanRequestListItem extends LoanRequest {
  equipmentCategory?: string;
  equipmentLocation?: string;
  equipmentImageUrl?: string;
  durationDays: number;
}

// Estados de las solicitudes con sus traducciones
export const LOAN_REQUEST_STATUS = {
  pending: 'Pendiente',
  approved: 'Aprobada',
  rejected: 'Rechazada',
  completed: 'Completada',
  cancelled: 'Cancelada',
  returned: 'Devuelta'
} as const;

// Colores para los estados
export const LOAN_REQUEST_STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
  returned: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
} as const;
