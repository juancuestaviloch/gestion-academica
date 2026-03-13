# UniTrack - Plataforma de Gestión Académica Universitaria

Aplicación web SPA para gestión académica de un estudiante universitario.
Incluye gestión de materias, calendario, exámenes, tareas, asistencia,
apuntes y metas de progreso académico.

## Stack Técnico

| Capa | Tecnología |
|------|-----------|
| Frontend | React + TypeScript + TailwindCSS v4 |
| Backend | Node.js + Express |
| ORM | Prisma |
| Base de Datos | SQLite |

## Requisitos

- **Node.js** v18 o superior
- **npm** v9 o superior

## Instalación y puesta en marcha

### 1. Clonar/descargar el proyecto

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env          # Configurar variables de entorno
npx prisma migrate dev        # Crear la base de datos y tablas
npx prisma db seed            # Cargar datos de ejemplo
npm run dev                   # Iniciar servidor en http://localhost:3001
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev                   # Iniciar app en http://localhost:5173
```

### 4. Abrir la aplicación

Navegar a **http://localhost:5173** en el navegador.

## Estructura del Proyecto

```
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma     # Modelos de datos
│   │   ├── seed.ts           # Datos de ejemplo
│   │   └── migrations/       # Migraciones de BD
│   ├── src/
│   │   ├── index.ts          # Servidor Express
│   │   └── routes/           # Endpoints API
│   ├── .env                  # Variables de entorno
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/              # Cliente API (fetch)
    │   ├── components/       # Componentes reutilizables
    │   ├── pages/            # Páginas/módulos
    │   ├── types/            # Interfaces TypeScript
    │   ├── App.tsx           # Rutas
    │   ├── main.tsx          # Entry point
    │   └── index.css         # Diseño base TailwindCSS
    ├── index.html
    └── package.json
```

## Módulos

| Módulo | Descripción |
|--------|------------|
| Dashboard | Resumen del día: clases, exámenes, tareas urgentes, stats |
| Materias | CRUD completo con horarios, bibliografía, colores |
| Calendario | Vistas mensual/semanal con clases auto-generadas |
| Exámenes | Gestión con alertas para próximos 7 días |
| Tareas | Filtros por materia/estado, indicadores de urgencia |
| Asistencia | Porcentaje automático, alertas bajo 75% |
| Apuntes | Editor Markdown, búsqueda global |
| Metas | Barras de progreso, estadísticas académicas |

## Variables de Entorno

Ver `backend/.env.example`:

| Variable | Descripción | Default |
|----------|------------|---------|
| `DATABASE_URL` | URL de la base de datos SQLite | `file:./dev.db` |
| `PORT` | Puerto del servidor backend | `3001` |

## API Endpoints

| Recurso | Endpoint | Métodos |
|---------|----------|---------|
| Dashboard | `/api/dashboard` | GET |
| Materias | `/api/materias` | GET, POST, PUT, DELETE |
| Exámenes | `/api/examenes` | GET, POST, PUT, DELETE |
| Tareas | `/api/tareas` | GET, POST, PUT, DELETE |
| Asistencias | `/api/asistencias` | GET, POST, PUT, DELETE |
| Apuntes | `/api/apuntes` | GET, POST, PUT, DELETE |
| Metas | `/api/metas` | GET, POST, PUT, DELETE |
| Eventos | `/api/eventos` | GET, POST, PUT, DELETE |
