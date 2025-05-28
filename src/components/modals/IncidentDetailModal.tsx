// filepath: c:\Users\simon\OneDrive\Escritorio\labLoan\lab-loan-system\front\src\components\modals\IncidentDetailModal.tsx
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Incident, IncidentStatus } from '../../types/incident';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface IncidentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  incident: Incident | null;
}

export default function IncidentDetailModal({
  isOpen,
  onClose,
  incident
}: IncidentDetailModalProps) {
  if (!incident) return null;

  const getStatusClass = (status: IncidentStatus) => {
    switch (status) {
      case 'reportada':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'en revisión':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'resuelta':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'rechazada':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'baja':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'media':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'alta':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'crítica':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-start mb-4">
                  <Dialog.Title as="h3" className="text-lg font-medium text-gray-900 dark:text-white">
                    Detalles de la incidencia
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200">{incident.title}</h4>
                    <div className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusClass(incident.status)}`}>
                      {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                    </div>
                  </div>
                  <div className={`inline-block px-3 py-1 text-xs font-medium rounded-full mb-3 ${getSeverityClass(incident.severity)}`}>
                    Severidad: {incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)}
                  </div>
                  
                  <dl className="text-sm grid grid-cols-3 gap-y-2">
                    <dt className="text-gray-500 dark:text-gray-400">Equipo:</dt>
                    <dd className="col-span-2 font-medium text-gray-900 dark:text-white">{incident.equipment?.name}</dd>
                    
                    <dt className="text-gray-500 dark:text-gray-400">Reportado por:</dt>
                    <dd className="col-span-2 text-gray-900 dark:text-white">{incident.studentName}</dd>
                    
                    <dt className="text-gray-500 dark:text-gray-400">Fecha de reporte:</dt>
                    <dd className="col-span-2 text-gray-900 dark:text-white">{formatDate(incident.createdAt)}</dd>
                    
                    {incident.updatedAt && (
                      <>
                        <dt className="text-gray-500 dark:text-gray-400">Última actualización:</dt>
                        <dd className="col-span-2 text-gray-900 dark:text-white">{formatDate(incident.updatedAt)}</dd>
                      </>
                    )}

                    {incident.resolvedAt && (
                      <>
                        <dt className="text-gray-500 dark:text-gray-400">Resuelto el:</dt>
                        <dd className="col-span-2 text-gray-900 dark:text-white">{formatDate(incident.resolvedAt)}</dd>
                      </>
                    )}
                  </dl>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descripción del problema:</h4>
                  <div className="bg-white dark:bg-gray-700 rounded-md p-3 text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                    <p className="whitespace-pre-line">{incident.description}</p>
                  </div>
                </div>

                {incident.adminNotes && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notas del administrador:</h4>
                    <div className="bg-yellow-50 dark:bg-yellow-900/10 rounded-md p-3 text-sm text-gray-700 dark:text-gray-300 border border-yellow-200 dark:border-yellow-800">
                      <p className="whitespace-pre-line">{incident.adminNotes}</p>
                    </div>
                  </div>
                )}

                {incident.imageUrls && incident.imageUrls.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Imágenes adjuntas:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {incident.imageUrls.map((url, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={url} 
                            alt={`Imagen ${index + 1}`} 
                            className="h-32 w-full object-cover rounded-md border border-gray-200 dark:border-gray-700"
                            onClick={() => window.open(url, '_blank')}
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/50 rounded-md transition-opacity cursor-pointer">
                            <span className="text-white text-sm">Ampliar</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex justify-center rounded-md border border-transparent bg-primary-100 dark:bg-primary-900 px-4 py-2 text-sm font-medium text-primary-900 dark:text-primary-100 hover:bg-primary-200 dark:hover:bg-primary-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                  >
                    Cerrar
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}