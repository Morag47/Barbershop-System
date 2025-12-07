import Horario from '../models/Horario.js';

const horariosController = {
    // Obtener horarios de un empleado
    async obtenerPorEmpleado(req, res) {
        try {
            const { empleadoId } = req.params;
            const horarios = await Horario.obtenerPorEmpleado(empleadoId);
            res.json(horarios);
        } catch (error) {
            console.error('Error al obtener horarios:', error);
            res.status(500).json({ error: 'Error al obtener horarios' });
        }
    },

    // Crear o actualizar horario
    async guardar(req, res) {
        try {
            const { empleado_id, dia_semana, hora_inicio, hora_fin, activo } = req.body;

            if (!empleado_id || !dia_semana || !hora_inicio || !hora_fin) {
                return res.status(400).json({ error: 'Todos los campos son requeridos' });
            }

            const id = await Horario.guardar({ empleado_id, dia_semana, hora_inicio, hora_fin, activo });
            res.json({ 
                message: 'Horario guardado exitosamente', 
                id 
            });
        } catch (error) {
            console.error('Error al guardar horario:', error);
            res.status(500).json({ error: 'Error al guardar horario' });
        }
    },

    // Eliminar horario
    async eliminar(req, res) {
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
    }
};

export default horariosController;
