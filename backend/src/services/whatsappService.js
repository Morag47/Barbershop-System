import twilioClient from '../config/twilioConfig.js';
import moment from 'moment-timezone';

const timezone = process.env.TIMEZONE || 'America/Bogota';
const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER;
const barberiaWhatsAppNumber = process.env.BARBERIA_WHATSAPP_NUMBER;

export async function enviarRecordatorioWhatsApp(cita) {
    if (!twilioClient) {
        console.warn('Twilio no está configurado. No se puede enviar WhatsApp.');
        return null;
    }

    const fechaFormateada = moment.tz(cita.fecha, timezone).format('dddd, D [de] MMMM');
    const horaFormateada = moment.tz(`${cita.fecha} ${cita.hora}`, timezone).format('h:mm A');

    const mensaje = `
🔔 *Recordatorio de Cita - Barbería Elite*

Hola *${cita.cliente_nombre}*! 👋

Te recordamos que tienes una cita programada:

📅 *Fecha:* ${fechaFormateada}
🕐 *Hora:* ${horaFormateada}
✂️ *Servicio:* ${cita.servicio_nombre}
👤 *Barbero:* ${cita.empleado_nombre}

¿Confirmas tu asistencia? 
Por favor responde a este mensaje para confirmar o si necesitas cancelar.

📍 Barbería Elite - Bogotá
    `.trim();

    try {
        // Formatear número de teléfono del cliente
        let numeroCliente = cita.cliente_telefono.replace(/\D/g, '');
        if (!numeroCliente.startsWith('57')) {
            numeroCliente = '57' + numeroCliente;
        }

        const message = await twilioClient.messages.create({
            body: mensaje,
            from: twilioWhatsAppNumber,
            to: `whatsapp:+${numeroCliente}`
        });

        console.log(`✅ Recordatorio WhatsApp enviado a ${cita.cliente_nombre} (${cita.cliente_telefono})`);
        return message;
    } catch (error) {
        console.error('Error al enviar WhatsApp:', error.message);
        throw error;
    }
}

export async function notificarAdminNuevaCita(cita) {
    if (!twilioClient || !barberiaWhatsAppNumber) {
        console.warn('Twilio no está configurado para notificaciones admin.');
        return null;
    }

    const fechaFormateada = moment.tz(cita.fecha, timezone).format('dddd, D [de] MMMM');
    const horaFormateada = moment.tz(`${cita.fecha} ${cita.hora}`, timezone).format('h:mm A');

    const mensaje = `
📝 *Nueva Cita Agendada*

Cliente: *${cita.cliente_nombre}*
Teléfono: ${cita.cliente_telefono}
Fecha: ${fechaFormateada}
Hora: ${horaFormateada}
Servicio: ${cita.servicio_nombre}
Barbero: ${cita.empleado_nombre}
    `.trim();

    try {
        let numeroAdmin = barberiaWhatsAppNumber.replace(/\D/g, '');
        if (!numeroAdmin.startsWith('57')) {
            numeroAdmin = '57' + numeroAdmin;
        }

        const message = await twilioClient.messages.create({
            body: mensaje,
            from: twilioWhatsAppNumber,
            to: `whatsapp:+${numeroAdmin}`
        });

        return message;
    } catch (error) {
        console.error('Error al notificar admin:', error.message);
        throw error;
    }
}
