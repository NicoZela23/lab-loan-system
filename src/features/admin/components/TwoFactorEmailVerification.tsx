import { useState } from 'react';
import { EnvelopeIcon, ShieldCheckIcon, ClockIcon } from '@heroicons/react/24/outline';
import { auth2FA } from '../../../services/api';

interface TwoFactorEmailVerificationProps {
  email: string;
  onVerified: () => void;
  onCancel: () => void;
}

export default function TwoFactorEmailVerification({ email, onVerified, onCancel }: TwoFactorEmailVerificationProps) {
  const [step, setStep] = useState<'send' | 'verify'>('send');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // Enviar código 2FA por email
  const handleSendCode = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await auth2FA.sendCode(email);
      
      if (response.success) {
        setSuccess(`Código enviado a ${email}`);
        setStep('verify');
        
        // Iniciar contador de tiempo
        const expiresIn = response.data.expiresIn || 600; // 10 minutos por defecto
        setTimeLeft(expiresIn);
        
        const timer = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar código');
    } finally {
      setLoading(false);
    }
  };

  // Verificar código 2FA
  const handleVerifyCode = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await auth2FA.verifyCode(email, verificationCode);
      
      if (response.success) {
        setSuccess('¡Código verificado exitosamente!');
        setTimeout(() => {
          onVerified();
        }, 1500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al verificar código');
    } finally {
      setLoading(false);
    }
  };

  // Formatear tiempo restante
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div className="mt-3">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-blue-100 dark:bg-blue-900 rounded-full">
            <ShieldCheckIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          
          <div className="mt-4 text-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Verificación de Doble Factor
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Verificación por Email - Demo Administrador
            </p>
          </div>

          {step === 'send' && (
            <div className="mt-6">
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center mb-2">
                  <EnvelopeIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Email de Demo Autorizado
                  </span>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {email}
                </p>
              </div>

              <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>⚠️ Modo Demo:</strong> Se enviará un código real de 6 dígitos a tu correo electrónico para probar el sistema 2FA.
                </p>
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Haz clic para recibir un código de verificación en tu email. El código será válido por 10 minutos.
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                  <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
                  <p className="text-sm text-green-800 dark:text-green-200">{success}</p>
                </div>
              )}

              <button
                onClick={handleSendCode}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando código...
                  </>
                ) : (
                  <>
                    <EnvelopeIcon className="w-5 h-5 mr-2" />
                    Enviar Código 2FA
                  </>
                )}
              </button>
            </div>
          )}

          {step === 'verify' && (
            <div className="mt-6">
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
                <p className="text-sm text-green-800 dark:text-green-200">
                  ✅ Código enviado a: <strong>{email}</strong>
                </p>
              </div>

              {timeLeft > 0 && (
                <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded">
                  <div className="flex items-center">
                    <ClockIcon className="w-4 h-4 text-orange-600 dark:text-orange-400 mr-2" />
                    <span className="text-sm text-orange-800 dark:text-orange-200">
                      Código válido por: <strong>{formatTime(timeLeft)}</strong>
                    </span>
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Código de verificación (6 dígitos)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-md text-center text-2xl tracking-widest dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="000000"
                  autoFocus
                />
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                  <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
                  <p className="text-sm text-green-800 dark:text-green-200">{success}</p>
                </div>
              )}

              <div className="flex space-x-3 mb-4">
                <button
                  onClick={() => {
                    setStep('send');
                    setVerificationCode('');
                    setError('');
                  }}
                  className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 px-4 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
                  disabled={loading}
                >
                  Reenviar Código
                </button>
                <button
                  onClick={handleVerifyCode}
                  disabled={verificationCode.length !== 6 || loading || timeLeft === 0}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Verificando...' : 'Verificar'}
                </button>
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Revisa tu bandeja de entrada y carpeta de spam
              </div>
            </div>
          )}

          <div className="mt-4">
            <button
              onClick={onCancel}
              className="w-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm"
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}