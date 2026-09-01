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

  await prisma.calificacion.deleteMany();
  await prisma.cita.deleteMany();
  await prisma.historiaMedica.deleteMany();
  await prisma.mascota.deleteMany();
  await prisma.vetClinica.deleteMany();
  await prisma.veterinario.deleteMany();
  await prisma.clinica.deleteMany();
  await prisma.usuario.deleteMany();

  console.log('✓ Base de datos limpiada');

  const hashUser  = await bcrypt.hash('Test1234@', 10);
  const hashAdmin = await bcrypt.hash('Admin1234@', 10);
  const hashSeed  = await bcrypt.hash('Password123!', 10);

  // ============================================
  // 1. USUARIOS DE PRUEBA (test accounts)
  // ============================================
  const sofia = await prisma.usuario.create({
    data: {
      email: 'sofia@vethome.com',
      nombre: 'Sofía Torres',
      telefono: '3101112233',
      direccion: 'Cra 7 #45-23, Usaquén, Bogotá',
      password: hashUser,
      role: 'USER',
    },
  });

  const usuarioPedro = await prisma.usuario.create({
    data: {
      email: 'pedro@vethome.com',
      nombre: 'Pedro Ramírez',
      telefono: '3209998877',
      direccion: 'Cll 85 #12-34, Chapinero, Bogotá',
      password: hashUser,
      role: 'VETERINARIAN',
    },
  });

  await prisma.usuario.create({
    data: {
      email: 'admin@vethome.com',
      nombre: 'Admin VetHome',
      telefono: '3006789999',
      direccion: 'Cra 5 #27-85, La Candelaria, Bogotá',
      password: hashAdmin,
      role: 'SUPER_ADMIN',
    },
  });

  // Usuarios propietarios adicionales
  const usuarios = await Promise.all([
    prisma.usuario.create({ data: { email: 'juan@vethome.com', nombre: 'Juan Martínez', telefono: '3101234567', direccion: 'Cra 7 #45-23, Usaquén', password: hashSeed, role: 'USER' } }),
    prisma.usuario.create({ data: { email: 'maria@vethome.com', nombre: 'María García', telefono: '3157654321', direccion: 'Cll 85 #12-34, Chapinero', password: hashSeed, role: 'USER' } }),
    prisma.usuario.create({ data: { email: 'carlos@vethome.com', nombre: 'Carlos López', telefono: '3209876543', direccion: 'Cra 11 #88-50, Teusaquillo', password: hashSeed, role: 'USER' } }),
    prisma.usuario.create({ data: { email: 'laura@vethome.com', nombre: 'Laura Díaz', telefono: '3184445566', direccion: 'Cll 127 #15-60, Suba', password: hashSeed, role: 'USER' } }),
    prisma.usuario.create({ data: { email: 'andres@vethome.com', nombre: 'Andrés Vargas', telefono: '3113332244', direccion: 'Cra 80 #38-20, Kennedy', password: hashSeed, role: 'USER' } }),
  ]);

  console.log('✓ Usuarios creados');

  // ============================================
  // 2. CLÍNICAS CON COORDENADAS EN BOGOTÁ
  // ============================================
  const clinicasData = [
    { nombre: 'Clínica Veterinaria Usaquén', direccion: 'Cra 7 #119-45, Usaquén', telefono: '6011110001', horario: 'Lun-Vie 8AM-6PM, Sab 9AM-4PM', latitud: 4.6941, longitud: -74.0294 },
    { nombre: 'Centro Veterinario Chapinero', direccion: 'Cll 60 #8-35, Chapinero', telefono: '6011110002', horario: 'Lun-Dom 8AM-8PM', latitud: 4.6352, longitud: -74.0665 },
    { nombre: 'Veterinaria Suba Norte', direccion: 'Cra 91 #145-20, Suba', telefono: '6011110003', horario: 'Lun-Vie 7AM-7PM, Sab 9AM-2PM', latitud: 4.7449, longitud: -74.0996 },
    { nombre: 'Clínica Mascotas Kennedy', direccion: 'Cll 38A #80-15, Kennedy', telefono: '6011110004', horario: 'Lun-Sab 8AM-7PM', latitud: 4.6287, longitud: -74.1329 },
    { nombre: 'Veterinaria Teusaquillo', direccion: 'Cra 17 #34-50, Teusaquillo', telefono: '6011110005', horario: 'Lun-Vie 8AM-6PM', latitud: 4.6401, longitud: -74.0842 },
    { nombre: 'Centro Animal Fontibón', direccion: 'Cll 17 #100-30, Fontibón', telefono: '6011110006', horario: 'Lun-Dom 9AM-7PM', latitud: 4.6721, longitud: -74.1469 },
    { nombre: 'Clínica Veterinaria Engativá', direccion: 'Cra 72 #74-20, Engativá', telefono: '6011110007', horario: 'Lun-Sab 8AM-6PM', latitud: 4.7044, longitud: -74.1133 },
    { nombre: 'Veterinaria Barrios Unidos', direccion: 'Cra 24 #57-45, Barrios Unidos', telefono: '6011110008', horario: 'Lun-Vie 7AM-6PM, Sab 8AM-2PM', latitud: 4.6601, longitud: -74.0797 },
    { nombre: 'Centro Veterinario Bosa', direccion: 'Cll 65B Sur #78-40, Bosa', telefono: '6011110009', horario: 'Lun-Dom 8AM-7PM', latitud: 4.6200, longitud: -74.1850 },
    { nombre: 'Clínica Animal Santa Fe', direccion: 'Cra 5 #12-30, Santa Fe', telefono: '6011110010', horario: 'Lun-Sab 9AM-6PM', latitud: 4.5981, longitud: -74.0742 },
  ];

  const clinicas = await Promise.all(
    clinicasData.map(data => prisma.clinica.create({ data }))
  );

  console.log('✓ 10 clínicas creadas');

  // ============================================
  // 3. VETERINARIOS (Pedro de prueba + 14 más)
  // ============================================
  const pedro = await prisma.veterinario.create({
    data: {
      userId: usuarioPedro.id,
      cedula: '80111222',
      tarjetaProfesional: 'TP-2024-000',
      estado: 'APROBADO',
      calificacionPromedio: 4.9,
    },
  });

  const vetsData = [
    { nombre: 'Dra. Ana Morales',      email: 'ana.morales@vethome.com',      cedula: '79100001', tp: 'TP-2024-001', calif: 4.8 },
    { nombre: 'Dr. Luis Herrera',      email: 'luis.herrera@vethome.com',     cedula: '79100002', tp: 'TP-2024-002', calif: 4.7 },
    { nombre: 'Dra. Claudia Peña',     email: 'claudia.pena@vethome.com',     cedula: '79100003', tp: 'TP-2024-003', calif: 4.6 },
    { nombre: 'Dr. Sergio Castro',     email: 'sergio.castro@vethome.com',    cedula: '79100004', tp: 'TP-2024-004', calif: 4.5 },
    { nombre: 'Dra. Natalia Ríos',     email: 'natalia.rios@vethome.com',     cedula: '79100005', tp: 'TP-2024-005', calif: 4.9 },
    { nombre: 'Dr. Camilo Ruiz',       email: 'camilo.ruiz@vethome.com',      cedula: '79100006', tp: 'TP-2024-006', calif: 4.3 },
    { nombre: 'Dra. Valentina Cruz',   email: 'valentina.cruz@vethome.com',   cedula: '79100007', tp: 'TP-2024-007', calif: 4.7 },
    { nombre: 'Dr. Felipe Medina',     email: 'felipe.medina@vethome.com',    cedula: '79100008', tp: 'TP-2024-008', calif: 4.4 },
    { nombre: 'Dra. Sandra Vargas',    email: 'sandra.vargas@vethome.com',    cedula: '79100009', tp: 'TP-2024-009', calif: 4.8 },
    { nombre: 'Dr. Julián Torres',     email: 'julian.torres@vethome.com',    cedula: '79100010', tp: 'TP-2024-010', calif: 4.6 },
    { nombre: 'Dra. Paola Jiménez',    email: 'paola.jimenez@vethome.com',    cedula: '79100011', tp: 'TP-2024-011', calif: 4.5 },
    { nombre: 'Dr. Andrés Ospina',     email: 'andres.ospina@vethome.com',    cedula: '79100012', tp: 'TP-2024-012', calif: 4.7 },
    { nombre: 'Dra. Carolina Suárez',  email: 'carolina.suarez@vethome.com',  cedula: '79100013', tp: 'TP-2024-013', calif: 4.3 },
    { nombre: 'Dr. Mauricio Salcedo',  email: 'mauricio.salcedo@vethome.com', cedula: '79100014', tp: 'TP-2024-014', calif: 4.9 },
  ];

  const vets: any[] = [pedro];

  for (const v of vetsData) {
    const usuario = await prisma.usuario.create({
      data: {
        email: v.email,
        nombre: v.nombre,
        telefono: `31${Math.floor(10000000 + Math.random() * 89999999)}`,
        password: hashSeed,
        role: 'VETERINARIAN',
      },
    });
    const vet = await prisma.veterinario.create({
      data: {
        userId: usuario.id,
        cedula: v.cedula,
        tarjetaProfesional: v.tp,
        estado: 'APROBADO',
        calificacionPromedio: v.calif,
      },
    });
    vets.push(vet);
  }

  console.log('✓ 15 veterinarios creados');

  // ============================================
  // 4. ASOCIACIONES VET-CLÍNICA
  // Cada clínica tiene entre 3 y 5 vets
  // Varios vets están en múltiples clínicas
  // ============================================
  const asociaciones = [
    // Pedro en 3 clínicas
    { vetIdx: 0, clinIdx: 0 },
    { vetIdx: 0, clinIdx: 1 },
    { vetIdx: 0, clinIdx: 4 },
    // Vet 1
    { vetIdx: 1, clinIdx: 0 },
    { vetIdx: 1, clinIdx: 2 },
    // Vet 2
    { vetIdx: 2, clinIdx: 1 },
    { vetIdx: 2, clinIdx: 3 },
    { vetIdx: 2, clinIdx: 7 },
    // Vet 3
    { vetIdx: 3, clinIdx: 2 },
    { vetIdx: 3, clinIdx: 6 },
    // Vet 4
    { vetIdx: 4, clinIdx: 0 },
    { vetIdx: 4, clinIdx: 3 },
    { vetIdx: 4, clinIdx: 9 },
    // Vet 5
    { vetIdx: 5, clinIdx: 4 },
    { vetIdx: 5, clinIdx: 5 },
    // Vet 6
    { vetIdx: 6, clinIdx: 1 },
    { vetIdx: 6, clinIdx: 6 },
    { vetIdx: 6, clinIdx: 8 },
    // Vet 7
    { vetIdx: 7, clinIdx: 3 },
    { vetIdx: 7, clinIdx: 7 },
    // Vet 8
    { vetIdx: 8, clinIdx: 2 },
    { vetIdx: 8, clinIdx: 5 },
    { vetIdx: 8, clinIdx: 9 },
    // Vet 9
    { vetIdx: 9, clinIdx: 4 },
    { vetIdx: 9, clinIdx: 8 },
    // Vet 10
    { vetIdx: 10, clinIdx: 0 },
    { vetIdx: 10, clinIdx: 6 },
    // Vet 11
    { vetIdx: 11, clinIdx: 1 },
    { vetIdx: 11, clinIdx: 5 },
    { vetIdx: 11, clinIdx: 9 },
    // Vet 12
    { vetIdx: 12, clinIdx: 3 },
    { vetIdx: 12, clinIdx: 7 },
    // Vet 13
    { vetIdx: 13, clinIdx: 2 },
    { vetIdx: 13, clinIdx: 8 },
    // Vet 14
    { vetIdx: 14, clinIdx: 4 },
    { vetIdx: 14, clinIdx: 6 },
    { vetIdx: 14, clinIdx: 9 },
  ];

  for (const a of asociaciones) {
    await prisma.vetClinica.create({
      data: { vetId: vets[a.vetIdx].id, clinicaId: clinicas[a.clinIdx].id },
    });
  }

  console.log('✓ Veterinarios asociados a clínicas');

  // ============================================
  // 5. MASCOTAS (usan fechaNacimiento)
  // ============================================
  const mascota1 = await prisma.mascota.create({ data: { userId: sofia.id,       nombre: 'Luna',   especie: 'Gato',   raza: 'Persa',           fechaNacimiento: new Date('2021-03-15'), peso: 4.5 } });
  const mascota2 = await prisma.mascota.create({ data: { userId: sofia.id,       nombre: 'Max',    especie: 'Perro',  raza: 'Golden Retriever', fechaNacimiento: new Date('2019-07-20'), peso: 32.0 } });
  const mascota3 = await prisma.mascota.create({ data: { userId: usuarios[0].id, nombre: 'Miau',   especie: 'Gato',   raza: 'Siamés',          fechaNacimiento: new Date('2022-01-10'), peso: 3.2 } });
  const mascota4 = await prisma.mascota.create({ data: { userId: usuarios[1].id, nombre: 'Rocky',  especie: 'Perro',  raza: 'Pastor Alemán',   fechaNacimiento: new Date('2020-05-05'), peso: 28.5 } });
  const mascota5 = await prisma.mascota.create({ data: { userId: usuarios[2].id, nombre: 'Fluffy', especie: 'Conejo', raza: 'Holland Lop',     fechaNacimiento: new Date('2023-02-28'), peso: 2.1 } });

  console.log('✓ Mascotas creadas');

  // ============================================
  // 6. CITAS
  // ============================================
  await prisma.cita.create({ data: { usuarioId: sofia.id, vetId: pedro.id, mascotaId: mascota1.id, fecha: new Date('2026-09-10T10:00:00'), status: 'PENDIENTE', notas: 'Revisión general de Luna.' } });
  await prisma.cita.create({ data: { usuarioId: sofia.id, vetId: vets[1].id, mascotaId: mascota2.id, fecha: new Date('2026-08-15T14:30:00'), status: 'COMPLETADA', notas: 'Control de displasia.', diagnostico: 'Displasia estable. Continuar ejercicio moderado.' } });
  await prisma.cita.create({ data: { usuarioId: usuarios[0].id, vetId: vets[2].id, mascotaId: mascota3.id, fecha: new Date('2026-09-20T09:00:00'), status: 'CONFIRMADA', notas: 'Vacunación anual.' } });
  await prisma.cita.create({ data: { usuarioId: usuarios[1].id, vetId: pedro.id, mascotaId: mascota4.id, fecha: new Date('2026-09-25T16:00:00'), status: 'PENDIENTE', notas: 'Revisión general.' } });

  console.log('✓ Citas creadas');

  // ============================================
  // 7. CALIFICACIONES
  // ============================================
  await prisma.calificacion.create({ data: { usuarioId: sofia.id, vetId: vets[1].id, puntuacion: 5, comentario: 'Excelente atención con Max.', fecha: new Date('2026-08-16') } });
  await prisma.calificacion.create({ data: { usuarioId: usuarios[0].id, vetId: vets[2].id, puntuacion: 4, comentario: 'Muy profesional con Miau.', fecha: new Date('2026-08-22') } });

  console.log('✓ Calificaciones creadas');

  console.log('');
  console.log('====================================');
  console.log('✅ Seed completado exitosamente!');
  console.log('====================================');
  console.log('🔐 Cuentas de prueba:');
  console.log('   sofia@vethome.com   / Test1234@  → USER');
  console.log('   pedro@vethome.com   / Test1234@  → VETERINARIAN');
  console.log('   admin@vethome.com   / Admin1234@ → SUPER_ADMIN');
  console.log('📊 10 clínicas · 15 vets · 5 mascotas · 4 citas');
}

main()
  .catch((e) => { console.error('❌ Error en seed:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });