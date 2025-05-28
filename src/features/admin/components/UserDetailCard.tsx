import React from 'react';
import { User } from '../../../types/user';
import { ShieldExclamationIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface UserDetailCardProps {
  user: User;
  onClose: () => void;
  onSuspendClick: () => void;
  onReactivateClick: () => void;
}

export default function UserDetailCard({ user, onClose, onSuspendClick, onReactivateClick }: UserDetailCardProps) {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-primary-700 text-white px-6 py-4 flex justify-between items-center">
        <h3 className="text-xl font-bold">Detalles del Usuario</h3>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
          <span className={`px-3 py-1 text-sm font-semibold rounded-full
            ${user.role === 'administrador' ? 'bg-purple-100 text-purple-800' : 
              user.role === 'docente' ? 'bg-blue-100 text-blue-800' : 
              'bg-green-100 text-green-800'}`}>
            {user.role === 'estudiante' ? 'Estudiante' : 
             user.role === 'docente' ? 'Docente' : 
             'Administrador'}
          </span>
        </div>
        
        <div className="border-t border-b border-gray-200 py-4 mb-4">
          <div className="flex items-center mb-2">
            <div className="font-medium text-gray-700 w-1/3">Estado:</div>
            <div>
              {user.isSuspended ? (
                <span className="flex items-center text-sm text-red-800">
                  <ShieldExclamationIcon className="h-4 w-4 mr-1 text-red-600" />
                  Suspendido
                </span>
              ) : (
                <span className="flex items-center text-sm text-green-800">
                  <CheckCircleIcon className="h-4 w-4 mr-1 text-green-600" />
                  Activo
                </span>
              )}
            </div>
          </div>
          
          {user.studentId && (
            <div className="flex items-center mb-2">
              <div className="font-medium text-gray-700 w-1/3">ID Universitario:</div>
              <div>{user.studentId}</div>
            </div>
          )}
          
          {user.faculty && (
            <div className="flex items-center mb-2">
              <div className="font-medium text-gray-700 w-1/3">Facultad:</div>
              <div>{user.faculty}</div>
            </div>
          )}
          
          {user.program && (
            <div className="flex items-center mb-2">
              <div className="font-medium text-gray-700 w-1/3">Programa/Carrera:</div>
              <div>{user.program}</div>
            </div>
          )}
          
          <div className="flex items-center mb-2">
            <div className="font-medium text-gray-700 w-1/3">Fecha de creación:</div>
            <div>{new Date(user.createdAt).toLocaleDateString()}</div>
          </div>
          
          {user.lastLogin && (
            <div className="flex items-center">
              <div className="font-medium text-gray-700 w-1/3">Último acceso:</div>
              <div>{new Date(user.lastLogin).toLocaleString()}</div>
            </div>
          )}
        </div>
        
        {user.isSuspended && user.suspensionReason && user.suspendedAt && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <ShieldExclamationIcon className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Información de suspensión</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p className="mb-1"><span className="font-medium">Motivo:</span> {user.suspensionReason}</p>
                  <p className="mb-1">
                    <span className="font-medium">Fecha:</span> {new Date(user.suspendedAt).toLocaleString()}
                  </p>
                  {user.suspendedBy && (
                    <p><span className="font-medium">Suspendido por:</span> {user.suspendedBy}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          {!user.isSuspended ? (
            <button
              onClick={onSuspendClick}
              className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Suspender Usuario
            </button>
          ) : (
            <button
              onClick={onReactivateClick}
              className="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Reactivar Usuario
            </button>
          )}
        </div>
      </div>
    </div>
  );
}