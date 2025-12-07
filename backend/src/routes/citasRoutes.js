import express from 'express';
import citasController from '../controllers/citasController.js';
import { body } from 'express-validator';

const router = express.Router();

// Validaciones para crear cita
const validacionCrearCita = [
    body('cliente_nombre').notEmpty().withMessage('Nombre del cliente es requerido'),
    body('cliente_cedula').notEmpty().withMessage('Cédula del cliente es requerida'),
    body('cliente_email').isEmail().withMessage('Email inválido'),
    body('cliente_telefono').notEmpty().withMessage('Teléfono es requerido'),
    body('servicio_id').isInt().withMessage('ID de servicio inválido'),
    body('empleado_id').isInt().withMessage('ID de empleado inválido'),
    body('fecha').isDate().withMessage('Fecha inválida'),
    body('hora').matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/).withMessage('Hora inválida')
];

// Rutas públicas
router.post('/', validacionCrearCita, citasController.crear);
router.get('/:id', citasController.obtenerPorId);

export default router;
