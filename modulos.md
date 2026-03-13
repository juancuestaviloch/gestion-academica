## MÓDULOS

### 1. Materias

Cada materia contiene:
- Nombre de la materia
- Nombre del profesor
- Días y horarios de cursada
- Bibliografía / materiales (lista con nombre + link opcional)
- Estado: `"Cursando"` | `"Aprobada"` | `"Pendiente"`
- Color de identificación (para diferenciación visual entre módulos)

Operaciones requeridas:
- Crear, editar, eliminar y ver detalle de cada materia

---

### 2. Calendario / Agenda de Clases

- Vista **mensual** y **semanal**
- Las clases se generan automáticamente desde los horarios de cada materia
- Posibilidad de agregar eventos manuales
- Indicadores visuales por materia usando el color asignado a cada una

---

### 3. Gestión de Exámenes y Fechas

Cada examen contiene:
- Materia asociada
- Fecha y hora
- Tipo: `"Parcial"` | `"Final"` | `"Recuperatorio"`
- Aula o modalidad (presencial / virtual)
- Notas y observaciones

Vistas requeridas:
- Lista de próximos exámenes ordenada por fecha
- Alerta visual destacada para exámenes en los próximos **7 días**

---

### 4. Tareas y Entregas (Deadlines)

Cada tarea contiene:
- Título
- Materia asociada
- Fecha límite
- Descripción
- Estado: `"Pendiente"` | `"En progreso"` | `"Entregada"`

Funcionalidades:
- Vista ordenada por urgencia (fecha límite más cercana primero)
- Filtro por materia y por estado

---

### 5. Seguimiento de Asistencia

- Por materia: registrar cada clase (presente / ausente)
- Calcular y mostrar **porcentaje de asistencia automáticamente**
- Alerta visual si el porcentaje baja del **75%**

---

### 6. Apuntes y Materiales de Estudio

- Por materia: agregar links, archivos (nombre + URL), notas de texto
- Editor de notas simple con soporte básico de **Markdown**
- Buscador global de materiales por nombre o materia

---

### 7. Metas y Progreso Académico

- Dashboard de progreso general:
  - Materias aprobadas vs total
  - Tareas completadas vs total
  - Asistencia promedio global
- Definir metas por cuatrimestre (ej: "Aprobar 4 materias")
- **Barra de progreso visual** por cada meta definida