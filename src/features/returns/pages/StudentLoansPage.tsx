import { useState, useEffect } from 'react';
import { LoanRequest, LOAN_REQUEST_STATUS } from '../../../types/loanRequest';
import { Return, ReturnFormData, EQUIPMENT_CONDITION } from '../../../types/return';
import { CalendarIcon, ExclamationTriangleIcon, CheckCircleIcon, StarIcon } from '@heroicons/react/24/outline';
import ReturnModal from '../components/ReturnModal';
import ServiceRatingModal from '../../../components/modals/ServiceRatingModal';
import { ServiceRatingFormData } from '../../../types/feedback';
import { Reservation } from '../../../types/reservation';
import { Incident, IncidentFormData } from '../../../types/incident';
import IncidentForm from '../../incidents/components/IncidentForm';

export default function StudentLoansPage() {
  const [activeLoanRequests, setActiveLoanRequests] = useState<LoanRequest[]>([]);
  const [returnedLoanRequests, setReturnedLoanRequests] = useState<LoanRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState<LoanRequest | null>(null);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
    // Estados para rating
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedLoanForRating, setSelectedLoanForRating] = useState<LoanRequest | null>(null);
  const [ratedLoans, setRatedLoans] = useState<number[]>([]);
  const [showRatingSuccess, setShowRatingSuccess] = useState(false);

  // Estados para reportar incidencias
  const [selectedLoanForIncident, setSelectedLoanForIncident] = useState<LoanRequest | null>(null);
  const [showIncidentForm, setShowIncidentForm] = useState(false);
  const [showIncidentSuccess, setShowIncidentSuccess] = useState(false);

  useEffect(() => {
    loadActiveLoanRequests();
  }, []);
  const loadActiveLoanRequests = () => {
    try {
      // Obtener datos del usuario actual
      const userData = localStorage.getItem('labLoanUser');
      const user = userData ? JSON.parse(userData) : null;

      if (!user) {
        setIsLoading(false);
        return;
      }

      // Obtener solicitudes del localStorage
      let allRequests: LoanRequest[] = [];
      const savedRequests = localStorage.getItem('labLoanRequests');
      if (savedRequests) {
        allRequests = JSON.parse(savedRequests);
      }      // Si no hay solicitudes aprobadas para demo, crear algunas
      const userApprovedRequests = allRequests.filter(request => 
        request.studentEmail === user.email && 
        request.status === 'approved'
      );

      const userReturnedRequests = allRequests.filter(request => 
        request.studentEmail === user.email && 
        request.status === 'returned'
      );

      if (userApprovedRequests.length === 0 && user.role === 'student') {
        // Crear solicitudes de demo aprobadas para pruebas
        const demoRequests: LoanRequest[] = [
          {
            id: Date.now() + 1,
            equipmentId: 1,
            equipmentName: 'Microscopio Digital',
            studentId: user.email,
            studentName: user.name || 'Estudiante',
            studentEmail: user.email,
            startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Hace 5 días
            endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // En 2 días
            purpose: 'Análisis de muestras para proyecto de investigación',
            subject: 'Biología Celular',
            status: 'approved',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            updatedAt: new Date()
          },
          {
            id: Date.now() + 2,
            equipmentId: 2,
            equipmentName: 'Balanza Analítica',
            studentId: user.email,
            studentName: user.name || 'Estudiante',
            studentEmail: user.email,
            startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Hace 3 días
            endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Ayer (vencido)
            purpose: 'Medición de reactivos para práctica de laboratorio',
            subject: 'Química Analítica',
            status: 'approved',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            updatedAt: new Date()
          }
        ];

        // Agregar las solicitudes demo al localStorage
        const updatedRequests = [...allRequests, ...demoRequests];
        localStorage.setItem('labLoanRequests', JSON.stringify(updatedRequests));
          setActiveLoanRequests(demoRequests);
        
        // Si no hay solicitudes devueltas, crear una demo para probar el rating
        if (userReturnedRequests.length === 0) {
          const demoReturnedRequest: LoanRequest = {
            id: Date.now() + 99,
            equipmentId: 3,
            equipmentName: 'Osciloscopio Digital',
            studentId: user.email,
            studentName: user.name || 'Estudiante',
            studentEmail: user.email,
            startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Hace 10 días
            endDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Hace 7 días
            purpose: 'Medición de señales para práctica de electrónica',
            subject: 'Electrónica Básica',
            status: 'returned',
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          };
          
          const updatedWithReturned = [...updatedRequests, demoReturnedRequest];
          localStorage.setItem('labLoanRequests', JSON.stringify(updatedWithReturned));
          setReturnedLoanRequests([demoReturnedRequest]);
        } else {
          setReturnedLoanRequests(userReturnedRequests);
        }
      } else {
        setActiveLoanRequests(userApprovedRequests);
        setReturnedLoanRequests(userReturnedRequests);
      }
    } catch (error) {
      console.error('Error loading active loan requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReturnClick = (loanRequest: LoanRequest) => {
    setSelectedLoan(loanRequest);
    setIsReturnModalOpen(true);
  };

  const handleReturnSubmit = (returnData: ReturnFormData) => {
    try {
      // Obtener datos del usuario actual
      const userData = localStorage.getItem('labLoanUser');
      const user = userData ? JSON.parse(userData) : null;

      if (!user || !selectedLoan) {
        alert('Error: No se pudo obtener la información necesaria');
        return;
      }

      // Crear registro de devolución
      const returnRecord: Return = {
        id: Date.now(),
        loanRequestId: returnData.loanRequestId,
        equipmentId: selectedLoan.equipmentId,
        equipmentName: selectedLoan.equipmentName,
        studentId: user.email,
        studentName: user.name || 'Estudiante',
        studentEmail: user.email,
        returnDate: new Date().toISOString().split('T')[0],
        equipmentCondition: returnData.equipmentCondition,
        studentComments: returnData.studentComments,
        createdAt: new Date()
      };

      // Guardar devolución en localStorage
      const existingReturns = localStorage.getItem('labLoanReturns');
      const returns: Return[] = existingReturns ? JSON.parse(existingReturns) : [];
      returns.push(returnRecord);
      localStorage.setItem('labLoanReturns', JSON.stringify(returns));

      // Actualizar estado de la solicitud de préstamo a 'returned'
      const savedRequests = localStorage.getItem('labLoanRequests');
      if (savedRequests) {
        const allRequests: LoanRequest[] = JSON.parse(savedRequests);
        const updatedRequests = allRequests.map(request =>
          request.id === selectedLoan.id
            ? { ...request, status: 'returned' as const, updatedAt: new Date() }
            : request
        );
        localStorage.setItem('labLoanRequests', JSON.stringify(updatedRequests));
      }

      // Actualizar estado local
      setActiveLoanRequests(prev => prev.filter(request => request.id !== selectedLoan.id));

      // Mostrar confirmación
      const conditionText = EQUIPMENT_CONDITION[returnData.equipmentCondition];
      alert(`✅ Devolución registrada exitosamente
      
Material: ${selectedLoan.equipmentName}
Estado: ${conditionText}
Fecha de devolución: ${new Date().toLocaleDateString('es-ES')}

La devolución ha sido registrada y aparecerá en tu historial.`);
      
      setIsReturnModalOpen(false);
      setSelectedLoan(null);
    } catch (error) {
      console.error('Error registering return:', error);
      alert('❌ Error al registrar la devolución. Por favor, inténtalo nuevamente.');
    }
  };

  const handleCloseReturnModal = () => {
    setIsReturnModalOpen(false);
    setSelectedLoan(null);
  };

  // Funciones para manejar el rating
  const handleRateService = (loanRequest: LoanRequest) => {
    setSelectedLoanForRating(loanRequest);
    setShowRatingModal(true);
  };

  const handleSubmitRating = (ratingData: ServiceRatingFormData) => {
    try {
      // Guardar la calificación en localStorage
      const existingRatings = localStorage.getItem('labLoanRatings');
      const ratings = existingRatings ? JSON.parse(existingRatings) : [];
      
      const newRating = {
        id: Date.now(),
        loanRequestId: ratingData.reservationId,
        rating: ratingData.rating,
        comment: ratingData.comment,
        timestamp: new Date(),
        studentEmail: JSON.parse(localStorage.getItem('labLoanUser') || '{}').email
      };
      
      ratings.push(newRating);
      localStorage.setItem('labLoanRatings', JSON.stringify(ratings));
      
      // Marcar como calificado
      setRatedLoans(prev => [...prev, ratingData.reservationId]);
      
      // Mostrar éxito
      setShowRatingSuccess(true);
      setTimeout(() => {
        setShowRatingSuccess(false);
      }, 3000);
      
      setShowRatingModal(false);
    } catch (error) {
      console.error('Error saving rating:', error);
      alert('❌ Error al guardar la calificación. Por favor, inténtalo nuevamente.');
    }
  };

  // Funciones para manejar incidencias
  const handleReportIncident = (loanRequest: LoanRequest) => {
    setSelectedLoanForIncident(loanRequest);
    setShowIncidentForm(true);
  };

  const handleIncidentSubmit = (incidentData: IncidentFormData) => {
    try {
      // Crear la incidencia
      const incident: Incident = {
        id: Math.floor(1000 + Math.random() * 9000),
        ...incidentData,
        studentId: 12345,
        studentName: JSON.parse(localStorage.getItem('labLoanUser') || '{}').name || 'Estudiante',
        status: 'reportada',
        createdAt: new Date(),
      };

      // Guardar en localStorage
      const existingIncidents = localStorage.getItem('labLoanIncidents');
      const incidents: Incident[] = existingIncidents ? JSON.parse(existingIncidents) : [];
      incidents.unshift(incident); // Agregar al inicio
      localStorage.setItem('labLoanIncidents', JSON.stringify(incidents));

      // Mostrar éxito
      setShowIncidentSuccess(true);
      setTimeout(() => {
        setShowIncidentSuccess(false);
      }, 4000);

      // Cerrar formulario
      setShowIncidentForm(false);
      setSelectedLoanForIncident(null);
    } catch (error) {
      console.error('Error saving incident:', error);
      alert('❌ Error al reportar la incidencia. Por favor, inténtalo nuevamente.');
    }
  };

  const handleCancelIncident = () => {
    setShowIncidentForm(false);
    setSelectedLoanForIncident(null);
  };

  const convertLoanToReservation = (loan: LoanRequest): Reservation => {
    return {
      id: loan.id,
      equipmentId: loan.equipmentId,
      equipment: {
        id: loan.equipmentId,
        name: loan.equipmentName,
        description: `Equipo: ${loan.equipmentName}`,
        imageUrl: ''
      },
      studentId: 12345, // Simplified for demo
      studentName: loan.studentName,
      startDate: new Date(loan.startDate),
      endDate: new Date(loan.endDate),
      status: 'completada' as const,
      createdAt: loan.createdAt || new Date()
    };
  };
  useEffect(() => {
    // Cargar préstamos ya calificados
    const existingRatings = localStorage.getItem('labLoanRatings');
    if (existingRatings) {
      const ratings = JSON.parse(existingRatings);
      const ratedIds = ratings.map((rating: any) => rating.loanRequestId);
      setRatedLoans(ratedIds);
    }
  }, []);

  // Helper functions
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

  const calculateDaysFromStart = (startDate: string) => {
    const start = new Date(startDate);
    const today = new Date();
    const diffTime = today.getTime() - start.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const isOverdue = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    return end < today;
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
          Mis Préstamos Activos
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Materiales que tienes actualmente prestados y puedes devolver.
        </p>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
          <h3 className="text-lg font-medium">Préstamos Activos</h3>
          <p className="text-3xl font-bold">{activeLoanRequests.length}</p>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-lg text-white">
          <h3 className="text-lg font-medium">Próximos a Vencer</h3>
          <p className="text-3xl font-bold">
            {activeLoanRequests.filter(loan => {
              const daysToEnd = Math.ceil((new Date(loan.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              return daysToEnd <= 2 && daysToEnd >= 0;
            }).length}
          </p>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-lg text-white">
          <h3 className="text-lg font-medium">Vencidos</h3>
          <p className="text-3xl font-bold">
            {activeLoanRequests.filter(loan => isOverdue(loan.endDate)).length}
          </p>
        </div>
      </div>

      {/* Lista de préstamos activos */}
      {activeLoanRequests.length > 0 ? (
        <div className="space-y-6">
          {activeLoanRequests.map((loanRequest) => (
            <div 
              key={loanRequest.id} 
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-md border ${
                isOverdue(loanRequest.endDate) 
                  ? 'border-red-300 dark:border-red-600' 
                  : 'border-gray-200 dark:border-gray-700'
              } p-6`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {loanRequest.equipmentName}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 mt-2">
                    {LOAN_REQUEST_STATUS[loanRequest.status]}
                  </span>
                </div>
                
                {isOverdue(loanRequest.endDate) && (
                  <div className="flex items-center text-red-600 dark:text-red-400">
                    <ExclamationTriangleIcon className="h-5 w-5 mr-1" />
                    <span className="text-sm font-medium">VENCIDO</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {formatDate(loanRequest.startDate)} - {formatDate(loanRequest.endDate)}
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Duración: {calculateDuration(loanRequest.startDate, loanRequest.endDate)} día{calculateDuration(loanRequest.startDate, loanRequest.endDate) > 1 ? 's' : ''}
                  <span className="ml-2 text-xs">
                    ({calculateDaysFromStart(loanRequest.startDate)} días desde inicio)
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3 mb-4">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Asignatura:</span> {loanRequest.subject}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                  <span className="font-medium">Propósito:</span> {loanRequest.purpose}
                </p>
              </div>              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => handleReportIncident(loanRequest)}
                  className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors flex items-center"
                >
                  <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                  Reportar Problema
                </button>
                <button
                  onClick={() => handleReturnClick(loanRequest)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors flex items-center"
                >
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Registrar Devolución
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <CheckCircleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No tienes préstamos activos
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Actualmente no tienes materiales prestados que necesiten devolución.
          </p>
        </div>      )}

      {/* Formulario de reporte de incidencias */}
      {showIncidentForm && selectedLoanForIncident && (
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
            Reportar problema con {selectedLoanForIncident.equipmentName}
          </h2>
          <IncidentForm
            equipment={{
              id: selectedLoanForIncident.equipmentId,
              name: selectedLoanForIncident.equipmentName,
              description: `Equipo prestado: ${selectedLoanForIncident.equipmentName}`,
              imageUrl: ''
            }}
            onSubmit={handleIncidentSubmit}
            onCancel={handleCancelIncident}
          />
        </div>
      )}

      {/* Sección de préstamos devueltos para calificar */}
      {returnedLoanRequests.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Préstamos Completados
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Ayúdanos a mejorar nuestro servicio calificando tu experiencia con estos préstamos completados.
          </p>          {/* Mensaje de éxito rating */}
          {showRatingSuccess && (
            <div className="mb-4 p-4 rounded-md bg-green-50 dark:bg-green-900/20 flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-500 dark:text-green-400 mr-3" />
              <span className="text-green-800 dark:text-green-300">
                ¡Gracias por tu evaluación! Tu feedback nos ayuda a mejorar nuestro servicio.
              </span>
            </div>
          )}

          {/* Mensaje de éxito incidencias */}
          {showIncidentSuccess && (
            <div className="mb-4 p-4 rounded-md bg-blue-50 dark:bg-blue-900/20 flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-3" />
              <span className="text-blue-800 dark:text-blue-300">
                ¡Incidencia reportada exitosamente! El personal técnico ha sido notificado y se encargará de revisar el problema.
              </span>
            </div>
          )}

          <div className="space-y-4">
            {returnedLoanRequests.map((loanRequest) => (
              <div key={loanRequest.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {loanRequest.equipmentName}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 mt-2">
                      Devuelto
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {formatDate(loanRequest.startDate)} - {formatDate(loanRequest.endDate)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Duración: {calculateDuration(loanRequest.startDate, loanRequest.endDate)} día{calculateDuration(loanRequest.startDate, loanRequest.endDate) > 1 ? 's' : ''}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3 mb-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Asignatura:</span> {loanRequest.subject}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                    <span className="font-medium">Propósito:</span> {loanRequest.purpose}
                  </p>
                </div>

                <div className="flex justify-end">
                  {ratedLoans.includes(loanRequest.id) ? (
                    <span className="flex items-center text-gray-500 dark:text-gray-400">
                      <StarIcon className="h-4 w-4 mr-2" />
                      Ya calificado
                    </span>
                  ) : (
                    <button
                      onClick={() => handleRateService(loanRequest)}
                      className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors flex items-center"
                    >
                      <StarIcon className="h-4 w-4 mr-2" />
                      Calificar Servicio
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}      {/* Modal de devolución */}
      {selectedLoan && (
        <ReturnModal
          loanRequest={selectedLoan}
          isOpen={isReturnModalOpen}
          onClose={handleCloseReturnModal}
          onSubmit={handleReturnSubmit}
        />
      )}

      {/* Modal de calificación */}
      <ServiceRatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        reservation={selectedLoanForRating ? convertLoanToReservation(selectedLoanForRating) : null}
        onSubmitRating={handleSubmitRating}
      />
    </div>
  );
}
