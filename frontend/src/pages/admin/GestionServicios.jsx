import { useState, useEffect } from 'react';
import { serviciosAPI } from '../../services/api';

function GestionServicios() {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [servicioEdit, setServicioEdit] = useState(null);
  const [mensaje, setMensaje] = useState('');
  
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    duracion: 60,
    precio: '',
    activo: true
  });

  useEffect(() => {
    cargarServicios();
  }, []);

  const cargarServicios = async () => {
    try {
      const response = await serviciosAPI.obtenerTodosAdmin();
      setServicios(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const limpiarForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      duracion: 60,
      precio: '',
      activo: true
    });
    setServicioEdit(null);
    setMostrarForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (servicioEdit) {
        await serviciosAPI.actualizar(servicioEdit.id, formData);
        setMensaje('Servicio actualizado exitosamente');
      } else {
        await serviciosAPI.crear(formData);
        setMensaje('Servicio creado exitosamente');
      }
      cargarServicios();
      limpiarForm();
      setTimeout(() => setMensaje(''), 3000);
    } catch (error) {
      alert('Error al guardar servicio: ' + (error.response?.data?.error || error.message));
    }
  };

  const editarServicio = (servicio) => {
    setServicioEdit(servicio);
    setFormData({
      nombre: servicio.nombre,
      descripcion: servicio.descripcion || '',
      duracion: servicio.duracion,
      precio: servicio.precio,
      activo: servicio.activo
    });
    setMostrarForm(true);
  };

  const eliminarServicio = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este servicio?')) return;
    
    try {
      await serviciosAPI.eliminar(id);
      setMensaje('Servicio eliminado');
      cargarServicios();
      setTimeout(() => setMensaje(''), 3000);
    } catch (error) {
      alert('Error al eliminar servicio');
    }
  };

  if (loading) return <div className="loading">Cargando servicios...</div>;

  return (
    <div className="fade-in">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h2 style={{ margin: 0 }}>Gestión de Servicios</h2>
        <button 
          onClick={() => setMostrarForm(!mostrarForm)}
          className="btn btn-primary"
        >
          {mostrarForm ? 'Cancelar' : '+ Nuevo Servicio'}
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
            {servicioEdit ? 'Editar Servicio' : 'Nuevo Servicio'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Precio (COP) *</label>
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  min="0"
                  step="1000"
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Duración (minutos)</label>
                <input
                  type="number"
                  name="duracion"
                  value={formData.duracion}
                  onChange={handleChange}
                  min="15"
                  step="15"
                />
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  name="activo"
                  checked={formData.activo}
                  onChange={handleChange}
                  id="activo"
                />
                <label htmlFor="activo" style={{ margin: 0 }}>Servicio Activo</label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button type="submit" className="btn btn-primary">
                {servicioEdit ? 'Actualizar' : 'Crear'} Servicio
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
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Duración</th>
              <th>Precio</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {servicios.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                  No hay servicios registrados
                </td>
              </tr>
            ) : (
              servicios.map((servicio) => (
                <tr key={servicio.id}>
                  <td>{servicio.id}</td>
                  <td style={{ fontWeight: '600' }}>{servicio.nombre}</td>
                  <td style={{ 
                    minWidth: '300px',
                    whiteSpace: 'normal',
                    wordWrap: 'break-word',
                    lineHeight: '1.4'
                  }}>
                    {servicio.descripcion || '-'}
                  </td>
                  <td>{servicio.duracion} min</td>
                  <td style={{ color: 'var(--primary-gold)', fontWeight: '600' }}>
                    ${parseFloat(servicio.precio).toLocaleString('es-CO')}
                  </td>
                  <td>
                    <span className={`badge badge-${servicio.activo ? 'success' : 'secondary'}`}>
                      {servicio.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => editarServicio(servicio)}
                        className="btn btn-small"
                        style={{ padding: '0.4rem 0.8rem' }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => eliminarServicio(servicio.id)}
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

export default GestionServicios;
