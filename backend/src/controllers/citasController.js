import Cita from '../models/Cita.js';
import Venta from '../models/Venta.js';
import Servicio from '../models/Servicio.js';
import { validationResult } from 'express-validator';
import { enviarEmailConfirmacion } from '../services/emailService.js';

const citasController = {
    // Crear nueva cita
    async crear(req, res) {
        try {
            // Validar datos
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { 
                cliente_nombre, 
                cliente_cedula, 
                cliente_email, 
                cliente_telefono, 
                servicio_id, 
                empleado_id, 
                fecha, 
                hora 
            } = req.body;

            // Verificar disponibilidad
            const disponible = await Cita.verificarDisponibilidad(empleado_id, fecha, hora);
            if (!disponible) {
                return res.status(400).json({ 
                    error: 'El horario seleccionado no está disponible' 
                });
            }

            // Crear cita
            const citaId = await Cita.crear({
                cliente_nombre,
                cliente_cedula,
                cliente_email,
                cliente_telefono,
                servicio_id,
                empleado_id,
                fecha,
                hora
            });

            // Obtener datos completos de la cita
            const cita = await Cita.obtenerPorId(citaId);

            // Enviar email de confirmación
            try {
                await enviarEmailConfirmacion(cita);
                await Cita.marcarEmailConfirmacionEnviado(citaId);
            } catch (emailError) {
                console.error('Error al enviar email de confirmación:', emailError);
                // No fallar la creación de la cita si el email falla
            }

            res.status(201).json({ 
                message: 'Cita creada exitosamente',
                cita 
            });
        } catch (error) {
            console.error('Error al crear cita:', error);
            res.status(500).json({ error: 'Error al crear la cita' });
        }
    },

    // Obtener cita por ID
    async obtenerPorId(req, res) {
        try {
            const { id } = req.params;
            const cita = await Cita.obtenerPorId(id);
            
            if (!cita) {
                return res.status(404).json({ error: 'Cita no encontrada' });
            }
            
            res.json(cita);
        } catch (error) {
            console.error('Error al obtener cita:', error);
            res.status(500).json({ error: 'Error al obtener la cita' });
        }
    }
};

export default citasController;
