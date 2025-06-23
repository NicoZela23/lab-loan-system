import { useState, useEffect } from 'react';
import ApprovalList from '../components/ApprovalList';
import ApprovalFilter from '../components/ApprovalFilter';
import { LoanRequest, ApprovalStatus } from '../types/teacherTypes';

// Esta página sería reemplazada por datos reales del backend
const mockRequests: LoanRequest[] = [
  {
    id: '1',
    studentName: 'Juan Pérez',
    studentId: 'A12345',
    equipment: 'Microscopio Digital',
    requestDate: '2025-05-25',
    pickupDate: '2025-05-28',
    returnDate: '2025-05-30',
    course: 'Biología Celular',
    reason: 'Proyecto de investigación sobre estructuras celulares',
    status: 'pending',
  },
  {
    id: '2',
    studentName: 'María García',
    studentId: 'A67890',
    equipment: 'Kit de Química Analítica',
    requestDate: '2025-05-26',
    pickupDate: '2025-05-29',
    returnDate: '2025-06-05',
    course: 'Química Analítica',
    reason: 'Práctica de laboratorio sobre análisis de compuestos',    status: 'pending',
  },
  {
    id: '3',
    studentName: 'Carlos Rodríguez',
    studentId: 'A54321',
    equipment: 'Osciloscopio',
    requestDate: '2025-05-24',
    pickupDate: '2025-05-27',
    returnDate: '2025-06-03',
    course: 'Electrónica Básica',
    reason: 'Medición de señales para proyecto final',
    status: 'approved',
  },
  {
    id: '4',
    studentName: 'Ana Martínez',
    studentId: 'A98765',
    equipment: 'Kit de Robótica',
    requestDate: '2025-05-23',
    pickupDate: '2025-05-26',
    returnDate: '2025-06-02',
    course: 'Introducción a la Robótica',
    reason: 'Construcción de prototipo para concurso universitario',
    status: 'rejected',
    rejectionReason: 'Equipo reservado para otro curso en las fechas solicitadas'
  }
];

export default function ApprovalPage() {
  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>(mockRequests);
  const [filteredRequests, setFilteredRequests] = useState<LoanRequest[]>(mockRequests);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Simula la carga de datos desde una API
  useEffect(() => {
    // Aquí se haría la llamada al backend para obtener las solicitudes
    // Por ahora, usamos los datos de ejemplo
    setLoanRequests(mockRequests);
  }, []);

  // Filtra las solicitudes según el estado seleccionado
  useEffect(() => {
    if (filterStatus === 'all') {
      setFilteredRequests(loanRequests);
    } else {
      setFilteredRequests(loanRequests.filter(request => request.status === filterStatus));
    }
  }, [filterStatus, loanRequests]);

  // Función para manejar la aprobación de una solicitud
  const handleApprove = (id: string, comments?: string) => {
    // En un caso real, esto enviaría una solicitud al backend
    setLoanRequests(prevRequests => 
      prevRequests.map(request => 
        request.id === id 
          ? { ...request, status: 'approved', approvalComments: comments } 
          : request
      )
    );
  };

  // Función para manejar el rechazo de una solicitud
  const handleReject = (id: string, reason: string) => {
    // En un caso real, esto enviaría una solicitud al backend
    setLoanRequests(prevRequests => 
      prevRequests.map(request => 
        request.id === id 
          ? { ...request, status: 'rejected', rejectionReason: reason } 
          : request
      )
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-primary-700 mb-6">Aprobación de Solicitudes de Préstamo</h1>
      
      <ApprovalFilter 
        currentFilter={filterStatus} 
        onFilterChange={setFilterStatus} 
      />
      
      <ApprovalList 
        requests={filteredRequests} 
        onApprove={handleApprove} 
        onReject={handleReject} 
      />
    </div>
  );
}