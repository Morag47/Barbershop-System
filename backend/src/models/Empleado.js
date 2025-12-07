import pool from '../config/dbConfig.js';

const Empleado = {
    // Obtener todos los empleados activos (sin cédula para clientes)
    async obtenerTodos() {
        const [rows] = await pool.query(
            'SELECT id, nombre, foto FROM empleados WHERE activo = TRUE ORDER BY nombre'
        );
        return rows;
    },

    // Obtener todos los empleados para admin (con cédula)
    async obtenerTodosAdmin() {
        const [rows] = await pool.query(
            'SELECT * FROM empleados ORDER BY nombre'
        );
        return rows;
    },

    // Obtener empleado por ID
    async obtenerPorId(id) {
        const [rows] = await pool.query(
            'SELECT * FROM empleados WHERE id = ?',
            [id]
        );
        return rows[0];
    },

    // Obtener empleado por cédula
    async obtenerPorCedula(cedula) {
        const [rows] = await pool.query(
            'SELECT * FROM empleados WHERE cedula = ?',
            [cedula]
        );
        return rows[0];
    },

    // Crear nuevo empleado
    async crear(empleado) {
        const { nombre, cedula, foto } = empleado;
        const [result] = await pool.query(
            'INSERT INTO empleados (nombre, cedula, foto) VALUES (?, ?, ?)',
            [nombre, cedula, foto || null]
        );
        return result.insertId;
    },

    // Actualizar empleado
    async actualizar(id, empleado) {
        const { nombre, cedula, foto, activo } = empleado;
        const [result] = await pool.query(
            'UPDATE empleados SET nombre = ?, cedula = ?, foto = ?, activo = ? WHERE id = ?',
            [nombre, cedula, foto, activo, id]
        );
        return result.affectedRows > 0;
    },

    // Eliminar empleado (soft delete)
    async eliminar(id) {
        const [result] = await pool.query(
            'UPDATE empleados SET activo = FALSE WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    },

    // Obtener horarios de un empleado
    async obtenerHorarios(empleadoId) {
        const [rows] = await pool.query(
            'SELECT * FROM horarios WHERE empleado_id = ? AND activo = TRUE ORDER BY FIELD(dia_semana, "lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo")',
            [empleadoId]
        );
        return rows;
    },

    // Obtener bloqueos de un empleado
    async obtenerBloqueos(empleadoId) {
        const [rows] = await pool.query(
            'SELECT * FROM bloqueos WHERE empleado_id = ? ORDER BY fecha_inicio DESC',
            [empleadoId]
        );
        return rows;
    }
};

export default Empleado;
