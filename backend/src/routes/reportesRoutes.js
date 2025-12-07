import express from 'express';
import reportesController from '../controllers/reportesController.js';
import { verificarToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verificarToken);

// Obtener reportes
router.get('/diario', reportesController.obtenerReporteDiario);
router.get('/semanal', reportesController.obtenerReporteSemanal);
router.get('/mensual', reportesController.obtenerReporteMensual);

// Generar PDFs
router.get('/pdf/diario', reportesController.generarPDFDiario);
router.get('/pdf/semanal', reportesController.generarPDFSemanal);
router.get('/pdf/mensual', reportesController.generarPDFMensual);

export default router;
