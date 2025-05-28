import { useState } from 'react';
import { Equipment, EquipmentFormData } from '../../../types/equipment';
import EquipmentForm from '../components/EquipmentForm';
import EquipmentList from '../components/EquipmentList';
import ConfirmModal from '../../../components/modals/ConfirmModal';

type FormMode = 'create' | 'edit' | 'hidden';

export default function EquipmentPage() {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [formMode, setFormMode] = useState<FormMode>('hidden');
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState<number | null>(null);

  const handleCreateSubmit = (data: EquipmentFormData) => {
    // Generate a new ID (in a real app, the backend would handle this)
    const newEquipment: Equipment = {
      ...data,
      id: Date.now(), // Simple way to generate unique IDs for demo purposes
    };

    setEquipments([...equipments, newEquipment]);
    setFormMode('hidden');
  };

  const handleEditSubmit = (data: EquipmentFormData) => {
    if (!editingEquipment) return;
    
    const updatedEquipments = equipments.map(equipment => 
      equipment.id === editingEquipment.id 
        ? { ...data, id: editingEquipment.id } 
        : equipment
    );
    
    setEquipments(updatedEquipments);
    setEditingEquipment(null);
    setFormMode('hidden');
  };

  const handleEdit = (equipment: Equipment) => {
    setEditingEquipment(equipment);
    setFormMode('edit');
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
  };

  return (
    <div className="w-full px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white dark:text-white">Equipos de Laboratorio</h1>
        {formMode === 'hidden' ? (
          <button 
            className="btn-primary flex items-center"
            onClick={() => setFormMode('create')}
          >
            Nuevo Equipo
          </button>
        ) : (
          <button 
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            onClick={cancelForm}
          >
            Cancelar
          </button>
        )}
      </div>

      {formMode !== 'hidden' && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            {formMode === 'create' ? 'Registrar Nuevo Equipo' : 'Editar Equipo'}
          </h2>
          <EquipmentForm 
            onSubmit={formMode === 'create' ? handleCreateSubmit : handleEditSubmit} 
            onCancel={cancelForm}
            initialData={formMode === 'edit' ? editingEquipment : undefined}
            submitLabel={formMode === 'create' ? 'Registrar Equipo' : 'Guardar Cambios'}
          />
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-white dark:text-white">Equipos Registrados</h2>
        <EquipmentList 
          equipments={equipments} 
          onEdit={handleEdit}
          onDelete={handleDelete}
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
