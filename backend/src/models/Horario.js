import pool from '../config/dbConfig.js';

const Horario = {
    // Obtener todos los horarios
    async obtenerTodos() {
        const [rows] = await pool.query(`
            SELECT h.*, e.nombre as empleado_nombre
            FROM horarios h
            INNER JOIN empleados e ON h.empleado_id = e.id
            WHERE h.activo = TRUE
            ORDER BY e.nombre, FIELD(h.dia_semana, 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo')
        `);
        return rows;
    },

    // Obtener un horario por ID
    async obtenerPorId(id) {
        const [rows] = await pool.query(
            'SELECT h.*, e.nombre as empleado_nombre FROM horarios h INNER JOIN empleados e ON h.empleado_id = e.id WHERE h.id = ?',
            [id]
        );
        return rows[0];
    },

    // Obtener horarios por empleado
    async obtenerPorEmpleado(empleadoId) {
        const [rows] = await pool.query(
            `SELECT * FROM horarios WHERE empleado_id = ? AND activo = TRUE 
            ORDER BY FIELD(dia_semana, 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo')`,
            [empleadoId]
        );
        return rows;
    },

    // Crear horario
    async crear(horario) {
        const { empleado_id, dia_semana, hora_inicio, hora_fin } = horario;
        const [result] = await pool.query(
            'INSERT INTO horarios (empleado_id, dia_semana, hora_inicio, hora_fin) VALUES (?, ?, ?, ?)',
            [empleado_id, dia_semana, hora_inicio, hora_fin]
        );
        return result.insertId;
    },

    // Actualizar horario
    async actualizar(id, horario) {
        const { dia_semana, hora_inicio, hora_fin, activo } = horario;
        const [result] = await pool.query(
            'UPDATE horarios SET dia_semana = ?, hora_inicio = ?, hora_fin = ?, activo = ? WHERE id = ?',
            [dia_semana, hora_inicio, hora_fin, activo, id]
        );
        return result.affectedRows > 0;
    },

    // Eliminar horario
    async eliminar(id) {
        const [result] = await pool.query(
            'UPDATE horarios SET activo = FALSE WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
};

export default Horario;
