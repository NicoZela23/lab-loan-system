import { useState } from 'react';
import { 
  ShieldExclamationIcon, 
  CheckCircleIcon, 
  XMarkIcon,
  QrCodeIcon,
  KeyIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';

export default function TwoFactorSettingsPage() {
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Códigos de respaldo simulados para demostración
  const mockBackupCodes = [
    '12345-67890',
    '09876-54321',
    '11111-22222',
    '33333-44444',
    '55555-66666',
    '77777-88888',
    '99999-00000',
    '12321-45654'
  ];

  const handleEnableTwoFA = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Simular generación de QR y configuración
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setShowQRCode(true);
      setBackupCodes(mockBackupCodes);
      setSuccess('Código QR generado. Escanéalo con tu aplicación de autenticación.');
    } catch (err) {
      setError('Error al configurar 2FA. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndEnable = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Simular verificación del código
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (verificationCode !== '123456') {
        throw new Error('Código de verificación inválido');
      }

      setTwoFAEnabled(true);
      setShowQRCode(false);
      setShowBackupCodes(true);
      setVerificationCode('');
      setSuccess('¡2FA activado exitosamente! Guarda tus códigos de respaldo en un lugar seguro.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al verificar el código');
    } finally {
      setLoading(false);
    }
  };

  const handleDisableTwoFA = async () => {
    if (!confirm('¿Estás seguro de que quieres desactivar la autenticación de doble factor? Esto reducirá la seguridad de tu cuenta.')) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTwoFAEnabled(false);
      setShowQRCode(false);
      setShowBackupCodes(false);
      setBackupCodes([]);
      setSuccess('2FA desactivado correctamente.');
    } catch (err) {
      setError('Error al desactivar 2FA. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const generateNewBackupCodes = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCodes = mockBackupCodes.map(() => 
        Math.random().toString(36).substr(2, 5).toUpperCase() + '-' + 
        Math.random().toString(36).substr(2, 5).toUpperCase()
      );
      
      setBackupCodes(newCodes);
      setShowBackupCodes(true);
      setSuccess('Nuevos códigos de respaldo generados. Los códigos anteriores ya no son válidos.');
    } catch (err) {
      setError('Error al generar nuevos códigos de respaldo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <ShieldExclamationIcon className="h-8 w-8 mr-3 text-primary-600" />
            Configuración de Autenticación de Doble Factor
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Mejora la seguridad de tu cuenta administrativa con autenticación de doble factor (2FA)
          </p>
        </div>

        {/* Mensajes de estado */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
            <div className="flex">
              <XMarkIcon className="h-5 w-5 text-red-400 mt-0.5" />
              <div className="ml-3">
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4">
            <div className="flex">
              <CheckCircleIcon className="h-5 w-5 text-green-400 mt-0.5" />
              <div className="ml-3">
                <p className="text-sm text-green-800 dark:text-green-200">{success}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Panel principal de configuración */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Estado de 2FA
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {twoFAEnabled ? 'La autenticación de doble factor está activada' : 'La autenticación de doble factor está desactivada'}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                twoFAEnabled 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
              }`}>
                {twoFAEnabled ? 'Activado' : 'Desactivado'}
              </div>
            </div>

            {!twoFAEnabled && !showQRCode && (
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
                  <div className="flex">
                    <ShieldExclamationIcon className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        ¿Por qué activar 2FA?
                      </h3>
                      <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                        La autenticación de doble factor añade una capa extra de seguridad a tu cuenta administrativa, 
                        requiriendo tanto tu contraseña como un código temporal generado por tu dispositivo móvil.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleEnableTwoFA}
                  disabled={loading}
                  className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {loading ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <>
                      <ShieldExclamationIcon className="h-5 w-5 mr-2" />
                      Activar Autenticación 2FA
                    </>
                  )}
                </button>
              </div>
            )}

            {showQRCode && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300 inline-block">
                    <QrCodeIcon className="h-32 w-32 text-gray-400 mx-auto" />
                    <p className="mt-2 text-sm text-gray-600">Código QR simulado</p>
                    <p className="text-xs text-gray-500">En producción, aquí aparecería el QR real</p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Instrucciones:
                  </h3>
                  <ol className="text-sm text-gray-600 dark:text-gray-300 space-y-1 list-decimal list-inside">
                    <li>Descarga una app de autenticación (Google Authenticator, Authy, etc.)</li>
                    <li>Escanea el código QR con la aplicación</li>
                    <li>Ingresa el código de 6 dígitos que aparece en tu app</li>
                    <li>Haz clic en "Verificar y Activar"</li>
                  </ol>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="verification-code" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Código de verificación
                    </label>
                    <input
                      id="verification-code"
                      type="text"
                      maxLength={6}
                      pattern="[0-9]{6}"
                      placeholder="123456"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-center font-mono text-lg"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Para demostración, usa el código: <span className="font-mono font-bold">123456</span>
                    </p>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setShowQRCode(false);
                        setVerificationCode('');
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleVerifyAndEnable}
                      disabled={loading || verificationCode.length !== 6}
                      className="flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                    >
                      {loading ? 'Verificando...' : 'Verificar y Activar'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {twoFAEnabled && (
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4">
                  <div className="flex">
                    <CheckCircleIcon className="h-5 w-5 text-green-400 mt-0.5" />
                    <div className="ml-3">
                      <p className="text-sm text-green-800 dark:text-green-200">
                        Tu cuenta está protegida con autenticación de doble factor. 
                        Se requerirá un código de verificación cada vez que inicies sesión.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={generateNewBackupCodes}
                    disabled={loading}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <KeyIcon className="h-4 w-4 mr-2 inline" />
                    Generar Nuevos Códigos de Respaldo
                  </button>
                  <button
                    onClick={handleDisableTwoFA}
                    disabled={loading}
                    className="flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Desactivar 2FA
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Panel de información y códigos de respaldo */}
          <div className="space-y-6">
            {/* Información sobre aplicaciones compatibles */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <DevicePhoneMobileIcon className="h-5 w-5 mr-2" />
                Aplicaciones Recomendadas
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Google Authenticator</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">iOS / Android</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Authy</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">iOS / Android / Desktop</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Microsoft Authenticator</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">iOS / Android</span>
                </div>
              </div>
            </div>

            {/* Códigos de respaldo */}
            {showBackupCodes && backupCodes.length > 0 && (
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <KeyIcon className="h-5 w-5 mr-2" />
                  Códigos de Respaldo
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Guarda estos códigos en un lugar seguro. Puedes usarlos para acceder a tu cuenta si pierdes acceso a tu dispositivo de autenticación.
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                  <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                    {backupCodes.map((code, index) => (
                      <div key={index} className="p-2 bg-white dark:bg-gray-800 rounded border text-center">
                        {code}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3">
                  <p className="text-xs text-yellow-800 dark:text-yellow-200">
                    <strong>Importante:</strong> Cada código solo se puede usar una vez. Una vez que uses un código de respaldo, 
                    no funcionará nuevamente. Asegúrate de generar nuevos códigos cuando se agoten.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}