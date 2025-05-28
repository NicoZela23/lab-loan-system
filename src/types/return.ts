import { Reservation } from './reservation';
import { EquipmentCondition } from './equipment';

export type ReturnCondition = 'bueno' | 'regular' | 'dañado';

export type ProblemCategory = 
  | 'desgaste_normal' 
  | 'mal_funcionamiento' 
  | 'daño_fisico' 
  | 'faltante_componente' 
  | 'mal_uso' 
  | 'otro';

export interface ReturnFormData {
  reservationId: number;
  condition: EquipmentCondition;
  observations: string;
  imageUrls: string[];
  hasIssues: boolean;
  issueType?: 'daño_leve' | 'daño_moderado' | 'daño_grave' | 'perdida' | 'otro';
  issueDescription?: string;
  requiresMaintenance?: boolean;
}

export interface EquipmentReturn {
  id: number;
  reservationId: number;
  reservation?: Reservation;
  returnDate: Date;
  condition: ReturnCondition;
  observations: string;
  hasIssues: boolean;
  teacherId: number; // ID del docente que recibe el equipo
  teacherName: string; // Nombre del docente
  createdAt: Date;
  problemCategory?: ProblemCategory;
  requiresMaintenance?: boolean;
  restrictStudentAccess?: boolean;
  imageUrls?: string[];
  teacherNotes?: string;
}