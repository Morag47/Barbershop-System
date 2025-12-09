import Admin from '../models/Admin.js';
import Servicio from '../models/Servicio.js';
import Empleado from '../models/Empleado.js';
import Cita from '../models/Cita.js';
import Horario from '../models/Horario.js';
import Bloqueo from '../models/Bloqueo.js';
import DiaFestivo from '../models/DiaFestivo.js';
import Venta from '../models/Venta.js';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { enviarEmailRecibo } from '../services/emailService.js';

const adminController = {
    // Login de administrador
    async login(req, res) {
        try {
            const { usuario, password } = req.body;

            if (!usuario || !password) {
                return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
            }

            // Buscar administrador
            const admin = await Admin.obtenerPorUsuario(usuario);
            if (!admin) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }

            // Verificar contraseña
            const passwordValido = await Admin.verificarPassword(password, admin.password);
            if (!passwordValido) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }

            // Generar token JWT
            const token = jwt.sign(
                { id: admin.id, usuario: admin.usuario },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
            );

            res.json({
                message: 'Login exitoso',
                token,
                admin: {
                    id: admin.id,
                    usuario: admin.usuario,
                    nombre: admin.nombre,
                    email: admin.email
                }
            });
        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({ error: 'Error en el login' });
        }
    },

    // ===== SERVICIOS =====
    async obtenerTodosServicios(req, res) {
        try {
            const servicios = await Servicio.obtenerTodosAdmin();
            res.json(servicios);
        } catch (error) {
            console.error('Error al obtener servicios:', error);
            res.status(500).json({ error: 'Error al obtener servicios' });
        }
    },

    async crearServicio(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const servicioId = await Servicio.crear(req.body);
            const servicio = await Servicio.obtenerPorId(servicioId);
            
            res.status(201).json({ 
                message: 'Servicio creado exitosamente',
                servicio 
            });
        } catch (error) {
            console.error('Error al crear servicio:', error);
            res.status(500).json({ error: 'Error al crear servicio' });
        }
    },

    async actualizarServicio(req, res) {
        try {
            const { id } = req.params;
            const actualizado = await Servicio.actualizar(id, req.body);
            
            if (!actualizado) {
                return res.status(404).json({ error: 'Servicio no encontrado' });
            }
            
            res.json({ message: 'Servicio actualizado exitosamente' });
        } catch (error) {
            console.error('Error al actualizar servicio:', error);
            res.status(500).json({ error: 'Error al actualizar servicio' });
        }
    },

    async eliminarServicio(req, res) {
        try {
            const { id } = req.params;
            const eliminado = await Servicio.eliminar(id);
            
            if (!eliminado) {
                return res.status(404).json({ error: 'Servicio no encontrado' });
            }
            
            res.json({ message: 'Servicio eliminado exitosamente' });
        } catch (error) {
            console.error('Error al eliminar servicio:', error);
            res.status(500).json({ error: 'Error al eliminar servicio' });
        }
    },

    // ===== EMPLEADOS =====
    async obtenerTodosEmpleados(req, res) {
        try {
            const empleados = await Empleado.obtenerTodosAdmin();
            res.json(empleados);
        } catch (error) {
            console.error('Error al obtener empleados:', error);
            res.status(500).json({ error: 'Error al obtener empleados' });
        }
    },

    async crearEmpleado(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // Verificar si la cédula ya existe
            const existente = await Empleado.obtenerPorCedula(req.body.cedula);
            if (existente) {
                return res.status(400).json({ error: 'Ya existe un empleado con esta cédula' });
            }

            const empleadoId = await Empleado.crear(req.body);
            const empleado = await Empleado.obtenerPorId(empleadoId);
            
            res.status(201).json({ 
                message: 'Empleado creado exitosamente',
                empleado 
            });
        } catch (error) {
            console.error('Error al crear empleado:', error);
            res.status(500).json({ error: 'Error al crear empleado' });
        }
    },

    async actualizarEmpleado(req, res) {
        try {
            const { id } = req.params;
            const actualizado = await Empleado.actualizar(id, req.body);
            
            if (!actualizado) {
                return res.status(404).json({ error: 'Empleado no encontrado' });
            }
            
            res.json({ message: 'Empleado actualizado exitosamente' });
        } catch (error) {
            console.error('Error al actualizar empleado:', error);
            res.status(500).json({ error: 'Error al actualizar empleado' });
        }
    },

    async eliminarEmpleado(req, res) {
        try {
            const { id } = req.params;
            const eliminado = await Empleado.eliminar(id);
            
            if (!eliminado) {
                return res.status(404).json({ error: 'Empleado no encontrado' });
            }
            
            res.json({ message: 'Empleado eliminado exitosamente' });
        } catch (error) {
            console.error('Error al eliminar empleado:', error);
            res.status(500).json({ error: 'Error al eliminar empleado' });
        }
    },

    async subirFotoEmpleado(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No se ha proporcionado ningún archivo' });
            }

            // Generar URL relativa para guardar en la base de datos
            const fotoUrl = `/uploads/empleados/${req.file.filename}`;

            res.json({ 
                message: 'Foto subida exitosamente',
                url: fotoUrl,
                filename: req.file.filename
            });
        } catch (error) {
            console.error('Error al subir foto:', error);
            res.status(500).json({ error: 'Error al subir la foto' });
        }
    },

    // ===== CITAS =====
    async obtenerTodasCitas(req, res) {
        try {
            const { estado } = req.query;
            
            let citas;
            if (estado) {
                citas = await Cita.obtenerPorEstado(estado);
            } else {
                citas = await Cita.obtenerTodas();
            }
            
            res.json(citas);
        } catch (error) {
            console.error('Error al obtener citas:', error);
            res.status(500).json({ error: 'Error al obtener citas' });
        }
    },

    async confirmarCita(req, res) {
        try {
            const { id } = req.params;
            const cita = await Cita.obtenerPorId(id);
            const confirmada = await Cita.confirmar(id);
            
            if (!confirmada) {
                return res.status(404).json({ error: 'Cita no encontrada' });
            }
            
            res.json({ message: 'Cita confirmada exitosamente' });
        } catch (error) {
            console.error('Error al confirmar cita:', error);
            res.status(500).json({ error: 'Error al confirmar cita' });
        }
    },

    async cancelarCita(req, res) {
        try {
            const { id } = req.params;
            
            // Verificar si la cita estaba completada para eliminar la venta
            const cita = await Cita.obtenerPorId(id);
            const estabaCompletada = cita && cita.estado === 'completada';
            
            const cancelada = await Cita.cancelar(id);
            
            if (!cancelada) {
                return res.status(404).json({ error: 'Cita no encontrada' });
            }
            
            // Si la cita estaba completada, eliminar la venta registrada
            if (estabaCompletada) {
                try {
                    await Venta.eliminarPorCita(id);
                    console.log(`⚠️ Venta eliminada por cancelación de cita #${id}`);
                } catch (ventaError) {
                    console.error('Error al eliminar venta:', ventaError);
                }
            }
            
            res.json({ message: 'Cita cancelada exitosamente' });
        } catch (error) {
            console.error('Error al cancelar cita:', error);
            res.status(500).json({ error: 'Error al cancelar cita' });
        }
    },

    async completarCita(req, res) {
        try {
            const { id } = req.params;
            const cita = await Cita.obtenerPorId(id);
            
            if (!cita) {
                return res.status(404).json({ error: 'Cita no encontrada' });
            }

            const completada = await Cita.completar(id);
            
            if (!completada) {
                return res.status(500).json({ error: 'Error al completar cita' });
            }

            // Registrar venta automáticamente
            try {
                // Verificar si ya existe una venta para esta cita
                const ventaExiste = await Venta.existePorCita(id);
                
                if (!ventaExiste) {
                    // Obtener el precio del servicio
                    const servicio = await Servicio.obtenerPorId(cita.servicio_id);
                    
                    if (servicio) {
                        await Venta.crear(
                            id,
                            cita.empleado_id,
                            cita.servicio_id,
                            cita.fecha,
                            servicio.precio
                        );
                        console.log(`Venta registrada: $${servicio.precio} COP`);
                    }
                }
            } catch (ventaError) {
                console.error('Error al registrar venta:', ventaError);
                // No fallar la operación si el registro de venta falla
            }

            // Enviar email con recibo
            try {
                await enviarEmailRecibo(cita);
                await Cita.marcarEmailReciboEnviado(id);
            } catch (emailError) {
                console.error('Error al enviar email de recibo:', emailError);
                // No fallar la operación si el email falla
            }
            
            res.json({ message: 'Cita completada exitosamente' });
        } catch (error) {
            console.error('Error al completar cita:', error);
            res.status(500).json({ error: 'Error al completar cita' });
        }
    },

    // ===== HORARIOS =====
    async obtenerTodosHorarios(req, res) {
        try {
            const horarios = await Horario.obtenerTodos();
            res.json(horarios);
        } catch (error) {
            console.error('Error al obtener horarios:', error);
            res.status(500).json({ error: 'Error al obtener horarios' });
        }
    },

    async crearHorario(req, res) {
        try {
            const horarioId = await Horario.crear(req.body);

            res.status(201).json({ 
                message: 'Horario creado exitosamente',
                id: horarioId 
            });
        } catch (error) {
            console.error('Error al crear horario:', error);
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'Ya existe un horario para este empleado en este día' });
            }
            res.status(500).json({ error: 'Error al crear horario' });
        }
    },

    async actualizarHorario(req, res) {
        try {
            const { id } = req.params;
            const actualizado = await Horario.actualizar(id, req.body);
            
            if (!actualizado) {
                return res.status(404).json({ error: 'Horario no encontrado' });
            }
            
            res.json({ message: 'Horario actualizado exitosamente' });
        } catch (error) {
            console.error('Error al actualizar horario:', error);
            res.status(500).json({ error: 'Error al actualizar horario' });
        }
    },

    async eliminarHorario(req, res) {
        try {
            const { id } = req.params;
            const eliminado = await Horario.eliminar(id);
            
            if (!eliminado) {
                return res.status(404).json({ error: 'Horario no encontrado' });
            }
            
            res.json({ message: 'Horario eliminado exitosamente' });
        } catch (error) {
            console.error('Error al eliminar horario:', error);
            res.status(500).json({ error: 'Error al eliminar horario' });
        }
    },

    // ===== BLOQUEOS =====
    async obtenerTodosBloqueos(req, res) {
        try {
            const bloqueos = await Bloqueo.obtenerTodos();
            res.json(bloqueos);
        } catch (error) {
            console.error('Error al obtener bloqueos:', error);
            res.status(500).json({ error: 'Error al obtener bloqueos' });
        }
    },

    async crearBloqueo(req, res) {
        try {
            const bloqueoId = await Bloqueo.crear(req.body);

            res.status(201).json({ 
                message: 'Bloqueo creado exitosamente',
                id: bloqueoId 
            });
        } catch (error) {
            console.error('Error al crear bloqueo:', error);
            res.status(500).json({ error: 'Error al crear bloqueo' });
        }
    },

    async actualizarBloqueo(req, res) {
        try {
            const { id } = req.params;
            const actualizado = await Bloqueo.actualizar(id, req.body);
            
            if (!actualizado) {
                return res.status(404).json({ error: 'Bloqueo no encontrado' });
            }
            
            res.json({ message: 'Bloqueo actualizado exitosamente' });
        } catch (error) {
            console.error('Error al actualizar bloqueo:', error);
            res.status(500).json({ error: 'Error al actualizar bloqueo' });
        }
    },

    async eliminarBloqueo(req, res) {
        try {
            const { id } = req.params;
            const eliminado = await Bloqueo.eliminar(id);
            
            if (!eliminado) {
                return res.status(404).json({ error: 'Bloqueo no encontrado' });
            }
            
            res.json({ message: 'Bloqueo eliminado exitosamente' });
        } catch (error) {
            console.error('Error al eliminar bloqueo:', error);
            res.status(500).json({ error: 'Error al eliminar bloqueo' });
        }
    },

    // ===== DÍAS FESTIVOS =====
    async obtenerDiasFestivos(req, res) {
        try {
            const diasFestivos = await DiaFestivo.obtenerTodos();
            res.json(diasFestivos);
        } catch (error) {
            console.error('Error al obtener días festivos:', error);
            res.status(500).json({ error: 'Error al obtener días festivos' });
        }
    },

    async crearDiaFestivo(req, res) {
        try {
            const diaId = await DiaFestivo.crear(req.body);
            res.status(201).json({ 
                message: 'Día festivo creado exitosamente',
                id: diaId 
            });
        } catch (error) {
            console.error('Error al crear día festivo:', error);
            res.status(500).json({ error: 'Error al crear día festivo' });
        }
    },

    async eliminarDiaFestivo(req, res) {
        try {
            const { id } = req.params;
            const eliminado = await DiaFestivo.eliminar(id);
            
            if (!eliminado) {
                return res.status(404).json({ error: 'Día festivo no encontrado' });
            }
            
            res.json({ message: 'Día festivo eliminado exitosamente' });
        } catch (error) {
            console.error('Error al eliminar día festivo:', error);
            res.status(500).json({ error: 'Error al eliminar día festivo' });
        }
    }
};

export default adminController;
