import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardDocumentCheckIcon, ShieldExclamationIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('teacher'); // Por defecto, rol de docente
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para 2FA
  const [showTwoFA, setShowTwoFA] = useState(false);
  const [twoFACode, setTwoFACode] = useState('');
  const [twoFALoading, setTwoFALoading] = useState(false);
  const [pendingAuthData, setPendingAuthData] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Simulamos la autenticación (en producción, esto se conectaría al backend)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Validación simple
      if (!email || !password) {
        throw new Error('Por favor ingresa tu email y contraseña');
      }

      // Si es administrador, requiere 2FA
      if (role === 'admin') {
        // Guardar datos de autenticación pendientes
        setPendingAuthData({
          email,
          role,
          name: 'Administrador del Sistema',
          isAuthenticated: true
        });
        
        // Mostrar pantalla de 2FA
        setShowTwoFA(true);
        setLoading(false);
        return;
      }

      // Para otros roles, continuar con autenticación normal
      // Almacenar información de sesión en localStorage (simplificado)
      localStorage.setItem('labLoanUser', JSON.stringify({
        email,
        role,
        name: role === 'teacher' ? 'Dr. José Martínez' : 'Estudiante',
        isAuthenticated: true
      }));      // Redirigir según el rol
      if (role === 'teacher') {
        navigate('/teacher/pending-loans');
      } else if (role === 'student') {
        navigate('/student/materials');
      } else if (role === 'admin') {
        navigate('/admin');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error durante el inicio de sesión');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTwoFASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTwoFALoading(true);
    setError(null);

    try {
      // Simulamos la verificación 2FA
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Códigos válidos para demostración
      const validCodes = ['123456', '000000']; // 123456 = código normal, 000000 = código de emergencia
      
      if (!validCodes.includes(twoFACode)) {
        throw new Error('Código de verificación inválido. Inténtalo de nuevo.');
      }      // Si el código es válido, completar autenticación
      localStorage.setItem('labLoanUser', JSON.stringify(pendingAuthData));
      
      // Redirigir según el rol
      if (pendingAuthData.role === 'admin') {
        navigate('/admin');
      } else if (pendingAuthData.role === 'teacher') {
        navigate('/teacher/pending-loans');
      } else if (pendingAuthData.role === 'student') {
        navigate('/student/materials');
      }
      
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error al verificar el código 2FA');
      }
    } finally {
      setTwoFALoading(false);
    }
  };

  const handleBackToLogin = () => {
    setShowTwoFA(false);
    setTwoFACode('');
    setPendingAuthData(null);
    setError(null);
  };

  // Render de la pantalla 2FA
  if (showTwoFA) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="flex justify-center">
              <ShieldExclamationIcon className="h-16 w-16 text-primary-600" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
              Verificación de Doble Factor
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Ingresa el código de 6 dígitos para completar el inicio de sesión
            </p>
            <p className="mt-1 text-center text-xs text-gray-500 dark:text-gray-500">
              Código de demo: <span className="font-mono font-bold">123456</span> o <span className="font-mono font-bold">000000</span>
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleTwoFASubmit}>
            <div>
              <label htmlFor="twofa-code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Código de verificación
              </label>
              <input
                id="twofa-code"
                name="twofa-code"
                type="text"
                maxLength={6}
                pattern="[0-9]{6}"
                autoComplete="one-time-code"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 text-center text-2xl font-mono tracking-widest"
                placeholder="000000"
                value={twoFACode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setTwoFACode(value);
                }}
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Ingresa el código de 6 dígitos enviado a tu dispositivo de autenticación
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handleBackToLogin}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Volver
              </button>
              <button
                type="submit"
                disabled={twoFALoading || twoFACode.length !== 6}
                className={`w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${(twoFALoading || twoFACode.length !== 6) ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {twoFALoading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'Verificar Código'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <InformationCircleIcon className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Información de demostración:</strong><br />
                    • Código normal: <span className="font-mono">123456</span><br />
                    • Código de emergencia: <span className="font-mono">000000</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render normal del login
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <ClipboardDocumentCheckIcon className="h-16 w-16 text-primary-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Sistema de Préstamo de Laboratorio
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Ingresa tus credenciales para acceder al sistema
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email o ID de Usuario</label>
              <input
                id="email"
                name="email"
                type="text"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Email o ID de Usuario"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-3">
                Rol:
              </label>
              <select
                id="role"
                name="role"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="teacher">Docente</option>
                <option value="student">Estudiante</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Iniciar sesión'
              )}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                O prueba con las credenciales de demostración
              </span>
            </div>
          </div>          <div className="mt-4 grid grid-cols-1 gap-3">
            <button
              type="button"
              onClick={() => {
                setEmail('estudiante@universidad.edu');
                setPassword('estudiante123');
                setRole('student');
              }}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Acceder como Estudiante (Demo)
            </button>
            
            <button
              type="button"
              onClick={() => {
                setEmail('docente@universidad.edu');
                setPassword('docente123');
                setRole('teacher');
              }}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Acceder como Docente (Demo)
            </button>
            
            <button
              type="button"
              onClick={() => {
                setEmail('admin@universidad.edu');
                setPassword('admin123');
                setRole('admin');
              }}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Acceder como Administrador (Demo)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}