import Empleado from '../models/Empleado.js';

const empleadosController = {
    // Obtener todos los empleados activos (sin cédula para clientes)
    async obtenerTodos(req, res) {
        try {
            const empleados = await Empleado.obtenerTodos();
            res.json(empleados);
        } catch (error) {
            console.error('Error al obtener empleados:', error);
            res.status(500).json({ error: 'Error al obtener empleados' });
        }
    },

    // Obtener todos los empleados incluyendo inactivos (admin)
    async obtenerTodosAdmin(req, res) {
        try {
            const empleados = await Empleado.obtenerTodosAdmin();
            res.json(empleados);
        } catch (error) {
            console.error('Error al obtener empleados:', error);
            res.status(500).json({ error: 'Error al obtener empleados' });
        }
    },

    // Obtener empleado por ID (sin cédula)
    async obtenerPorId(req, res) {
        try {
            const { id } = req.params;
            const empleado = await Empleado.obtenerPorId(id);
            
            if (!empleado) {
                return res.status(404).json({ error: 'Empleado no encontrado' });
            }
            
            // Remover cédula para clientes
            const { cedula, ...empleadoSinCedula } = empleado;
            res.json(empleadoSinCedula);
        } catch (error) {
            console.error('Error al obtener empleado:', error);
            res.status(500).json({ error: 'Error al obtener empleado' });
        }
    },

    // Crear empleado (admin)
    async crear(req, res) {
        try {
            const { nombre, cedula, foto } = req.body;

            if (!nombre || !cedula) {
                return res.status(400).json({ error: 'Nombre y cédula son requeridos' });
            }

            const id = await Empleado.crear({ nombre, cedula, foto });
            res.status(201).json({ 
                message: 'Empleado creado exitosamente', 
                id 
            });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'Ya existe un empleado con esta cédula' });
            }
            console.error('Error al crear empleado:', error);
            res.status(500).json({ error: 'Error al crear empleado' });
        }
    },

    // Actualizar empleado (admin)
    async actualizar(req, res) {
        try {
            const { id } = req.params;
            const { nombre, cedula, foto, activo } = req.body;

            const actualizado = await Empleado.actualizar(id, { 
                nombre, 
                cedula, 
                foto, 
                activo 
            });

            if (!actualizado) {
                return res.status(404).json({ error: 'Empleado no encontrado' });
            }

            res.json({ message: 'Empleado actualizado exitosamente' });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'Ya existe un empleado con esta cédula' });
            }
            console.error('Error al actualizar empleado:', error);
            res.status(500).json({ error: 'Error al actualizar empleado' });
        }
    },

    // Eliminar empleado (admin)
    async eliminar(req, res) {
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
    }
};

export default empleadosController;
