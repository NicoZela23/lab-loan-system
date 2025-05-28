// filepath: c:\Users\simon\OneDrive\Escritorio\labLoan\lab-loan-system\front\src\components\modals\ServiceRatingModal.tsx
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Reservation } from '../../types/reservation';
import { ServiceRatingFormData } from '../../types/feedback';
import ServiceRatingForm from '../../features/feedback/components/ServiceRatingForm';

interface ServiceRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: Reservation | null;
  onSubmitRating: (rating: ServiceRatingFormData) => void;
}

export default function ServiceRatingModal({
  isOpen,
  onClose,
  reservation,
  onSubmitRating
}: ServiceRatingModalProps) {
  if (!reservation) return null;

  const handleSubmitRating = (data: ServiceRatingFormData) => {
    onSubmitRating(data);
    onClose();
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
                <Dialog.Title as="h3" className="text-lg font-medium mb-4 text-gray-900 dark:text-white text-center">
                  Califica tu experiencia con el préstamo
                </Dialog.Title>
                
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Detalles del préstamo:</h4>
                  <dl className="text-sm grid grid-cols-3">
                    <dt className="text-gray-500 dark:text-gray-400">Equipo:</dt>
                    <dd className="col-span-2 font-medium text-gray-900 dark:text-white">{reservation.equipment?.name}</dd>
                  </dl>
                </div>

                <ServiceRatingForm
                  reservationId={reservation.id}
                  onSubmit={handleSubmitRating}
                  onCancel={onClose}
                />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}