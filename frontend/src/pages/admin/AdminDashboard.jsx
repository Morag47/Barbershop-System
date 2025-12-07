import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import GestionServicios from './GestionServicios';
import GestionEmpleados from './GestionEmpleados';
import GestionBloqueos from './GestionBloqueos';
import GestionReportes from './GestionReportes';

// Componente para gestión de citas con diseño premium
function GestionCitas() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    cargarCitas();
  }, [filtroEstado]);

  const cargarCitas = async () => {
    try {
      const response = await adminAPI.obtenerCitas(filtroEstado);
      setCitas(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstado = async (id, accion) => {
    try {
      if (accion === 'confirmar') {
        await adminAPI.confirmarCita(id);
        setMensaje('Cita confirmada exitosamente');
      }
      if (accion === 'cancelar') {
        await adminAPI.cancelarCita(id);
        setMensaje('Cita cancelada');
      }
      if (accion === 'completar') {
        await adminAPI.completarCita(id);
        setMensaje('Cita completada');
      }
      cargarCitas();
      setTimeout(() => setMensaje(''), 3000);
    } catch (error) {
      alert('Error al cambiar estado');
    }
  };

  if (loading) return <div className="loading">Cargando citas...</div>;

  return (
    <div className="fade-in">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h2 style={{ margin: 0 }}>Gestión de Citas</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label style={{ color: 'var(--neutral-light)', fontWeight: '500' }}>
            Filtrar:
          </label>
          <select 
            value={filtroEstado} 
            onChange={(e) => setFiltroEstado(e.target.value)}
            style={{ minWidth: '180px' }}
          >
            <option value="">Todas las Citas</option>
            <option value="pendiente">Pendientes</option>
            <option value="confirmada">Confirmadas</option>
            <option value="cancelada">Canceladas</option>
            <option value="completada">Completadas</option>
          </select>
        </div>
      </div>

      {mensaje && (
        <div className="success-message" style={{ marginBottom: '1.5rem' }}>
          ✓ {mensaje}
        </div>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Contacto</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Servicio</th>
              <th>Barbero</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {citas.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '3rem', color: 'var(--neutral-silver)' }}>
                  No hay citas {filtroEstado ? `en estado "${filtroEstado}"` : 'registradas'}
                </td>
              </tr>
            ) : (
              citas.map((cita) => (
                <tr key={cita.id}>
                  <td style={{ fontWeight: 'bold', color: 'var(--primary-gold)' }}>
                    #{cita.id}
                  </td>
                  <td>
                    <div style={{ fontWeight: '600' }}>{cita.cliente_nombre}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--neutral-silver)' }}>
                      {cita.cliente_cedula}
                    </div>
                  </td>
                  <td>
                    <div>{cita.cliente_telefono}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--neutral-silver)' }}>
                      {cita.cliente_email}
                    </div>
                  </td>
                  <td style={{ fontWeight: '500' }}>
                    {new Date(cita.fecha + 'T00:00:00').toLocaleDateString('es-CO', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short'
                    })}
                  </td>
                  <td style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                    {cita.hora.substring(0, 5)}
                  </td>
                  <td>{cita.servicio_nombre}</td>
                  <td>{cita.empleado_nombre}</td>
                  <td>
                    <span className={`badge badge-${cita.estado}`}>
                      {cita.estado}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {cita.estado === 'pendiente' && (
                        <>
                          <button 
                            onClick={() => cambiarEstado(cita.id, 'confirmar')}
                            className="btn btn-primary" 
                            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                          >
                            ✓ Confirmar
                          </button>
                          <button 
                            onClick={() => cambiarEstado(cita.id, 'cancelar')}
                            className="btn btn-danger" 
                            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                          >
                            ✗ Cancelar
                          </button>
                        </>
                      )}
                      {cita.estado === 'confirmada' && (
                        <button 
                          onClick={() => cambiarEstado(cita.id, 'completar')}
                          className="btn btn-primary" 
                          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                        >
                          ✓ Completar
                        </button>
                      )}
                      {(cita.estado === 'completada' || cita.estado === 'cancelada') && (
                        <span style={{ color: 'var(--neutral-silver)', fontSize: '0.85rem' }}>
                          Sin acciones
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={{ 
        marginTop: '2rem', 
        padding: '1.5rem',
        background: 'var(--neutral-dark)',
        borderRadius: '6px',
        border: '1px solid var(--neutral-gray)'
      }}>
        <h4 style={{ marginBottom: '1rem', color: 'var(--primary-gold)' }}>
          Estadísticas
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-gold)' }}>
              {citas.length}
            </div>
            <div style={{ color: 'var(--neutral-silver)', fontSize: '0.9rem' }}>
              Total Citas
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffd54f' }}>
              {citas.filter(c => c.estado === 'pendiente').length}
            </div>
            <div style={{ color: 'var(--neutral-silver)', fontSize: '0.9rem' }}>
              Pendientes
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#64b5f6' }}>
              {citas.filter(c => c.estado === 'confirmada').length}
            </div>
            <div style={{ color: 'var(--neutral-silver)', fontSize: '0.9rem' }}>
              Confirmadas
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#81c784' }}>
              {citas.filter(c => c.estado === 'completada').length}
            </div>
            <div style={{ color: 'var(--neutral-silver)', fontSize: '0.9rem' }}>
              Completadas
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dashboard principal con diseño premium
function AdminDashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [seccionActiva, setSeccionActiva] = useState('citas');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const adminData = localStorage.getItem('admin');
    
    if (!token || !adminData) {
      navigate('/admin/login');
      return;
    }
    
    setAdmin(JSON.parse(adminData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    navigate('/admin/login');
  };

  if (!admin) return null;

  // Renderizar contenido según sección activa
  const renderContenido = () => {
    switch(seccionActiva) {
      case 'citas':
        return <GestionCitas />;
      case 'servicios':
        return <GestionServicios />;
      case 'empleados':
        return <GestionEmpleados />;
      case 'bloqueos':
        return <GestionBloqueos />;
      case 'reportes':
        return <GestionReportes />;
      default:
        return <GestionCitas />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)' }}>
      {/* Header Premium */}
      <nav className="navbar">
        <div className="navbar-content">
          <h1>HIGHBURY BARBER - ADMIN</h1>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: 'var(--neutral-charcoal)',
              borderRadius: '4px',
              border: '1px solid var(--primary-gold)'
            }}>
              <span style={{ fontSize: '1.2rem' }}>👤</span>
              <span style={{ color: 'var(--primary-gold)', fontWeight: '600' }}>
                {admin.nombre}
              </span>
            </div>
            <button 
              onClick={handleLogout} 
              className="btn btn-danger"
              style={{ padding: '0.7rem 1.5rem' }}
            >
              Cerrar Sesión
            </button>
          </nav>
        </div>
      </nav>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)' }}>
        {/* Sidebar Premium */}
        <div style={{ 
          width: '280px', 
          background: 'var(--neutral-charcoal)',
          borderRight: '1px solid var(--neutral-gray)',
          padding: '2rem 0'
        }}>
          <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
            <h3 style={{ 
              color: 'var(--primary-gold)', 
              fontSize: '1.1rem',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '1.5rem'
            }}>
              Menú Principal
            </h3>
          </div>
          
          <nav style={{ display: 'flex', flexDirection: 'column' }}>
            <button 
              onClick={() => setSeccionActiva('citas')}
              style={{ 
                color: seccionActiva === 'citas' ? 'var(--primary-gold)' : 'var(--neutral-light)',
                background: 'transparent',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                padding: '1rem 1.5rem',
                borderLeft: seccionActiva === 'citas' ? '4px solid var(--primary-gold)' : '4px solid transparent',
                backgroundColor: seccionActiva === 'citas' ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                fontWeight: seccionActiva === 'citas' ? '600' : '400',
                transition: 'var(--transition)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                fontSize: '1rem'
              }}
            >
              <span style={{ fontSize: '1.3rem' }}>📅</span>
              <span>Gestión de Citas</span>
            </button>
            
            <button 
              onClick={() => setSeccionActiva('servicios')}
              style={{ 
                color: seccionActiva === 'servicios' ? 'var(--primary-gold)' : 'var(--neutral-light)',
                background: 'transparent',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                padding: '1rem 1.5rem',
                borderLeft: seccionActiva === 'servicios' ? '4px solid var(--primary-gold)' : '4px solid transparent',
                backgroundColor: seccionActiva === 'servicios' ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                fontWeight: seccionActiva === 'servicios' ? '600' : '400',
                transition: 'var(--transition)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                fontSize: '1rem'
              }}
            >
              <span style={{ fontSize: '1.3rem' }}>✂️</span>
              <span>Gestión de Servicios</span>
            </button>
            
            <button 
              onClick={() => setSeccionActiva('empleados')}
              style={{ 
                color: seccionActiva === 'empleados' ? 'var(--primary-gold)' : 'var(--neutral-light)',
                background: 'transparent',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                padding: '1rem 1.5rem',
                borderLeft: seccionActiva === 'empleados' ? '4px solid var(--primary-gold)' : '4px solid transparent',
                backgroundColor: seccionActiva === 'empleados' ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                fontWeight: seccionActiva === 'empleados' ? '600' : '400',
                transition: 'var(--transition)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                fontSize: '1rem'
              }}
            >
              <span style={{ fontSize: '1.3rem' }}>👥</span>
              <span>Gestión de Empleados</span>
            </button>
            
            <button 
              onClick={() => setSeccionActiva('bloqueos')}
              style={{ 
                color: seccionActiva === 'bloqueos' ? 'var(--primary-gold)' : 'var(--neutral-light)',
                background: 'transparent',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                padding: '1rem 1.5rem',
                borderLeft: seccionActiva === 'bloqueos' ? '4px solid var(--primary-gold)' : '4px solid transparent',
                backgroundColor: seccionActiva === 'bloqueos' ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                fontWeight: seccionActiva === 'bloqueos' ? '600' : '400',
                transition: 'var(--transition)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                fontSize: '1rem'
              }}
            >
              <span style={{ fontSize: '1.3rem' }}>🚫</span>
              <span>Bloqueos y Vacaciones</span>
            </button>
            
            <button 
              onClick={() => setSeccionActiva('reportes')}
              style={{ 
                color: seccionActiva === 'reportes' ? 'var(--primary-gold)' : 'var(--neutral-light)',
                background: 'transparent',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                padding: '1rem 1.5rem',
                borderLeft: seccionActiva === 'reportes' ? '4px solid var(--primary-gold)' : '4px solid transparent',
                backgroundColor: seccionActiva === 'reportes' ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                fontWeight: seccionActiva === 'reportes' ? '600' : '400',
                transition: 'var(--transition)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                fontSize: '1rem'
              }}
            >
              <span style={{ fontSize: '1.3rem' }}>📊</span>
              <span>Reportes y Estadísticas</span>
            </button>
            
            <Link 
              to="/" 
              style={{ 
                color: 'var(--neutral-light)',
                textDecoration: 'none',
                padding: '1rem 1.5rem',
                borderLeft: '4px solid transparent',
                fontWeight: '400',
                transition: 'var(--transition)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginTop: '1rem',
                borderTop: '1px solid var(--neutral-gray)'
              }}
            >
              <span style={{ fontSize: '1.3rem' }}>🏠</span>
              <span>Ir al Sitio Web</span>
            </Link>
          </nav>
        </div>

        {/* Contenido principal */}
        <div style={{ 
          flex: 1, 
          padding: '2.5rem', 
          background: 'var(--bg-dark)',
          overflowY: 'auto'
        }}>
          <div className="fade-in">
            {renderContenido()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
