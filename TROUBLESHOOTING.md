# 🔧 Solución de Problemas Comunes

## Problemas del Backend

### Error: "Cannot find module"
```powershell
# Solución: Reinstalar dependencias
cd backend
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Error: "Access denied for user"
```
❌ Error al conectar a la base de datos: Access denied for user 'root'@'localhost'
```

**Solución:**
1. Verifica tu contraseña de MySQL
2. Edita el archivo `.env`:
```env
DB_USER=root
DB_PASSWORD=tu_password_correcto
```

### Error: "Table doesn't exist"
```
❌ Error: Table 'barberia_db.servicios' doesn't exist
```

**Solución:**
1. Abre MySQL Workbench
2. Ejecuta completamente el archivo `backend/database.sql`
3. Verifica que se crearon las tablas:
```sql
USE barberia_db;
SHOW TABLES;
```

### Error: "Port 3000 already in use"
```
❌ Error: listen EADDRINUSE: address already in use :::3000
```

**Solución:**
```powershell
# Encontrar el proceso que usa el puerto
netstat -ano | findstr :3000

# Matar el proceso (reemplaza XXXX con el PID)
taskkill /PID XXXX /F

# O cambiar el puerto en .env
PORT=3001
```

### Error: "JWT_SECRET is not defined"
```
❌ Error: JWT_SECRET is required
```

**Solución:**
```env
# Agregar al archivo .env
JWT_SECRET=cualquier_texto_largo_y_secreto_aqui_123456789
```

### Emails no se envían

**Problema:** Los emails no llegan

**Solución:**
1. Verifica que usas una "Contraseña de Aplicación" de Gmail (no tu contraseña normal)
2. Activa la verificación en 2 pasos en Google
3. Genera una contraseña de aplicación: https://myaccount.google.com/apppasswords
4. Usa esa contraseña en `.env`:
```env
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
```

### WhatsApp no funciona

**Solución:**
1. Verifica tus credenciales de Twilio
2. Configura el Sandbox: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
3. Envía "join [código]" desde tu WhatsApp al número de Twilio
4. Verifica el formato del número:
```env
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
BARBERIA_WHATSAPP_NUMBER=+573001234567
```

---

## Problemas del Frontend

### Error: "npm ERR! code ELIFECYCLE"
```powershell
# Solución: Limpiar cache y reinstalar
cd frontend
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm cache clean --force
npm install
```

### Error: "Failed to fetch"
```
❌ Error: Failed to fetch
```

**Solución:**
1. Verifica que el backend esté corriendo (http://localhost:3000)
2. Verifica el archivo `.env` del frontend:
```env
VITE_API_URL=http://localhost:3000/api
```
3. Reinicia el frontend después de cambiar `.env`

### Página en blanco

**Solución:**
1. Abre la consola del navegador (F12)
2. Busca errores
3. Verifica que todas las dependencias estén instaladas:
```powershell
cd frontend
npm install react react-dom react-router-dom axios
```

### CORS Error
```
❌ Access to XMLHttpRequest blocked by CORS policy
```

**Solución:**
En `backend/index.js`, verifica:
```javascript
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
```

---

## Problemas de Base de Datos

### No puedo conectarme a MySQL

**Solución:**
1. Verifica que MySQL esté corriendo:
```powershell
Get-Service -Name MySQL*
```

2. Si no está corriendo:
```powershell
Start-Service -Name MySQL80
```

### Error: "Too many connections"

**Solución:**
En MySQL Workbench:
```sql
SHOW VARIABLES LIKE 'max_connections';
SET GLOBAL max_connections = 200;
```

### Datos no aparecen

**Solución:**
```sql
-- Verificar que hay datos
USE barberia_db;
SELECT * FROM servicios;
SELECT * FROM empleados;
SELECT * FROM horarios;

-- Si no hay datos, ejecutar de nuevo las inserciones del database.sql
```

---

## Comandos Útiles

### Backend

```powershell
# Ver logs en tiempo real
cd backend
npm run dev

# Verificar versión de Node
node --version  # Debe ser v16+

# Ver dependencias instaladas
npm list --depth=0

# Actualizar dependencias
npm update
```

### Frontend

```powershell
# Iniciar con más detalles
cd frontend
npm run dev -- --debug

# Compilar para producción
npm run build

# Preview de producción
npm run preview
```

### Base de Datos

```sql
-- Ver todas las bases de datos
SHOW DATABASES;

-- Usar la base de datos
USE barberia_db;

-- Ver todas las tablas
SHOW TABLES;

-- Ver estructura de una tabla
DESCRIBE citas;

-- Ver cantidad de registros
SELECT COUNT(*) FROM citas;
SELECT COUNT(*) FROM servicios;
SELECT COUNT(*) FROM empleados;

-- Ver últimas citas
SELECT * FROM citas ORDER BY id DESC LIMIT 10;

-- Resetear auto_increment
ALTER TABLE citas AUTO_INCREMENT = 1;

-- Vaciar tabla (cuidado!)
TRUNCATE TABLE citas;

-- Backup de base de datos
-- En PowerShell:
# mysqldump -u root -p barberia_db > backup.sql

-- Restaurar backup
-- En PowerShell:
# mysql -u root -p barberia_db < backup.sql
```

---

## Verificación del Sistema

### Checklist de Funcionamiento

Ejecuta estos pasos para verificar que todo funcione:

```powershell
# 1. Backend
cd C:\Users\Andre\OneDrive\Escritorio\barberia-app\backend
npm run dev
# ✅ Debe decir: "Servidor corriendo en http://localhost:3000"
# ✅ Debe decir: "Conexión a la base de datos establecida"

# 2. Probar API (en otra terminal)
curl http://localhost:3000
# ✅ Debe retornar JSON con status "running"

curl http://localhost:3000/api/servicios
# ✅ Debe retornar array de servicios

# 3. Frontend (en otra terminal)
cd C:\Users\Andre\OneDrive\Escritorio\barberia-app\frontend
npm run dev
# ✅ Debe decir: "Local: http://localhost:5173"

# 4. Abrir navegador
# ✅ http://localhost:5173 debe mostrar la página
# ✅ http://localhost:5173/reservar debe mostrar formulario
# ✅ http://localhost:5173/admin/login debe mostrar login
```

### Test de API con PowerShell

```powershell
# Test GET
Invoke-RestMethod -Uri "http://localhost:3000/api/servicios"

# Test POST (crear cita)
$body = @{
    cliente_nombre = "Test Usuario"
    cliente_cedula = "123456789"
    cliente_email = "test@example.com"
    cliente_telefono = "3001234567"
    servicio_id = 1
    empleado_id = 1
    fecha = "2025-12-15"
    hora = "10:00:00"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/citas" -Method POST -Body $body -ContentType "application/json"
```

---

## Logs y Debugging

### Ver logs del Backend

El backend muestra logs en consola. Busca:

```
✅ Conexión a la base de datos establecida
✅ Servidor corriendo en http://localhost:3000
✅ Sistema de recordatorios activo
```

Si hay errores, aparecerán en rojo.

### Ver logs del Frontend

Abre DevTools en el navegador (F12) y ve a la pestaña "Console".

### Ver queries de MySQL

En `backend/src/config/dbConfig.js`, puedes habilitar logs:

```javascript
const pool = mysql.createPool({
    // ... otras opciones
    debug: true  // Agregar esta línea
});
```

---

## Performance

### Backend lento

**Optimizaciones:**

1. Aumentar pool de conexiones:
```javascript
// backend/src/config/dbConfig.js
connectionLimit: 20
```

2. Agregar índices en BD:
```sql
CREATE INDEX idx_fecha ON citas(fecha);
CREATE INDEX idx_empleado_fecha ON citas(empleado_id, fecha);
```

### Frontend lento

**Optimizaciones:**

1. Compilar para producción:
```powershell
cd frontend
npm run build
```

2. Usar producción del backend:
```powershell
cd backend
npm start  # Sin nodemon
```

---

## Resetear el Sistema

### Resetear Base de Datos

```sql
-- En MySQL Workbench
DROP DATABASE barberia_db;

-- Luego ejecutar de nuevo database.sql
```

### Resetear todo el proyecto

```powershell
# Backend
cd backend
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
Remove-Item .env

# Frontend
cd frontend
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Luego seguir las instrucciones de instalación de nuevo
```

---

## Preguntas Frecuentes

**P: ¿Puedo cambiar el puerto del backend?**
R: Sí, en `.env` cambia `PORT=3000` al puerto que quieras.

**P: ¿Puedo usar otra base de datos?**
R: Sí, pero tendrías que adaptar las queries. MySQL es recomendado.

**P: ¿Funciona en Mac/Linux?**
R: Sí, los comandos son similares (usa `bash` en lugar de PowerShell).

**P: ¿Puedo usar otro email que no sea Gmail?**
R: Sí, configura Nodemailer para tu proveedor (Outlook, Yahoo, etc.).

**P: ¿Los mensajes de WhatsApp son gratis?**
R: Con Twilio Sandbox sí (para desarrollo). En producción hay costo.

**P: ¿Puedo personalizar los emails?**
R: Sí, edita `backend/src/services/emailService.js`.

**P: ¿Cómo agrego más servicios?**
R: Usa el panel admin o inserta en BD:
```sql
INSERT INTO servicios (nombre, descripcion, precio) 
VALUES ('Mi Servicio', 'Descripción', 30000);
```

---

## Recursos Adicionales

- **Node.js**: https://nodejs.org/docs
- **Express**: https://expressjs.com
- **React**: https://react.dev
- **MySQL**: https://dev.mysql.com/doc
- **JWT**: https://jwt.io
- **Twilio**: https://www.twilio.com/docs
- **Nodemailer**: https://nodemailer.com

---

**Si sigues teniendo problemas, revisa los logs completos y busca el mensaje de error específico.**
