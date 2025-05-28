import React, { useEffect, useState } from 'react';
import { User } from '../../../types/user';
import { userService } from '../../../services/userService';
import UserList from '../components/UserList';
import SuspendUserModal from '../components/SuspendUserModal';
import UserDetailCard from '../components/UserDetailCard';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Cargar usuarios al iniciar
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar la lista de usuarios. Por favor, inténtelo de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspendClick = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setIsSuspendModalOpen(true);
    }
  };

  const handleConfirmSuspension = async (reason: string) => {
    if (!selectedUser) return;
    
    try {
      // Suspender usuario
      const updatedUser = await userService.suspendUser({
        userId: selectedUser.id,
        reason: reason
      });
      
      // Actualizar la lista de usuarios
      setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
      
      // Cerrar el modal
      setIsSuspendModalOpen(false);
      
      // Mostrar mensaje de éxito
      setSuccessMessage(`El usuario ${selectedUser.name} ha sido suspendido correctamente.`);
      
      // Si estábamos viendo los detalles del usuario, actualizar la vista
      if (showDetails) {
        setSelectedUser(updatedUser);
      }
      
      // Limpiar el mensaje después de 5 segundos
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (err) {
      setError('Error al suspender al usuario. Por favor, inténtelo de nuevo.');
      console.error(err);
    }
  };

  const handleReactivateClick = async (userId: string) => {
    try {
      // Reactivar usuario
      const updatedUser = await userService.reactivateUser(userId);
      
      // Actualizar la lista de usuarios
      setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
      
      // Mostrar mensaje de éxito
      setSuccessMessage(`El usuario ${updatedUser.name} ha sido reactivado correctamente.`);
      
      // Si estábamos viendo los detalles del usuario, actualizar la vista
      if (showDetails && selectedUser && selectedUser.id === updatedUser.id) {
        setSelectedUser(updatedUser);
      }
      
      // Limpiar el mensaje después de 5 segundos
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (err) {
      setError('Error al reactivar al usuario. Por favor, inténtelo de nuevo.');
      console.error(err);
    }
  };

  const handleViewDetailsClick = async (userId: string) => {
    try {
      const user = await userService.getUserById(userId);
      if (user) {
        setSelectedUser(user);
        setShowDetails(true);
      } else {
        setError('Usuario no encontrado');
      }
    } catch (err) {
      setError('Error al cargar los detalles del usuario');
      console.error(err);
    }
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedUser(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
      </div>
      
      {successMessage && (
        <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  onClick={() => setError(null)}
                  className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={showDetails ? "lg:col-span-2" : "lg:col-span-3"}>
            <UserList 
              users={users} 
              onSuspendClick={handleSuspendClick} 
              onReactivateClick={handleReactivateClick}
              onViewDetailsClick={handleViewDetailsClick}
            />
          </div>
          
          {showDetails && selectedUser && (
            <div className="lg:col-span-1">
              <UserDetailCard 
                user={selectedUser} 
                onClose={closeDetails}
                onSuspendClick={() => handleSuspendClick(selectedUser.id)}
                onReactivateClick={() => handleReactivateClick(selectedUser.id)}
              />
            </div>
          )}
        </div>
      )}

      {/* Modal para suspender usuario */}
      {selectedUser && (
        <SuspendUserModal 
          isOpen={isSuspendModalOpen}
          onClose={() => setIsSuspendModalOpen(false)}
          onConfirm={handleConfirmSuspension}
          userName={selectedUser.name}
        />
      )}
    </div>
  );
}