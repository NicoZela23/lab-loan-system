// filepath: c:\Users\simon\OneDrive\Escritorio\labLoan\lab-loan-system\front\src\types\incident.ts
import { Equipment } from './equipment';

export type IncidentStatus = 'reportada' | 'en revisión' | 'resuelta' | 'rechazada';
export type IncidentSeverity = 'baja' | 'media' | 'alta' | 'crítica';

export interface Incident {
  id: number;
  equipmentId: number;
  equipment?: Equipment;
  studentId: number; // En un sistema real, esto sería el ID del usuario autenticado
  studentName: string; // En un sistema real, esto vendría del usuario autenticado
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  imageUrls: string[];
  createdAt: Date;
  updatedAt?: Date;
  resolvedAt?: Date;
  adminNotes?: string;
}

export interface IncidentFormData {
  equipmentId: number;
  title: string;
  description: string;
  severity: IncidentSeverity;
  imageUrls: string[];
}

export interface IncidentFilter {
  status?: IncidentStatus;
  severity?: IncidentSeverity;
  equipmentId?: number;
}