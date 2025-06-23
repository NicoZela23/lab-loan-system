import { useState, useEffect } from 'react';
import { Equipment } from '../../../types/equipment';
import { LoanRequest, LoanRequestFormData } from '../../../types/loanRequest';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import EquipmentList from '../components/EquipmentList';
import EquipmentFilters from '../components/EquipmentFilters';
import LoanRequestModal from '../components/LoanRequestModal';

export default function StudentEquipmentPage() {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [filteredEquipments, setFilteredEquipments] = useState<Equipment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);

  // Simular carga de datos desde localStorage
  useEffect(() => {
    const loadEquipments = () => {
      try {
        const savedEquipments = localStorage.getItem('labLoanEquipments');
        if (savedEquipments) {
          const equipmentsData = JSON.parse(savedEquipments);
          setEquipments(equipmentsData);
        } else {
          // Datos de ejemplo inicial
          const initialEquipments: Equipment[] = [
            {
              id: 1,
              name: 'Microscopio Digital',
              description: 'Microscopio digital de alta resolución con capacidad de aumento 40x-1000x',
              category: 'Óptica',
              status: 'disponible',
              location: 'Laboratorio A-201',
              serialNumber: 'MD-2024-001',
              isAvailableForLoan: true,
              imageUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400'
            },
            {
              id: 2,
              name: 'Balanza Analítica',
              description: 'Balanza de precisión para mediciones analíticas de hasta 0.1mg',
              category: 'Medición',
              status: 'disponible',
              location: 'Laboratorio B-105',
              serialNumber: 'BA-2024-002',
              isAvailableForLoan: true,
              imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400'
            },
            {
              id: 3,
              name: 'Centrífuga',
              description: 'Centrífuga de mesa para tubos de ensayo y microplacas',
              category: 'Separación',
              status: 'disponible',
              location: 'Laboratorio C-302',
              serialNumber: 'CE-2024-003',
              isAvailableForLoan: true,
              imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400'
            },
            {
              id: 4,
              name: 'pH Metro Digital',
              description: 'Medidor de pH digital con compensación automática de temperatura',
              category: 'Medición',
              status: 'prestado',
              location: 'Laboratorio A-201',
              serialNumber: 'PH-2024-004',
              isAvailableForLoan: true,
              imageUrl: 'https://images.unsplash.com/photo-1594622632047-55fb2bde64b0?w=400'
            },
            {
              id: 5,
              name: 'Espectrofotómetro',
              description: 'Espectrofotómetro UV-Vis para análisis cualitativo y cuantitativo',
              category: 'Análisis',
              status: 'mantenimiento',
              location: 'Laboratorio D-105',
              serialNumber: 'SP-2024-005',
              isAvailableForLoan: true,
              imageUrl: 'https://images.unsplash.com/photo-1551601651-05b0b51a6c25?w=400'
            },
            {
              id: 6,
              name: 'Pipetas Automáticas Set',
              description: 'Set de pipetas automáticas de volumen variable (10-100μL, 100-1000μL)',
              category: 'Volumetría',
              status: 'disponible',
              location: 'Laboratorio B-105',
              serialNumber: 'PI-2024-006',
              isAvailableForLoan: true,
              imageUrl: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400'
            },
            {
              id: 7,
              name: 'Agitador Magnético',
              description: 'Agitador magnético con calentamiento y control de temperatura',
              category: 'Agitación',
              status: 'disponible',
              location: 'Laboratorio A-201',
              serialNumber: 'AM-2024-007',
              isAvailableForLoan: true,
              imageUrl: 'https://tecnal.com.br/img/produtos/11656/11656-b.jpg'
            },
            {
              id: 8,
              name: 'Termociclidador',
              description: 'Termociclidador para PCR con 96 pozos',
              category: 'Biología Molecular',
              status: 'dañado',
              location: 'Laboratorio C-302',
              serialNumber: 'TC-2024-008',
              isAvailableForLoan: false,
              imageUrl: 'https://images.unsplash.com/photo-1583912086296-a7b7f5dce086?w=400'
            }
          ];
          setEquipments(initialEquipments);
          localStorage.setItem('labLoanEquipments', JSON.stringify(initialEquipments));
        }
      } catch (error) {
        console.error('Error loading equipments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEquipments();
  }, []);

  // Filtrar equipos según los criterios
  useEffect(() => {
    let filtered = equipments.filter(equipment => 
      // Solo mostrar equipos disponibles para préstamo
      equipment.status === 'disponible' && equipment.isAvailableForLoan !== false
    );    if (searchTerm) {
      filtered = filtered.filter(equipment =>
        equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (equipment.description && equipment.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (equipment.category && equipment.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(equipment => equipment.category === selectedCategory);
    }

    if (selectedLocation) {
      filtered = filtered.filter(equipment => equipment.location === selectedLocation);
    }

    setFilteredEquipments(filtered);
  }, [equipments, searchTerm, selectedCategory, selectedLocation]);

  // Obtener categorías únicas
  const categories = Array.from(new Set(equipments.map(eq => eq.category))).filter(Boolean);
  
  // Obtener ubicaciones únicas
  const locations = Array.from(new Set(equipments.map(eq => eq.location))).filter(Boolean);
  const handleReserve = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setIsLoanModalOpen(true);
  };

  const handleLoanRequest = (requestData: LoanRequestFormData) => {
    try {
      // Obtener datos del usuario actual
      const userData = localStorage.getItem('labLoanUser');
      const user = userData ? JSON.parse(userData) : null;

      if (!user) {
        alert('Error: No se pudo obtener la información del usuario');
        return;
      }      // Crear la solicitud de préstamo
      const loanRequest: LoanRequest = {
        id: Date.now(),
        equipmentId: requestData.equipmentId,
        equipmentName: requestData.equipmentName,
        studentId: user.email,
        studentName: user.name || 'Estudiante',
        studentEmail: user.email,
        startDate: requestData.startDate,
        endDate: requestData.endDate,
        purpose: requestData.purpose,
        subject: requestData.subject,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Guardar la solicitud en localStorage
      const existingRequests = localStorage.getItem('labLoanRequests');
      const requests: LoanRequest[] = existingRequests ? JSON.parse(existingRequests) : [];
      requests.push(loanRequest);
      localStorage.setItem('labLoanRequests', JSON.stringify(requests));

      // Mostrar confirmación
      alert(`✅ Solicitud de préstamo enviada exitosamente para: ${requestData.equipmentName}\n\nEstado: Pendiente de aprobación\nPodrás ver el estado de tu solicitud en "Mis Reservas"`);
      
      setIsLoanModalOpen(false);
      setSelectedEquipment(null);
    } catch (error) {
      console.error('Error al crear solicitud de préstamo:', error);
      alert('❌ Error al enviar la solicitud. Por favor, inténtalo nuevamente.');
    }
  };

  const handleCloseLoanModal = () => {
    setIsLoanModalOpen(false);
    setSelectedEquipment(null);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedLocation('');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Materiales Disponibles
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Explora los materiales y equipos disponibles para préstamo en los laboratorios.
        </p>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
          <h3 className="text-lg font-medium">Equipos Disponibles</h3>
          <p className="text-3xl font-bold">{filteredEquipments.length}</p>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
          <h3 className="text-lg font-medium">Categorías</h3>
          <p className="text-3xl font-bold">{categories.length}</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
          <h3 className="text-lg font-medium">Laboratorios</h3>
          <p className="text-3xl font-bold">{locations.length}</p>
        </div>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Búsqueda */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, descripción o categoría..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Botón de filtros */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <FunnelIcon className="h-5 w-5 mr-2" />
            Filtros
            {(selectedCategory || selectedLocation) && (
              <span className="ml-2 bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                {[selectedCategory, selectedLocation].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>

        {/* Panel de filtros */}
        {showFilters && (
          <EquipmentFilters
            categories={categories}
            locations={locations}
            selectedCategory={selectedCategory}
            selectedLocation={selectedLocation}
            onCategoryChange={setSelectedCategory}
            onLocationChange={setSelectedLocation}
            onClearFilters={clearFilters}
          />
        )}

        {/* Resumen de filtros activos */}
        {(searchTerm || selectedCategory || selectedLocation) && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
            <div className="flex items-center justify-between">
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <span className="font-medium">Filtros activos:</span>
                {searchTerm && <span className="ml-2 bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded">"{searchTerm}"</span>}
                {selectedCategory && <span className="ml-2 bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded">{selectedCategory}</span>}
                {selectedLocation && <span className="ml-2 bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded">{selectedLocation}</span>}
              </div>
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-medium"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Lista de equipos */}
      {filteredEquipments.length > 0 ? (
        <EquipmentList 
          equipments={filteredEquipments}
          onReserve={handleReserve}
          showReserveButton={true}
          showAdminActions={false}
        />
      ) : (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <MagnifyingGlassIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No se encontraron materiales
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            No hay materiales disponibles que coincidan con tus criterios de búsqueda.
          </p>
          {(searchTerm || selectedCategory || selectedLocation) && (
            <button
              onClick={clearFilters}
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
            >
              Limpiar filtros
            </button>          )}
        </div>
      )}

      {/* Modal de solicitud de préstamo */}
      {selectedEquipment && (
        <LoanRequestModal
          equipment={selectedEquipment}
          isOpen={isLoanModalOpen}
          onClose={handleCloseLoanModal}
          onSubmit={handleLoanRequest}
        />
      )}
    </div>
  );
}
