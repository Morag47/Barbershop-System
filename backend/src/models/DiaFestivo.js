import pool from '../config/dbConfig.js';

const DiaFestivo = {
    // Obtener todos los días festivos
    async obtenerTodos() {
        const [rows] = await pool.query(
            'SELECT * FROM dias_festivos ORDER BY fecha'
        );
        return rows;
    },

    // Obtener días festivos futuros
    async obtenerFuturos() {
        const [rows] = await pool.query(
            'SELECT * FROM dias_festivos WHERE fecha >= CURDATE() ORDER BY fecha'
        );
        return rows;
    },

    // Verificar si una fecha es festiva
    async esFestivo(fecha) {
        const [rows] = await pool.query(
            'SELECT COUNT(*) as total FROM dias_festivos WHERE fecha = ?',
            [fecha]
        );
        return rows[0].total > 0;
    },

    // Crear día festivo
    async crear(diaFestivo) {
        const { fecha, descripcion } = diaFestivo;
        const [result] = await pool.query(
            'INSERT INTO dias_festivos (fecha, descripcion) VALUES (?, ?)',
            [fecha, descripcion]
        );
        return result.insertId;
    },

    // Eliminar día festivo
    async eliminar(id) {
        const [result] = await pool.query(
            'DELETE FROM dias_festivos WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
};

export default DiaFestivo;
