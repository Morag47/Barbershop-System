import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { iniciarCronJobs } from './src/utils/cronJobs.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Importar rutas
import serviciosRoutes from './src/routes/serviciosRoutes.js';
import empleadosRoutes from './src/routes/empleadosRoutes.js';
import citasRoutes from './src/routes/citasRoutes.js';
import disponibilidadRoutes from './src/routes/disponibilidadRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import horariosRoutes from './src/routes/horariosRoutes.js';
import bloqueosRoutes from './src/routes/bloqueosRoutes.js';
import reportesRoutes from './src/routes/reportesRoutes.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (fotos de empleados)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas públicas
app.use('/api/servicios', serviciosRoutes);
app.use('/api/empleados', empleadosRoutes);
app.use('/api/citas', citasRoutes);
app.use('/api/disponibilidad', disponibilidadRoutes);

// Rutas administrativas
app.use('/api/admin', adminRoutes);
app.use('/api/horarios', horariosRoutes);
app.use('/api/bloqueos', bloqueosRoutes);
app.use('/api/reportes', reportesRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ 
        message: 'API de Barbería - Sistema de Gestión de Citas',
        version: '1.0.0',
        status: 'running'
    });
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Algo salió mal!',
        message: err.message 
    });
});

// Ruta no encontrada
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`🌍 Zona horaria: ${process.env.TIMEZONE || 'America/Bogota'}`);
    
    // Iniciar trabajos cron para recordatorios y auto-cancelación
    iniciarCronJobs();
});
