import express from 'express';
import disponibilidadController from '../controllers/disponibilidadController.js';

const router = express.Router();

// Ruta pública para consultar disponibilidad
router.get('/', disponibilidadController.obtenerDisponibilidad);

export default router;
