import express from 'express';
import horariosController from '../controllers/horariosController.js';
import { verificarToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación (admin)
router.get('/empleado/:empleadoId', verificarToken, horariosController.obtenerPorEmpleado);
router.post('/', verificarToken, horariosController.guardar);
router.delete('/:id', verificarToken, horariosController.eliminar);

export default router;
