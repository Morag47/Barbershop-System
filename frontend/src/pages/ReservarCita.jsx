import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { serviciosAPI, empleadosAPI, disponibilidadAPI, citasAPI } from '../services/api';

function ReservarCita() {
  const navigate = useNavigate();
  const [paso, setPaso] = useState(1);
  const [servicios, setServicios] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [mesActual, setMesActual] = useState(new Date());

  const [formData, setFormData] = useState({
    servicio_id: '',
    empleado_id: '',
    fecha: '',
    hora: '',
    cliente_nombre: '',
    cliente_cedula: '',
    cliente_email: '',
    cliente_telefono: ''
  });

  const [horariosDisponibles, setHorariosDisponibles] = useState([]);

  useEffect(() => {
    cargarServicios();
    cargarEmpleados();
  }, []);

  const cargarServicios = async () => {
    try {
      const response = await serviciosAPI.obtenerTodos();
      setServicios(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const cargarEmpleados = async () => {
    try {
      const response = await empleadosAPI.obtenerTodos();
      setEmpleados([
        { id: 0, nombre: 'Cualquier Barbero Disponible' },
        ...response.data
      ]);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const cargarDisponibilidad = async () => {
    if (!formData.fecha) return;
    
    setLoading(true);
    try {
      const params = { fecha: formData.fecha };
      if (formData.empleado_id && formData.empleado_id !== '0') {
        params.empleado_id = formData.empleado_id;
      }
      
      const response = await disponibilidadAPI.obtener(params);
      
      if (response.data.disponible) {
        if (formData.empleado_id && formData.empleado_id !== '0') {
          setHorariosDisponibles(response.data.horarios || []);
        } else {
          setHorariosDisponibles(response.data.horarios_disponibles?.map(h => ({ hora: h, disponible: true })) || []);
        }
      } else {
        setHorariosDisponibles([]);
        setError(response.data.mensaje || 'No hay horarios disponibles');
      }
    } catch (error) {
      setError('Error al cargar disponibilidad');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formData.fecha) {
      cargarDisponibilidad();
    }
  }, [formData.fecha, formData.empleado_id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  // Funciones del calendario
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startDayOfWeek, year, month };
  };

  const formatDate = (day) => {
    const { year, month } = getDaysInMonth(mesActual);
    const date = new Date(year, month, day);
    return date.toISOString().split('T')[0];
  };

  const isDateDisabled = (day) => {
    const selectedDate = new Date(mesActual.getFullYear(), mesActual.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate < today;
  };

  const cambiarMes = (direccion) => {
    const newDate = new Date(mesActual);
    newDate.setMonth(newDate.getMonth() + direccion);
    setMesActual(newDate);
  };

  const seleccionarFecha = (day) => {
    if (isDateDisabled(day)) return;
    const fechaFormateada = formatDate(day);
    setFormData({ ...formData, fecha: fechaFormateada, hora: '' });
    setError('');
  };

  const siguientePaso = () => {
    if (paso === 1 && !formData.servicio_id) {
      setError('Por favor seleccioná un servicio');
      return;
    }
    if (paso === 2 && !formData.empleado_id) {
      setError('Por favor seleccioná un barbero');
      return;
    }
    if (paso === 3 && (!formData.fecha || !formData.hora)) {
      setError('Por favor seleccioná fecha y hora');
      return;
    }
    setPaso(paso + 1);
    setError('');
  };

  const anteriorPaso = () => {
    setPaso(paso - 1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let empleadoFinal = formData.empleado_id;
      
      if (empleadoFinal === '0') {
        const response = await disponibilidadAPI.obtener({ fecha: formData.fecha });
        const empleadoDisponible = response.data.por_empleado?.find(e => 
          e.horarios.some(h => h.hora === formData.hora && h.disponible)
        );
        
        if (!empleadoDisponible) {
          setError('No hay empleados disponibles para este horario');
          setLoading(false);
          return;
        }
        
        empleadoFinal = empleadoDisponible.empleado_id;
      }

      await citasAPI.crear({
        ...formData,
        empleado_id: empleadoFinal
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 4000);
    } catch (error) {
      setError(error.response?.data?.error || 'Error al crear la cita');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fade-in">
        <nav className="navbar">
          <div className="navbar-content">
            <h1>HIGHBURY BARBER</h1>
          </div>
        </nav>
        <div className="container" style={{ 
          maxWidth: '600px', 
          textAlign: 'center', 
          paddingTop: '5rem' 
        }}>
          <div style={{
            background: 'var(--neutral-charcoal)',
            border: '2px solid var(--primary-gold)',
            borderRadius: '8px',
            padding: '3rem 2rem',
            boxShadow: 'var(--shadow-xl)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>✅</div>
            <h2 style={{ color: 'var(--primary-gold)', marginBottom: '1.5rem' }}>
              ¡Reserva Confirmada!
            </h2>
            <p style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--neutral-light)' }}>
              Tu cita ha sido agendada exitosamente.
            </p>
            <p style={{ color: 'var(--neutral-silver)', marginBottom: '0.5rem' }}>
              📧 Te enviamos un email de confirmación
            </p>
            <p style={{ color: 'var(--neutral-silver)', marginBottom: '2rem' }}>
              📱 Recibirás un recordatorio por WhatsApp 3 horas antes
            </p>
            <div className="loading" style={{ color: 'var(--primary-gold)', fontSize: '1rem' }}>
              Redirigiendo al inicio...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <nav className="navbar">
        <div className="navbar-content">
          <h1>HIGHBURY BARBER</h1>
          <nav>
            <Link to="/">Volver al Inicio</Link>
          </nav>
        </div>
      </nav>

      <div className="container" style={{ maxWidth: '900px', paddingTop: '3rem', paddingBottom: '3rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
          Reservá Tu Cita
        </h2>

        {/* Progress Stepper Premium */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginBottom: '3rem',
          position: 'relative',
          paddingBottom: '1rem'
        }}>
          {/* Línea de progreso */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '12.5%',
            right: '12.5%',
            height: '3px',
            background: 'var(--neutral-gray)',
            zIndex: 0
          }}>
            <div style={{
              height: '100%',
              background: 'var(--primary-gold)',
              width: `${((paso - 1) / 3) * 100}%`,
              transition: 'width 0.3s ease'
            }}></div>
          </div>

          {['Servicio', 'Barbero', 'Fecha', 'Datos'].map((label, index) => (
            <div key={index} style={{ 
              flex: 1,
              textAlign: 'center',
              position: 'relative',
              zIndex: 1
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: paso > index + 1 ? 'var(--primary-gold)' : 
                           paso === index + 1 ? 'var(--primary-gold)' : 
                           'var(--neutral-gray)',
                border: paso === index + 1 ? '3px solid var(--primary-gold-light)' : 'none',
                color: 'var(--neutral-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.8rem',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                transition: 'all 0.3s ease',
                boxShadow: paso === index + 1 ? 'var(--shadow-md)' : 'none'
              }}>
                {paso > index + 1 ? '✓' : index + 1}
              </div>
              <div style={{
                fontSize: '0.9rem',
                fontWeight: paso === index + 1 ? '600' : '400',
                color: paso === index + 1 ? 'var(--primary-gold)' : 'var(--neutral-silver)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        <div className="card" style={{ padding: '2.5rem' }}>
          {/* Paso 1: Seleccionar Servicio */}
          {paso === 1 && (
            <div className="fade-in">
              <h3 style={{ marginBottom: '2rem', textAlign: 'center' }}>
                Elegí Tu Servicio
              </h3>
              <div className="grid grid-2" style={{ gap: '1.5rem' }}>
                {servicios.map((servicio) => (
                  <div 
                    key={servicio.id}
                    onClick={() => setFormData({ ...formData, servicio_id: servicio.id })}
                    className="service-card"
                    style={{
                      cursor: 'pointer',
                      border: formData.servicio_id === servicio.id ? 
                        '2px solid var(--primary-gold)' : 
                        '1px solid var(--neutral-gray)',
                      transform: formData.servicio_id === servicio.id ? 'scale(1.02)' : 'scale(1)',
                      padding: '2rem'
                    }}
                  >
                    <h4 style={{ fontSize: '1.3rem', marginBottom: '0.8rem' }}>
                      {servicio.nombre}
                    </h4>
                    <p style={{ fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                      {servicio.descripcion}
                    </p>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      paddingTop: '1rem',
                      borderTop: '1px solid var(--neutral-gray)'
                    }}>
                      <span className="price" style={{ fontSize: '1.8rem' }}>
                        ${parseFloat(servicio.precio).toLocaleString('es-CO')}
                      </span>
                      <span className="duration">
                        ⏱️ {servicio.duracion} min
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={siguientePaso} 
                className="btn btn-primary" 
                style={{ width: '100%', marginTop: '2rem', padding: '1.2rem' }}
              >
                Continuar →
              </button>
            </div>
          )}

          {/* Paso 2: Seleccionar Barbero */}
          {paso === 2 && (
            <div className="fade-in">
              <h3 style={{ marginBottom: '2rem', textAlign: 'center' }}>
                Elegí Tu Barbero
              </h3>
              <div className="grid grid-3" style={{ gap: '1.5rem' }}>
                {empleados.map((empleado) => (
                  <div 
                    key={empleado.id}
                    onClick={() => setFormData({ ...formData, empleado_id: empleado.id.toString() })}
                    style={{
                      padding: '2rem 1.5rem',
                      background: 'var(--neutral-dark)',
                      border: formData.empleado_id === empleado.id.toString() ? 
                        '2px solid var(--primary-gold)' : 
                        '1px solid var(--neutral-gray)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'var(--transition)',
                      transform: formData.empleado_id === empleado.id.toString() ? 'scale(1.05)' : 'scale(1)'
                    }}
                  >
                    {empleado.id === 0 ? (
                      <div style={{ 
                        fontSize: '3.5rem', 
                        marginBottom: '1rem',
                        filter: formData.empleado_id === empleado.id.toString() ? 'grayscale(0%)' : 'grayscale(30%)'
                      }}>
                        🎲
                      </div>
                    ) : empleado.foto ? (
                      <img 
                        src={`http://localhost:3000${empleado.foto}`} 
                        alt={empleado.nombre}
                        style={{
                          width: '100px',
                          height: '100px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          margin: '0 auto 1rem',
                          border: '3px solid ' + (formData.empleado_id === empleado.id.toString() ? 
                            'var(--primary-gold)' : 'var(--neutral-gray)'),
                          filter: formData.empleado_id === empleado.id.toString() ? 'grayscale(0%)' : 'grayscale(30%)'
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: 'var(--neutral-gray)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem',
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        color: 'var(--neutral-silver)',
                        border: '3px solid ' + (formData.empleado_id === empleado.id.toString() ? 
                          'var(--primary-gold)' : 'var(--neutral-gray)'),
                        filter: formData.empleado_id === empleado.id.toString() ? 'grayscale(0%)' : 'grayscale(30%)'
                      }}>
                        {empleado.nombre.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <h4 style={{ 
                      fontSize: '1.1rem',
                      color: formData.empleado_id === empleado.id.toString() ? 
                        'var(--primary-gold)' : 'var(--neutral-light)'
                    }}>
                      {empleado.nombre}
                    </h4>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button 
                  onClick={anteriorPaso} 
                  className="btn btn-secondary" 
                  style={{ flex: 1, padding: '1.2rem' }}
                >
                  ← Atrás
                </button>
                <button 
                  onClick={siguientePaso} 
                  className="btn btn-primary" 
                  style={{ flex: 2, padding: '1.2rem' }}
                >
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {/* Paso 3: Seleccionar Fecha y Hora */}
          {paso === 3 && (
            <div className="fade-in">
              <h3 style={{ marginBottom: '2rem', textAlign: 'center' }}>
                Elegí Fecha y Hora
              </h3>
              
              {/* Calendario Personalizado */}
              <div style={{ 
                background: 'var(--neutral-dark)', 
                borderRadius: '12px', 
                padding: '1.5rem',
                border: '1px solid var(--neutral-gray)',
                marginBottom: '2rem'
              }}>
                {/* Header del calendario */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '1.5rem'
                }}>
                  <button 
                    onClick={() => cambiarMes(-1)}
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--primary-gold)',
                      color: 'var(--primary-gold)',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      fontWeight: '600'
                    }}
                  >
                    ←
                  </button>
                  <h4 style={{ 
                    color: 'var(--primary-gold)', 
                    margin: 0,
                    fontSize: '1.2rem',
                    letterSpacing: '1px'
                  }}>
                    {mesActual.toLocaleDateString('es', { month: 'long', year: 'numeric' }).toUpperCase()}
                  </h4>
                  <button 
                    onClick={() => cambiarMes(1)}
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--primary-gold)',
                      color: 'var(--primary-gold)',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      fontWeight: '600'
                    }}
                  >
                    →
                  </button>
                </div>

                {/* Días de la semana */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(7, 1fr)', 
                  gap: '0.5rem',
                  marginBottom: '0.5rem'
                }}>
                  {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                    <div key={day} style={{ 
                      textAlign: 'center', 
                      color: 'var(--neutral-silver)',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      padding: '0.5rem'
                    }}>
                      {day}
                    </div>
                  ))}
                </div>

                {/* Días del mes */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(7, 1fr)', 
                  gap: '0.5rem'
                }}>
                  {(() => {
                    const { daysInMonth, startDayOfWeek } = getDaysInMonth(mesActual);
                    const days = [];
                    
                    // Espacios vacíos antes del primer día
                    for (let i = 0; i < startDayOfWeek; i++) {
                      days.push(
                        <div key={`empty-${i}`} style={{ padding: '1rem' }}></div>
                      );
                    }
                    
                    // Días del mes
                    for (let day = 1; day <= daysInMonth; day++) {
                      const fechaCompleta = formatDate(day);
                      const isSelected = formData.fecha === fechaCompleta;
                      const isDisabled = isDateDisabled(day);
                      
                      days.push(
                        <div
                          key={day}
                          onClick={() => !isDisabled && seleccionarFecha(day)}
                          style={{
                            padding: '1rem',
                            textAlign: 'center',
                            background: isSelected ? 'var(--primary-gold)' : 'transparent',
                            color: isSelected ? 'var(--neutral-dark)' : 
                                   isDisabled ? 'var(--neutral-gray)' : 'var(--neutral-light)',
                            borderRadius: '8px',
                            cursor: isDisabled ? 'not-allowed' : 'pointer',
                            fontWeight: isSelected ? '700' : '500',
                            fontSize: '1rem',
                            border: isSelected ? '2px solid var(--primary-gold-light)' : '1px solid transparent',
                            transition: 'all 0.2s ease',
                            opacity: isDisabled ? 0.3 : 1,
                            ...((!isDisabled && !isSelected) && {
                              ':hover': {
                                background: 'rgba(212, 175, 55, 0.2)',
                                border: '1px solid var(--primary-gold)'
                              }
                            })
                          }}
                          onMouseEnter={(e) => {
                            if (!isDisabled && !isSelected) {
                              e.currentTarget.style.background = 'rgba(212, 175, 55, 0.2)';
                              e.currentTarget.style.border = '1px solid var(--primary-gold)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isDisabled && !isSelected) {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.border = '1px solid transparent';
                            }
                          }}
                        >
                          {day}
                        </div>
                      );
                    }
                    
                    return days;
                  })()}
                </div>
              </div>

              {formData.fecha && (
                <div style={{ marginTop: '2rem' }}>
                  <h4 style={{ marginBottom: '1.5rem', color: 'var(--primary-gold)' }}>
                    Horarios Disponibles
                  </h4>
                  {loading ? (
                    <div className="loading">Cargando horarios...</div>
                  ) : horariosDisponibles.length > 0 ? (
                    <div className="grid grid-4" style={{ gap: '1rem' }}>
                      {horariosDisponibles.map((horario) => (
                        <div 
                          key={horario.hora}
                          onClick={() => setFormData({ ...formData, hora: horario.hora })}
                          style={{
                            padding: '1.2rem',
                            background: formData.hora === horario.hora ? 'var(--primary-gold)' : 'var(--neutral-dark)',
                            border: formData.hora === horario.hora ? 
                              '2px solid var(--primary-gold-light)' : 
                              '1px solid var(--neutral-gray)',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            textAlign: 'center',
                            fontSize: '1.2rem',
                            fontWeight: '600',
                            color: formData.hora === horario.hora ? 'var(--neutral-dark)' : 'var(--neutral-light)',
                            transition: 'var(--transition)',
                            transform: formData.hora === horario.hora ? 'scale(1.05)' : 'scale(1)'
                          }}
                        >
                          {horario.hora.substring(0, 5)}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="error-message">
                      No hay horarios disponibles para esta fecha. Por favor seleccioná otra fecha.
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button 
                  onClick={anteriorPaso} 
                  className="btn btn-secondary" 
                  style={{ flex: 1, padding: '1.2rem' }}
                >
                  ← Atrás
                </button>
                <button 
                  onClick={siguientePaso} 
                  className="btn btn-primary" 
                  style={{ flex: 2, padding: '1.2rem' }}
                  disabled={!formData.fecha || !formData.hora}
                >
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {/* Paso 4: Datos del Cliente */}
          {paso === 4 && (
            <form onSubmit={handleSubmit} className="fade-in">
              <h3 style={{ marginBottom: '2rem', textAlign: 'center' }}>
                Completá Tus Datos
              </h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre Completo *</label>
                  <input 
                    type="text" 
                    name="cliente_nombre"
                    value={formData.cliente_nombre}
                    onChange={handleChange}
                    placeholder="Juan Pérez"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Cédula *</label>
                  <input 
                    type="text" 
                    name="cliente_cedula"
                    value={formData.cliente_cedula}
                    onChange={handleChange}
                    placeholder="1234567890"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input 
                    type="email" 
                    name="cliente_email"
                    value={formData.cliente_email}
                    onChange={handleChange}
                    placeholder="juan@ejemplo.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Teléfono (WhatsApp) *</label>
                  <input 
                    type="tel" 
                    name="cliente_telefono"
                    value={formData.cliente_telefono}
                    onChange={handleChange}
                    placeholder="3001234567"
                    required
                  />
                </div>
              </div>

              {/* Resumen de la reserva */}
              <div style={{
                background: 'var(--neutral-dark)',
                padding: '1.5rem',
                borderRadius: '6px',
                marginTop: '2rem',
                border: '1px solid var(--primary-gold)'
              }}>
                <h4 style={{ color: 'var(--primary-gold)', marginBottom: '1rem' }}>
                  Resumen de Tu Reserva
                </h4>
                <div style={{ display: 'grid', gap: '0.8rem', color: 'var(--neutral-light)' }}>
                  <div>
                    <strong>Servicio:</strong> {servicios.find(s => s.id === formData.servicio_id)?.nombre}
                  </div>
                  <div>
                    <strong>Barbero:</strong> {empleados.find(e => e.id.toString() === formData.empleado_id)?.nombre}
                  </div>
                  <div>
                    <strong>Fecha:</strong> {new Date(formData.fecha + 'T00:00:00').toLocaleDateString('es-CO', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                  <div>
                    <strong>Hora:</strong> {formData.hora.substring(0, 5)}
                  </div>
                  <div style={{ 
                    paddingTop: '1rem', 
                    borderTop: '1px solid var(--neutral-gray)',
                    fontSize: '1.3rem',
                    color: 'var(--primary-gold)',
                    fontWeight: 'bold'
                  }}>
                    <strong>Total:</strong> ${parseFloat(servicios.find(s => s.id === formData.servicio_id)?.precio || 0).toLocaleString('es-CO')}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button 
                  type="button"
                  onClick={anteriorPaso} 
                  className="btn btn-secondary" 
                  style={{ flex: 1, padding: '1.2rem' }}
                >
                  ← Atrás
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ flex: 2, padding: '1.2rem' }} 
                  disabled={loading}
                >
                  {loading ? 'Procesando...' : '✓ Confirmar Reserva'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReservarCita;
