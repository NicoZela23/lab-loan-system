export type LoanStatus = 'checked-out' | 'returned' | 'returned-late' | 'overdue' | 'lost' | 'damaged';
export type EquipmentCondition = 'excellent' | 'good' | 'fair' | 'poor' | 'damaged' | 'unusable';

export interface LoanHistoryItem {
  id: string;
  equipmentName: string;
  equipmentId: string;
  studentName: string;
  studentId: string;
  checkoutDate: string;
  returnDate: string;
  actualReturnDate: string | null;
  course: string;
  status: LoanStatus;
  condition: EquipmentCondition | null;
  notes: string | null;
}