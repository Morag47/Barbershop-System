import pool from '../config/dbConfig.js';

const Servicio = {
    // Obtener todos los servicios activos
    async obtenerTodos() {
        const [rows] = await pool.query(
            'SELECT id, nombre, descripcion, duracion, precio FROM servicios WHERE activo = TRUE ORDER BY nombre'
        );
        return rows;
    },

    // Obtener todos los servicios (incluidos inactivos) para admin
    async obtenerTodosAdmin() {
        const [rows] = await pool.query(
            'SELECT * FROM servicios ORDER BY nombre'
        );
        return rows;
    },

    // Obtener servicio por ID
    async obtenerPorId(id) {
        const [rows] = await pool.query(
            'SELECT * FROM servicios WHERE id = ?',
            [id]
        );
        return rows[0];
    },

    // Crear nuevo servicio
    async crear(servicio) {
        const { nombre, descripcion, precio } = servicio;
        const [result] = await pool.query(
            'INSERT INTO servicios (nombre, descripcion, duracion, precio) VALUES (?, ?, 60, ?)',
            [nombre, descripcion, precio]
        );
        return result.insertId;
    },

    // Actualizar servicio
    async actualizar(id, servicio) {
        const { nombre, descripcion, precio, activo } = servicio;
        const [result] = await pool.query(
            'UPDATE servicios SET nombre = ?, descripcion = ?, precio = ?, activo = ? WHERE id = ?',
            [nombre, descripcion, precio, activo, id]
        );
        return result.affectedRows > 0;
    },

    // Eliminar servicio (soft delete)
    async eliminar(id) {
        const [result] = await pool.query(
            'UPDATE servicios SET activo = FALSE WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    },

    // Activar servicio
    async activar(id) {
        const [result] = await pool.query(
            'UPDATE servicios SET activo = TRUE WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
};

export default Servicio;
