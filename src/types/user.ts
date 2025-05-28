export type UserRole = 'estudiante' | 'docente' | 'administrador';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  studentId?: string; // ID universitario (solo para estudiantes)
  faculty?: string;  
  program?: string;  // Carrera o departamento
  isSuspended: boolean;
  suspensionReason?: string;
  suspendedAt?: Date;
  suspendedBy?: string;
  lastLogin?: Date;
  createdAt: Date;
}

export interface SuspensionData {
  userId: string;
  reason: string;
}