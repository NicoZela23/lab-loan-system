import { useState, useEffect } from 'react';
import { LoanRequest, LOAN_REQUEST_STATUS, LOAN_REQUEST_STATUS_COLORS } from '../../../types/loanRequest';
import { CalendarIcon, ClockIcon, DocumentTextIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function StudentReservationsPage() {
  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLoanRequests();
  }, []);

  const loadLoanRequests = () => {
    try {
      // Obtener datos del usuario actual
      const userData = localStorage.getItem('labLoanUser');
      const user = userData ? JSON.parse(userData) : null;

      if (!user) {
        setIsLoading(false);
        return;
      }

      // Obtener solicitudes del localStorage
      const savedRequests = localStorage.getItem('labLoanRequests');
      if (savedRequests) {
        const allRequests: LoanRequest[] = JSON.parse(savedRequests);
        // Filtrar solo las solicitudes del estudiante actual
        const userRequests = allRequests.filter(request => request.studentEmail === user.email);
        setLoanRequests(userRequests);
      }
    } catch (error) {
      console.error('Error loading loan requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelRequest = (requestId: number) => {
    if (window.confirm('¿Estás seguro de que quieres cancelar esta solicitud?')) {
      try {
        // Actualizar en localStorage
        const savedRequests = localStorage.getItem('labLoanRequests');
        if (savedRequests) {
          const allRequests: LoanRequest[] = JSON.parse(savedRequests);
          const updatedRequests = allRequests.map(request =>
            request.id === requestId
              ? { ...request, status: 'cancelled' as const, updatedAt: new Date() }
              : request
          );
          localStorage.setItem('labLoanRequests', JSON.stringify(updatedRequests));
          
          // Actualizar estado local
          setLoanRequests(prev => prev.map(request =>
            request.id === requestId
              ? { ...request, status: 'cancelled' as const, updatedAt: new Date() }
              : request
          ));
          
          alert('Solicitud cancelada exitosamente');
        }
      } catch (error) {
        console.error('Error cancelling request:', error);
        alert('Error al cancelar la solicitud');
      }
    }
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'approved':
        return <DocumentTextIcon className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'cancelled':
        return <ExclamationTriangleIcon className="h-5 w-5 text-gray-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Mis Reservas
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Gestiona tus solicitudes de préstamo y revisa su estado.
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-lg text-white">
          <h3 className="text-lg font-medium">Pendientes</h3>
          <p className="text-3xl font-bold">
            {loanRequests.filter(r => r.status === 'pending').length}
          </p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
          <h3 className="text-lg font-medium">Aprobadas</h3>
          <p className="text-3xl font-bold">
            {loanRequests.filter(r => r.status === 'approved').length}
          </p>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-lg text-white">
          <h3 className="text-lg font-medium">Rechazadas</h3>
          <p className="text-3xl font-bold">
            {loanRequests.filter(r => r.status === 'rejected').length}
          </p>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
          <h3 className="text-lg font-medium">Total</h3>
          <p className="text-3xl font-bold">{loanRequests.length}</p>
        </div>
      </div>

      {/* Lista de solicitudes */}
      {loanRequests.length > 0 ? (
        <div className="space-y-6">
          {loanRequests.map((request) => (
            <div key={request.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getStatusIcon(request.status)}
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {request.equipmentName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      Asignatura: {request.subject}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${LOAN_REQUEST_STATUS_COLORS[request.status]}`}>
                    {LOAN_REQUEST_STATUS[request.status]}
                  </span>
                  {request.status === 'pending' && (
                    <button
                      onClick={() => cancelRequest(request.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {formatDate(request.startDate)} - {formatDate(request.endDate)}
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Duración: {calculateDuration(request.startDate, request.endDate)} día{calculateDuration(request.startDate, request.endDate) > 1 ? 's' : ''}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3 mb-4">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Asignatura:</span> {request.subject}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                  <span className="font-medium">Propósito:</span> {request.purpose}
                </p>
              </div>

              {/* Comentarios del docente/admin */}
              {request.teacherNotes && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3 mb-4">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <span className="font-medium">Comentarios del docente:</span> {request.teacherNotes}
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                <span>Solicitud #{request.id}</span>
                <span>
                  Creada: {new Date(request.createdAt).toLocaleDateString()} a las {new Date(request.createdAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <CalendarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No tienes solicitudes de préstamo
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Ve a la sección "Materiales" para solicitar el préstamo de algún equipo.
          </p>
          <a
            href="/student/materials"
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
          >
            Ver Materiales
          </a>
        </div>
      )}
    </div>
  );
}
