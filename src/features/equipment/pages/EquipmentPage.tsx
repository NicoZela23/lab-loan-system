import { useState } from 'react';
import { Equipment, EquipmentFormData } from '../../../types/equipment';
import { DamageReportData } from '../components/DamageReportForm';
import EquipmentForm from '../components/EquipmentForm';
import EquipmentList from '../components/EquipmentList';
import DamageReportForm from '../components/DamageReportForm';
import ConfirmModal from '../../../components/modals/ConfirmModal';

type FormMode = 'create' | 'edit' | 'damage' | 'hidden';

export default function EquipmentPage() {
  const [equipments, setEquipments] = useState<Equipment[]>([
    // Datos de ejemplo para demostración
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
      description: 'Balanza de precisión para mediciones analíticas',
      category: 'Medición',
      status: 'disponible',
      location: 'Laboratorio B-105',
      serialNumber: 'BA-2024-002',
      isAvailableForLoan: true,
      imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400'
    }
  ]);
  const [formMode, setFormMode] = useState<FormMode>('hidden');
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [reportingDamageEquipment, setReportingDamageEquipment] = useState<Equipment | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState<number | null>(null);

  const handleCreateSubmit = (data: EquipmentFormData) => {
    const newEquipment: Equipment = {
      ...data,
      id: Date.now(),
      status: 'disponible',
      isAvailableForLoan: true
    };

    setEquipments([...equipments, newEquipment]);
    setFormMode('hidden');
  };

  const handleEditSubmit = (data: EquipmentFormData) => {
    if (!editingEquipment) return;
    
    const updatedEquipments = equipments.map(equipment => 
      equipment.id === editingEquipment.id 
        ? { ...data, id: editingEquipment.id, status: equipment.status } 
        : equipment
    );
    
    setEquipments(updatedEquipments);
    setEditingEquipment(null);
    setFormMode('hidden');
  };

  const handleDamageReportSubmit = (damageData: DamageReportData) => {
    if (!reportingDamageEquipment) return;

    // Crear el reporte de daño
    const damageReport = {
      id: Date.now(),
      equipmentId: reportingDamageEquipment.id,
      damageType: damageData.damageType,
      severity: damageData.severity,
      description: damageData.description,
      imageUrls: damageData.imageUrls,
      estimatedRepairTime: damageData.estimatedRepairTime,
      repairCost: damageData.repairCost,
      repairNotes: damageData.repairNotes,
      reportedBy: {
        id: 'admin-1',
        name: 'Administrador',
        role: 'admin' as const
      },
      reportedAt: new Date(),
      isResolved: false
    };

    // Actualizar el equipo con el estado dañado
    const updatedEquipments = equipments.map(equipment => 
      equipment.id === reportingDamageEquipment.id 
        ? { 
            ...equipment, 
            status: 'dañado' as const,
            isAvailableForLoan: false,
            currentDamageReport: damageReport,
            damageHistory: [...(equipment.damageHistory || []), damageReport]
          } 
        : equipment
    );
    
    setEquipments(updatedEquipments);
    setReportingDamageEquipment(null);
    setFormMode('hidden');
  };

  const handleEdit = (equipment: Equipment) => {
    setEditingEquipment(equipment);
    setFormMode('edit');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReportDamage = (equipment: Equipment) => {
    setReportingDamageEquipment(equipment);
    setFormMode('damage');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: number) => {
    setEquipmentToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (equipmentToDelete === null) return;
    
    setEquipments(equipments.filter(equipment => equipment.id !== equipmentToDelete));
    setEquipmentToDelete(null);
  };

  const cancelForm = () => {
    setFormMode('hidden');
    setEditingEquipment(null);
    setReportingDamageEquipment(null);
  };

  // Estadísticas para el header
  const availableCount = equipments.filter(eq => eq.status === 'disponible').length;
  const damagedCount = equipments.filter(eq => eq.status === 'dañado').length;
  const maintenanceCount = equipments.filter(eq => eq.status === 'mantenimiento').length;

  return (
    <div className="w-full px-4 py-8">
      {/* Header con estadísticas */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestión de Equipos</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Administra el inventario de equipos de laboratorio
            </p>
          </div>
          {formMode === 'hidden' ? (
            <button 
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
              onClick={() => setFormMode('create')}
            >
              + Nuevo Equipo
            </button>
          ) : (
            <button 
              className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={cancelForm}
            >
              Cancelar
            </button>
          )}
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{equipments.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total equipos</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">{availableCount}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Disponibles</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-red-600">{damagedCount}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Dañados</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-yellow-600">{maintenanceCount}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">En mantenimiento</div>
          </div>
        </div>
      </div>

      {/* Formularios */}
      {formMode === 'create' && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Registrar Nuevo Equipo
          </h2>
          <EquipmentForm 
            onSubmit={handleCreateSubmit} 
            onCancel={cancelForm}
            submitLabel="Registrar Equipo"
          />
        </div>
      )}

      {formMode === 'edit' && editingEquipment && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Editar Equipo
          </h2>
          <EquipmentForm 
            onSubmit={handleEditSubmit} 
            onCancel={cancelForm}
            initialData={editingEquipment}
            submitLabel="Guardar Cambios"
          />
        </div>
      )}

      {formMode === 'damage' && reportingDamageEquipment && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <DamageReportForm 
            equipment={reportingDamageEquipment}
            onSubmit={handleDamageReportSubmit} 
            onCancel={cancelForm}
          />
        </div>
      )}

      {/* Lista de equipos */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Equipos Registrados</h2>
          {damagedCount > 0 && (
            <div className="text-sm text-red-600 dark:text-red-400">
              ⚠️ {damagedCount} equipo{damagedCount > 1 ? 's' : ''} dañado{damagedCount > 1 ? 's' : ''} requiere{damagedCount === 1 ? '' : 'n'} atención
            </div>
          )}
        </div>
        <EquipmentList 
          equipments={equipments} 
          onEdit={handleEdit}
          onDelete={handleDelete}
          onReportDamage={handleReportDamage}
          showAdminActions={true}
        />
      </div>

      <ConfirmModal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar eliminación"
        message="¿Estás seguro de que deseas eliminar este equipo? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        isDanger={true}
      />
    </div>
  );
}
