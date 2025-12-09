import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Servicios públicos
export const serviciosAPI = {
    obtenerTodos: () => api.get('/servicios'),
    obtenerPorId: (id) => api.get(`/servicios/${id}`),
    obtenerTodosAdmin: () => api.get('/servicios/admin/todos'),
    crear: (servicio) => api.post('/servicios', servicio),
    actualizar: (id, servicio) => api.put(`/servicios/${id}`, servicio),
    eliminar: (id) => api.delete(`/servicios/${id}`)
};

export const empleadosAPI = {
    obtenerTodos: () => api.get('/empleados'),
    obtenerPorId: (id) => api.get(`/empleados/${id}`),
    obtenerTodosAdmin: () => api.get('/empleados/admin/todos'),
    crear: (empleado) => api.post('/empleados', empleado),
    actualizar: (id, empleado) => api.put(`/empleados/${id}`, empleado),
    eliminar: (id) => api.delete(`/empleados/${id}`),
    subirFoto: (formData) => {
        const token = localStorage.getItem('token');
        return axios.post(`${API_URL}/admin/empleados/subir-foto`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        });
    }
};

export const horariosAPI = {
    obtenerPorEmpleado: (empleadoId) => api.get(`/horarios/empleado/${empleadoId}`),
    guardar: (horario) => api.post('/horarios', horario),
    eliminar: (id) => api.delete(`/horarios/${id}`)
};

export const bloqueosAPI = {
    obtenerTodos: () => api.get('/bloqueos'),
    obtenerPorEmpleado: (empleadoId) => api.get(`/bloqueos/empleado/${empleadoId}`),
    crear: (bloqueo) => api.post('/bloqueos', bloqueo),
    actualizar: (id, bloqueo) => api.put(`/bloqueos/${id}`, bloqueo),
    eliminar: (id) => api.delete(`/bloqueos/${id}`)
};

export const citasAPI = {
    crear: (cita) => api.post('/citas', cita),
    obtenerPorId: (id) => api.get(`/citas/${id}`)
};

export const disponibilidadAPI = {
    obtener: (params) => api.get('/disponibilidad', { params })
};

// Servicios administrativos
export const adminAPI = {
    login: (credenciales) => api.post('/admin/login', credenciales),
    
    // Servicios
    obtenerServicios: () => api.get('/admin/servicios'),
    crearServicio: (servicio) => api.post('/admin/servicios', servicio),
    actualizarServicio: (id, servicio) => api.put(`/admin/servicios/${id}`, servicio),
    eliminarServicio: (id) => api.delete(`/admin/servicios/${id}`),
    
    // Empleados
    obtenerEmpleados: () => api.get('/admin/empleados'),
    crearEmpleado: (empleado) => api.post('/admin/empleados', empleado),
    actualizarEmpleado: (id, empleado) => api.put(`/admin/empleados/${id}`, empleado),
    eliminarEmpleado: (id) => api.delete(`/admin/empleados/${id}`),
    
    // Citas
    obtenerCitas: (estado) => api.get('/admin/citas', { params: { estado } }),
    confirmarCita: (id) => api.patch(`/admin/citas/${id}/confirmar`),
    cancelarCita: (id) => api.patch(`/admin/citas/${id}/cancelar`),
    completarCita: (id) => api.patch(`/admin/citas/${id}/completar`),
    
    // Horarios
    obtenerHorarios: () => api.get('/admin/horarios'),
    crearHorario: (horario) => api.post('/admin/horarios', horario),
    actualizarHorario: (id, horario) => api.put(`/admin/horarios/${id}`, horario),
    eliminarHorario: (id) => api.delete(`/admin/horarios/${id}`),
    
    // Bloqueos
    obtenerBloqueos: () => api.get('/admin/bloqueos'),
    crearBloqueo: (bloqueo) => api.post('/admin/bloqueos', bloqueo),
    actualizarBloqueo: (id, bloqueo) => api.put(`/admin/bloqueos/${id}`, bloqueo),
    eliminarBloqueo: (id) => api.delete(`/admin/bloqueos/${id}`),
    
    // Días festivos
    obtenerDiasFestivos: () => api.get('/admin/dias-festivos'),
    crearDiaFestivo: (dia) => api.post('/admin/dias-festivos', dia),
    eliminarDiaFestivo: (id) => api.delete(`/admin/dias-festivos/${id}`)
};

// API de Reportes
export const reportesAPI = {
    // Obtener datos de reportes
    obtenerReporteDiario: (fecha) => api.get('/reportes/diario', { params: { fecha } }),
    obtenerReporteSemanal: (fechaInicio, fechaFin) => 
        api.get('/reportes/semanal', { params: { fechaInicio, fechaFin } }),
    obtenerReporteMensual: (fechaInicio, fechaFin) => 
        api.get('/reportes/mensual', { params: { fechaInicio, fechaFin } }),
    
    // Descargar PDFs (retorna blob para descarga)
    descargarPDFDiario: (fecha) => {
        return api.get('/reportes/pdf/diario', { 
            params: { fecha },
            responseType: 'blob'
        });
    },
    descargarPDFSemanal: (fechaInicio, fechaFin) => {
        return api.get('/reportes/pdf/semanal', { 
            params: { fechaInicio, fechaFin },
            responseType: 'blob'
        });
    },
    descargarPDFMensual: (fechaInicio, fechaFin) => {
        return api.get('/reportes/pdf/mensual', { 
            params: { fechaInicio, fechaFin },
            responseType: 'blob'
        });
    }
};

export default api;
