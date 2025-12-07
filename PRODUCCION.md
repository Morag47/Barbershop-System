# 🔐 Configuración de Seguridad y Producción

## Seguridad

### 1. Variables de Entorno en Producción

**NUNCA** subas el archivo `.env` a Git. Asegúrate de que esté en `.gitignore`.

```env
# Cambiar en producción
JWT_SECRET=genera_una_clave_muy_segura_y_larga_con_caracteres_especiales
```

### 2. Contraseña del Administrador

Por defecto, la contraseña es `admin123`. Para cambiarla:

```sql
-- Conectarse a MySQL
USE barberia_db;

-- Generar nuevo hash de contraseña (usa bcrypt con salt 10)
-- Ejemplo: nueva contraseña "MiPassword123!"
UPDATE administradores 
SET password = '$2b$10$NUEVO_HASH_AQUI' 
WHERE usuario = 'admin';
```

Para generar un hash bcrypt, puedes usar:
```javascript
const bcrypt = require('bcrypt');
const password = 'TuNuevaContraseña';
bcrypt.hash(password, 10).then(hash => console.log(hash));
```

### 3. Configuración CORS

En producción, configura CORS para aceptar solo tu dominio:

```javascript
// backend/index.js
app.use(cors({
    origin: 'https://tu-dominio.com',
    credentials: true
}));
```

### 4. HTTPS

En producción, siempre usa HTTPS. Puedes obtener certificados gratuitos con Let's Encrypt.

## Optimizaciones de Producción

### Backend

1. **Variables de entorno**
```env
NODE_ENV=production
PORT=3000
```

2. **PM2 para gestión de procesos**
```powershell
npm install -g pm2
pm2 start index.js --name barberia-backend
pm2 save
pm2 startup
```

3. **Logs**
```powershell
pm2 logs barberia-backend
```

### Frontend

1. **Build de producción**
```powershell
cd frontend
npm run build
```

Esto genera la carpeta `dist/` con archivos optimizados.

2. **Servir con Nginx o Apache**

Ejemplo de configuración Nginx:
```nginx
server {
    listen 80;
    server_name tu-dominio.com;
    
    root /ruta/a/frontend/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Base de Datos en Producción

### 1. Backup Automático

Crear script de backup:
```powershell
# backup.ps1
$date = Get-Date -Format "yyyy-MM-dd_HH-mm"
$backupFile = "backup_$date.sql"
mysqldump -u root -p barberia_db > $backupFile
```

Programar con Task Scheduler de Windows.

### 2. Índices y Optimización

Los índices ya están creados en el script SQL. Para verificar:
```sql
SHOW INDEX FROM citas;
```

### 3. Conexión con Pool

El proyecto ya usa connection pooling. En producción, ajusta:
```javascript
// backend/src/config/dbConfig.js
connectionLimit: 20  // Aumentar según necesidad
```

## Monitoreo

### 1. Logs de Errores

Implementar Winston para logs más robustos:
```powershell
npm install winston
```

### 2. Health Check

Endpoint ya disponible:
```bash
GET http://localhost:3000/
```

### 3. Monitoreo de Base de Datos

```sql
-- Ver conexiones activas
SHOW PROCESSLIST;

-- Ver estado de tablas
SHOW TABLE STATUS;
```

## Email en Producción

### Alternativas a Gmail

1. **SendGrid** (recomendado)
   - Más confiable para producción
   - Mayor límite de envíos
   - Mejor deliverability

2. **Amazon SES**
   - Económico
   - Alta disponibilidad

3. **Mailgun**
   - Fácil de configurar

## WhatsApp en Producción

### Twilio - Pasar de Sandbox a Producción

1. Verificar tu número de teléfono
2. Obtener aprobación de plantillas de mensajes
3. Cumplir con políticas de WhatsApp
4. Configurar webhook para respuestas

Costo aproximado: $0.005 por mensaje (varía según país)

## Escalabilidad

### Separar Servicios

Para mayor tráfico:

1. **Base de datos separada**: MySQL en servidor dedicado
2. **Backend API**: Múltiples instancias con load balancer
3. **Frontend**: CDN (Cloudflare, AWS CloudFront)
4. **Cache**: Redis para sesiones y datos frecuentes

### Rate Limiting

Proteger contra abuso:
```powershell
npm install express-rate-limit
```

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // límite de 100 requests
});

app.use('/api/', limiter);
```

## Checklist de Producción

### Antes de Desplegar

- [ ] Cambiar JWT_SECRET
- [ ] Cambiar contraseña de admin
- [ ] Configurar CORS correctamente
- [ ] Configurar HTTPS
- [ ] Configurar backup automático de BD
- [ ] Probar sistema de emails
- [ ] Probar sistema de WhatsApp
- [ ] Configurar logs
- [ ] Configurar monitoreo
- [ ] Documentar credenciales de manera segura
- [ ] Probar todas las funcionalidades
- [ ] Revisar límites de tasa de servicios externos
- [ ] Configurar variables de producción

### Después de Desplegar

- [ ] Verificar que la aplicación funcione
- [ ] Probar proceso completo de reserva
- [ ] Verificar envío de emails
- [ ] Verificar envío de WhatsApp
- [ ] Verificar cron jobs
- [ ] Monitorear logs por 24-48 horas
- [ ] Realizar backup de BD
- [ ] Documentar proceso de despliegue

## Mantenimiento

### Actualizaciones de Seguridad

```powershell
# Verificar paquetes desactualizados
npm outdated

# Actualizar dependencias
npm update

# Auditoría de seguridad
npm audit
npm audit fix
```

### Limpieza de Base de Datos

```sql
-- Eliminar citas antiguas (más de 6 meses)
DELETE FROM citas 
WHERE fecha < DATE_SUB(NOW(), INTERVAL 6 MONTH);

-- Optimizar tablas
OPTIMIZE TABLE citas;
```

## Costos Estimados

### Servicios Externos (mensual)

- **Hosting**: $5-20 (VPS básico)
- **Base de Datos**: Incluida o $5-10
- **Dominio**: $10-15/año
- **SSL**: Gratis (Let's Encrypt)
- **Email** (SendGrid): $0-15 (hasta 40,000 emails)
- **WhatsApp** (Twilio): Variable ($0.005/mensaje)

**Total aproximado**: $10-50/mes dependiendo del tráfico

## Soporte y Mantenimiento

- Revisar logs diariamente
- Backup semanal de BD
- Actualizar dependencias mensualmente
- Auditoría de seguridad trimestral
- Revisión de métricas mensual

---

**Nota**: Estos son lineamientos generales. Ajusta según tus necesidades específicas.
