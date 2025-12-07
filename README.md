# 💈 Sistema de Gestión de Barbería

Sistema completo de gestión de citas, empleados, servicios y reportes para barbería desarrollado con Node.js, Express, React y MySQL.

**Autor:** Andrés Felipe Mora  
**Licencia:** [Creative Commons BY-NC-SA 4.0](./LICENSE)

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [API Endpoints](#api-endpoints)
- [Base de Datos](#base-de-datos)
- [Características Avanzadas](#características-avanzadas)

## ✨ Características

### Área Pública (Clientes)
- ✅ Ver servicios disponibles con precios
- ✅ Seleccionar barbero o dejar que el sistema asigne uno disponible
- ✅ Ver disponibilidad en tiempo real
- ✅ Reservar citas sin necesidad de autenticación
- ✅ Sistema de pasos intuitivo para reservar
- ✅ Recibir confirmación por email
- ✅ Recordatorio por WhatsApp 3 horas antes

### Panel Administrativo
- ✅ Autenticación con JWT
- ✅ Gestión completa de citas (confirmar, cancelar, completar)
- ✅ CRUD de servicios
- ✅ CRUD de empleados/barberos
- ✅ Gestión de horarios de trabajo
- ✅ Gestión de bloqueos (vacaciones, días libres)
- ✅ Gestión de días festivos
- ✅ Envío automático de recibos por email

### Sistema de Notificaciones
- 📧 Email de confirmación al reservar
- 📱 Recordatorio por WhatsApp 3 horas antes
- 🧾 Recibo por email al completar el servicio
- ⏰ Sistema de cron jobs automatizado

## 🛠️ Tecnologías

### Backend
- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **MySQL** - Base de datos relacional
- **JWT** - Autenticación segura
- **bcrypt** - Hash de contraseñas
- **Nodemailer** - Envío de emails
- **Twilio** - Mensajes de WhatsApp
- **node-cron** - Tareas programadas
- **moment-timezone** - Manejo de zonas horarias
- **pdfkit** - Generación de PDFs elegantes

### Frontend
- **React 18** - Librería UI
- **Vite** - Build tool moderno
- **React Router** - Navegación
- **Axios** - Cliente HTTP
- **Recharts** - Gráficas interactivas

## 📦 Requisitos Previos

- Node.js (v16 o superior)
- MySQL 8.0+
- NPM o Yarn
- Cuenta de Gmail (para envío de emails)
- Cuenta de Twilio (para WhatsApp - opcional)

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/Morag47/Barbershop-System.git
cd Barbershop-System
```

### 2. Configurar la Base de Datos

Abre MySQL y ejecuta el archivo `backend/database_completo.sql`:

```sql
-- El archivo creará automáticamente:
-- - La base de datos barberia_db
-- - Todas las tablas necesarias
-- - Datos de ejemplo
```

### 3. Instalar dependencias del Backend

```powershell
cd backend
npm install
```

### 4. Instalar dependencias del Frontend

```powershell
cd frontend
npm install
```

## ⚙️ Configuración

### Backend

1. Copia el archivo `.env.example` a `.env`:

```powershell
cd backend
Copy-Item .env.example .env
```

2. Edita el archivo `.env` con tus credenciales:

```env
# Base de Datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password_mysql
DB_NAME=barberia_db
DB_PORT=3306

# JWT
JWT_SECRET=genera_una_clave_secreta_segura_aqui

# Email (Gmail)
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_contraseña_de_aplicacion_gmail

# Twilio (WhatsApp)
TWILIO_ACCOUNT_SID=tu_account_sid_de_twilio
TWILIO_AUTH_TOKEN=tu_auth_token_de_twilio
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
BARBERIA_WHATSAPP_NUMBER=+573001234567
```

### Configurar Gmail para Nodemailer

1. Ve a tu cuenta de Google
2. Activa la verificación en 2 pasos
3. Genera una "Contraseña de aplicación"
4. Usa esa contraseña en `EMAIL_PASSWORD`

### Configurar Twilio para WhatsApp

1. Crea una cuenta en [Twilio](https://www.twilio.com)
2. Obtén tu Account SID y Auth Token
3. Configura WhatsApp Sandbox para pruebas
4. Usa las credenciales en el `.env`

## 🎯 Uso

### Iniciar el Backend

```powershell
cd backend
npm run dev
```

El servidor estará corriendo en `http://localhost:3000`

### Iniciar el Frontend

```powershell
cd frontend
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📁 Estructura del Proyecto

```
barberia-app/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── dbConfig.js          # Configuración MySQL
│   │   │   ├── emailConfig.js       # Configuración Nodemailer
│   │   │   └── twilioConfig.js      # Configuración Twilio
│   │   │
│   │   ├── controllers/
│   │   │   ├── serviciosController.js
│   │   │   ├── empleadosController.js
│   │   │   ├── citasController.js
│   │   │   ├── disponibilidadController.js
│   │   │   └── adminController.js
│   │   │
│   │   ├── models/
│   │   │   ├── Servicio.js
│   │   │   ├── Empleado.js
│   │   │   ├── Cita.js
│   │   │   ├── Horario.js
│   │   │   ├── Bloqueo.js
│   │   │   ├── Admin.js
│   │   │   └── DiaFestivo.js
│   │   │
│   │   ├── routes/
│   │   │   ├── serviciosRoutes.js
│   │   │   ├── empleadosRoutes.js
│   │   │   ├── citasRoutes.js
│   │   │   ├── disponibilidadRoutes.js
│   │   │   └── adminRoutes.js
│   │   │
│   │   ├── middleware/
│   │   │   └── authMiddleware.js    # JWT verification
│   │   │
│   │   ├── services/
│   │   │   ├── emailService.js      # Envío de emails
│   │   │   └── whatsappService.js   # Envío de WhatsApp
│   │   │
│   │   └── utils/
│   │       └── cronJobs.js          # Tareas programadas
│   │
│   ├── database.sql                  # Script de base de datos
│   ├── index.js                      # Entrada de la aplicación
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Home.jsx              # Página principal
    │   │   ├── ReservarCita.jsx      # Proceso de reserva
    │   │   └── admin/
    │   │       ├── AdminLogin.jsx    # Login admin
    │   │       └── AdminDashboard.jsx
    │   │
    │   ├── services/
    │   │   └── api.js                # Configuración Axios
    │   │
    │   ├── App.jsx
    │   ├── App.css
    │   └── main.jsx
    │
    ├── vite.config.js
    └── package.json
```

## 🌐 API Endpoints

### Endpoints Públicos

#### Servicios
```
GET    /api/servicios           # Obtener todos los servicios activos
GET    /api/servicios/:id       # Obtener servicio por ID
```

#### Empleados
```
GET    /api/empleados           # Obtener todos los empleados activos
GET    /api/empleados/:id       # Obtener empleado por ID
```

#### Disponibilidad
```
GET    /api/disponibilidad      # Consultar horarios disponibles
       Query params: fecha, empleado_id (opcional)
```

#### Citas
```
POST   /api/citas               # Crear nueva cita
GET    /api/citas/:id           # Obtener cita por ID
```

### Endpoints Administrativos (Requieren autenticación)

#### Autenticación
```
POST   /api/admin/login         # Login de administrador
```

#### Servicios (Admin)
```
GET    /api/admin/servicios            # Obtener todos los servicios
POST   /api/admin/servicios            # Crear servicio
PUT    /api/admin/servicios/:id        # Actualizar servicio
DELETE /api/admin/servicios/:id        # Desactivar servicio
```

#### Empleados (Admin)
```
GET    /api/admin/empleados            # Obtener todos los empleados
POST   /api/admin/empleados            # Crear empleado
PUT    /api/admin/empleados/:id        # Actualizar empleado
DELETE /api/admin/empleados/:id        # Desactivar empleado
```

#### Citas (Admin)
```
GET    /api/admin/citas                # Obtener todas las citas
PATCH  /api/admin/citas/:id/confirmar  # Confirmar cita
PATCH  /api/admin/citas/:id/cancelar   # Cancelar cita
PATCH  /api/admin/citas/:id/completar  # Completar cita (envía recibo)
```

#### Horarios (Admin)
```
GET    /api/admin/horarios             # Obtener todos los horarios
POST   /api/admin/horarios             # Crear horario
PUT    /api/admin/horarios/:id         # Actualizar horario
DELETE /api/admin/horarios/:id         # Eliminar horario
```

#### Bloqueos (Admin)
```
GET    /api/admin/bloqueos             # Obtener todos los bloqueos
POST   /api/admin/bloqueos             # Crear bloqueo
PUT    /api/admin/bloqueos/:id         # Actualizar bloqueo
DELETE /api/admin/bloqueos/:id         # Eliminar bloqueo
```

#### Días Festivos (Admin)
```
GET    /api/admin/dias-festivos        # Obtener días festivos
POST   /api/admin/dias-festivos        # Crear día festivo
DELETE /api/admin/dias-festivos/:id    # Eliminar día festivo
```

## 💾 Base de Datos

### Tablas Principales

#### servicios
- `id` - Identificador único
- `nombre` - Nombre del servicio
- `descripcion` - Descripción del servicio
- `duracion` - Duración en minutos (siempre 60)
- `precio` - Precio del servicio
- `activo` - Estado activo/inactivo

#### empleados
- `id` - Identificador único
- `nombre` - Nombre del empleado
- `cedula` - Cédula (visible solo para admin)
- `foto` - URL de la foto
- `activo` - Estado activo/inactivo

#### citas
- `id` - Identificador único
- `cliente_nombre` - Nombre del cliente
- `cliente_cedula` - Cédula del cliente
- `cliente_email` - Email del cliente
- `cliente_telefono` - Teléfono/WhatsApp
- `servicio_id` - FK a servicios
- `empleado_id` - FK a empleados
- `fecha` - Fecha de la cita
- `hora` - Hora de la cita
- `estado` - pendiente/confirmada/cancelada/completada
- `recordatorio_enviado` - Boolean
- `email_confirmacion_enviado` - Boolean
- `email_recibo_enviado` - Boolean

#### horarios
- `id` - Identificador único
- `empleado_id` - FK a empleados
- `dia_semana` - lunes, martes, etc.
- `hora_inicio` - Hora de inicio (10:00:00)
- `hora_fin` - Hora de fin (18:00:00)

#### bloqueos
- `id` - Identificador único
- `empleado_id` - FK a empleados
- `fecha_inicio` - Fecha inicial del bloqueo
- `fecha_fin` - Fecha final del bloqueo
- `motivo` - vacaciones/dia_libre/otro
- `descripcion` - Descripción opcional

#### dias_festivos
- `id` - Identificador único
- `fecha` - Fecha del día festivo
- `descripcion` - Descripción del festivo

## 🎨 Características Avanzadas

### Sistema de Horarios
- Horarios de 10:00 AM a 6:00 PM
- Bloques de 1 hora por servicio
- Hora de almuerzo bloqueada (1:00 PM)
- Validación de disponibilidad en tiempo real

### Gestión de Disponibilidad
- Verifica horarios de trabajo del empleado
- Valida bloqueos (vacaciones, días libres)
- Detecta días festivos automáticamente
- Evita reservas duplicadas

### Sistema de Notificaciones
- **Email de Confirmación**: Se envía inmediatamente al reservar
- **Recordatorio WhatsApp**: Se envía automáticamente 3 horas antes
- **Recibo por Email**: Se envía cuando el admin marca la cita como completada

### Seguridad
- Autenticación JWT para panel admin
- Contraseñas hasheadas con bcrypt
- Validación de datos con express-validator
- Protección contra duplicados en base de datos

### Zona Horaria
- Configurado para zona horaria de Bogotá, Colombia
- Manejo correcto de fechas y horas con moment-timezone

## 👤 Credenciales por Defecto

### Panel Administrativo
- **Usuario**: `admin`
- **Contraseña**: `admin123`

## 🔧 Comandos Útiles

### Backend
```powershell
npm start          # Iniciar en producción
npm run dev        # Iniciar en desarrollo (con nodemon)
```

### Frontend
```powershell
npm run dev        # Iniciar servidor de desarrollo
npm run build      # Compilar para producción
npm run preview    # Vista previa de producción
```

## 📝 Notas Importantes

1. **Configuración de Email**: Es necesario configurar una cuenta de Gmail con contraseña de aplicación para que los emails funcionen.

2. **Configuración de WhatsApp**: Twilio ofrece un sandbox gratuito para pruebas. Para producción necesitas un número verificado.

3. **Zona Horaria**: El sistema está configurado para Colombia (America/Bogota). Ajusta si es necesario en el archivo `.env`.

4. **Días Festivos**: El sistema viene con los días festivos de Colombia 2025 precargados.

5. **Cron Jobs**: El sistema verifica cada 30 minutos si hay citas que necesiten recordatorio.

## 🐛 Solución de Problemas

### El servidor backend no inicia
- Verifica que MySQL esté corriendo
- Verifica las credenciales en el archivo `.env`
- Asegúrate de haber ejecutado el script `database.sql`

### Los emails no se envían
- Verifica que tengas una contraseña de aplicación de Gmail (no tu contraseña normal)
- Verifica que el firewall no esté bloqueando el puerto 587

### Los mensajes de WhatsApp no se envían
- Verifica tus credenciales de Twilio
- Asegúrate de haber configurado el Sandbox de WhatsApp
- El número debe estar en formato internacional (+57...)

## 📄 Licencia

[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

Este proyecto está licenciado bajo **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International**.

### ¿Qué significa esto?

✅ **Puedes:**
- Usar el software con fines educativos y personales
- Modificar y adaptar el código
- Compartir tus modificaciones

❌ **NO puedes:**
- Usar el software con fines comerciales sin permiso
- Vender este software o servicios basados en él
- Implementarlo en negocios sin autorización

📧 **Para uso comercial**, contactar: **andres.moagui@gmail.com**

Ver licencia completa en [LICENSE](./LICENSE)

## 👨‍💻 Autor

**Andrés Felipe Mora**  
📧 Email: andres.moagui@gmail.com  
🔗 GitHub: [@Morag47](https://github.com/Morag47)

Desarrollado con ❤️ usando Node.js, Express, React y MySQL.

---

**Sistema de Gestión de Barbería** - © 2025 Andrés Felipe Mora  
Todos los derechos reservados bajo licencia CC BY-NC-SA 4.0 💈✂️
