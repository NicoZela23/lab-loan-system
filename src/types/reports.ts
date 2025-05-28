export interface MonthlyUsageReport {
  month: string;
  year: number;
  totalLoans: number;
  uniqueUsers: number;
  equipmentUsage: EquipmentUsageData[];
  categoryUsage: CategoryUsageData[];
  facultyUsage: FacultyUsageData[];
  summary: ReportSummary;
}

export interface EquipmentUsageData {
  equipmentId: string;
  equipmentName: string;
  category: string;
  totalLoans: number;
  totalHours: number;
  averageUsageTime: number;
  mostActiveUser: string;
  condition: {
    excellent: number;
    good: number;
    regular: number;
    damaged: number;
  };
}

export interface CategoryUsageData {
  category: string;
  totalLoans: number;
  totalHours: number;
  equipmentCount: number;
  popularEquipment: string;
}

export interface FacultyUsageData {
  faculty: string;
  totalLoans: number;
  totalStudents: number;
  mostUsedEquipment: string;
  averageUsageTime: number;
}

export interface ReportSummary {
  mostUsedEquipment: string;
  leastUsedEquipment: string;
  peakUsageDay: string;
  averageLoanDuration: number;
  onTimeReturns: number;
  lateReturns: number;
  damageIncidents: number;
  recommendations: string[];
}

export interface ReportFilters {
  month: number;
  year: number;
  faculty?: string;
  category?: string;
  includeReturned: boolean;
  includeActive: boolean;
}

export interface ReportExportOptions {
  format: 'pdf' | 'excel' | 'csv';
  includeCharts: boolean;
  includeDetails: boolean;
  language: 'es' | 'en';
}