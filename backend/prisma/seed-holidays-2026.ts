import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const year = 2026;
  const holidays = [
    { title: 'Año Nuevo', date: new Date(year, 0, 1), isHoliday: true },
    { title: 'Carnaval', date: new Date(year, 1, 16), isHoliday: true },
    { title: 'Carnaval', date: new Date(year, 1, 17), isHoliday: true },
    { title: 'Día de la Memoria', date: new Date(year, 2, 24), isHoliday: true },
    { title: 'Malvinas', date: new Date(year, 3, 2), isHoliday: true },
    { title: 'Viernes Santo', date: new Date(year, 3, 3), isHoliday: true },
    { title: 'Día del Trabajador', date: new Date(year, 4, 1), isHoliday: true },
    { title: 'Revolución de Mayo', date: new Date(year, 4, 25), isHoliday: true },
    { title: 'Feriado Turístico', date: new Date(year, 5, 15), isHoliday: true }, // General Güemes trasl.
    { title: 'Paso a la Inmortalidad del Gral. Güemes', date: new Date(year, 5, 17), isHoliday: true },
    { title: 'Día de la Bandera', date: new Date(year, 5, 20), isHoliday: true },
    { title: 'Día de la Independencia', date: new Date(year, 6, 9), isHoliday: true },
    { title: 'Paso a la Inmortalidad del Gral. San Martín', date: new Date(year, 7, 17), isHoliday: true },
    { title: 'Día del Respeto a la Diversidad Cultural', date: new Date(year, 9, 12), isHoliday: true },
    { title: 'Día de la Soberanía Nacional', date: new Date(year, 10, 20), isHoliday: true },
    { title: 'Inmaculada Concepción', date: new Date(year, 11, 8), isHoliday: true },
    { title: 'Navidad', date: new Date(year, 11, 25), isHoliday: true },
  ];

  // Note: model Evento doesn't have a 'tipo' or 'isHoliday' yet, so I'll use description or color
  // to distinguish them. The 'esParo' boolean is available, maybe I can add 'esFeriado' 
  // but I'd need a migration. I'll use color #D97706 (Orange) for holidays and put it in description.

  for (const h of holidays) {
    await prisma.evento.create({
      data: {
        titulo: `🇦🇷 ${h.title}`,
        fecha: h.date,
        descripcion: 'Feriado Nacional',
        color: '#D97706', // Amber/Orange for holidays
        esParo: false
      }
    });
  }

  console.log('✅ Feriados 2026 inyectados.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
