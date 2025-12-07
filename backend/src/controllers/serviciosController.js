import Servicio from '../models/Servicio.js';

const serviciosController = {
    // Obtener todos los servicios activos (público)
    async obtenerTodos(req, res) {
        try {
            const servicios = await Servicio.obtenerTodos();
            res.json(servicios);
        } catch (error) {
            console.error('Error al obtener servicios:', error);
            res.status(500).json({ error: 'Error al obtener servicios' });
        }
    },

    // Obtener todos los servicios incluyendo inactivos (admin)
    async obtenerTodosAdmin(req, res) {
        try {
            const servicios = await Servicio.obtenerTodosAdmin();
            res.json(servicios);
        } catch (error) {
            console.error('Error al obtener servicios:', error);
            res.status(500).json({ error: 'Error al obtener servicios' });
        }
    },

    // Obtener servicio por ID
    async obtenerPorId(req, res) {
        try {
            const { id } = req.params;
            const servicio = await Servicio.obtenerPorId(id);
            
            if (!servicio) {
                return res.status(404).json({ error: 'Servicio no encontrado' });
            }
            
            res.json(servicio);
        } catch (error) {
            console.error('Error al obtener servicio:', error);
            res.status(500).json({ error: 'Error al obtener servicio' });
        }
    },

    // Crear servicio (admin)
    async crear(req, res) {
        try {
            const { nombre, descripcion, duracion, precio } = req.body;

            if (!nombre || !precio) {
                return res.status(400).json({ error: 'Nombre y precio son requeridos' });
            }

            const id = await Servicio.crear({ nombre, descripcion, duracion: duracion || 60, precio });
            res.status(201).json({ 
                message: 'Servicio creado exitosamente', 
                id 
            });
        } catch (error) {
            console.error('Error al crear servicio:', error);
            res.status(500).json({ error: 'Error al crear servicio' });
        }
    },

    // Actualizar servicio (admin)
    async actualizar(req, res) {
        try {
            const { id } = req.params;
            const { nombre, descripcion, duracion, precio, activo } = req.body;

            const actualizado = await Servicio.actualizar(id, { 
                nombre, 
                descripcion, 
                duracion, 
                precio, 
                activo 
            });

            if (!actualizado) {
                return res.status(404).json({ error: 'Servicio no encontrado' });
            }

            res.json({ message: 'Servicio actualizado exitosamente' });
        } catch (error) {
            console.error('Error al actualizar servicio:', error);
            res.status(500).json({ error: 'Error al actualizar servicio' });
        }
    },

    // Eliminar servicio (admin)
    async eliminar(req, res) {
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
    }
};

export default serviciosController;
