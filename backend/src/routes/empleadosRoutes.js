import express from 'express';
import empleadosController from '../controllers/empleadosController.js';
import { verificarToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas públicas
router.get('/', empleadosController.obtenerTodos);
router.get('/:id', empleadosController.obtenerPorId);

// Rutas protegidas (admin)
router.get('/admin/todos', verificarToken, empleadosController.obtenerTodosAdmin);
router.post('/', verificarToken, empleadosController.crear);
router.put('/:id', verificarToken, empleadosController.actualizar);
router.delete('/:id', verificarToken, empleadosController.eliminar);

export default router;
