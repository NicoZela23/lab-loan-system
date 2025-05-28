// filepath: c:\Users\simon\OneDrive\Escritorio\labLoan\lab-loan-system\front\src\types\feedback.ts
import { Reservation } from './reservation';

export interface ServiceRating {
  id: number;
  reservationId: number;
  reservation?: Reservation;
  rating: number; // 1-5 estrellas
  comment: string;
  timestamp: Date;
  studentId: number; // En un sistema real, sería el ID del usuario autenticado
}

export interface ServiceRatingFormData {
  reservationId: number;
  rating: number;
  comment: string;
}

export const RATING_QUESTIONS = [
  "¿Cómo calificarías la facilidad del proceso de reserva?",
  "¿Cómo calificarías la disponibilidad de los equipos?",
  "¿Cómo calificarías la condición del equipo que recibiste?",
  "¿Cómo calificarías la atención del personal?",
  "¿Cómo calificarías tu experiencia general?"
];

export type RatingQuestionResponses = {
  [key: number]: number; // índice de pregunta -> puntuación
};