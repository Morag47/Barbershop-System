import cron from 'node-cron';
import Cita from '../models/Cita.js';
import Bloqueo from '../models/Bloqueo.js';
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

    // Ejecutar cada hora para cancelar automáticamente citas vencidas
    cron.schedule('0 * * * *', async () => {
        console.log('🔍 Verificando citas vencidas para auto-cancelación...');
        
        try {
            // Cancelar citas que pasaron más de 3 horas y no fueron completadas/confirmadas
            const citasCanceladas = await Cita.cancelarCitasVencidas();
            
            if (citasCanceladas > 0) {
                console.log(`✅ ${citasCanceladas} cita(s) cancelada(s) automáticamente por vencimiento`);
            } else {
                console.log('✅ No hay citas vencidas para cancelar');
            }
        } catch (error) {
            console.error('❌ Error en cron job de cancelación automática:', error);
        }
    });

    // Ejecutar diariamente a las 3:00 AM para limpiar bloqueos vencidos
    cron.schedule('0 3 * * *', async () => {
        console.log('🔍 Limpiando bloqueos vencidos...');
        
        try {
            const bloqueosEliminados = await Bloqueo.eliminarVencidos();
            
            if (bloqueosEliminados > 0) {
                console.log(`✅ ${bloqueosEliminados} bloqueo(s) vencido(s) eliminado(s) automáticamente`);
            } else {
                console.log('✅ No hay bloqueos vencidos para eliminar');
            }
        } catch (error) {
            console.error('❌ Error en cron job de limpieza de bloqueos:', error);
        }
    });

    console.log('✅ Cron jobs iniciados');
    console.log('⏰ Sistema de recordatorios activo');
    console.log('⚠️  Sistema de auto-cancelación activo');
    console.log('🧹 Sistema de limpieza de bloqueos activo');
}
