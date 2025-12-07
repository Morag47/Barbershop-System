import { useState, useEffect } from 'react';
import { bloqueosAPI, empleadosAPI } from '../../services/api';

function GestionBloqueos() {
  const [bloqueos, setBloqueos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [bloqueoEdit, setBloqueoEdit] = useState(null);
  const [mensaje, setMensaje] = useState('');
  
  const [formData, setFormData] = useState({
    empleado_id: '',
    fecha_inicio: '',
    fecha_fin: '',
    motivo: 'vacaciones',
    descripcion: ''
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [bloqueosRes, empleadosRes] = await Promise.all([
        bloqueosAPI.obtenerTodos(),
        empleadosAPI.obtenerTodosAdmin()
      ]);
      setBloqueos(bloqueosRes.data);
      setEmpleados(empleadosRes.data.filter(e => e.activo));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const limpiarForm = () => {
    setFormData({
      empleado_id: '',
      fecha_inicio: '',
      fecha_fin: '',
      motivo: 'vacaciones',
      descripcion: ''
    });
    setBloqueoEdit(null);
    setMostrarForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (new Date(formData.fecha_inicio) > new Date(formData.fecha_fin)) {
      alert('La fecha de inicio no puede ser mayor a la fecha de fin');
      return;
    }

    try {
      if (bloqueoEdit) {
        await bloqueosAPI.actualizar(bloqueoEdit.id, formData);
        setMensaje('Bloqueo actualizado exitosamente');
      } else {
        await bloqueosAPI.crear(formData);
        setMensaje('Bloqueo creado exitosamente');
      }
      cargarDatos();
      limpiarForm();
      setTimeout(() => setMensaje(''), 3000);
    } catch (error) {
      alert('Error al guardar bloqueo: ' + (error.response?.data?.error || error.message));
    }
  };

  const editarBloqueo = (bloqueo) => {
    setBloqueoEdit(bloqueo);
    setFormData({
      empleado_id: bloqueo.empleado_id,
      fecha_inicio: bloqueo.fecha_inicio.split('T')[0],
      fecha_fin: bloqueo.fecha_fin.split('T')[0],
      motivo: bloqueo.motivo,
      descripcion: bloqueo.descripcion || ''
    });
    setMostrarForm(true);
  };

  const eliminarBloqueo = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este bloqueo?')) return;
    
    try {
      await bloqueosAPI.eliminar(id);
      setMensaje('Bloqueo eliminado');
      cargarDatos();
      setTimeout(() => setMensaje(''), 3000);
    } catch (error) {
      alert('Error al eliminar bloqueo');
    }
  };

  const getNombreEmpleado = (id) => {
    const empleado = empleados.find(e => e.id === id);
    return empleado ? empleado.nombre : `ID: ${id}`;
  };

  const getMotivoLabel = (motivo) => {
    const motivos = {
      'vacaciones': 'Vacaciones',
      'dia_libre': 'Día Libre',
      'otro': 'Otro'
    };
    return motivos[motivo] || motivo;
  };

  if (loading) return <div className="loading">Cargando bloqueos...</div>;

  return (
    <div className="fade-in">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h2 style={{ margin: 0 }}>Gestión de Bloqueos</h2>
        <button 
          onClick={() => setMostrarForm(!mostrarForm)}
          className="btn btn-primary"
        >
          {mostrarForm ? 'Cancelar' : '+ Nuevo Bloqueo'}
        </button>
      </div>

      {mensaje && (
        <div className="success-message" style={{ marginBottom: '1.5rem' }}>
          ✓ {mensaje}
        </div>
      )}

      {mostrarForm && (
        <div style={{
          background: 'var(--neutral-dark)',
          padding: '2rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          border: '1px solid var(--neutral-gray)'
        }}>
          <h3 style={{ marginTop: 0 }}>
            {bloqueoEdit ? 'Editar Bloqueo' : 'Nuevo Bloqueo'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Empleado *</label>
              <select
                name="empleado_id"
                value={formData.empleado_id}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar empleado...</option>
                {empleados.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Fecha Inicio *</label>
                <input
                  type="date"
                  name="fecha_inicio"
                  value={formData.fecha_inicio}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="form-group">
                <label>Fecha Fin *</label>
                <input
                  type="date"
                  name="fecha_fin"
                  value={formData.fecha_fin}
                  onChange={handleChange}
                  min={formData.fecha_inicio || new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Motivo *</label>
              <select
                name="motivo"
                value={formData.motivo}
                onChange={handleChange}
                required
              >
                <option value="vacaciones">Vacaciones</option>
                <option value="dia_libre">Día Libre</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div className="form-group">
              <label>Descripción (opcional)</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows="3"
                placeholder="Detalles adicionales sobre el bloqueo..."
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button type="submit" className="btn btn-primary">
                {bloqueoEdit ? 'Actualizar' : 'Crear'} Bloqueo
              </button>
              <button type="button" onClick={limpiarForm} className="btn btn-secondary">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Empleado</th>
              <th>Fecha Inicio</th>
              <th>Fecha Fin</th>
              <th>Motivo</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {bloqueos.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                  No hay bloqueos registrados
                </td>
              </tr>
            ) : (
              bloqueos.map((bloqueo) => (
                <tr key={bloqueo.id}>
                  <td>{bloqueo.id}</td>
                  <td style={{ fontWeight: '600' }}>{getNombreEmpleado(bloqueo.empleado_id)}</td>
                  <td>{new Date(bloqueo.fecha_inicio).toLocaleDateString('es-CO')}</td>
                  <td>{new Date(bloqueo.fecha_fin).toLocaleDateString('es-CO')}</td>
                  <td>
                    <span className="badge badge-warning">
                      {getMotivoLabel(bloqueo.motivo)}
                    </span>
                  </td>
                  <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {bloqueo.descripcion || '-'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => editarBloqueo(bloqueo)}
                        className="btn btn-small"
                        style={{ padding: '0.4rem 0.8rem' }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => eliminarBloqueo(bloqueo.id)}
                        className="btn btn-secondary btn-small"
                        style={{ padding: '0.4rem 0.8rem' }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GestionBloqueos;
