## BASE DE DATOS

Diseñar el **schema completo de Prisma** con todas las relaciones:

- `Materia` → tiene muchos `Examen`, `Tarea`, `Asistencia`, `Material`
- `Examen` → pertenece a una `Materia`
- `Tarea` → pertenece a una `Materia`
- `Asistencia` → pertenece a una `Materia`, registra fecha y estado
- `Material` → pertenece a una `Materia`
- `Meta` → independiente, con progreso calculado dinámicamente

Incluir **migraciones de Prisma** y **seeds con datos de ejemplo** 
para que la app se vea funcional desde el primer arranque.
