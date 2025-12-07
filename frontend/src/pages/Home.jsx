import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { serviciosAPI } from '../services/api';

function Home() {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarServicios();
  }, []);

  const cargarServicios = async () => {
    try {
      const response = await serviciosAPI.obtenerTodos();
      setServicios(response.data);
    } catch (error) {
      console.error('Error al cargar servicios:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      {/* Navbar Premium */}
      <nav className="navbar">
        <div className="navbar-content">
          <h1>HIGHBURY BARBER</h1>
          <nav>
            <Link to="/" className="active">Inicio</Link>
            <Link to="/reservar">Reservar Cita</Link>
            <Link to="/admin/login">Administración</Link>
          </nav>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero">
        <h1>Estilo & Distinción</h1>
        <p>Experimentá el arte del cuidado masculino en su máxima expresión. Tradición, elegancia y perfección en cada detalle.</p>
        <Link to="/reservar" className="btn btn-primary">
          Reservar Cita
        </Link>
      </div>

      {/* Servicios */}
      <div className="container">
        <h2 style={{ textAlign: 'center', marginBottom: '3rem', marginTop: '4rem' }}>
          Nuestros Servicios
        </h2>
        
        {loading ? (
          <div className="loading">Cargando servicios exclusivos...</div>
        ) : (
          <div className="grid grid-3">
            {servicios.map((servicio) => (
              <div key={servicio.id} className="service-card">
                <h3>{servicio.nombre}</h3>
                <p>{servicio.descripcion}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <div className="price">
                      ${parseFloat(servicio.precio).toLocaleString('es-CO')}
                    </div>
                    <div className="duration">
                      ⏱️ {servicio.duracion} minutos
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>
            La Experiencia Highbury
          </h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👨‍💼</div>
              <h4>Maestros Barberos</h4>
              <p>Profesionales certificados con años de experiencia en técnicas clásicas y modernas</p>
            </div>
            
            <div className="feature-card">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
              <h4>Productos Premium</h4>
              <p>Utilizamos únicamente productos de las mejores marcas internacionales</p>
            </div>
            
            <div className="feature-card">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏱</div>
              <h4>Horarios Flexibles</h4>
              <p>Lunes a Sábado de 10:00 AM a 6:00 PM. Reservá tu turno con facilidad</p>
            </div>
            
            <div className="feature-card">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</div>
              <h4>Ambiente Exclusivo</h4>
              <p>Un espacio diseñado para tu comodidad y relajación total</p>
            </div>
            
            <div className="feature-card">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📱</div>
              <h4>Sistema Digital</h4>
              <p>Reservá online 24/7 y recibí recordatorios automáticos</p>
            </div>
            
            <div className="feature-card">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💎</div>
              <h4>Atención Personalizada</h4>
              <p>Cada cliente recibe un servicio único adaptado a sus necesidades</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="container" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>
          Transformá Tu Estilo Hoy
        </h2>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
          Dale a tu imagen la importancia que merece. Reservá tu cita y descubrí la diferencia de un servicio verdaderamente premium.
        </p>
        <Link to="/reservar" className="btn btn-primary" style={{ fontSize: '1.1rem' }}>
          Reservar Mi Cita
        </Link>
      </div>

      {/* Footer */}
      <footer style={{ 
        background: 'var(--neutral-dark)', 
        borderTop: '1px solid var(--primary-gold)',
        padding: '3rem 2rem',
        textAlign: 'center'
      }}>
        <div className="container">
          <h3 style={{ color: 'var(--primary-gold)', marginBottom: '1rem' }}>
            HIGHBURY BARBER
          </h3>
          <p style={{ color: 'var(--neutral-silver)', marginBottom: '1rem' }}>
            Bogotá, Colombia • Lun - Sáb: 10:00 - 18:00
          </p>
          <p style={{ color: 'var(--neutral-gray)', fontSize: '0.9rem' }}>
            © 2025 Highbury Barber. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
