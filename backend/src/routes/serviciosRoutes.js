import express from 'express';
import serviciosController from '../controllers/serviciosController.js';
import { verificarToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas públicas
router.get('/', serviciosController.obtenerTodos);
router.get('/:id', serviciosController.obtenerPorId);

// Rutas protegidas (admin)
router.get('/admin/todos', verificarToken, serviciosController.obtenerTodosAdmin);
router.post('/', verificarToken, serviciosController.crear);
router.put('/:id', verificarToken, serviciosController.actualizar);
router.delete('/:id', verificarToken, serviciosController.eliminar);

export default router;
