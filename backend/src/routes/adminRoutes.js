import express from 'express';
import adminController from '../controllers/adminController.js';
import { verificarToken } from '../middleware/authMiddleware.js';
import { body } from 'express-validator';
import upload from '../config/multerConfig.js';

const router = express.Router();

// Ruta de login (sin autenticación)
router.post('/login', adminController.login);

// Aplicar middleware de autenticación a todas las rutas siguientes
router.use(verificarToken);

// ===== SERVICIOS =====
router.get('/servicios', adminController.obtenerTodosServicios);
router.post('/servicios', [
    body('nombre').notEmpty().withMessage('Nombre es requerido'),
    body('precio').isFloat({ min: 0 }).withMessage('Precio debe ser un número positivo')
], adminController.crearServicio);
router.put('/servicios/:id', adminController.actualizarServicio);
router.delete('/servicios/:id', adminController.eliminarServicio);

// ===== EMPLEADOS =====
router.get('/empleados', adminController.obtenerTodosEmpleados);
router.post('/empleados', [
    body('nombre').notEmpty().withMessage('Nombre es requerido'),
    body('cedula').notEmpty().withMessage('Cédula es requerida')
], adminController.crearEmpleado);
router.put('/empleados/:id', adminController.actualizarEmpleado);
router.delete('/empleados/:id', adminController.eliminarEmpleado);
router.post('/empleados/subir-foto', upload.single('foto'), adminController.subirFotoEmpleado);

// ===== CITAS =====
router.get('/citas', adminController.obtenerTodasCitas);
router.patch('/citas/:id/confirmar', adminController.confirmarCita);
router.patch('/citas/:id/cancelar', adminController.cancelarCita);
router.patch('/citas/:id/completar', adminController.completarCita);

// ===== HORARIOS =====
router.get('/horarios', adminController.obtenerTodosHorarios);
router.post('/horarios', adminController.crearHorario);
router.put('/horarios/:id', adminController.actualizarHorario);
router.delete('/horarios/:id', adminController.eliminarHorario);

// ===== BLOQUEOS =====
router.get('/bloqueos', adminController.obtenerTodosBloqueos);
router.post('/bloqueos', adminController.crearBloqueo);
router.put('/bloqueos/:id', adminController.actualizarBloqueo);
router.delete('/bloqueos/:id', adminController.eliminarBloqueo);

// ===== DÍAS FESTIVOS =====
router.get('/dias-festivos', adminController.obtenerDiasFestivos);
router.post('/dias-festivos', adminController.crearDiaFestivo);
router.delete('/dias-festivos/:id', adminController.eliminarDiaFestivo);

export default router;
