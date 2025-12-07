# 🚀 Guía de Inicio Rápido

## Configuración Inicial (5 minutos)

### 1. Base de Datos
```powershell
# Abrir MySQL Workbench y ejecutar:
# backend/database.sql
```

### 2. Backend
```powershell
cd backend
npm install
Copy-Item .env.example .env
# Editar .env con tus credenciales
npm run dev
```

### 3. Frontend
```powershell
cd frontend
npm install
npm run dev
```

## URLs de Acceso

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Panel Admin**: http://localhost:5173/admin/login

## Credenciales Admin

- Usuario: `admin`
- Contraseña: `admin123`

## Configuración Mínima de .env

```env
# Base de Datos
DB_PASSWORD=tu_password

# JWT
JWT_SECRET=cualquier_texto_secreto_largo

# Email (opcional para testing)
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_password_de_aplicacion

# WhatsApp (opcional para testing)
TWILIO_ACCOUNT_SID=tu_sid
TWILIO_AUTH_TOKEN=tu_token
```

## Flujo de Prueba

1. Abre http://localhost:5173
2. Haz clic en "Reservar Cita"
3. Sigue los 4 pasos para reservar
4. Ve al panel admin (http://localhost:5173/admin/login)
5. Gestiona las citas desde el panel

## 📞 Soporte

Si tienes problemas, revisa la documentación completa en `README.md`
