import React from 'react';

interface ApprovalFilterProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function ApprovalFilter({ currentFilter, onFilterChange }: ApprovalFilterProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center">
        <span className="text-gray-700 font-medium mr-3">Filtrar por estado:</span>
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              currentFilter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => onFilterChange('all')}
          >
            Todas
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              currentFilter === 'pending'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => onFilterChange('pending')}
          >
            Pendientes
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              currentFilter === 'approved'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => onFilterChange('approved')}
          >
            Aprobadas
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              currentFilter === 'rejected'
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => onFilterChange('rejected')}
          >
            Rechazadas
          </button>
        </div>
      </div>
    </div>
  );
}