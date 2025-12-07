import Bloqueo from '../models/Bloqueo.js';

const bloqueosController = {
    // Obtener todos los bloqueos
    async obtenerTodos(req, res) {
        try {
            const bloqueos = await Bloqueo.obtenerTodos();
            res.json(bloqueos);
        } catch (error) {
            console.error('Error al obtener bloqueos:', error);
            res.status(500).json({ error: 'Error al obtener bloqueos' });
        }
    },

    // Obtener bloqueos de un empleado
    async obtenerPorEmpleado(req, res) {
        try {
            const { empleadoId } = req.params;
            const bloqueos = await Bloqueo.obtenerPorEmpleado(empleadoId);
            res.json(bloqueos);
        } catch (error) {
            console.error('Error al obtener bloqueos:', error);
            res.status(500).json({ error: 'Error al obtener bloqueos' });
        }
    },

    // Crear bloqueo
    async crear(req, res) {
        try {
            const { empleado_id, fecha_inicio, fecha_fin, motivo, descripcion } = req.body;

            if (!empleado_id || !fecha_inicio || !fecha_fin || !motivo) {
                return res.status(400).json({ error: 'Todos los campos son requeridos' });
            }

            const id = await Bloqueo.crear({ empleado_id, fecha_inicio, fecha_fin, motivo, descripcion });
            res.status(201).json({ 
                message: 'Bloqueo creado exitosamente', 
                id 
            });
        } catch (error) {
            console.error('Error al crear bloqueo:', error);
            res.status(500).json({ error: 'Error al crear bloqueo' });
        }
    },

    // Actualizar bloqueo
    async actualizar(req, res) {
        try {
            const { id } = req.params;
            const { empleado_id, fecha_inicio, fecha_fin, motivo, descripcion } = req.body;

            const actualizado = await Bloqueo.actualizar(id, { 
                empleado_id, 
                fecha_inicio, 
                fecha_fin, 
                motivo, 
                descripcion 
            });

            if (!actualizado) {
                return res.status(404).json({ error: 'Bloqueo no encontrado' });
            }

            res.json({ message: 'Bloqueo actualizado exitosamente' });
        } catch (error) {
            console.error('Error al actualizar bloqueo:', error);
            res.status(500).json({ error: 'Error al actualizar bloqueo' });
        }
    },

    // Eliminar bloqueo
    async eliminar(req, res) {
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
    }
};

export default bloqueosController;
