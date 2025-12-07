import pool from '../config/dbConfig.js';

const Cita = {
    // Obtener todas las citas con información relacionada
    async obtenerTodas() {
        const [rows] = await pool.query(`
            SELECT 
                c.*,
                s.nombre as servicio_nombre,
                s.precio as servicio_precio,
                e.nombre as empleado_nombre
            FROM citas c
            INNER JOIN servicios s ON c.servicio_id = s.id
            INNER JOIN empleados e ON c.empleado_id = e.id
            ORDER BY c.fecha DESC, c.hora DESC
        `);
        return rows;
    },

    // Obtener citas por estado
    async obtenerPorEstado(estado) {
        const [rows] = await pool.query(`
            SELECT 
                c.*,
                s.nombre as servicio_nombre,
                s.precio as servicio_precio,
                e.nombre as empleado_nombre
            FROM citas c
            INNER JOIN servicios s ON c.servicio_id = s.id
            INNER JOIN empleados e ON c.empleado_id = e.id
            WHERE c.estado = ?
            ORDER BY c.fecha, c.hora
        `, [estado]);
        return rows;
    },

    // Obtener cita por ID
    async obtenerPorId(id) {
        const [rows] = await pool.query(`
            SELECT 
                c.*,
                s.nombre as servicio_nombre,
                s.descripcion as servicio_descripcion,
                s.precio as servicio_precio,
                e.nombre as empleado_nombre,
                e.foto as empleado_foto
            FROM citas c
            INNER JOIN servicios s ON c.servicio_id = s.id
            INNER JOIN empleados e ON c.empleado_id = e.id
            WHERE c.id = ?
        `, [id]);
        return rows[0];
    },

    // Obtener citas por fecha
    async obtenerPorFecha(fecha) {
        const [rows] = await pool.query(`
            SELECT 
                c.*,
                s.nombre as servicio_nombre,
                e.nombre as empleado_nombre
            FROM citas c
            INNER JOIN servicios s ON c.servicio_id = s.id
            INNER JOIN empleados e ON c.empleado_id = e.id
            WHERE c.fecha = ?
            ORDER BY c.hora
        `, [fecha]);
        return rows;
    },

    // Obtener citas por empleado y fecha
    async obtenerPorEmpleadoYFecha(empleadoId, fecha) {
        const [rows] = await pool.query(`
            SELECT * FROM citas 
            WHERE empleado_id = ? AND fecha = ? AND estado != 'cancelada'
            ORDER BY hora
        `, [empleadoId, fecha]);
        return rows;
    },

    // Verificar si un horario está disponible
    async verificarDisponibilidad(empleadoId, fecha, hora) {
        const [rows] = await pool.query(`
            SELECT COUNT(*) as total FROM citas 
            WHERE empleado_id = ? AND fecha = ? AND hora = ? AND estado != 'cancelada'
        `, [empleadoId, fecha, hora]);
        return rows[0].total === 0;
    },

    // Crear nueva cita
    async crear(cita) {
        const { 
            cliente_nombre, 
            cliente_cedula, 
            cliente_email, 
            cliente_telefono, 
            servicio_id, 
            empleado_id, 
            fecha, 
            hora 
        } = cita;
        
        const [result] = await pool.query(
            `INSERT INTO citas 
            (cliente_nombre, cliente_cedula, cliente_email, cliente_telefono, 
             servicio_id, empleado_id, fecha, hora, estado) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pendiente')`,
            [cliente_nombre, cliente_cedula, cliente_email, cliente_telefono, 
             servicio_id, empleado_id, fecha, hora]
        );
        return result.insertId;
    },

    // Actualizar estado de cita
    async actualizarEstado(id, estado) {
        const [result] = await pool.query(
            'UPDATE citas SET estado = ? WHERE id = ?',
            [estado, id]
        );
        return result.affectedRows > 0;
    },

    // Marcar email de confirmación como enviado
    async marcarEmailConfirmacionEnviado(id) {
        const [result] = await pool.query(
            'UPDATE citas SET email_confirmacion_enviado = TRUE WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    },

    // Marcar recordatorio como enviado
    async marcarRecordatorioEnviado(id) {
        const [result] = await pool.query(
            'UPDATE citas SET recordatorio_enviado = TRUE WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    },

    // Marcar email de recibo como enviado
    async marcarEmailReciboEnviado(id) {
        const [result] = await pool.query(
            'UPDATE citas SET email_recibo_enviado = TRUE WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    },

    // Obtener citas próximas para recordatorios (3 horas antes)
    async obtenerCitasParaRecordatorio() {
        const [rows] = await pool.query(`
            SELECT 
                c.*,
                s.nombre as servicio_nombre,
                e.nombre as empleado_nombre
            FROM citas c
            INNER JOIN servicios s ON c.servicio_id = s.id
            INNER JOIN empleados e ON c.empleado_id = e.id
            WHERE c.estado = 'pendiente' 
            AND c.recordatorio_enviado = FALSE
            AND TIMESTAMP(c.fecha, c.hora) BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 4 HOUR)
            AND TIMESTAMP(c.fecha, c.hora) >= DATE_ADD(NOW(), INTERVAL 3 HOUR)
        `);
        return rows;
    },

    // Cancelar cita
    async cancelar(id) {
        return await this.actualizarEstado(id, 'cancelada');
    },

    // Completar cita
    async completar(id) {
        return await this.actualizarEstado(id, 'completada');
    },

    // Confirmar cita
    async confirmar(id) {
        return await this.actualizarEstado(id, 'confirmada');
    }
};

export default Cita;
