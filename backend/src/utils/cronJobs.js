import cron from 'node-cron';
import Cita from '../models/Cita.js';
import { enviarRecordatorioWhatsApp } from '../services/whatsappService.js';

export function iniciarCronJobs() {
    // Ejecutar cada 30 minutos para buscar citas que necesiten recordatorio
    // Formato: minuto hora día mes día-de-la-semana
    cron.schedule('*/30 * * * *', async () => {
        console.log('🔍 Buscando citas para enviar recordatorios...');
        
        try {
            // Obtener citas que necesitan recordatorio (3 horas antes)
            const citas = await Cita.obtenerCitasParaRecordatorio();
            
            if (citas.length === 0) {
                console.log('✅ No hay citas pendientes de recordatorio');
                return;
            }

            console.log(`📱 ${citas.length} recordatorio(s) para enviar`);

            // Enviar recordatorios
            for (const cita of citas) {
                try {
                    await enviarRecordatorioWhatsApp(cita);
                    await Cita.marcarRecordatorioEnviado(cita.id);
                    console.log(`✅ Recordatorio enviado para cita #${cita.id}`);
                } catch (error) {
                    console.error(`❌ Error al enviar recordatorio para cita #${cita.id}:`, error.message);
                }
                
                // Pequeña pausa entre mensajes para no saturar la API
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        } catch (error) {
            console.error('❌ Error en cron job de recordatorios:', error);
        }
    });

    console.log('✅ Cron jobs iniciados');
}
