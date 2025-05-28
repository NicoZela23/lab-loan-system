import { useState } from 'react';
import { LoanHistoryItem, LoanStatus } from '../types/historyTypes';
import { DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface HistoryTableProps {
  data: LoanHistoryItem[];
}

export default function HistoryTable({ data }: HistoryTableProps) {
  const [selectedItem, setSelectedItem] = useState<LoanHistoryItem | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Calcular los índices para la paginación
  const start = page * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedData = data.slice(start, end);
  const totalPages = Math.ceil(data.length / rowsPerPage);
  
  // Obtener el texto de estado según el tipo de estado
  const getStatusText = (status: LoanStatus) => {
    const statusMap: Record<LoanStatus, { text: string, class: string }> = {
      'checked-out': { text: 'Prestado', class: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
      'returned': { text: 'Devuelto', class: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
      'returned-late': { text: 'Devuelto con retraso', class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
      'overdue': { text: 'Vencido', class: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
      'lost': { text: 'Extraviado', class: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' },
      'damaged': { text: 'Dañado', class: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' }
    };
    
    return statusMap[status] || { text: status, class: 'bg-gray-100 text-gray-800' };
  };
  
  // Formatear fecha para mostrar en formato legible
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };
  
  // Mostrar detalles de un préstamo
  const handleViewDetails = (item: LoanHistoryItem) => {
    setSelectedItem(item);
  };
  
  // Cerrar el modal de detalles
  const handleCloseModal = () => {
    setSelectedItem(null);
  };
  
  return (
    <div className="overflow-hidden">
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <DocumentMagnifyingGlassIcon className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">No se encontraron registros</p>
          <p className="text-gray-400 dark:text-gray-500">Modifica los filtros para ver resultados</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-fixed">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/6">
                    Equipo
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/6">
                    Estudiante
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/6">
                    Curso
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/8">
                    Préstamo
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/8">
                    Devolución
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/8">
                    Estado
                  </th>
                  <th scope="col" className="relative px-4 py-3 w-1/12">
                    <span className="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedData.map((item) => {
                  const status = getStatusText(item.status);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-4 py-4 break-words">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{item.equipmentName}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{item.equipmentId}</div>
                      </td>
                      <td className="px-4 py-4 break-words">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{item.studentName}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{item.studentId}</div>
                      </td>
                      <td className="px-4 py-4 break-words">
                        <div className="text-sm text-gray-900 dark:text-white">{item.course}</div>
                      </td>
                      <td className="px-4 py-4 break-words">
                        <div className="text-sm text-gray-900 dark:text-white">{formatDate(item.checkoutDate)}</div>
                      </td>
                      <td className="px-4 py-4 break-words">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {item.actualReturnDate ? formatDate(item.actualReturnDate) : formatDate(item.returnDate)}
                        </div>
                        {item.actualReturnDate && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Prevista: {formatDate(item.returnDate)}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.class}`}>
                          {status.text}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right text-sm font-medium">
                        <button
                          onClick={() => handleViewDetails(item)}
                          className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                        >
                          Detalles
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Paginación */}
          <div className="bg-white dark:bg-gray-900 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  page === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Anterior
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  page >= totalPages - 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Siguiente
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-400">
                  Mostrando <span className="font-medium">{start + 1}</span> a{' '}
                  <span className="font-medium">{Math.min(end, data.length)}</span> de{' '}
                  <span className="font-medium">{data.length}</span> resultados
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setPage(Math.max(0, page - 1))}
                    disabled={page === 0}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white dark:bg-gray-800 text-sm font-medium ${
                      page === 0
                        ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="sr-only">Anterior</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {/* Números de página */}
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setPage(index)}
                      className={`relative inline-flex items-center px-4 py-2 border ${
                        page === index
                          ? 'z-10 bg-primary-50 border-primary-500 text-primary-600 dark:bg-primary-900 dark:border-primary-500 dark:text-primary-300'
                          : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                      } text-sm font-medium`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                    disabled={page >= totalPages - 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white dark:bg-gray-800 text-sm font-medium ${
                      page >= totalPages - 1
                        ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="sr-only">Siguiente</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Modal de detalles */}
      {selectedItem && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Detalles del préstamo</h3>
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                onClick={handleCloseModal}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-4">
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Equipo</h4>
                <p className="text-gray-900 dark:text-white">{selectedItem.equipmentName} ({selectedItem.equipmentId})</p>
              </div>
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Estudiante</h4>
                <p className="text-gray-900 dark:text-white">{selectedItem.studentName} ({selectedItem.studentId})</p>
              </div>
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Curso</h4>
                <p className="text-gray-900 dark:text-white">{selectedItem.course}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha de préstamo</h4>
                  <p className="text-gray-900 dark:text-white">{formatDate(selectedItem.checkoutDate)}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha de devolución prevista</h4>
                  <p className="text-gray-900 dark:text-white">{formatDate(selectedItem.returnDate)}</p>
                </div>
              </div>
              {selectedItem.actualReturnDate && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha de devolución real</h4>
                  <p className="text-gray-900 dark:text-white">{formatDate(selectedItem.actualReturnDate)}</p>
                </div>
              )}
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Estado</h4>
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusText(selectedItem.status).class}`}>
                  {getStatusText(selectedItem.status).text}
                </span>
              </div>
              {selectedItem.condition && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Condición del equipo</h4>
                  <p className="text-gray-900 dark:text-white capitalize">{selectedItem.condition}</p>
                </div>
              )}
              {selectedItem.notes && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Notas</h4>
                  <p className="text-gray-900 dark:text-white">{selectedItem.notes}</p>
                </div>
              )}
            </div>
            <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 rounded-b-lg text-right">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}