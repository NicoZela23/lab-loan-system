import { 
  UserGroupIcon, 
  ShieldExclamationIcon, 
  ClockIcon,
  DocumentCheckIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

// Tarjeta de información con estadísticas
const StatCard = ({ title, value, icon: Icon, color, linkTo }: { 
  title: string; 
  value: string | number; 
  icon: any; 
  color: string;
  linkTo: string;
}) => (
  <Link to={linkTo} className="block">
    <div className={`bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border-l-4 ${color} transition-transform hover:scale-105`}>
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900 dark:text-white">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  </Link>
);

export default function AdminDashboard() {
  // Estadísticas de ejemplo (en una aplicación real, estas vendrían del backend)
  const stats = {
    totalUsers: 256,
    activePenalties: 12,
    pendingReturns: 38,
    lateReturns: 7
  };

  return (
    <div>
      <div className="pb-5 border-b border-gray-200 dark:border-gray-700 mb-6">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl">
          Panel de Control
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Gestión y monitoreo del sistema de préstamos de laboratorio
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Usuarios Totales"
          value={stats.totalUsers}
          icon={UserGroupIcon}
          color="border-blue-500"
          linkTo="/admin/users"
        />
        
        <StatCard
          title="Sanciones Activas"
          value={stats.activePenalties}
          icon={ShieldExclamationIcon}
          color="border-red-500"
          linkTo="/admin/active-penalties"
        />
        
        <StatCard
          title="Devoluciones Pendientes"
          value={stats.pendingReturns}
          icon={ClockIcon}
          color="border-yellow-500"
          linkTo="/admin/loan-history"
        />
        
        <StatCard
          title="Devoluciones con Retraso"
          value={stats.lateReturns}
          icon={DocumentCheckIcon}
          color="border-purple-500"
          linkTo="/admin/loan-history"
        />
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Panel de Sanciones Recientes */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Sanciones Recientes
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                Últimas sanciones aplicadas a estudiantes
              </p>
            </div>
            <Link 
              to="/admin/active-penalties"
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 dark:text-indigo-200 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-900/50"
            >
              Ver todas
            </Link>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {/* Sanciones de ejemplo */}
              <li className="px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">CP</span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        Carlos Pérez
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        7 días por retraso en devolución
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Hace 2 días
                  </div>
                </div>
              </li>
              <li className="px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">ML</span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        María López
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        15 días por daño en equipo
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Hace 5 días
                  </div>
                </div>
              </li>
              <li className="px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">JG</span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        Juan González
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        3 días por retraso en devolución
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Hace 1 semana
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Panel de Acciones Rápidas */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Acciones Rápidas
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Acciones administrativas comunes
            </p>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Link
                to="/admin/penalty-settings"
                className="inline-flex items-center justify-center px-4 py-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Cog6ToothIcon className="h-5 w-5 mr-2" />
                Configurar Sanciones
              </Link>
              <Link
                to="/admin/active-penalties"
                className="inline-flex items-center justify-center px-4 py-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <ShieldExclamationIcon className="h-5 w-5 mr-2" />
                Gestionar Sanciones
              </Link>
              <Link
                to="/admin/users"
                className="inline-flex items-center justify-center px-4 py-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <UserGroupIcon className="h-5 w-5 mr-2" />
                Gestionar Usuarios
              </Link>
              <Link
                to="/admin/loan-history"
                className="inline-flex items-center justify-center px-4 py-4 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                <ClockIcon className="h-5 w-5 mr-2" />
                Ver Historial
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}