import 'dotenv/config';
import { PrismaClient } from '../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Iniciando seed de VetHome...');

  // Limpiar datos existentes (en orden de dependencias)
  await prisma.calificacion.deleteMany();
  await prisma.cita.deleteMany();
  await prisma.historiaMedica.deleteMany();
  await prisma.mascota.deleteMany();
  await prisma.vetClinica.deleteMany();
  await prisma.veterinario.deleteMany();
  await prisma.clinica.deleteMany();
  await prisma.usuario.deleteMany();

  console.log('✓ Base de datos limpiada');

  // ============================================
  // 1. CREAR USUARIOS (Propietarios)
  // ============================================
  const hashedPassword = await bcrypt.hash('Password123!', 10);

  const usuario1 = await prisma.usuario.create({
    data: {
      email: 'juan@example.com',
      nombre: 'Juan Martínez',
      telefono: '3101234567',
      direccion: 'Cra 7 #45-23, Usaquén, Bogotá',
      password: hashedPassword,
      role: 'USER',
    },
  });

  const usuario2 = await prisma.usuario.create({
    data: {
      email: 'maria@example.com',
      nombre: 'María García',
      telefono: '3157654321',
      direccion: 'Cll 85 #12-34, Chapinero, Bogotá',
      password: hashedPassword,
      role: 'USER',
    },
  });

  const usuario3 = await prisma.usuario.create({
    data: {
      email: 'carlos@example.com',
      nombre: 'Carlos López',
      telefono: '3209876543',
      direccion: 'Cra 11 #88-50, Teusaquillo, Bogotá',
      password: hashedPassword,
      role: 'USER',
    },
  });

  console.log('✓ 3 usuarios propietarios creados');

  // ============================================
  // 2. CREAR VETERINARIOS
  // ============================================
  const usuarioVet1 = await prisma.usuario.create({
    data: {
      email: 'drlopez@example.com',
      nombre: 'Dr. Carlos López Veterinario',
      telefono: '3105551234',
      direccion: 'Cra 9 #50-15, La Soledad, Bogotá',
      password: hashedPassword,
      role: 'VETERINARIAN',
    },
  });

  const veterinario1 = await prisma.veterinario.create({
    data: {
      userId: usuarioVet1.id,
      cedula: '79123456',
      numeroColegiado: 'MV-12345',
      tarjetaProfesional: 'TP-2024-001',
      calificacionPromedio: 4.8,
    },
  });

  const usuarioVet2 = await prisma.usuario.create({
    data: {
      email: 'drasanchez@example.com',
      nombre: 'Dra. Patricia Sánchez Veterinaria',
      telefono: '3128889999',
      direccion: 'Cll 72 #8-45, Barrios Unidos, Bogotá',
      password: hashedPassword,
      role: 'VETERINARIAN',
    },
  });

  const veterinario2 = await prisma.veterinario.create({
    data: {
      userId: usuarioVet2.id,
      cedula: '76543210',
      numeroColegiado: 'MV-12346',
      tarjetaProfesional: 'TP-2024-002',
      calificacionPromedio: 4.6,
    },
  });

  const usuarioVet3 = await prisma.usuario.create({
    data: {
      email: 'drgomez@example.com',
      nombre: 'Dr. Roberto Gómez Veterinario',
      telefono: '3114445555',
      direccion: 'Cra 15 #92-30, Santa Bárbara, Bogotá',
      password: hashedPassword,
      role: 'VETERINARIAN',
    },
  });

  const veterinario3 = await prisma.veterinario.create({
    data: {
      userId: usuarioVet3.id,
      cedula: '80999888',
      numeroColegiado: 'MV-12347',
      tarjetaProfesional: 'TP-2024-003',
      calificacionPromedio: 4.5,
    },
  });

  console.log('✓ 3 veterinarios creados');

  // ============================================
  // 3. CREAR SUPER ADMIN
  // ============================================
  const superAdmin = await prisma.usuario.create({
    data: {
      email: 'admin@vethome.com',
      nombre: 'Admin VetHome',
      telefono: '3006789999',
      direccion: 'Cra 5 #27-85, La Candelaria, Bogotá',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    },
  });

  console.log('✓ Super admin creado');

  // ============================================
  // 4. CREAR CLÍNICAS VETERINARIAS
  // ============================================
  const clinica1 = await prisma.clinica.create({
    data: {
      nombre: 'Clínica Veterinaria Mascotas Felices',
      direccion: 'Cra 7 #52-30, Usaquén, Bogotá',
      telefono: '6015551234',
      horario: 'Lun-Vie 8AM-6PM, Sab 9AM-4PM',
    },
  });

  const clinica2 = await prisma.clinica.create({
    data: {
      nombre: 'Centro Veterinario La Sabana',
      direccion: 'Cll 85 #15-40, Chapinero, Bogotá',
      telefono: '6015559876',
      horario: 'Lun-Dom 8AM-8PM',
    },
  });

  const clinica3 = await prisma.clinica.create({
    data: {
      nombre: 'Veterinaria Teusaquillo Pet',
      direccion: 'Cra 11 #88-55, Teusaquillo, Bogotá',
      telefono: '6015556789',
      horario: 'Lun-Vie 7AM-7PM, Sab 9AM-2PM',
    },
  });

  console.log('✓ 3 clínicas creadas');

  // ============================================
  // 5. ASOCIAR VETERINARIOS CON CLÍNICAS (N:M)
  // ============================================
  await prisma.vetClinica.create({
    data: { vetId: veterinario1.id, clinicaId: clinica1.id },
  });

  await prisma.vetClinica.create({
    data: { vetId: veterinario1.id, clinicaId: clinica2.id },
  });

  await prisma.vetClinica.create({
    data: { vetId: veterinario2.id, clinicaId: clinica2.id },
  });

  await prisma.vetClinica.create({
    data: { vetId: veterinario2.id, clinicaId: clinica3.id },
  });

  await prisma.vetClinica.create({
    data: { vetId: veterinario3.id, clinicaId: clinica1.id },
  });

  console.log('✓ Veterinarios asociados con clínicas');

  // ============================================
  // 6. CREAR MASCOTAS
  // ============================================
  const mascota1 = await prisma.mascota.create({
    data: {
      userId: usuario1.id,
      nombre: 'Luna',
      especie: 'Gato',
      raza: 'Persa',
      edad: 36, // 3 años en meses
      peso: 4.5,
    },
  });

  const mascota2 = await prisma.mascota.create({
    data: {
      userId: usuario1.id,
      nombre: 'Max',
      especie: 'Perro',
      raza: 'Golden Retriever',
      edad: 60, // 5 años
      peso: 32.0,
    },
  });

  const mascota3 = await prisma.mascota.create({
    data: {
      userId: usuario2.id,
      nombre: 'Miau',
      especie: 'Gato',
      raza: 'Siamés',
      edad: 24, // 2 años
      peso: 3.2,
    },
  });

  const mascota4 = await prisma.mascota.create({
    data: {
      userId: usuario3.id,
      nombre: 'Rocky',
      especie: 'Perro',
      raza: 'Pastor Alemán',
      edad: 48, // 4 años
      peso: 28.5,
    },
  });

  const mascota5 = await prisma.mascota.create({
    data: {
      userId: usuario2.id,
      nombre: 'Fluffy',
      especie: 'Conejo',
      raza: 'Holland Lop',
      edad: 18, // 1.5 años
      peso: 2.1,
    },
  });

  console.log('✓ 5 mascotas creadas');

  // ============================================
  // 7. CREAR HISTORIAS MÉDICAS
  // ============================================
  await prisma.historiaMedica.create({
    data: {
      mascotaId: mascota1.id,
      vacunas: 'Vacuna trivalente (2024-01), Rabia (2024-01)',
      alergias: 'Alérgica a pollo',
      condiciones: 'Ninguna',
      notas: 'Gato sano, buena condición física. Requiere dieta especial sin pollo.',
    },
  });

  await prisma.historiaMedica.create({
    data: {
      mascotaId: mascota2.id,
      vacunas: 'Vacuna polivalente (2023-11), Rabia (2023-11)',
      alergias: 'Ninguna',
      condiciones: 'Displasia leve de cadera',
      notas: 'Perro activo. Control anual recomendado para displasia.',
    },
  });

  await prisma.historiaMedica.create({
    data: {
      mascotaId: mascota3.id,
      vacunas: 'Vacuna trivalente (2024-02), Rabia (2024-02)',
      alergias: 'Sensible a antibióticos tipo penicilina',
      condiciones: 'Ninguna',
      notas: 'Gato de raza, requiere revisiones cada 6 meses.',
    },
  });

  await prisma.historiaMedica.create({
    data: {
      mascotaId: mascota4.id,
      vacunas: 'Vacuna polivalente (2023-10), Rabia (2023-10)',
      alergias: 'Ninguna',
      condiciones: 'Ninguna',
      notas: 'Perro de trabajo, excelente estado de salud.',
    },
  });

  await prisma.historiaMedica.create({
    data: {
      mascotaId: mascota5.id,
      vacunas: 'Ninguna registrada',
      alergias: 'Sensible a alimentos con colorantes',
      condiciones: 'Ninguna',
      notas: 'Conejo pequeño, requiere dieta de fibra. Esterilizado.',
    },
  });

  console.log('✓ 5 historias médicas creadas');

  // ============================================
  // 8. CREAR CITAS
  // ============================================
  const cita1 = await prisma.cita.create({
    data: {
      usuarioId: usuario1.id,
      vetId: veterinario1.id,
      mascotaId: mascota1.id,
      fecha: new Date('2024-08-10T10:00:00'),
      status: 'COMPLETADA',
      notas: 'Revisión rutinaria de gato. Se recomendó cambio de alimento.',
      diagnostico: 'Gato sano, ligero sobrepeso (4.5 kg). Recomendar actividad física.',
    },
  });

  const cita2 = await prisma.cita.create({
    data: {
      usuarioId: usuario1.id,
      vetId: veterinario3.id,
      mascotaId: mascota2.id,
      fecha: new Date('2024-08-15T14:30:00'),
      status: 'COMPLETADA',
      notas: 'Revisión de displasia. Se prescribió suplemento para articulaciones.',
      diagnostico: 'Displasia estable. Continuar con ejercicio moderado.',
    },
  });

  const cita3 = await prisma.cita.create({
    data: {
      usuarioId: usuario2.id,
      vetId: veterinario2.id,
      mascotaId: mascota3.id,
      fecha: new Date('2024-08-20T09:00:00'),
      status: 'CONFIRMADA',
      notas: 'Cita de vacunación anual.',
      diagnostico: null,
    },
  });

  const cita4 = await prisma.cita.create({
    data: {
      usuarioId: usuario3.id,
      vetId: veterinario1.id,
      mascotaId: mascota4.id,
      fecha: new Date('2024-08-25T16:00:00'),
      status: 'PENDIENTE',
      notas: 'Revisión general canina.',
      diagnostico: null,
    },
  });

  const cita5 = await prisma.cita.create({
    data: {
      usuarioId: usuario2.id,
      vetId: veterinario2.id,
      mascotaId: mascota5.id,
      fecha: new Date('2024-09-01T11:00:00'),
      status: 'PENDIENTE',
      notas: 'Revisión de conejo. Control post-esterilización.',
      diagnostico: null,
    },
  });

  console.log('✓ 5 citas creadas');

  // ============================================
  // 9. CREAR CALIFICACIONES
  // ============================================
  await prisma.calificacion.create({
    data: {
      usuarioId: usuario1.id,
      vetId: veterinario1.id,
      puntuacion: 5,
      comentario:
        'Excelente atención. Dr. López fue muy atento con Luna. Altamente recomendado.',
      fecha: new Date('2024-08-11'),
    },
  });

  await prisma.calificacion.create({
    data: {
      usuarioId: usuario1.id,
      vetId: veterinario3.id,
      puntuacion: 4,
      comentario:
        'Buen diagnóstico. Muy profesional, aunque un poco rápido en la consulta.',
      fecha: new Date('2024-08-16'),
    },
  });

  await prisma.calificacion.create({
    data: {
      usuarioId: usuario2.id,
      vetId: veterinario2.id,
      puntuacion: 5,
      comentario:
        'Dra. Sánchez es increíble. Miau se siente muy cómoda con ella. Volveré sin duda.',
      fecha: new Date('2024-08-21'),
    },
  });

  await prisma.calificacion.create({
    data: {
      usuarioId: usuario3.id,
      vetId: veterinario1.id,
      puntuacion: 4,
      comentario:
        'Buena atención al perro. Podría mejorar en explicar el tratamiento.',
      fecha: new Date('2024-08-26'),
    },
  });

  console.log('✓ 4 calificaciones creadas');

  console.log('');
  console.log('====================================');
  console.log('✅ Seed completado exitosamente!');
  console.log('====================================');
  console.log('');
  console.log('📊 Datos creados:');
  console.log('   • 3 Usuarios propietarios');
  console.log('   • 3 Veterinarios');
  console.log('   • 1 Super Admin');
  console.log('   • 3 Clínicas');
  console.log('   • 5 Mascotas');
  console.log('   • 5 Historias médicas');
  console.log('   • 5 Citas');
  console.log('   • 4 Calificaciones');
  console.log('');
  console.log('🔐 Contraseña para todos los usuarios: Password123!');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
