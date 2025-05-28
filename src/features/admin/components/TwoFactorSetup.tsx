import { useState } from 'react';
import { QrCodeIcon, ShieldCheckIcon, KeyIcon } from '@heroicons/react/24/outline';

interface TwoFactorSetupProps {
  onComplete: (secretKey: string) => void;
  onCancel: () => void;
}

export default function TwoFactorSetup({ onComplete, onCancel }: TwoFactorSetupProps) {
  const [step, setStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Simulamos un secreto 2FA - en producción vendría del backend
  const mockSecret = 'JBSWY3DPEHPK3PXP';
  const mockQRCodeUrl = `otpauth://totp/LabLoan:admin@universidad.edu?secret=${mockSecret}&issuer=LabLoan`;

  const handleVerifyCode = async () => {
    setLoading(true);
    setError('');

    try {
      // Simulamos validación - en producción se enviaría al backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Para demo, aceptamos cualquier código de 6 dígitos
      if (verificationCode.length === 6 && /^\d+$/.test(verificationCode)) {
        onComplete(mockSecret);
      } else {
        throw new Error('Código inválido. Ingresa un código de 6 dígitos.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al verificar el código');
    } finally {
      setLoading(false);
    }
  };

  const backupCodes = [
    '12345678', '87654321', '11223344', '44332211', '56789012'
  ];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div className="mt-3">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 dark:bg-green-900 rounded-full">
            <ShieldCheckIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          
          <div className="mt-4 text-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Configurar Autenticación de Doble Factor
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Agrega una capa extra de seguridad a tu cuenta
            </p>
          </div>

          {step === 1 && (
            <div className="mt-6">
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                <strong>Paso 1:</strong> Escanea este código QR con tu aplicación autenticadora
              </div>
              
              {/* QR Code simulado */}
              <div className="flex justify-center mb-4">
                <div className="bg-white p-4 rounded-lg border-2 border-gray-300">
                  <div className="w-48 h-48 bg-gray-100 flex items-center justify-center">
                    <QrCodeIcon className="w-32 h-32 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-400 mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <strong>Clave manual:</strong> {mockSecret}
                <br />
                <span className="text-xs">Usa esta clave si no puedes escanear el QR</span>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  Aplicaciones recomendadas:
                </p>
                <ul className="text-xs text-gray-500 dark:text-gray-400 list-disc list-inside">
                  <li>Google Authenticator</li>
                  <li>Microsoft Authenticator</li>
                  <li>Authy</li>
                </ul>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                Continuar
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="mt-6">
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                <strong>Paso 2:</strong> Ingresa el código de 6 dígitos de tu aplicación
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Código de verificación
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-center text-2xl tracking-widest dark:bg-gray-700 dark:text-white"
                  placeholder="000000"
                />
              </div>

              {error && (
                <div className="mb-4 text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 px-4 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
                >
                  Atrás
                </button>
                <button
                  onClick={handleVerifyCode}
                  disabled={verificationCode.length !== 6 || loading}
                  className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Verificando...' : 'Verificar'}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="mt-6">
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                <strong>Paso 3:</strong> Guarda estos códigos de respaldo
              </div>

              <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
                <div className="flex items-center mb-2">
                  <KeyIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                  <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Códigos de respaldo
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-1 text-sm font-mono">
                  {backupCodes.map((code, index) => (
                    <div key={index} className="text-yellow-700 dark:text-yellow-300">
                      {code}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                  Guarda estos códigos en un lugar seguro. Los necesitarás si pierdes acceso a tu aplicación autenticadora.
                </p>
              </div>

              <button
                onClick={() => onComplete(mockSecret)}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Completar configuración
              </button>
            </div>
          )}

          <div className="mt-4">
            <button
              onClick={onCancel}
              className="w-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}