// filepath: c:\Users\simon\OneDrive\Escritorio\labLoan\lab-loan-system\front\src\components\modals\ReservationSuccessModal.tsx
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { Reservation } from '../../types/reservation';
import { Link } from 'react-router-dom';

interface ReservationSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: Reservation | null;
}

export default function ReservationSuccessModal({
  isOpen,
  onClose,
  reservation
}: ReservationSuccessModalProps) {
  if (!reservation) return null;
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', { 
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('es-ES', { 
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex flex-col items-center text-center mb-5">
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mb-4">
                    <CheckCircleIcon className="h-10 w-10 text-green-600 dark:text-green-400" />
                  </div>
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                  >
                    ¡Reserva realizada con éxito!
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Tu reserva ha sido registrada correctamente. Recibirás una confirmación cuando sea aprobada.
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Detalles de la reserva:</h4>
                  <dl className="text-sm">
                    <div className="grid grid-cols-3 py-2 border-b border-gray-200 dark:border-gray-600">
                      <dt className="text-gray-500 dark:text-gray-400">Equipo:</dt>
                      <dd className="col-span-2 font-medium text-gray-900 dark:text-white">{reservation.equipment?.name}</dd>
                    </div>
                    <div className="grid grid-cols-3 py-2 border-b border-gray-200 dark:border-gray-600">
                      <dt className="text-gray-500 dark:text-gray-400">Fecha:</dt>
                      <dd className="col-span-2 font-medium text-gray-900 dark:text-white">{formatDate(reservation.startDate)}</dd>
                    </div>
                    <div className="grid grid-cols-3 py-2 border-b border-gray-200 dark:border-gray-600">
                      <dt className="text-gray-500 dark:text-gray-400">Horario:</dt>
                      <dd className="col-span-2 font-medium text-gray-900 dark:text-white">
                        {formatTime(reservation.startDate)} - {formatTime(reservation.endDate)}
                      </dd>
                    </div>
                    <div className="grid grid-cols-3 py-2">
                      <dt className="text-gray-500 dark:text-gray-400">Estado:</dt>
                      <dd className="col-span-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                          Pendiente de aprobación
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="mt-6 flex justify-center space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                    onClick={onClose}
                  >
                    Aceptar
                  </button>
                  <Link
                    to="/reservas"
                    className="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                  >
                    Ver mis reservas
                  </Link>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}