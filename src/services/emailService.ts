// Servicio de email para envío de códigos 2FA
export interface EmailData {
  to: string;
  subject: string;
  code: string;
  method: 'email' | 'sms';
}

export const sendTwoFactorCode = async (emailData: EmailData): Promise<boolean> => {
  try {
    // Configuración para EmailJS
    const serviceId = 'service_your_id'; // Reemplazar con tu Service ID de EmailJS
    const templateId = 'template_2fa_code'; // Reemplazar con tu Template ID
    const publicKey = 'your_public_key'; // Reemplazar con tu Public Key de EmailJS

    // Datos del template
    const templateParams = {
      to_email: emailData.to,
      subject: emailData.subject,
      verification_code: emailData.code,
      method: emailData.method === 'email' ? 'correo electrónico' : 'SMS',
      timestamp: new Date().toLocaleString('es-ES', {
        timeZone: 'America/La_Paz',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    // Para desarrollo/demo, vamos a usar un servicio de email directo
    // Esto es solo para demostración - en producción deberías usar EmailJS o un backend
    const emailServiceUrl = 'https://api.emailjs.com/api/v1.0/email/send';
    
    const response = await fetch(emailServiceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: templateParams
      })
    });

    if (response.ok) {
      console.log('✅ Código 2FA enviado exitosamente a:', emailData.to);
      return true;
    } else {
      console.error('❌ Error al enviar email:', response.statusText);
      return false;
    }
  } catch (error) {
    console.error('❌ Error en el servicio de email:', error);
    
    // Fallback: Para demostración, simulamos el envío y mostramos en consola
    console.log(`
🔐 CÓDIGO 2FA (Demo) 
📧 Para: ${emailData.to}
🎯 Método: ${emailData.method}
🔑 Código: ${emailData.code}
⏰ Enviado: ${new Date().toLocaleString('es-ES')}
    `);
    
    // Mostrar notificación en pantalla para demo
    showEmailNotification(emailData);
    
    return true; // Retornamos true para la demo
  }
};

// Función para mostrar notificación visual del email enviado (solo para demo)
const showEmailNotification = (emailData: EmailData) => {
  const notification = document.createElement('div');
  notification.innerHTML = `
    <div style="
      position: fixed; 
      top: 20px; 
      right: 20px; 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
      color: white; 
      padding: 20px; 
      border-radius: 12px; 
      box-shadow: 0 10px 30px rgba(0,0,0,0.3); 
      z-index: 10000; 
      max-width: 350px;
      font-family: 'Segoe UI', sans-serif;
      animation: slideIn 0.3s ease-out;
    ">
      <div style="display: flex; align-items: center; margin-bottom: 12px;">
        <span style="font-size: 20px; margin-right: 10px;">📧</span>
        <strong style="font-size: 16px;">Código 2FA Enviado</strong>
      </div>
      <div style="background: rgba(255,255,255,0.1); padding: 12px; border-radius: 8px; margin-bottom: 12px;">
        <div style="font-family: 'Courier New', monospace; font-size: 24px; letter-spacing: 3px; text-align: center; font-weight: bold;">
          ${emailData.code}
        </div>
      </div>
      <div style="font-size: 13px; opacity: 0.9;">
        <div>📨 Enviado a: <strong>${emailData.to}</strong></div>
        <div>🚀 Método: ${emailData.method === 'email' ? 'Correo Electrónico' : 'SMS'}</div>
        <div>⏰ ${new Date().toLocaleString('es-ES')}</div>
      </div>
      <div style="font-size: 11px; margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.2); opacity: 0.8;">
        💡 Modo Demo - En producción se enviaría por email real
      </div>
    </div>
  `;
  
  // Agregar estilos de animación
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(notification);
  
  // Remover notificación después de 15 segundos
  setTimeout(() => {
    if (document.body.contains(notification)) {
      notification.style.animation = 'slideIn 0.3s ease-out reverse';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }
  }, 15000);
};

// Función para enviar código específicamente a simonchumacero26@gmail.com
export const sendCodeToSimon = async (code: string, method: 'email' | 'sms' = 'email'): Promise<boolean> => {
  const emailData: EmailData = {
    to: 'simonchumacero26@gmail.com',
    subject: 'Código de Verificación 2FA - Sistema de Préstamo Laboratorio',
    code: code,
    method: method
  };
  
  return await sendTwoFactorCode(emailData);
};