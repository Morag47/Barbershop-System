# 📊 Diagramas y Flujos del Sistema

## Flujo Principal del Usuario (Cliente)

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLUJO DE RESERVA DE CITA                     │
└─────────────────────────────────────────────────────────────────┘

1. INICIO
   │
   ├─→ Cliente accede a la web
   │   └─→ Ve página principal con servicios
   │
2. SELECCIÓN DE SERVICIO
   │
   ├─→ Cliente elige servicio (corte, barba, etc.)
   │   └─→ Ve precio y duración
   │
3. SELECCIÓN DE BARBERO
   │
   ├─→ Cliente elige barbero específico
   │   └─→ O selecciona "Cualquiera disponible"
   │
4. SELECCIÓN DE FECHA Y HORA
   │
   ├─→ Cliente selecciona fecha
   ├─→ Sistema consulta disponibilidad
   ├─→ Sistema muestra horarios libres
   │   └─→ Considera:
   │       • Horarios de trabajo del barbero
   │       • Citas ya reservadas
   │       • Bloqueos (vacaciones)
   │       • Días festivos
   │       • Hora de almuerzo (13:00)
   │
5. INGRESO DE DATOS
   │
   ├─→ Cliente ingresa:
   │   • Nombre completo
   │   • Cédula
   │   • Email
   │   • Teléfono (WhatsApp)
   │
6. CONFIRMACIÓN
   │
   ├─→ Sistema crea la cita en BD
   ├─→ Envía email de confirmación ✉️
   │   └─→ Cliente recibe detalles de la cita
   │
7. RECORDATORIO (3 horas antes)
   │
   ├─→ Cron job detecta cita próxima
   └─→ Envía WhatsApp al cliente 📱
       └─→ Cliente puede responder al admin
   
8. SERVICIO
   │
   ├─→ Cliente llega a la barbería
   ├─→ Recibe el servicio
   └─→ Paga en caja
   
9. CIERRE
   │
   ├─→ Admin marca cita como "completada"
   └─→ Sistema envía recibo por email 🧾

FIN
```

## Flujo Administrativo

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLUJO DEL ADMINISTRADOR                       │
└─────────────────────────────────────────────────────────────────┘

1. LOGIN
   │
   ├─→ Admin accede a /admin/login
   ├─→ Ingresa usuario y contraseña
   ├─→ Sistema valida con BD
   └─→ Genera token JWT (válido 24h)
   
2. PANEL PRINCIPAL
   │
   ├─→ Ver todas las citas
   │   └─→ Filtrar por estado:
   │       • Pendiente
   │       • Confirmada
   │       • Cancelada
   │       • Completada
   │
   ├─→ Gestionar Servicios
   │   • Crear nuevo servicio
   │   • Editar servicio
   │   • Desactivar servicio
   │
   ├─→ Gestionar Empleados
   │   • Agregar barbero
   │   • Editar información
   │   • Desactivar barbero
   │
   ├─→ Gestionar Horarios
   │   • Definir días laborales
   │   • Configurar horas de trabajo
   │
   ├─→ Gestionar Bloqueos
   │   • Crear bloqueo (vacaciones)
   │   • Editar fechas
   │   • Eliminar bloqueo
   │
   └─→ Días Festivos
       • Agregar festivo
       • Eliminar festivo

3. ACCIONES SOBRE CITAS
   │
   ├─→ Confirmar cita
   │   └─→ Cambia estado a "confirmada"
   │
   ├─→ Cancelar cita
   │   └─→ Cambia estado a "cancelada"
   │       └─→ Libera el horario
   │
   └─→ Completar cita
       └─→ Cambia estado a "completada"
           └─→ Envía recibo por email

4. LOGOUT
   │
   └─→ Elimina token del localStorage
```

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                      ARQUITECTURA GENERAL                        │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│              │         │              │         │              │
│   CLIENTES   │◄───────►│   FRONTEND   │◄───────►│   BACKEND    │
│   (Navegador)│         │  React+Vite  │  HTTP   │  Node+Express│
│              │         │              │ REST API│              │
└──────────────┘         └──────────────┘         └──────┬───────┘
                                                          │
                    ┌─────────────────────────────────────┤
                    │                                     │
           ┌────────▼────────┐                   ┌────────▼────────┐
           │                 │                   │                 │
           │  BASE DE DATOS  │                   │   SERVICIOS     │
           │     MySQL       │                   │   EXTERNOS      │
           │                 │                   │                 │
           │  • servicios    │                   │ • Nodemailer    │
           │  • empleados    │                   │ • Twilio        │
           │  • citas        │                   │ • Cron Jobs     │
           │  • horarios     │                   │                 │
           │  • bloqueos     │                   └─────────────────┘
           │  • festivos     │
           │  • admins       │
           └─────────────────┘
```

## Modelo de Base de Datos (Relaciones)

```
┌─────────────────────────────────────────────────────────────────┐
│                  DIAGRAMA ENTIDAD-RELACIÓN                       │
└─────────────────────────────────────────────────────────────────┘

           ┌──────────────┐
           │ ADMINISTRADORES│
           │─────────────  │
           │ id (PK)       │
           │ usuario       │
           │ password      │
           │ nombre        │
           └──────────────┘

    ┌──────────────┐                        ┌──────────────┐
    │  SERVICIOS   │                        │  EMPLEADOS   │
    │──────────────│                        │──────────────│
    │ id (PK)      │                        │ id (PK)      │
    │ nombre       │                        │ nombre       │
    │ descripcion  │                        │ cedula       │
    │ duracion     │                        │ foto         │
    │ precio       │                        │ activo       │
    │ activo       │                        └──────┬───────┘
    └──────┬───────┘                               │
           │                                       │
           │                        ┌──────────────┴──────────┐
           │                        │                         │
           │              ┌─────────▼─────────┐    ┌─────────▼─────────┐
           │              │    HORARIOS       │    │    BLOQUEOS       │
           │              │───────────────────│    │───────────────────│
           │              │ id (PK)           │    │ id (PK)           │
           │              │ empleado_id (FK)  │    │ empleado_id (FK)  │
           │              │ dia_semana        │    │ fecha_inicio      │
           │              │ hora_inicio       │    │ fecha_fin         │
           │              │ hora_fin          │    │ motivo            │
           │              └───────────────────┘    └───────────────────┘
           │
           │
    ┌──────▼───────┐
    │    CITAS     │
    │──────────────│
    │ id (PK)      │
    │ servicio_id (FK) ───────┘
    │ empleado_id (FK) ────────┐
    │ cliente_nombre           │
    │ cliente_cedula           │
    │ cliente_email            │
    │ cliente_telefono         │
    │ fecha                    │
    │ hora                     │
    │ estado                   │
    └──────────────┘

    ┌──────────────┐
    │DIAS_FESTIVOS │
    │──────────────│
    │ id (PK)      │
    │ fecha        │
    │ descripcion  │
    └──────────────┘
```

## Estados de una Cita

```
┌─────────────────────────────────────────────────────────────────┐
│                    CICLO DE VIDA DE UNA CITA                     │
└─────────────────────────────────────────────────────────────────┘

    ┌─────────────┐
    │   CREADA    │
    │ (pendiente) │
    └──────┬──────┘
           │
           │ ✉️ Email de confirmación enviado
           │
           ├─────────────────────────────────┐
           │                                 │
           │ 3h antes:                       │
    ┌──────▼──────┐                  ┌──────▼──────┐
    │ RECORDATORIO│                  │  CANCELADA  │
    │   ENVIADO   │                  │  (por admin │
    │(sigue pendiente)               │ o cliente)  │
    └──────┬──────┘                  └─────────────┘
           │                                 ↓
           │                              [FIN]
           │
           │ Admin la marca como confirmada
           │
    ┌──────▼──────┐
    │ CONFIRMADA  │
    │(cliente confirmó │
    │  asistencia)     │
    └──────┬──────┘
           │
           │ Cliente recibe servicio
           │ Admin marca como completada
           │
    ┌──────▼──────┐
    │ COMPLETADA  │
    │ (servicio   │
    │  terminado) │
    └──────┬──────┘
           │
           │ 🧾 Recibo enviado por email
           │
           ↓
         [FIN]
```

## Sistema de Notificaciones

```
┌─────────────────────────────────────────────────────────────────┐
│              FLUJO DEL SISTEMA DE NOTIFICACIONES                 │
└─────────────────────────────────────────────────────────────────┘

EVENTO                      ACCIÓN                    DESTINO
─────────────────────────────────────────────────────────────────

Cita creada          →     Email Confirmación    →   Cliente
                            • Fecha y hora
                            • Servicio
                            • Barbero
                            • Precio


Cron Job             →     Verifica cada 30 min  →   Base de Datos
(cada 30 min)               • Busca citas próximas
                            • Dentro de 3-4 horas
                            • Recordatorio no enviado


Cita en 3h          →      WhatsApp Recordatorio →   Cliente
                            • Recordatorio
                            • Datos de la cita
                            • Link para responder


Cliente responde    →      Mensaje recibido      →   Admin WhatsApp
al WhatsApp                 • Admin ve respuesta
                            • Puede cancelar si
                              cliente no puede ir


Cita completada     →      Email Recibo          →   Cliente
(Admin marca)               • Recibo detallado
                            • Fecha y hora
                            • Servicio prestado
                            • Monto pagado
                            • ID de transacción
```

## Cálculo de Disponibilidad

```
┌─────────────────────────────────────────────────────────────────┐
│            ALGORITMO DE CÁLCULO DE DISPONIBILIDAD                │
└─────────────────────────────────────────────────────────────────┘

INPUTS:
  • Fecha seleccionada
  • Empleado (opcional)

PROCESO:

1. Validar fecha
   ├─→ ¿Es fecha pasada? → RECHAZAR
   └─→ ¿Es fecha futura? → CONTINUAR

2. Obtener día de la semana
   └─→ Convertir a español (lunes, martes, etc.)

3. Verificar días festivos
   ├─→ ¿Existe en tabla dias_festivos? → NO HAY HORARIOS
   └─→ No es festivo → CONTINUAR

4. Obtener horarios base
   └─→ Generar slots de 10:00 a 18:00 (cada hora)
       └─→ Excluir 13:00 (almuerzo)
       └─→ Slots: [10:00, 11:00, 12:00, 14:00, 15:00, 16:00, 17:00]

5. Para cada empleado:
   
   a. Verificar horario de trabajo
      ├─→ ¿Trabaja ese día? → CONTINUAR
      └─→ No trabaja → SKIP EMPLEADO
   
   b. Verificar bloqueos
      ├─→ ¿Tiene bloqueo activo? → SKIP EMPLEADO
      └─→ No tiene bloqueo → CONTINUAR
   
   c. Obtener citas reservadas
      └─→ Query: SELECT hora FROM citas 
          WHERE empleado_id = X 
          AND fecha = Y 
          AND estado != 'cancelada'
   
   d. Filtrar horarios disponibles
      └─→ Slots - Horas ocupadas = Horarios libres

6. Consolidar resultados
   ├─→ Si hay empleado específico:
   │   └─→ Retornar horarios de ese empleado
   │
   └─→ Si es "cualquiera disponible":
       └─→ Retornar horarios donde al menos
           un empleado esté disponible

OUTPUT:
  {
    disponible: true/false,
    horarios: [
      { hora: "10:00:00", disponible: true },
      { hora: "11:00:00", disponible: true },
      ...
    ]
  }
```

## Tecnologías y Responsabilidades

```
┌─────────────────────────────────────────────────────────────────┐
│                  STACK TECNOLÓGICO COMPLETO                      │
└─────────────────────────────────────────────────────────────────┘

FRONTEND (Cliente Web)
├── React 18
│   └─→ Componentes interactivos
├── Vite
│   └─→ Build rápido y optimizado
├── React Router
│   └─→ Navegación SPA
├── Axios
│   └─→ Peticiones HTTP
└── CSS Vanilla
    └─→ Estilos responsivos

BACKEND (Servidor API)
├── Node.js
│   └─→ Runtime JavaScript
├── Express
│   └─→ Framework web REST
├── JWT
│   └─→ Autenticación sin estado
├── Bcrypt
│   └─→ Hash de contraseñas
└── Express Validator
    └─→ Validación de datos

BASE DE DATOS
└── MySQL
    ├─→ Almacenamiento relacional
    ├─→ Transacciones ACID
    ├─→ Índices para performance
    └─→ Connection pooling

SERVICIOS EXTERNOS
├── Nodemailer
│   ├─→ Envío de emails
│   └─→ Templates HTML
├── Twilio
│   ├─→ Mensajes WhatsApp
│   └─→ API programática
└── node-cron
    ├─→ Tareas programadas
    └─→ Recordatorios automáticos

UTILIDADES
├── moment-timezone
│   └─→ Manejo de zonas horarias
└── dotenv
    └─→ Variables de entorno
```

---

Este documento proporciona una visión completa de cómo funciona el sistema internamente.
