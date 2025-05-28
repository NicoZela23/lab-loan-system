import React, { useState } from 'react';
import { User, UserRole } from '../../../types/user';
import { ShieldExclamationIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

interface UserListProps {
  users: User[];
  onSuspendClick: (userId: string) => void;
  onReactivateClick: (userId: string) => void;
  onViewDetailsClick: (userId: string) => void;
}

export default function UserList({ users, onSuspendClick, onReactivateClick, onViewDetailsClick }: UserListProps) {
  const [filterRole, setFilterRole] = useState<UserRole | 'todos'>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filtrar usuarios por rol y término de búsqueda
  const filteredUsers = users.filter((user) => {
    const matchesRole = filterRole === 'todos' || user.role === filterRole;
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.studentId && user.studentId.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col md:flex-row gap-2 md:gap-4">
          <div>
            <label htmlFor="role-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Filtrar por rol
            </label>
            <select
              id="role-filter"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as UserRole | 'todos')}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="todos">Todos los roles</option>
              <option value="estudiante">Estudiantes</option>
              <option value="docente">Docentes</option>
              <option value="administrador">Administradores</option>
            </select>
          </div>
        </div>
        <div className="w-full md:w-auto">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Buscar usuarios
          </label>
          <input
            type="text"
            id="search"
            placeholder="Buscar por nombre, email o ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-1 block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md"
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Último acceso
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id} className={user.isSuspended ? "bg-red-50" : "hover:bg-gray-50"}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                        {user.studentId && (
                          <div className="text-xs text-gray-500">
                            ID: {user.studentId}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${user.role === 'administrador' ? 'bg-purple-100 text-purple-800' : 
                        user.role === 'docente' ? 'bg-blue-100 text-blue-800' : 
                        'bg-green-100 text-green-800'}`}>
                      {user.role === 'estudiante' ? 'Estudiante' : 
                       user.role === 'docente' ? 'Docente' : 
                       'Administrador'}
                    </span>
                    {user.program && (
                      <div className="text-xs text-gray-500 mt-1">
                        {user.program}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.isSuspended ? (
                      <span className="flex items-center text-xs text-red-800">
                        <ShieldExclamationIcon className="h-4 w-4 mr-1 text-red-600" />
                        Suspendido
                      </span>
                    ) : (
                      <span className="flex items-center text-xs text-green-800">
                        <CheckCircleIcon className="h-4 w-4 mr-1 text-green-600" />
                        Activo
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Nunca'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onViewDetailsClick(user.id)}
                      className="text-primary-600 hover:text-primary-900 mr-4"
                    >
                      Ver detalles
                    </button>
                    {!user.isSuspended ? (
                      <button
                        onClick={() => onSuspendClick(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Suspender
                      </button>
                    ) : (
                      <button
                        onClick={() => onReactivateClick(user.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Reactivar
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  No se encontraron usuarios con los criterios especificados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}