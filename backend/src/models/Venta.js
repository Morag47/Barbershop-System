import pool from '../config/dbConfig.js';

const Venta = {
  // Registrar una venta cuando se completa una cita
  async crear(citaId, empleadoId, servicioId, fecha, monto) {
    const query = `
      INSERT INTO ventas (cita_id, empleado_id, servicio_id, fecha, monto)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [citaId, empleadoId, servicioId, fecha, monto]);
    return result;
  },

  // Obtener ventas de un día específico
  async obtenerPorFecha(fecha) {
    const query = `
      SELECT 
        v.*,
        e.nombre as empleado_nombre,
        s.nombre as servicio_nombre,
        c.cliente_nombre
      FROM ventas v
      INNER JOIN empleados e ON v.empleado_id = e.id
      INNER JOIN servicios s ON v.servicio_id = s.id
      INNER JOIN citas c ON v.cita_id = c.id
      WHERE v.fecha = ?
      ORDER BY v.creado_en DESC
    `;
    const [rows] = await pool.execute(query, [fecha]);
    return rows;
  },

  // Obtener ventas por rango de fechas
  async obtenerPorRango(fechaInicio, fechaFin) {
    const query = `
      SELECT 
        v.*,
        e.nombre as empleado_nombre,
        s.nombre as servicio_nombre,
        c.cliente_nombre
      FROM ventas v
      INNER JOIN empleados e ON v.empleado_id = e.id
      INNER JOIN servicios s ON v.servicio_id = s.id
      INNER JOIN citas c ON v.cita_id = c.id
      WHERE v.fecha BETWEEN ? AND ?
      ORDER BY v.fecha ASC, v.creado_en DESC
    `;
    const [rows] = await pool.execute(query, [fechaInicio, fechaFin]);
    return rows;
  },

  // Reporte diario: totales por empleado y servicio
  async reporteDiario(fecha) {
    const queryTotal = `
      SELECT 
        COUNT(*) as total_ventas,
        SUM(monto) as total_dinero
      FROM ventas
      WHERE fecha = ?
    `;
    
    const queryPorEmpleado = `
      SELECT 
        e.nombre as empleado,
        COUNT(*) as cantidad_servicios,
        SUM(v.monto) as total_ganado
      FROM ventas v
      INNER JOIN empleados e ON v.empleado_id = e.id
      WHERE v.fecha = ?
      GROUP BY v.empleado_id, e.nombre
      ORDER BY total_ganado DESC
    `;
    
    const queryPorServicio = `
      SELECT 
        s.nombre as servicio,
        COUNT(*) as cantidad,
        SUM(v.monto) as total
      FROM ventas v
      INNER JOIN servicios s ON v.servicio_id = s.id
      WHERE v.fecha = ?
      GROUP BY v.servicio_id, s.nombre
      ORDER BY total DESC
    `;

    const [totalRows] = await pool.execute(queryTotal, [fecha]);
    const [empleadoRows] = await pool.execute(queryPorEmpleado, [fecha]);
    const [servicioRows] = await pool.execute(queryPorServicio, [fecha]);

    return {
      fecha,
      total: totalRows[0],
      porEmpleado: empleadoRows,
      porServicio: servicioRows
    };
  },

  // Reporte semanal: totales por día
  async reporteSemanal(fechaInicio, fechaFin) {
    const queryPorDia = `
      SELECT 
        fecha,
        COUNT(*) as total_ventas,
        SUM(monto) as total_dinero
      FROM ventas
      WHERE fecha BETWEEN ? AND ?
      GROUP BY fecha
      ORDER BY fecha ASC
    `;
    
    const queryTotal = `
      SELECT 
        COUNT(*) as total_ventas,
        SUM(monto) as total_dinero
      FROM ventas
      WHERE fecha BETWEEN ? AND ?
    `;

    const queryPorEmpleado = `
      SELECT 
        e.nombre as empleado,
        COUNT(*) as cantidad_servicios,
        SUM(v.monto) as total_ganado
      FROM ventas v
      INNER JOIN empleados e ON v.empleado_id = e.id
      WHERE v.fecha BETWEEN ? AND ?
      GROUP BY v.empleado_id, e.nombre
      ORDER BY total_ganado DESC
    `;

    const [diaRows] = await pool.execute(queryPorDia, [fechaInicio, fechaFin]);
    const [totalRows] = await pool.execute(queryTotal, [fechaInicio, fechaFin]);
    const [empleadoRows] = await pool.execute(queryPorEmpleado, [fechaInicio, fechaFin]);

    return {
      fechaInicio,
      fechaFin,
      total: totalRows[0],
      porDia: diaRows,
      porEmpleado: empleadoRows
    };
  },

  // Reporte mensual: totales por día y semana
  async reporteMensual(fechaInicio, fechaFin) {
    const queryPorDia = `
      SELECT 
        fecha,
        COUNT(*) as total_ventas,
        SUM(monto) as total_dinero
      FROM ventas
      WHERE fecha BETWEEN ? AND ?
      GROUP BY fecha
      ORDER BY fecha ASC
    `;
    
    const queryTotal = `
      SELECT 
        COUNT(*) as total_ventas,
        SUM(monto) as total_dinero
      FROM ventas
      WHERE fecha BETWEEN ? AND ?
    `;

    const queryPorEmpleado = `
      SELECT 
        e.nombre as empleado,
        COUNT(*) as cantidad_servicios,
        SUM(v.monto) as total_ganado
      FROM ventas v
      INNER JOIN empleados e ON v.empleado_id = e.id
      WHERE v.fecha BETWEEN ? AND ?
      GROUP BY v.empleado_id, e.nombre
      ORDER BY total_ganado DESC
    `;

    const queryPorServicio = `
      SELECT 
        s.nombre as servicio,
        COUNT(*) as cantidad,
        SUM(v.monto) as total
      FROM ventas v
      INNER JOIN servicios s ON v.servicio_id = s.id
      WHERE v.fecha BETWEEN ? AND ?
      GROUP BY v.servicio_id, s.nombre
      ORDER BY total DESC
    `;

    const [diaRows] = await pool.execute(queryPorDia, [fechaInicio, fechaFin]);
    const [totalRows] = await pool.execute(queryTotal, [fechaInicio, fechaFin]);
    const [empleadoRows] = await pool.execute(queryPorEmpleado, [fechaInicio, fechaFin]);
    const [servicioRows] = await pool.execute(queryPorServicio, [fechaInicio, fechaFin]);

    return {
      fechaInicio,
      fechaFin,
      total: totalRows[0],
      porDia: diaRows,
      porEmpleado: empleadoRows,
      porServicio: servicioRows
    };
  },

  // Verificar si ya existe una venta para una cita
  async existePorCita(citaId) {
    const query = 'SELECT id FROM ventas WHERE cita_id = ?';
    const [rows] = await pool.execute(query, [citaId]);
    return rows.length > 0;
  }
};

export default Venta;
