import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheckIcon, ClockIcon, DevicePhoneMobileIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { sendCodeToSimon } from '../../../services/emailService';

interface TwoFactorVerificationProps {
  email: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function TwoFactorVerification({ email, onSuccess, onCancel }: TwoFactorVerificationProps) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [method, setMethod] = useState<'sms' | 'email'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutos
  const [canResend, setCanResend] = useState(false);
  const [correctCode, setCorrectCode] = useState('');

  // Generar código aleatorio para simular el 2FA
  useEffect(() => {
    const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();
    const newCode = generateCode();
    setCorrectCode(newCode);
    
    // Enviar código al correo especificado usando el servicio de email
    sendCodeToSimon(newCode, method).then(() => {
      console.log(`🔐 Código 2FA enviado a simonchumacero26@gmail.com: ${newCode}`);
    }).catch((error) => {
      console.error('Error enviando código:', error);
    });
    
    // Mostrar notificación temporal con el código (para demo y desarrollo)
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="position: fixed; top: 20px; right: 20px; background: #1f2937; color: white; padding: 16px; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); z-index: 1000; max-width: 300px;">
        <div style="display: flex; align-items: center; margin-bottom: 8px;">
          <span style="margin-right: 8px;">📱</span>
          <strong>Código 2FA Enviado</strong>
        </div>
        <div style="font-family: monospace; font-size: 18px; letter-spacing: 2px; background: #374151; padding: 8px; border-radius: 4px; text-align: center;">
          ${newCode}
        </div>
        <div style="font-size: 12px; color: #9ca3af; margin-top: 8px;">
          Enviado a: simonchumacero26@gmail.com
        </div>
        <div style="font-size: 12px; color: #9ca3af;">
          Método: ${method === 'email' ? 'Email' : 'SMS'}
        </div>
      </div>
    `;
    document.body.appendChild(notification);
    
    // Remover notificación después de 10 segundos
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 10000);
  }, [method]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      
      // Auto-focus siguiente input
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        nextInput?.focus();
      }
      
      // Verificar automáticamente cuando se complete el código
      if (newCode.every(digit => digit !== '') && newCode.join('').length === 6) {
        setTimeout(() => handleVerify(newCode.join('')), 100);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = async (codeToVerify?: string) => {
    const verificationCode = codeToVerify || code.join('');
    
    if (verificationCode.length !== 6) {
      setError('Por favor, ingresa el código completo de 6 dígitos');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simular verificación
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (verificationCode === correctCode) {
        onSuccess();
      } else {
        setError('Código incorrecto. Por favor, intenta nuevamente.');
        setCode(['', '', '', '', '', '']);
        document.getElementById('code-0')?.focus();
      }
    } catch (err) {
      setError('Error al verificar el código. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setTimeLeft(300);
    setCanResend(false);
    setCode(['', '', '', '', '', '']);
    setError(null);
    
    // Generar nuevo código
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setCorrectCode(newCode);
    
    // Enviar nuevo código al correo especificado
    try {
      await sendCodeToSimon(newCode, method);
      console.log(`🔐 Nuevo código 2FA enviado a simonchumacero26@gmail.com: ${newCode}`);
    } catch (error) {
      console.error('Error reenviando código:', error);
    }
    
    document.getElementById('code-0')?.focus();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, '$1***$3');
  const maskedPhone = '+591 *** ** 789'; // Número simulado

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <ShieldCheckIcon className="mx-auto h-16 w-16 text-primary-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Verificación en Dos Pasos
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Por seguridad, necesitamos verificar tu identidad
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6">
          {/* Método de verificación */}
          <div>
            <label className="text-base font-medium text-gray-900 dark:text-white">
              Método de verificación
            </label>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              El código se enviará a simonchumacero26@gmail.com
            </p>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  id="email-method"
                  name="verification-method"
                  type="radio"
                  checked={method === 'email'}
                  onChange={() => setMethod('email')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <label htmlFor="email-method" className="ml-3 flex items-center">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Correo electrónico
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      simonchumacero26@gmail.com
                    </div>
                  </div>
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="sms-method"
                  name="verification-method"
                  type="radio"
                  checked={method === 'sms'}
                  onChange={() => setMethod('sms')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <label htmlFor="sms-method" className="ml-3 flex items-center">
                  <DevicePhoneMobileIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Mensaje de texto (SMS)
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {maskedPhone}
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Campo de código */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Código de verificación
            </label>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Ingresa el código de 6 dígitos enviado a simonchumacero26@gmail.com
            </p>
            
            <div className="flex space-x-2 justify-center">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-lg font-mono border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  autoComplete="off"
                />
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* Timer y reenvío */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <ClockIcon className="h-4 w-4 mr-1" />
              <span>Expira en {formatTime(timeLeft)}</span>
            </div>
            
            {canResend ? (
              <button
                onClick={handleResendCode}
                className="text-primary-600 hover:text-primary-500 font-medium"
              >
                Reenviar código
              </button>
            ) : (
              <span className="text-gray-400">Reenviar código</span>
            )}
          </div>

          {/* Botones */}
          <div className="flex space-x-3">
            <button
              onClick={() => handleVerify()}
              disabled={loading || code.some(digit => !digit)}
              className={`flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                loading || code.some(digit => !digit) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verificando...
                </div>
              ) : (
                'Verificar'
              )}
            </button>
            
            <button
              onClick={onCancel}
              className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancelar
            </button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            ¿Problemas para acceder? Contacta al administrador del sistema
          </p>
        </div>
      </div>
    </div>
  );
}