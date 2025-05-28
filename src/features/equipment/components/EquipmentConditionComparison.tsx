import { EquipmentConditionRecord } from '../../../types/equipment';

interface EquipmentConditionComparisonProps {
  initialCondition: EquipmentConditionRecord;
  title?: string;
}

// Mapa de colores para cada estado de condición
const conditionColors = {
  'excelente': 'text-green-600 dark:text-green-400',
  'bueno': 'text-blue-600 dark:text-blue-400',
  'regular': 'text-yellow-600 dark:text-yellow-400',
  'deficiente': 'text-red-600 dark:text-red-400'
};

// Componente para mostrar el estado inicial del equipo al momento de realizar la devolución
export default function EquipmentConditionComparison({ 
  initialCondition,
  title = "Estado inicial del equipo"
}: EquipmentConditionComparisonProps) {
  // Formatear la fecha de registro
  const formattedDate = initialCondition.recordedAt.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
      <h3 className="text-base font-medium text-gray-900 dark:text-white mb-3">
        {title}
      </h3>
      
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Estado:</span>
            <span className={`text-sm font-medium ${conditionColors[initialCondition.condition]}`}>
              {initialCondition.condition.charAt(0).toUpperCase() + initialCondition.condition.slice(1)}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {initialCondition.observations}
          </p>
        </div>
        
        {initialCondition.imageUrls && initialCondition.imageUrls.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Documentación fotográfica:
            </p>
            <div className="grid grid-cols-3 gap-2">
              {initialCondition.imageUrls.map((url, index) => (
                <div key={index} className="relative aspect-square">
                  <img 
                    src={url} 
                    alt={`Estado inicial ${index + 1}`}
                    className="h-full w-full object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Registrado por {initialCondition.recordedBy.name} el {formattedDate}
          </p>
        </div>
      </div>
    </div>
  );
}