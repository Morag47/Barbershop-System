import express from 'express';
import bloqueosController from '../controllers/bloqueosController.js';
import { verificarToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación (admin)
router.get('/', verificarToken, bloqueosController.obtenerTodos);
router.get('/empleado/:empleadoId', verificarToken, bloqueosController.obtenerPorEmpleado);
router.post('/', verificarToken, bloqueosController.crear);
router.put('/:id', verificarToken, bloqueosController.actualizar);
router.delete('/:id', verificarToken, bloqueosController.eliminar);

export default router;
