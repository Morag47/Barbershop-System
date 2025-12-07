import { useState, useEffect } from 'react';
import { reportesAPI } from '../../services/api';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function GestionReportes() {
  const [tipoReporte, setTipoReporte] = useState('diario'); // diario, semanal, mensual
  const [reporteData, setReporteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  
  // Fechas
  const hoy = new Date().toISOString().split('T')[0];
  const [fechaDiaria, setFechaDiaria] = useState(hoy);
  const [fechaInicioSemanal, setFechaInicioSemanal] = useState(hoy);
  const [fechaFinSemanal, setFechaFinSemanal] = useState(hoy);
  const [fechaInicioMensual, setFechaInicioMensual] = useState(hoy);
  const [fechaFinMensual, setFechaFinMensual] = useState(hoy);

  useEffect(() => {
    // Calcular semana actual
    const fecha = new Date();
    const primerDia = new Date(fecha.setDate(fecha.getDate() - fecha.getDay() + 1));
    const ultimoDia = new Date(fecha.setDate(fecha.getDate() - fecha.getDay() + 7));
    setFechaInicioSemanal(primerDia.toISOString().split('T')[0]);
    setFechaFinSemanal(ultimoDia.toISOString().split('T')[0]);

    // Calcular mes actual
    const hoy = new Date();
    const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
    setFechaInicioMensual(primerDiaMes.toISOString().split('T')[0]);
    setFechaFinMensual(ultimoDiaMes.toISOString().split('T')[0]);
  }, []);

  const cargarReporte = async () => {
    try {
      setLoading(true);
      setMensaje('');
      let response;

      if (tipoReporte === 'diario') {
        response = await reportesAPI.obtenerReporteDiario(fechaDiaria);
      } else if (tipoReporte === 'semanal') {
        response = await reportesAPI.obtenerReporteSemanal(fechaInicioSemanal, fechaFinSemanal);
      } else if (tipoReporte === 'mensual') {
        response = await reportesAPI.obtenerReporteMensual(fechaInicioMensual, fechaFinMensual);
      }

      setReporteData(response.data);
    } catch (error) {
      console.error('Error al cargar reporte:', error);
      setMensaje('Error al cargar reporte');
    } finally {
      setLoading(false);
    }
  };

  const descargarPDF = async () => {
    try {
      setMensaje('Generando PDF...');
      let response;
      let filename;

      if (tipoReporte === 'diario') {
        response = await reportesAPI.descargarPDFDiario(fechaDiaria);
        filename = `reporte-diario-${fechaDiaria}.pdf`;
      } else if (tipoReporte === 'semanal') {
        response = await reportesAPI.descargarPDFSemanal(fechaInicioSemanal, fechaFinSemanal);
        filename = `reporte-semanal-${fechaInicioSemanal}-${fechaFinSemanal}.pdf`;
      } else if (tipoReporte === 'mensual') {
        response = await reportesAPI.descargarPDFMensual(fechaInicioMensual, fechaFinMensual);
        filename = `reporte-mensual-${fechaInicioMensual}-${fechaFinMensual}.pdf`;
      }

      // Crear blob y descargar
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setMensaje('PDF descargado exitosamente');
      setTimeout(() => setMensaje(''), 3000);
    } catch (error) {
      console.error('Error al descargar PDF:', error);
      setMensaje('Error al descargar PDF');
    }
  };

  const formatearMoneda = (valor) => {
    return `$${Number(valor || 0).toLocaleString('es-CO')}`;
  };

  const formatearFechaParaGrafica = (fecha) => {
    try {
      if (!fecha) return 'N/A';
      
      // Si la fecha ya viene como objeto Date o timestamp
      let dateObj;
      if (fecha instanceof Date) {
        dateObj = fecha;
      } else if (typeof fecha === 'string') {
        // Formato YYYY-MM-DD
        const [year, month, day] = fecha.split('-').map(n => parseInt(n, 10));
        dateObj = new Date(year, month - 1, day);
      } else {
        dateObj = new Date(fecha);
      }
      
      if (isNaN(dateObj.getTime())) {
        return 'Fecha inválida';
      }
      
      return dateObj.toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'short'
      });
    } catch (error) {
      console.error('Error formateando fecha para gráfica:', fecha, error);
      return 'Error';
    }
  };

  const formatearFecha = (fecha) => {
    try {
      if (!fecha) return 'N/A';
      
      let dateObj;
      if (fecha instanceof Date) {
        dateObj = fecha;
      } else if (typeof fecha === 'string') {
        const [year, month, day] = fecha.split('-').map(n => parseInt(n, 10));
        dateObj = new Date(year, month - 1, day);
      } else {
        dateObj = new Date(fecha);
      }
      
      if (isNaN(dateObj.getTime())) {
        return 'Fecha inválida';
      }
      
      return dateObj.toLocaleDateString('es-CO', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      });
    } catch (error) {
      console.error('Error formateando fecha:', fecha, error);
      return 'Error';
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '2rem', color: 'var(--primary-gold)' }}>
        📊 Reportes y Estadísticas
      </h2>

      {mensaje && (
        <div style={{
          padding: '1rem',
          background: mensaje.includes('Error') ? '#d32f2f' : '#4caf50',
          color: 'white',
          borderRadius: '4px',
          marginBottom: '1.5rem'
        }}>
          {mensaje}
        </div>
      )}

      {/* Selector de tipo de reporte */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2rem',
        borderBottom: '1px solid var(--neutral-gray)',
        paddingBottom: '1rem'
      }}>
        <button
          onClick={() => setTipoReporte('diario')}
          style={{
            padding: '0.8rem 1.5rem',
            background: tipoReporte === 'diario' ? 'var(--primary-gold)' : 'var(--neutral-charcoal)',
            color: tipoReporte === 'diario' ? '#000' : 'var(--neutral-light)',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'var(--transition)'
          }}
        >
          📅 Reporte Diario
        </button>
        <button
          onClick={() => setTipoReporte('semanal')}
          style={{
            padding: '0.8rem 1.5rem',
            background: tipoReporte === 'semanal' ? 'var(--primary-gold)' : 'var(--neutral-charcoal)',
            color: tipoReporte === 'semanal' ? '#000' : 'var(--neutral-light)',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'var(--transition)'
          }}
        >
          📊 Reporte Semanal
        </button>
        <button
          onClick={() => setTipoReporte('mensual')}
          style={{
            padding: '0.8rem 1.5rem',
            background: tipoReporte === 'mensual' ? 'var(--primary-gold)' : 'var(--neutral-charcoal)',
            color: tipoReporte === 'mensual' ? '#000' : 'var(--neutral-light)',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'var(--transition)'
          }}
        >
          📈 Reporte Mensual
        </button>
      </div>

      {/* Selector de fechas */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Seleccionar Período</h3>
        
        {tipoReporte === 'diario' && (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--neutral-silver)' }}>
                Fecha:
              </label>
              <input
                type="date"
                value={fechaDiaria}
                onChange={(e) => setFechaDiaria(e.target.value)}
                max={hoy}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  background: 'var(--neutral-charcoal)',
                  border: '1px solid var(--neutral-gray)',
                  borderRadius: '4px',
                  color: 'var(--neutral-light)',
                  fontSize: '1rem'
                }}
              />
            </div>
            <button onClick={cargarReporte} className="btn btn-primary" disabled={loading}>
              {loading ? 'Cargando...' : 'Generar Reporte'}
            </button>
          </div>
        )}

        {tipoReporte === 'semanal' && (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--neutral-silver)' }}>
                Fecha Inicio:
              </label>
              <input
                type="date"
                value={fechaInicioSemanal}
                onChange={(e) => setFechaInicioSemanal(e.target.value)}
                max={hoy}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  background: 'var(--neutral-charcoal)',
                  border: '1px solid var(--neutral-gray)',
                  borderRadius: '4px',
                  color: 'var(--neutral-light)',
                  fontSize: '1rem'
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--neutral-silver)' }}>
                Fecha Fin:
              </label>
              <input
                type="date"
                value={fechaFinSemanal}
                onChange={(e) => setFechaFinSemanal(e.target.value)}
                max={hoy}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  background: 'var(--neutral-charcoal)',
                  border: '1px solid var(--neutral-gray)',
                  borderRadius: '4px',
                  color: 'var(--neutral-light)',
                  fontSize: '1rem'
                }}
              />
            </div>
            <button onClick={cargarReporte} className="btn btn-primary" disabled={loading}>
              {loading ? 'Cargando...' : 'Generar Reporte'}
            </button>
          </div>
        )}

        {tipoReporte === 'mensual' && (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--neutral-silver)' }}>
                Fecha Inicio:
              </label>
              <input
                type="date"
                value={fechaInicioMensual}
                onChange={(e) => setFechaInicioMensual(e.target.value)}
                max={hoy}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  background: 'var(--neutral-charcoal)',
                  border: '1px solid var(--neutral-gray)',
                  borderRadius: '4px',
                  color: 'var(--neutral-light)',
                  fontSize: '1rem'
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--neutral-silver)' }}>
                Fecha Fin:
              </label>
              <input
                type="date"
                value={fechaFinMensual}
                onChange={(e) => setFechaFinMensual(e.target.value)}
                max={hoy}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  background: 'var(--neutral-charcoal)',
                  border: '1px solid var(--neutral-gray)',
                  borderRadius: '4px',
                  color: 'var(--neutral-light)',
                  fontSize: '1rem'
                }}
              />
            </div>
            <button onClick={cargarReporte} className="btn btn-primary" disabled={loading}>
              {loading ? 'Cargando...' : 'Generar Reporte'}
            </button>
          </div>
        )}
      </div>

      {/* Mostrar reporte */}
      {reporteData && (
        <>
          {/* Resumen General */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="card" style={{ background: 'linear-gradient(135deg, #d4af37 0%, #aa8c2c 100%)', color: '#000' }}>
              <h4 style={{ marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>Total Ingresos</h4>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {formatearMoneda(reporteData.total?.total_dinero)}
              </div>
              <div style={{ fontSize: '0.85rem', marginTop: '0.5rem', opacity: 0.8 }}>
                COP
              </div>
            </div>
            
            <div className="card" style={{ background: 'var(--neutral-charcoal)' }}>
              <h4 style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--neutral-silver)' }}>Total Servicios</h4>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-gold)' }}>
                {reporteData.total?.total_ventas || 0}
              </div>
              <div style={{ fontSize: '0.85rem', marginTop: '0.5rem', color: 'var(--neutral-silver)' }}>
                servicios
              </div>
            </div>

            {(tipoReporte === 'semanal' || tipoReporte === 'mensual') && reporteData.porDia?.length > 0 && (
              <div className="card" style={{ background: 'var(--neutral-charcoal)' }}>
                <h4 style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--neutral-silver)' }}>Promedio Diario</h4>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-gold)' }}>
                  {formatearMoneda((reporteData.total?.total_dinero || 0) / reporteData.porDia.length)}
                </div>
                <div style={{ fontSize: '0.85rem', marginTop: '0.5rem', color: 'var(--neutral-silver)' }}>
                  COP/día
                </div>
              </div>
            )}
          </div>

          {/* Gráfica de ingresos por día (solo semanal y mensual) */}
          {(tipoReporte === 'semanal' || tipoReporte === 'mensual') && reporteData.porDia && reporteData.porDia.length > 0 && (
            <div className="card" style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3>Ingresos por Día</h3>
                <button onClick={descargarPDF} className="btn btn-secondary">
                  📄 Descargar PDF
                </button>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={reporteData.porDia.map(dia => ({
                  ...dia,
                  fechaLabel: formatearFechaParaGrafica(dia.fecha)
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis 
                    dataKey="fechaLabel"
                    stroke="#999"
                  />
                  <YAxis 
                    stroke="#999"
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      background: '#2a2a2a', 
                      border: '1px solid #d4af37',
                      borderRadius: '4px'
                    }}
                    formatter={(value) => formatearMoneda(value)}
                    labelFormatter={(label, payload) => {
                      if (payload && payload[0] && payload[0].payload.fecha) {
                        return formatearFecha(payload[0].payload.fecha);
                      }
                      return label;
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="total_dinero" 
                    stroke="#d4af37" 
                    strokeWidth={3}
                    name="Ingresos"
                    dot={{ fill: '#d4af37', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Ventas por Empleado */}
          {reporteData.porEmpleado && reporteData.porEmpleado.length > 0 && (
            <div className="card" style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Ventas por Empleado</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={reporteData.porEmpleado}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="empleado" stroke="#999" />
                  <YAxis 
                    stroke="#999"
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      background: '#2a2a2a', 
                      border: '1px solid #d4af37',
                      borderRadius: '4px'
                    }}
                    formatter={(value) => formatearMoneda(value)}
                  />
                  <Legend />
                  <Bar dataKey="total_ganado" fill="#d4af37" name="Ganancias" />
                </BarChart>
              </ResponsiveContainer>
              
              <div style={{ marginTop: '1.5rem' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Empleado</th>
                      <th>Servicios</th>
                      <th>Total Ganado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reporteData.porEmpleado.map((emp, index) => (
                      <tr key={index}>
                        <td style={{ fontWeight: '600' }}>{emp.empleado}</td>
                        <td>{emp.cantidad_servicios}</td>
                        <td style={{ color: 'var(--primary-gold)', fontWeight: 'bold' }}>
                          {formatearMoneda(emp.total_ganado)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Ventas por Servicio */}
          {reporteData.porServicio && reporteData.porServicio.length > 0 && (
            <div className="card">
              <h3 style={{ marginBottom: '1.5rem' }}>Ventas por Servicio</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={reporteData.porServicio}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="servicio" stroke="#999" />
                  <YAxis 
                    stroke="#999"
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      background: '#2a2a2a', 
                      border: '1px solid #d4af37',
                      borderRadius: '4px'
                    }}
                    formatter={(value) => formatearMoneda(value)}
                  />
                  <Legend />
                  <Bar dataKey="total" fill="#64b5f6" name="Ingresos" />
                </BarChart>
              </ResponsiveContainer>
              
              <div style={{ marginTop: '1.5rem' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Servicio</th>
                      <th>Cantidad</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reporteData.porServicio.map((srv, index) => (
                      <tr key={index}>
                        <td style={{ fontWeight: '600' }}>{srv.servicio}</td>
                        <td>{srv.cantidad}</td>
                        <td style={{ color: 'var(--primary-gold)', fontWeight: 'bold' }}>
                          {formatearMoneda(srv.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Botón de descarga PDF para reporte diario */}
          {tipoReporte === 'diario' && (
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <button onClick={descargarPDF} className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
                📄 Descargar Reporte en PDF
              </button>
            </div>
          )}
        </>
      )}

      {!reporteData && !loading && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
          <h3 style={{ color: 'var(--neutral-silver)' }}>
            Selecciona un período y genera tu reporte
          </h3>
        </div>
      )}
    </div>
  );
}

export default GestionReportes;
