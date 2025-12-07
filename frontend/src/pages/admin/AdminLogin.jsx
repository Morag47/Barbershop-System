import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';

function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    usuario: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await adminAPI.login(formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('admin', JSON.stringify(response.data.admin));
      navigate('/admin/dashboard');
    } catch (error) {
      setError(error.response?.data?.error || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'var(--bg-gradient)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
                          radial-gradient(circle at 80% 80%, rgba(212, 175, 55, 0.08) 0%, transparent 50%)`,
        pointerEvents: 'none'
      }}></div>

      {/* Back to home link */}
      <Link 
        to="/" 
        style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          color: 'var(--primary-gold)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '1rem',
          zIndex: 10
        }}
      >
        ← Volver al Inicio
      </Link>

      <div 
        className="card fade-in" 
        style={{ 
          width: '100%', 
          maxWidth: '450px', 
          margin: '20px',
          padding: '3rem 2.5rem',
          position: 'relative',
          zIndex: 1,
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--primary-gold)'
        }}
      >
        {/* Logo/Icon */}
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, var(--primary-gold) 0%, var(--primary-gold-light) 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            fontSize: '2.5rem',
            boxShadow: 'var(--shadow-lg)'
          }}>
            🔐
          </div>
          <h2 style={{ 
            marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, var(--primary-gold) 0%, var(--primary-gold-light) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Panel Administrativo
          </h2>
          <p style={{ 
            color: 'var(--neutral-silver)', 
            fontSize: '0.95rem',
            letterSpacing: '0.5px'
          }}>
            HIGHBURY BARBER
          </p>
        </div>
        
        {error && (
          <div className="error-message" style={{ marginBottom: '1.5rem' }}>
            ⚠️ {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Usuario</label>
            <input 
              type="text" 
              name="usuario"
              value={formData.usuario}
              onChange={handleChange}
              placeholder="Ingresá tu usuario"
              required
              autoFocus
              style={{ fontSize: '1rem' }}
            />
          </div>
          
          <div className="form-group">
            <label>Contraseña</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Ingresá tu contraseña"
              required
              style={{ fontSize: '1rem' }}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ 
              width: '100%',
              marginTop: '1.5rem',
              padding: '1.2rem',
              fontSize: '1rem'
            }}
            disabled={loading}
          >
            {loading ? 'Verificando...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Info de credenciales por defecto */}
        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem',
          background: 'rgba(212, 175, 55, 0.05)',
          border: '1px solid rgba(212, 175, 55, 0.2)',
          borderRadius: '4px',
          fontSize: '0.85rem'
        }}>
          <p style={{ 
            color: 'var(--neutral-silver)', 
            marginBottom: '0.5rem',
            textAlign: 'center',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Credenciales por Defecto
          </p>
          <div style={{ color: 'var(--neutral-light)', textAlign: 'center' }}>
            <p style={{ margin: '0.3rem 0' }}>
              Usuario: <strong style={{ color: 'var(--primary-gold)' }}>admin</strong>
            </p>
            <p style={{ margin: '0.3rem 0' }}>
              Contraseña: <strong style={{ color: 'var(--primary-gold)' }}>admin123</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
