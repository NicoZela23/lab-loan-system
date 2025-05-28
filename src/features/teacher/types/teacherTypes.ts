export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface LoanRequest {
  id: string;
  studentName: string;
  studentId: string;
  equipment: string;
  quantity: number;
  requestDate: string;
  pickupDate: string;
  returnDate: string;
  course: string;
  reason: string;
  status: ApprovalStatus;
  approvalComments?: string;
  rejectionReason?: string;
}