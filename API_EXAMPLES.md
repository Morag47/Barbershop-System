# 📋 Ejemplos de Uso de la API

## Servicios Públicos

### Obtener todos los servicios
```bash
GET http://localhost:3000/api/servicios

Response:
[
  {
    "id": 1,
    "nombre": "Corte de Cabello",
    "descripcion": "Corte de cabello clásico con máquina y tijera",
    "duracion": 60,
    "precio": "25000.00"
  }
]
```

### Consultar disponibilidad
```bash
GET http://localhost:3000/api/disponibilidad?fecha=2025-12-15&empleado_id=1

Response:
{
  "disponible": true,
  "horarios": [
    { "hora": "10:00:00", "disponible": true },
    { "hora": "11:00:00", "disponible": true },
    { "hora": "12:00:00", "disponible": true }
  ]
}
```

### Crear una cita
```bash
POST http://localhost:3000/api/citas
Content-Type: application/json

{
  "cliente_nombre": "Juan Pérez",
  "cliente_cedula": "1234567890",
  "cliente_email": "juan@example.com",
  "cliente_telefono": "3001234567",
  "servicio_id": 1,
  "empleado_id": 1,
  "fecha": "2025-12-15",
  "hora": "10:00:00"
}

Response:
{
  "message": "Cita creada exitosamente",
  "cita": { ... }
}
```

## Servicios Administrativos

### Login
```bash
POST http://localhost:3000/api/admin/login
Content-Type: application/json

{
  "usuario": "admin",
  "password": "admin123"
}

Response:
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": 1,
    "usuario": "admin",
    "nombre": "Administrador Principal"
  }
}
```

### Obtener todas las citas (requiere token)
```bash
GET http://localhost:3000/api/admin/citas
Authorization: Bearer tu_token_jwt

Response:
[
  {
    "id": 1,
    "cliente_nombre": "Juan Pérez",
    "fecha": "2025-12-15",
    "hora": "10:00:00",
    "estado": "pendiente",
    "servicio_nombre": "Corte de Cabello",
    "empleado_nombre": "Carlos Rodríguez"
  }
]
```

### Confirmar cita
```bash
PATCH http://localhost:3000/api/admin/citas/1/confirmar
Authorization: Bearer tu_token_jwt

Response:
{
  "message": "Cita confirmada exitosamente"
}
```

### Completar cita (envía recibo)
```bash
PATCH http://localhost:3000/api/admin/citas/1/completar
Authorization: Bearer tu_token_jwt

Response:
{
  "message": "Cita completada exitosamente"
}
```

### Crear servicio
```bash
POST http://localhost:3000/api/admin/servicios
Authorization: Bearer tu_token_jwt
Content-Type: application/json

{
  "nombre": "Corte Premium",
  "descripcion": "Corte de cabello con tratamiento",
  "precio": 35000
}
```

### Crear bloqueo (vacaciones)
```bash
POST http://localhost:3000/api/admin/bloqueos
Authorization: Bearer tu_token_jwt
Content-Type: application/json

{
  "empleado_id": 1,
  "fecha_inicio": "2025-12-24",
  "fecha_fin": "2025-12-31",
  "motivo": "vacaciones",
  "descripcion": "Vacaciones de fin de año"
}
```

## Códigos de Estado HTTP

- `200` - OK (solicitud exitosa)
- `201` - Created (recurso creado exitosamente)
- `400` - Bad Request (datos inválidos)
- `401` - Unauthorized (no autenticado)
- `403` - Forbidden (token inválido)
- `404` - Not Found (recurso no encontrado)
- `500` - Internal Server Error (error del servidor)

## Notas

- Todos los endpoints administrativos requieren el header `Authorization: Bearer <token>`
- El token se obtiene del endpoint de login
- El token expira en 24 horas (configurable en .env)
- Las fechas deben estar en formato `YYYY-MM-DD`
- Las horas deben estar en formato `HH:MM:SS`
