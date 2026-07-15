# Citi API v4

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-v11-E0234E?style=flat-square&logo=nestjs" alt="NestJS">
  <img src="https://img.shields.io/badge/TypeORM-v0.3-262627?style=flat-square" alt="TypeORM">
  <img src="https://img.shields.io/badge/TypeScript-v5-3178C6?style=flat-square&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql" alt="MySQL">
  <img src="https://img.shields.io/badge/MariaDB-003545?style=flat-square&logo=mariadb" alt="MariaDB">
  <img src="https://img.shields.io/badge/JWT-black?style=flat-square&logo=jsonwebtoken" alt="JWT">
  <img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker" alt="Docker">
</p>

API backend para plataforma de descubrimiento turístico, desarrollada con **NestJS** y **TypeORM** en arquitectura monorepo. Permite gestionar locales, eventos, geolocalización y recomendaciones personalizadas basadas en etiquetas e interacciones de usuarios.

---

## 📦 Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| **Runtime** | Node.js |
| **Framework** | NestJS v11 + TypeScript v5 |
| **ORM** | TypeORM v0.3 |
| **Base de datos** | MySQL / MariaDB |
| **Auth** | Passport + JWT (bcrypt) |
| **Validación** | class-validator + class-transformer |
| **Archivos** | Multer (disk storage) |
| **Infraestructura** | Docker / Docker Compose |

---

## 🧱 Arquitectura del proyecto

```
citi-api-v4/
├── apps/
│   ├── citi-api/                    # API principal (pública)
│   │   └── src/
│   │       ├── auth/                # Autenticación y registro
│   │       ├── dashboard/           # Dashboard administrativo
│   │       ├── etiqueta/            # Gestión de etiquetas (tags)
│   │       ├── evento/              # CRUD de eventos
│   │       ├── geolocalizacion/     # Datos geográficos (país, región, ciudad)
│   │       ├── home/                # Feed principal y recomendaciones
│   │       ├── interacciones/       # Likes, shares, vistas
│   │       ├── invitado/            # Acceso público para invitados
│   │       ├── local/               # CRUD de locales
│   │       ├── subscription/        # Suscripciones (WIP)
│   │       └── user/                # Gestión de usuarios
│   └── citi-back/                   # App secundaria (admin interna)
│       └── src/
│           └── entities/            # 14 entidades compartidas
├── docker-compose.yaml              # MariaDB + app container
├── nest-cli.json                    # Configuración monorepo NestJS
└── package.json
```

### Diagrama de dependencias entre módulos

```
                    ┌─────────────┐
                    │  AppModule  │  (raíz — importa todos)
                    └──────┬──────┘
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
   ┌──────────┐    ┌──────────────┐   ┌──────────┐
   │ AuthMod  │    │ InvitadoMod  │   │ UserMod  │
   │          │    │              │   │          │
   │ imports: │    │ imports:     │   │ imports: │
   │ UserMod  │    │ UserMod      │   │Etiqueta  │
   │ JwtMod   │    │ EtiquetaMod  │   └────┬─────┘
   └────┬─────┘    │ AuthMod      │        │
        │          └──────────────┘        │
        └──────────────┬───────────────────┘
                       ▼
         ┌─────────────────────────┐
         │ LocalMod │ EventoMod    │
         │ imports: │ imports:     │
         │ GeoMod   │ GeoMod       │
         │ InterMod │ InterMod     │
         │          │ EtiquetaMod  │
         └────┬──────────┬─────────┘
              ▼          ▼
      ┌──────────────────────┐
      │  InteraccionModule   │  (leaf)
      │  GeoModule           │  (leaf)
      │  EtiquetaModule      │  (leaf)
      └──────────────────────┘

   ┌──────────────┐  ┌─────────────┐  ┌─────────────┐
   │DashboardMod  │  │ HomeModule  │  │SubscriptMod │
   │ imports: 5   │  │ imports: 5  │  │ imports: 1  │
   └──────────────┘  └─────────────┘  └─────────────┘
```

### Diagrama de entidades (base de datos)

```
Pais ──1:N──→ Region ──1:N──→ Ciudad ──1:N──→ User
                                │
                                ├──1:N──→ Local ──M:N──→ Etiquetas
                                │          ├──1:N──→ FotosLocal
                                │          └──1:N──→ interaccion
                                │
                                ├──1:N──→ Evento ──M:N──→ Etiquetas
                                │          ├──1:N──→ FotosEvento
                                │          └──1:N──→ interaccion
                                │
                                └──1:N──→ GeoData

LocalTipo ──1:N──→ Local
TipoUser  ──1:N──→ User
User ──1:N──→ interaccion ──N:1──→ Evento
                │
                └──N:1──→ Local

User ──M:N──→ Etiquetas  (Preferencias)
User ──M:N──→ Local      (Favoritos)
```

---

## 🚀 Comandos

```bash
# Instalar dependencias
npm install

# Iniciar API principal (desarrollo)
npm run start:apidev

# Iniciar app secundaria (desarrollo)
npm run start:backdev

# Iniciar ambos con watch
npm run start:api       # API con --watch
npm run start:back      # Back con --watch

# Lint + format
npm run belleza

# Tests
npm run test
```

### Variables de entorno (`.env`)

```env
APIPORT=4001
BACKPORT=4003
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=citi
DB_PORT=3306
JWT_SECRET=your-secret-key
GEOKEY=your-geo-key
```

### Docker

```bash
# Iniciar solo la base de datos
docker compose up -d database

# Iniciar todo (producción)
docker compose --profile production_app up -d
```

---

## 🧩 Funcionalidades por módulo

### 🔐 Auth (`/auth`)
- `POST /auth` — Registro de nuevo usuario
- `POST /auth/login` — Login con JWT
- `GET /auth/login` — Validar token y obtener usuario actual

### 👤 User (`/user`)
- `PUT /user` — Actualizar perfil
- `PUT /user/preferencia` / `GET /user/preferencia` — Gestionar preferencias del usuario

### 🏷️ Etiqueta (`/etiqueta`)
- `GET /etiqueta` — Listar etiquetas (paginado)
- `POST /etiqueta` — Crear etiqueta
- `PATCH /etiqueta` — Actualizar etiqueta

### 🏪 Local (`/local`)
- CRUD completo de locales (crear, editar, eliminar, listar, obtener)
- Subida y borrado de fotos (Multer → `public/fotosLocal/`)
- Asignación de etiquetas a locales
- Sistema de favoritos por usuario
- Soporte para locales "necro" (turísticos)

### 📅 Evento (`/evento`)
- CRUD completo de eventos (crear, editar, eliminar, listar, obtener)
- Subida y borrado de fotos (Multer → `public/fotosEvento/`)
- Asignación de etiquetas a eventos
- Soporte para eventos "necro"

### 🌍 Geolocalización (`/Geo`)
- Consulta de datos geográficos (países, regiones, ciudades)
- Guardado de datos geoespaciales por usuario
- Utilidades internas (carga de datos por defecto)

### ❤️ Interacciones (`/interaccion`)
- Likes, compartidos y vistas sobre locales y eventos
- Consulta de interacciones por usuario

### 🏠 Home (`/home`)
- Feed personalizado: locales, eventos, preferencias
- Filtro por contenido "necro"
- Recomendaciones basadas en preferencias del usuario

### 📊 Dashboard (`/dashboard`)
- Top locales y etiquetas (admin)
- Datos para mapa de calor por ubicación y radio
- Acceso restringido a SuperAdmin

### 🔗 Invitado (`/invitado`)
- Endpoint público para acceso de invitados (sin autenticación)

---

## 🔒 Autenticación y roles

- **JWT** con Passport Strategy, expires 1 año
- Passwords hasheados con **bcrypt**
- Roles: `SuperAdmin`, `Admin`, `Usuario`
- Protección por `@JwtAuthGuard` (clase) y `@UseAuthUser` + `@RoleProtected` (método)

---

## 🗃️ Entidades (14)

| Entidad | Descripción | PK |
|---------|-------------|----|
| `Admin` | Administradores del sistema | UUID |
| `User` | Usuarios de la plataforma | UUID |
| `Local` | Locales/negocios | UUID |
| `Evento` | Eventos | number |
| `Etiquetas` | Tags/categorías | number |
| `Pais` | Países | number |
| `Region` | Regiones | number |
| `Ciudad` | Ciudades | number |
| `LocalTipo` | Tipos de local | number |
| `TipoUser` | Roles de usuario | number |
| `interaccion` | Likes/shares/views | number |
| `FotosLocal` | Fotos de locales | number |
| `FotosEvento` | Fotos de eventos | number |
| `GeoData` | Datos geoespaciales | number |

---

## 📈 API endpoints (42 total)

| Módulo | Base | Endpoints |
|--------|------|-----------|
| Auth | `/auth` | 4 |
| User | `/user` | 4 |
| Etiqueta | `/etiqueta` | 3 |
| Local | `/local` | 12 |
| Evento | `/evento` | 9 |
| Geo | `/Geo` | 5 |
| Interacción | `/interaccion` | 2 |
| Dashboard | `/dashboard` | 3 |
| Home | `/home` | 6 |
| Invitado | `/invitado` | 1 |

---

## ⚠️ Notas técnicas

- **Monorepo NestJS** con dos aplicaciones: `citi-api` (pública) y `citi-back` (admin/secundaria)
- **TypeORM** con `synchronize: false` en API y `synchronize: true` en Back
- Archivos estáticos servidos en `/public` (fotos de locales y eventos)
- Soporte para contenido **"necro"** — modo turístico con items destacados
- Sistema de **recomendaciones** basado en etiquetas de preferencia del usuario

---

## 📝 Licencia

Este repositorio se publica únicamente con fines de demostración y portafolio.  
No se autoriza la reutilización, distribución o uso comercial del código sin permiso expreso del autor.
