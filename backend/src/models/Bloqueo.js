import pool from '../config/dbConfig.js';

const Bloqueo = {
    // Obtener todos los bloqueos
    async obtenerTodos() {
        const [rows] = await pool.query(`
            SELECT b.*, e.nombre as empleado_nombre
            FROM bloqueos b
            INNER JOIN empleados e ON b.empleado_id = e.id
            ORDER BY b.fecha_inicio DESC
        `);
        return rows;
    },

    // Obtener un bloqueo por ID
    async obtenerPorId(id) {
        const [rows] = await pool.query(
            'SELECT b.*, e.nombre as empleado_nombre FROM bloqueos b INNER JOIN empleados e ON b.empleado_id = e.id WHERE b.id = ?',
            [id]
        );
        return rows[0];
    },

    // Obtener bloqueos activos (futuras o presentes)
    async obtenerActivos() {
        const [rows] = await pool.query(`
            SELECT b.*, e.nombre as empleado_nombre
            FROM bloqueos b
            INNER JOIN empleados e ON b.empleado_id = e.id
            WHERE b.fecha_fin >= CURDATE()
            ORDER BY b.fecha_inicio
        `);
        return rows;
    },

    // Obtener bloqueos por empleado
    async obtenerPorEmpleado(empleadoId) {
        const [rows] = await pool.query(
            'SELECT * FROM bloqueos WHERE empleado_id = ? ORDER BY fecha_inicio DESC',
            [empleadoId]
        );
        return rows;
    },

    // Verificar si un empleado está bloqueado en una fecha
    async verificarBloqueo(empleadoId, fecha) {
        const [rows] = await pool.query(
            `SELECT COUNT(*) as total FROM bloqueos 
            WHERE empleado_id = ? AND ? BETWEEN fecha_inicio AND fecha_fin`,
            [empleadoId, fecha]
        );
        return rows[0].total > 0;
    },

    // Crear bloqueo
    async crear(bloqueo) {
        const { empleado_id, fecha_inicio, fecha_fin, motivo, descripcion } = bloqueo;
        const [result] = await pool.query(
            'INSERT INTO bloqueos (empleado_id, fecha_inicio, fecha_fin, motivo, descripcion) VALUES (?, ?, ?, ?, ?)',
            [empleado_id, fecha_inicio, fecha_fin, motivo, descripcion]
        );
        return result.insertId;
    },

    // Actualizar bloqueo
    async actualizar(id, bloqueo) {
        const { fecha_inicio, fecha_fin, motivo, descripcion } = bloqueo;
        const [result] = await pool.query(
            'UPDATE bloqueos SET fecha_inicio = ?, fecha_fin = ?, motivo = ?, descripcion = ? WHERE id = ?',
            [fecha_inicio, fecha_fin, motivo, descripcion, id]
        );
        return result.affectedRows > 0;
    },

    // Eliminar bloqueo
    async eliminar(id) {
        const [result] = await pool.query(
            'DELETE FROM bloqueos WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    },

    // Eliminar bloqueos vencidos (fecha_fin anterior a hoy)
    async eliminarVencidos() {
        const [result] = await pool.query(
            'DELETE FROM bloqueos WHERE fecha_fin < CURDATE()'
        );
        return result.affectedRows;
    }
};

export default Bloqueo;
