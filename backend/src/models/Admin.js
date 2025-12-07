import pool from '../config/dbConfig.js';
import bcrypt from 'bcrypt';

const Admin = {
    // Obtener administrador por usuario
    async obtenerPorUsuario(usuario) {
        const [rows] = await pool.query(
            'SELECT * FROM administradores WHERE usuario = ?',
            [usuario]
        );
        return rows[0];
    },

    // Crear administrador
    async crear(admin) {
        const { usuario, password, nombre, email } = admin;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const [result] = await pool.query(
            'INSERT INTO administradores (usuario, password, nombre, email) VALUES (?, ?, ?, ?)',
            [usuario, hashedPassword, nombre, email]
        );
        return result.insertId;
    },

    // Verificar contraseña
    async verificarPassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    },

    // Actualizar contraseña
    async actualizarPassword(id, nuevaPassword) {
        const hashedPassword = await bcrypt.hash(nuevaPassword, 10);
        const [result] = await pool.query(
            'UPDATE administradores SET password = ? WHERE id = ?',
            [hashedPassword, id]
        );
        return result.affectedRows > 0;
    }
};

export default Admin;
