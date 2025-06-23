import React, { useState } from 'react';
import { LoanRequest } from '../types/teacherTypes';
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

interface ApprovalListProps {
  requests: LoanRequest[];
  onApprove: (id: string, comments?: string) => void;
  onReject: (id: string, reason: string) => void;
}

export default function ApprovalList({ requests, onApprove, onReject }: ApprovalListProps) {
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
  const [approvalComments, setApprovalComments] = useState<string>('');
  const [rejectionReason, setRejectionReason] = useState<string>('');
  
  // Maneja la acción de mostrar el formulario de aprobación
  const handleShowApproveForm = (id: string) => {
    setActiveRequestId(id === activeRequestId ? null : id);
    setApprovalComments('');
    setRejectionReason('');
  };
  
  // Maneja la acción de aprobación
  const handleApprove = (id: string) => {
    onApprove(id, approvalComments);
    setActiveRequestId(null);
    setApprovalComments('');
  };
  
  // Maneja la acción de rechazo
  const handleReject = (id: string) => {
    if (!rejectionReason.trim()) {
      alert('Debe proporcionar un motivo para rechazar la solicitud.');
      return;
    }
    onReject(id, rejectionReason);
    setActiveRequestId(null);
    setRejectionReason('');
  };
  
  // Renderiza una etiqueta de estado según el estado de la solicitud
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <ClockIcon className="h-4 w-4 mr-1" />
            Pendiente
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="h-4 w-4 mr-1" />
            Aprobada
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircleIcon className="h-4 w-4 mr-1" />
            Rechazada
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estudiante
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Equipo
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fechas
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Curso
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  No hay solicitudes que mostrar con los filtros actuales.
                </td>
              </tr>
            ) : (
              requests.map((request) => (
                <React.Fragment key={request.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{request.studentName}</div>
                      <div className="text-xs text-gray-500">{request.studentId}</div>
                    </td>                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{request.equipment}</div>
                      <div className="text-xs text-gray-500">Curso: {request.course}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs text-gray-500">Solicitud: {new Date(request.requestDate).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500">Recogida: {new Date(request.pickupDate).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500">Devolución: {new Date(request.returnDate).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.course}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderStatusBadge(request.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {request.status === 'pending' ? (
                        <button
                          onClick={() => handleShowApproveForm(request.id)}
                          className="text-primary-600 hover:text-primary-900 mr-3"
                        >
                          Revisar
                        </button>
                      ) : (
                        <div className="flex items-center space-x-2">
                          {request.status === 'approved' && (
                            <span className="text-sm text-gray-500 italic">
                              {request.approvalComments ? `Comentario: ${request.approvalComments}` : 'Sin comentarios'}
                            </span>
                          )}
                          {request.status === 'rejected' && (
                            <span className="text-sm text-gray-500 italic">
                              Motivo: {request.rejectionReason}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                  {activeRequestId === request.id && (
                    <tr className="bg-gray-50">
                      <td colSpan={6} className="px-6 py-4">
                        <div className="mb-4">
                          <h4 className="text-lg font-medium text-gray-900 mb-2">Detalles de la solicitud</h4>
                          <p className="text-sm text-gray-700 mb-1">
                            <span className="font-medium">Justificación:</span> {request.reason}
                          </p>
                        </div>
                        
                        <div className="mb-4">
                          <label htmlFor="approvalComments" className="block text-sm font-medium text-gray-700 mb-1">
                            Comentarios (opcional)
                          </label>
                          <textarea
                            id="approvalComments"
                            name="approvalComments"
                            rows={2}
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            placeholder="Añadir comentarios adicionales para el estudiante..."
                            value={approvalComments}
                            onChange={(e) => setApprovalComments(e.target.value)}
                          />
                        </div>
                        
                        <div className="flex justify-between">
                          <div>
                            <button
                              type="button"
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              onClick={() => handleApprove(request.id)}
                            >
                              <CheckCircleIcon className="h-5 w-5 mr-2" />
                              Aprobar Solicitud
                            </button>
                          </div>
                          
                          <div className="flex flex-col">
                            <textarea
                              name="rejectionReason"
                              rows={2}
                              className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md mb-2"
                              placeholder="Motivo del rechazo (requerido)..."
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                            />
                            <button
                              type="button"
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 self-end"
                              onClick={() => handleReject(request.id)}
                            >
                              <XCircleIcon className="h-5 w-5 mr-2" />
                              Rechazar Solicitud
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}