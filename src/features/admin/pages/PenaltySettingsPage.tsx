import { useState } from 'react';
import { Cog6ToothIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

type PenaltyRule = {
  id: string;
  days: number;
  penaltyDays: number;
  description: string;
  isActive: boolean;
};

export default function PenaltySettingsPage() {
  // Estado para almacenar las reglas de sanciones
  const [penaltyRules, setPenaltyRules] = useState<PenaltyRule[]>([
    {
      id: '1',
      days: 1,
      penaltyDays: 3,
      description: 'Retraso de 1 día en la devolución',
      isActive: true
    },
    {
      id: '2',
      days: 3,
      penaltyDays: 7,
      description: 'Retraso de 3 días en la devolución',
      isActive: true
    },
    {
      id: '3',
      days: 7,
      penaltyDays: 15,
      description: 'Retraso de 7 días en la devolución',
      isActive: true
    }
  ]);

  // Estado para el formulario de nueva regla
  const [newRule, setNewRule] = useState({
    days: 0,
    penaltyDays: 0,
    description: ''
  });

  // Estado para controlar la activación automática de sanciones
  const [autoApplyPenalties, setAutoApplyPenalties] = useState(true);

  // Función para añadir una nueva regla
  const handleAddRule = () => {
    if (newRule.days > 0 && newRule.penaltyDays > 0 && newRule.description) {
      const rule: PenaltyRule = {
        id: Date.now().toString(),
        days: newRule.days,
        penaltyDays: newRule.penaltyDays,
        description: newRule.description,
        isActive: true
      };
      
      setPenaltyRules([...penaltyRules, rule]);
      
      // Reiniciar el formulario
      setNewRule({
        days: 0,
        penaltyDays: 0,
        description: ''
      });
    }
  };

  // Función para eliminar una regla
  const handleDeleteRule = (id: string) => {
    setPenaltyRules(penaltyRules.filter(rule => rule.id !== id));
  };

  // Función para activar/desactivar una regla
  const handleToggleRule = (id: string) => {
    setPenaltyRules(
      penaltyRules.map(rule => 
        rule.id === id ? { ...rule, isActive: !rule.isActive } : rule
      )
    );
  };

  // Función para guardar la configuración
  const handleSaveSettings = () => {
    // Aquí se implementaría la lógica para enviar la configuración al backend
    alert('Configuración guardada con éxito');
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white flex items-center">
            <Cog6ToothIcon className="h-6 w-6 mr-2 text-gray-500 dark:text-gray-400" />
            Configuración de Sanciones Automáticas
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Define las reglas para aplicar sanciones por retrasos en devoluciones
          </p>
        </div>
        <button
          type="button"
          onClick={handleSaveSettings}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Guardar Configuración
        </button>
      </div>

      {/* Toggle para activar/desactivar sanciones automáticas */}
      <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-gray-700/30 border-t border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-base font-medium text-gray-900 dark:text-white">
              Aplicación automática de sanciones
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Al activar esta opción, el sistema aplicará sanciones automáticamente cuando se detecten retrasos
            </p>
          </div>
          <div className="ml-4 flex items-center">
            <button
              type="button"
              onClick={() => setAutoApplyPenalties(!autoApplyPenalties)}
              className={`${
                autoApplyPenalties 
                  ? 'bg-primary-600' 
                  : 'bg-gray-200 dark:bg-gray-700'
              } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
            >
              <span className="sr-only">Activar sanciones automáticas</span>
              <span
                className={`${
                  autoApplyPenalties 
                    ? 'translate-x-5' 
                    : 'translate-x-0'
                } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
              />
            </button>
            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-white">
              {autoApplyPenalties ? 'Activado' : 'Desactivado'}
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 py-5 sm:px-6">
        <h4 className="text-base font-medium text-gray-900 dark:text-white mb-4">
          Reglas de sanciones por retraso
        </h4>
        
        {/* Tabla de reglas */}
        <div className="mt-4 flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 dark:border-gray-700 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Días de retraso
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Días de sanción
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Descripción
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Estado
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Acciones</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {penaltyRules.map((rule) => (
                      <tr key={rule.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {rule.days} {rule.days === 1 ? 'día' : 'días'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {rule.penaltyDays} {rule.penaltyDays === 1 ? 'día' : 'días'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {rule.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleToggleRule(rule.id)}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              rule.isActive
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                            }`}
                          >
                            {rule.isActive ? 'Activa' : 'Inactiva'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleDeleteRule(rule.id)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario para añadir nueva regla */}
      <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-base font-medium text-gray-900 dark:text-white mb-4">
          Añadir nueva regla
        </h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="days" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Días de retraso
            </label>
            <div className="mt-1">
              <input
                type="number"
                min="1"
                name="days"
                id="days"
                value={newRule.days || ''}
                onChange={(e) => setNewRule({...newRule, days: parseInt(e.target.value) || 0})}
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md"
              />
            </div>
          </div>
          <div>
            <label htmlFor="penaltyDays" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Días de sanción
            </label>
            <div className="mt-1">
              <input
                type="number"
                min="1"
                name="penaltyDays"
                id="penaltyDays"
                value={newRule.penaltyDays || ''}
                onChange={(e) => setNewRule({...newRule, penaltyDays: parseInt(e.target.value) || 0})}
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md"
              />
            </div>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Descripción
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="description"
                id="description"
                value={newRule.description}
                onChange={(e) => setNewRule({...newRule, description: e.target.value})}
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md"
              />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <button
            type="button"
            onClick={handleAddRule}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Añadir regla
          </button>
        </div>
      </div>
    </div>
  );
}