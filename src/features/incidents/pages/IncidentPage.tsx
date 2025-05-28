// filepath: c:\Users\simon\OneDrive\Escritorio\labLoan\lab-loan-system\front\src\features\incidents\pages\IncidentPage.tsx
import { useState } from 'react';
import { Equipment } from '../../../types/equipment';
import { Incident, IncidentFormData } from '../../../types/incident';
import IncidentForm from '../components/IncidentForm';
import IncidentList from '../components/IncidentList';
import IncidentDetailModal from '../../../components/modals/IncidentDetailModal';
import IncidentSuccessModal from '../../../components/modals/IncidentSuccessModal';
import { MagnifyingGlassIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

// Para demo: equipos de muestra - reutilizados del código existente
const demoEquipments: Equipment[] = [
  {
    id: 1,
    name: 'Microscopio Digital',
    description: 'Microscopio digital de alta resolución con conexión USB y ampliación de hasta 1000x.',
    imageUrl: 'https://images.unsplash.com/photo-1606206522398-de3bd05b1615?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80'
  },
  {
    id: 2,
    name: 'Kit de Arduino Uno',
    description: 'Kit completo de Arduino Uno con diversos componentes electrónicos para prácticas de programación.',
    imageUrl: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1964&q=80'
  },
  {
    id: 3,
    name: 'Osciloscopio Digital',
    description: 'Osciloscopio digital de 2 canales, 100MHz con pantalla LCD a color.',
    imageUrl: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80'
  },
  {
    id: 4,
    name: 'Multímetro Digital',
    description: 'Multímetro digital profesional para mediciones de voltaje, corriente y resistencia.',
    imageUrl: 'https://images.unsplash.com/photo-1603732551681-2e91159b9dc2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80'
  }
];

// Demo: incidencias previas para mostrar la funcionalidad de seguimiento
const demoIncidents: Incident[] = [
  {
    id: 1001,
    equipmentId: 3,
    equipment: demoEquipments.find(eq => eq.id === 3),
    studentId: 12345,
    studentName: 'Estudiante Demo',
    title: 'Pantalla parpadea intermitentemente',
    description: 'La pantalla del osciloscopio parpadea cada 10-15 segundos y a veces se apaga por completo durante unos instantes.',
    severity: 'media',
    status: 'en revisión',
    imageUrls: ['https://images.unsplash.com/photo-1614064641938-3bbee52942c7'],
    createdAt: new Date(2023, 3, 15),
    updatedAt: new Date(2023, 3, 16),
    adminNotes: 'Se está revisando el problema con la fuente de alimentación.'
  },
  {
    id: 1002,
    equipmentId: 1,
    equipment: demoEquipments.find(eq => eq.id === 1),
    studentId: 12345,
    studentName: 'Estudiante Demo',
    title: 'Fallo en el enfoque automático',
    description: 'El microscopio no logra enfocar automáticamente y la imagen siempre queda borrosa.',
    severity: 'alta',
    status: 'resuelta',
    imageUrls: [],
    createdAt: new Date(2023, 2, 20),
    updatedAt: new Date(2023, 2, 22),
    resolvedAt: new Date(2023, 2, 25),
    adminNotes: 'Se reemplazó el mecanismo de enfoque automático y se calibró el sistema.'
  }
];

export default function IncidentPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>(demoIncidents);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [newIncident, setNewIncident] = useState<Incident | null>(null);
  
  const filteredEquipments = demoEquipments.filter(equipment => 
    equipment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    equipment.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleReportIncidentClick = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleCancelForm = () => {
    setSelectedEquipment(null);
  };
  
  const handleSubmitIncident = (formData: IncidentFormData) => {
    // En un sistema real, aquí enviaríamos los datos al backend
    // y recibiríamos una confirmación con la incidencia creada
    const mockIncident: Incident = {
      id: Math.floor(1000 + Math.random() * 9000), // ID aleatorio de 4 dígitos
      ...formData,
      studentId: 12345, // ID del estudiante autenticado (mock)
      studentName: 'Estudiante Demo', // Nombre del estudiante autenticado (mock)
      status: 'reportada',
      createdAt: new Date(),
    };
    
    // Simulamos un pequeño retraso para dar sensación de procesamiento
    setTimeout(() => {
      setIncidents([mockIncident, ...incidents]);
      setNewIncident(mockIncident);
      setSelectedEquipment(null);
      setIsSuccessModalOpen(true);
    }, 500);
  };
  
  const handleViewIncidentDetail = (incident: Incident) => {
    setSelectedIncident(incident);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="w-full px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white dark:text-white mb-6">Incidencias de Equipos</h1>
        
        {selectedEquipment ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
              Reportar incidencia con {selectedEquipment.name}
            </h2>
            <IncidentForm 
              equipment={selectedEquipment}
              onSubmit={handleSubmitIncident}
              onCancel={handleCancelForm}
            />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Tarjeta para reportar nueva incidencia */}
              <div className="bg-primary-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Reportar incidencia</h2>
                <p className="text-primary-100 mb-6">
                  Selecciona un equipo a continuación para reportar una falla o defecto.
                </p>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="input-field pl-10"
                    placeholder="Buscar equipo..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Resumen de incidencias */}
              <div className="col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Mis incidencias reportadas</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 flex flex-col items-center">
                    <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      {incidents.filter(inc => inc.status === 'reportada').length}
                    </span>
                    <span className="text-sm text-yellow-600 dark:text-yellow-400">Reportadas</span>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 flex flex-col items-center">
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {incidents.filter(inc => inc.status === 'en revisión').length}
                    </span>
                    <span className="text-sm text-blue-600 dark:text-blue-400">En revisión</span>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 flex flex-col items-center">
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {incidents.filter(inc => inc.status === 'resuelta').length}
                    </span>
                    <span className="text-sm text-green-600 dark:text-green-400">Resueltas</span>
                  </div>
                </div>

                {incidents.length > 0 ? (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Haz clic en "Ver detalles" para más información sobre cada incidencia.
                  </p>
                ) : (
                  <div className="text-center py-8">
                    <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">No has reportado ninguna incidencia aún.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Lista de equipos para reportar */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-white dark:text-white">Equipos disponibles para reportar</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {filteredEquipments.map(equipment => (
                  <div key={equipment.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:-translate-y-1">
                    <img 
                      src={equipment.imageUrl} 
                      alt={equipment.name}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{equipment.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">{equipment.description}</p>
                      <button
                        onClick={() => handleReportIncidentClick(equipment)}
                        className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2 px-3 rounded-md text-sm flex items-center justify-center"
                      >
                        <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                        Reportar problema
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredEquipments.length === 0 && (
                <div className="text-center py-10 bg-white/10 dark:bg-gray-800/40 rounded-lg shadow-inner">
                  <p className="text-gray-300 dark:text-gray-400">
                    {searchQuery.length > 0 
                      ? 'No se encontraron equipos que coincidan con tu búsqueda.' 
                      : 'No hay equipos disponibles en este momento.'}
                  </p>
                </div>
              )}
            </div>
            
            {/* Lista de incidencias reportadas */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-white dark:text-white">Historial de incidencias</h2>
              <IncidentList
                incidents={incidents}
                onViewIncident={handleViewIncidentDetail}
              />
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg">
              <h3 className="font-medium text-blue-800 dark:text-blue-300">Información importante</h3>
              <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                Por favor, reporta las incidencias tan pronto como las detectes para que puedan ser 
                atendidas rápidamente. Proporciona la mayor cantidad de detalles posibles e incluye 
                imágenes si es necesario.
              </p>
            </div>
          </>
        )}
      </div>
      
      <IncidentDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        incident={selectedIncident}
      />
      
      <IncidentSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        incident={newIncident}
      />
    </div>
  );
}