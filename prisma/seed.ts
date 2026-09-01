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

  const hashTest  = await bcrypt.hash('Test1234@', 10);
  const hashAdmin = await bcrypt.hash('Admin1234@', 10);
  const hashSeed  = await bcrypt.hash('Password123!', 10);

  // ============================================
  // 1. SUPER ADMINS
  // ============================================
  await prisma.usuario.create({
    data: { email: 'admin@vethome.com', nombre: 'Admin VetHome', telefono: '3006789999', direccion: 'Cra 5 #27-85, La Candelaria, Bogotá', password: hashAdmin, role: 'SUPER_ADMIN' },
  });
  await prisma.usuario.create({
    data: { email: 'operaciones@vethome.com', nombre: 'Laura Mendoza', telefono: '3014445566', direccion: 'Cll 72 #10-45, Chapinero, Bogotá', password: hashAdmin, role: 'SUPER_ADMIN' },
  });
  await prisma.usuario.create({
    data: { email: 'soporte@vethome.com', nombre: 'Daniel Castillo', telefono: '3023336677', direccion: 'Cra 15 #100-30, Usaquén, Bogotá', password: hashAdmin, role: 'SUPER_ADMIN' },
  });

  console.log('✓ 3 Super Admins creados');

  // ============================================
  // 2. USUARIOS PROPIETARIOS
  // ============================================
  const usuariosData = [
    // Cuentas de prueba
    { email: 'sofia@vethome.com',    nombre: 'Sofía Torres',         telefono: '3101112233', direccion: 'Cra 7 #45-23, Usaquén, Bogotá',              password: hashTest },
    // Usuarios adicionales
    { email: 'juan@vethome.com',     nombre: 'Juan Martínez',        telefono: '3101234567', direccion: 'Cra 7 #52-10, Usaquén, Bogotá',              password: hashSeed },
    { email: 'maria@vethome.com',    nombre: 'María García',         telefono: '3157654321', direccion: 'Cll 85 #12-34, Chapinero, Bogotá',           password: hashSeed },
    { email: 'carlos@vethome.com',   nombre: 'Carlos López',         telefono: '3209876543', direccion: 'Cra 11 #88-50, Teusaquillo, Bogotá',         password: hashSeed },
    { email: 'laura@vethome.com',    nombre: 'Laura Díaz',           telefono: '3184445566', direccion: 'Cll 127 #15-60, Suba, Bogotá',               password: hashSeed },
    { email: 'andres@vethome.com',   nombre: 'Andrés Vargas',        telefono: '3113332244', direccion: 'Cra 80 #38-20, Kennedy, Bogotá',             password: hashSeed },
    { email: 'valentina@vethome.com',nombre: 'Valentina Herrera',    telefono: '3126667788', direccion: 'Cra 19 #63-40, Barrios Unidos, Bogotá',      password: hashSeed },
    { email: 'camilo@vethome.com',   nombre: 'Camilo Rueda',         telefono: '3135558899', direccion: 'Cll 17 #98-15, Fontibón, Bogotá',            password: hashSeed },
    { email: 'natalia@vethome.com',  nombre: 'Natalia Moreno',       telefono: '3144449900', direccion: 'Cra 91 #140-30, Suba, Bogotá',               password: hashSeed },
    { email: 'felipe@vethome.com',   nombre: 'Felipe Romero',        telefono: '3153330011', direccion: 'Cll 65B Sur #80-20, Bosa, Bogotá',           password: hashSeed },
    { email: 'paola@vethome.com',    nombre: 'Paola Jiménez',        telefono: '3162221122', direccion: 'Cra 24 #60-35, Barrios Unidos, Bogotá',      password: hashSeed },
    { email: 'sergio@vethome.com',   nombre: 'Sergio Castro',        telefono: '3171112233', direccion: 'Cra 72 #76-10, Engativá, Bogotá',            password: hashSeed },
    { email: 'daniela@vethome.com',  nombre: 'Daniela Peña',         telefono: '3180003344', direccion: 'Cll 38A #82-05, Kennedy, Bogotá',            password: hashSeed },
    { email: 'julian@vethome.com',   nombre: 'Julián Ospina',        telefono: '3199994455', direccion: 'Cra 5 #14-20, Santa Fe, Bogotá',             password: hashSeed },
    { email: 'carolina@vethome.com', nombre: 'Carolina Suárez',      telefono: '3108885566', direccion: 'Cll 119 #8-40, Usaquén, Bogotá',             password: hashSeed },
    { email: 'mauricio@vethome.com', nombre: 'Mauricio Salcedo',     telefono: '3117776677', direccion: 'Cra 11 #90-15, Chapinero, Bogotá',           password: hashSeed },
    { email: 'isabela@vethome.com',  nombre: 'Isabela Ríos',         telefono: '3126667788', direccion: 'Cll 100 #18-30, Suba, Bogotá',               password: hashSeed },
    { email: 'nicolas@vethome.com',  nombre: 'Nicolás Guerrero',     telefono: '3135558899', direccion: 'Cra 30 #3-25, Teusaquillo, Bogotá',          password: hashSeed },
    { email: 'alejandra@vethome.com',nombre: 'Alejandra Molina',     telefono: '3144440011', direccion: 'Cll 13 #102-50, Fontibón, Bogotá',           password: hashSeed },
    { email: 'sebastian@vethome.com',nombre: 'Sebastián Pineda',     telefono: '3153331122', direccion: 'Cra 68 #22-40, Puente Aranda, Bogotá',       password: hashSeed },
    { email: 'mariana@vethome.com',  nombre: 'Mariana Acosta',       telefono: '3162222233', direccion: 'Cll 57 #24-10, Barrios Unidos, Bogotá',      password: hashSeed },
    { email: 'david@vethome.com',    nombre: 'David Camacho',        telefono: '3171113344', direccion: 'Cra 91 #145-60, Suba, Bogotá',               password: hashSeed },
    { email: 'sara@vethome.com',     nombre: 'Sara Bermúdez',        telefono: '3180004455', direccion: 'Cll 38 #18-25, Teusaquillo, Bogotá',         password: hashSeed },
    { email: 'tomas@vethome.com',    nombre: 'Tomás Cardona',        telefono: '3199995566', direccion: 'Cra 7 #120-30, Usaquén, Bogotá',             password: hashSeed },
    { email: 'gabriela@vethome.com', nombre: 'Gabriela Cárdenas',    telefono: '3108886677', direccion: 'Cll 80 #9-15, Chapinero, Bogotá',            password: hashSeed },
  ];

  const usuarios = await Promise.all(
    usuariosData.map(d => prisma.usuario.create({ data: { ...d, role: 'USER' } }))
  );

  const sofia = usuarios[0];
  console.log(`✓ ${usuarios.length} usuarios propietarios creados`);

  // ============================================
  // 3. VETERINARIOS
  // ============================================
  const vetsData = [
    // Cuenta de prueba — APROBADO
    { email: 'pedro@vethome.com',         nombre: 'Pedro Ramírez',       cedula: '80111222', tp: 'TP-2024-000', calif: 4.9, estado: 'APROBADO',  password: hashTest },
    // Aprobados
    { email: 'ana.morales@vethome.com',   nombre: 'Ana Morales',         cedula: '79100001', tp: 'TP-2024-001', calif: 4.8, estado: 'APROBADO',  password: hashSeed },
    { email: 'luis.herrera@vethome.com',  nombre: 'Luis Herrera',        cedula: '79100002', tp: 'TP-2024-002', calif: 4.7, estado: 'APROBADO',  password: hashSeed },
    { email: 'claudia.pena@vethome.com',  nombre: 'Claudia Peña',        cedula: '79100003', tp: 'TP-2024-003', calif: 4.6, estado: 'APROBADO',  password: hashSeed },
    { email: 'sergio.castro@vethome.com', nombre: 'Sergio Castro Vet',   cedula: '79100004', tp: 'TP-2024-004', calif: 4.5, estado: 'APROBADO',  password: hashSeed },
    { email: 'natalia.rios@vethome.com',  nombre: 'Natalia Ríos Vet',   cedula: '79100005', tp: 'TP-2024-005', calif: 4.9, estado: 'APROBADO',  password: hashSeed },
    { email: 'camilo.ruiz@vethome.com',   nombre: 'Camilo Ruiz Vet',    cedula: '79100006', tp: 'TP-2024-006', calif: 4.3, estado: 'APROBADO',  password: hashSeed },
    { email: 'valentina.cruz@vethome.com',nombre: 'Valentina Cruz Vet', cedula: '79100007', tp: 'TP-2024-007', calif: 4.7, estado: 'APROBADO',  password: hashSeed },
    { email: 'felipe.medina@vethome.com', nombre: 'Felipe Medina Vet',  cedula: '79100008', tp: 'TP-2024-008', calif: 4.4, estado: 'APROBADO',  password: hashSeed },
    { email: 'sandra.vargas@vethome.com', nombre: 'Sandra Vargas',       cedula: '79100009', tp: 'TP-2024-009', calif: 4.8, estado: 'APROBADO',  password: hashSeed },
    { email: 'julian.torres@vethome.com', nombre: 'Julián Torres Vet',  cedula: '79100010', tp: 'TP-2024-010', calif: 4.6, estado: 'APROBADO',  password: hashSeed },
    { email: 'paola.jim@vethome.com',     nombre: 'Paola Jiménez Vet',  cedula: '79100011', tp: 'TP-2024-011', calif: 4.5, estado: 'APROBADO',  password: hashSeed },
    // Pendientes de aprobación
    { email: 'andres.ospina@vethome.com', nombre: 'Andrés Ospina',       cedula: '79100012', tp: 'TP-2024-012', calif: 0.0, estado: 'PENDIENTE', password: hashSeed },
    { email: 'carol.sua@vethome.com',     nombre: 'Carolina Suárez Vet',cedula: '79100013', tp: 'TP-2024-013', calif: 0.0, estado: 'PENDIENTE', password: hashSeed },
    // Rechazado
    { email: 'mauricio.sal@vethome.com',  nombre: 'Mauricio Salcedo Vet',cedula: '79100014', tp: 'TP-2024-014', calif: 0.0, estado: 'RECHAZADO', password: hashSeed },
  ];

  const vets: any[] = [];

  for (const v of vetsData) {
    const usuario = await prisma.usuario.create({
      data: { email: v.email, nombre: v.nombre, telefono: `31${Math.floor(10000000 + Math.random() * 89999999)}`, direccion: 'Bogotá, Colombia', password: v.password, role: 'VETERINARIAN' },
    });
    const vet = await prisma.veterinario.create({
      data: { userId: usuario.id, cedula: v.cedula, tarjetaProfesional: v.tp, estado: v.estado as any, calificacionPromedio: v.calif },
    });
    vets.push(vet);
  }

  console.log(`✓ ${vets.length} veterinarios creados`);

  // ============================================
  // 4. CLÍNICAS CON COORDENADAS EN BOGOTÁ
  // ============================================
  const clinicasData = [
    { nombre: 'Clínica Veterinaria Usaquén',        direccion: 'Cra 7 #119-45, Usaquén',         telefono: '6011110001', horario: 'Lun-Vie 8AM-6PM, Sab 9AM-4PM',   latitud: 4.6941, longitud: -74.0294 },
    { nombre: 'Centro Veterinario Chapinero',        direccion: 'Cll 60 #8-35, Chapinero',         telefono: '6011110002', horario: 'Lun-Dom 8AM-8PM',                latitud: 4.6352, longitud: -74.0665 },
    { nombre: 'Veterinaria Suba Norte',              direccion: 'Cra 91 #145-20, Suba',            telefono: '6011110003', horario: 'Lun-Vie 7AM-7PM, Sab 9AM-2PM',   latitud: 4.7449, longitud: -74.0996 },
    { nombre: 'Clínica Mascotas Kennedy',            direccion: 'Cll 38A #80-15, Kennedy',         telefono: '6011110004', horario: 'Lun-Sab 8AM-7PM',                latitud: 4.6287, longitud: -74.1329 },
    { nombre: 'Veterinaria Teusaquillo',             direccion: 'Cra 17 #34-50, Teusaquillo',      telefono: '6011110005', horario: 'Lun-Vie 8AM-6PM',                latitud: 4.6401, longitud: -74.0842 },
    { nombre: 'Centro Animal Fontibón',              direccion: 'Cll 17 #100-30, Fontibón',        telefono: '6011110006', horario: 'Lun-Dom 9AM-7PM',                latitud: 4.6721, longitud: -74.1469 },
    { nombre: 'Clínica Veterinaria Engativá',        direccion: 'Cra 72 #74-20, Engativá',         telefono: '6011110007', horario: 'Lun-Sab 8AM-6PM',                latitud: 4.7044, longitud: -74.1133 },
    { nombre: 'Veterinaria Barrios Unidos',          direccion: 'Cra 24 #57-45, Barrios Unidos',   telefono: '6011110008', horario: 'Lun-Vie 7AM-6PM, Sab 8AM-2PM',   latitud: 4.6601, longitud: -74.0797 },
    { nombre: 'Centro Veterinario Bosa',             direccion: 'Cll 65B Sur #78-40, Bosa',        telefono: '6011110009', horario: 'Lun-Dom 8AM-7PM',                latitud: 4.6200, longitud: -74.1850 },
    { nombre: 'Clínica Animal Santa Fe',             direccion: 'Cra 5 #12-30, Santa Fe',          telefono: '6011110010', horario: 'Lun-Sab 9AM-6PM',                latitud: 4.5981, longitud: -74.0742 },
  ];

  const clinicas = await Promise.all(
    clinicasData.map(data => prisma.clinica.create({ data }))
  );

  console.log(`✓ ${clinicas.length} clínicas creadas`);

  // ============================================
  // 5. ASOCIACIONES VET-CLÍNICA
  // Solo vets APROBADOS (índices 0-11)
  // ============================================
  const asociaciones = [
    { vetIdx: 0,  clinIdx: 0 }, { vetIdx: 0,  clinIdx: 1 }, { vetIdx: 0,  clinIdx: 4 },
    { vetIdx: 1,  clinIdx: 0 }, { vetIdx: 1,  clinIdx: 2 },
    { vetIdx: 2,  clinIdx: 1 }, { vetIdx: 2,  clinIdx: 3 }, { vetIdx: 2,  clinIdx: 7 },
    { vetIdx: 3,  clinIdx: 2 }, { vetIdx: 3,  clinIdx: 6 },
    { vetIdx: 4,  clinIdx: 0 }, { vetIdx: 4,  clinIdx: 3 }, { vetIdx: 4,  clinIdx: 9 },
    { vetIdx: 5,  clinIdx: 4 }, { vetIdx: 5,  clinIdx: 5 },
    { vetIdx: 6,  clinIdx: 1 }, { vetIdx: 6,  clinIdx: 6 }, { vetIdx: 6,  clinIdx: 8 },
    { vetIdx: 7,  clinIdx: 3 }, { vetIdx: 7,  clinIdx: 7 },
    { vetIdx: 8,  clinIdx: 2 }, { vetIdx: 8,  clinIdx: 5 }, { vetIdx: 8,  clinIdx: 9 },
    { vetIdx: 9,  clinIdx: 4 }, { vetIdx: 9,  clinIdx: 8 },
    { vetIdx: 10, clinIdx: 0 }, { vetIdx: 10, clinIdx: 6 },
    { vetIdx: 11, clinIdx: 1 }, { vetIdx: 11, clinIdx: 5 }, { vetIdx: 11, clinIdx: 9 },
  ];

  for (const a of asociaciones) {
    await prisma.vetClinica.create({
      data: { vetId: vets[a.vetIdx].id, clinicaId: clinicas[a.clinIdx].id },
    });
  }

  console.log('✓ Veterinarios asociados a clínicas');

  // ============================================
  // 6. MASCOTAS
  // ============================================
  const mascotasData = [
    { userId: sofia.id,          nombre: 'Luna',      especie: 'Gato',     raza: 'Persa',              fechaNacimiento: new Date('2021-03-15'), peso: 4.5 },
    { userId: sofia.id,          nombre: 'Max',       especie: 'Perro',    raza: 'Golden Retriever',   fechaNacimiento: new Date('2019-07-20'), peso: 32.0 },
    { userId: usuarios[1].id,    nombre: 'Miau',      especie: 'Gato',     raza: 'Siamés',             fechaNacimiento: new Date('2022-01-10'), peso: 3.2 },
    { userId: usuarios[1].id,    nombre: 'Tobi',      especie: 'Perro',    raza: 'Beagle',             fechaNacimiento: new Date('2020-11-05'), peso: 12.5 },
    { userId: usuarios[2].id,    nombre: 'Rocky',     especie: 'Perro',    raza: 'Pastor Alemán',      fechaNacimiento: new Date('2020-05-05'), peso: 28.5 },
    { userId: usuarios[3].id,    nombre: 'Fluffy',    especie: 'Conejo',   raza: 'Holland Lop',        fechaNacimiento: new Date('2023-02-28'), peso: 2.1 },
    { userId: usuarios[4].id,    nombre: 'Nala',      especie: 'Gato',     raza: 'Angora',             fechaNacimiento: new Date('2021-08-14'), peso: 3.8 },
    { userId: usuarios[5].id,    nombre: 'Bruno',     especie: 'Perro',    raza: 'Labrador',           fechaNacimiento: new Date('2018-04-22'), peso: 35.0 },
    { userId: usuarios[6].id,    nombre: 'Pipa',      especie: 'Ave',      raza: 'Loro Amazónico',     fechaNacimiento: new Date('2019-12-01'), peso: 0.4 },
    { userId: usuarios[7].id,    nombre: 'Simba',     especie: 'Gato',     raza: 'Maine Coon',         fechaNacimiento: new Date('2022-06-30'), peso: 6.2 },
    { userId: usuarios[8].id,    nombre: 'Lola',      especie: 'Perro',    raza: 'Bulldog Francés',    fechaNacimiento: new Date('2021-09-18'), peso: 11.0 },
    { userId: usuarios[9].id,    nombre: 'Coco',      especie: 'Perro',    raza: 'Poodle',             fechaNacimiento: new Date('2023-01-07'), peso: 5.5 },
    { userId: usuarios[10].id,   nombre: 'Peppa',     especie: 'Cerdo',    raza: 'Vietnamita',         fechaNacimiento: new Date('2022-10-20'), peso: 8.0 },
    { userId: usuarios[11].id,   nombre: 'Rex',       especie: 'Perro',    raza: 'Rottweiler',         fechaNacimiento: new Date('2019-03-11'), peso: 42.0 },
    { userId: usuarios[12].id,   nombre: 'Mango',     especie: 'Ave',      raza: 'Canario',            fechaNacimiento: new Date('2023-05-25'), peso: 0.1 },
    { userId: usuarios[13].id,   nombre: 'Kira',      especie: 'Perro',    raza: 'Husky Siberiano',    fechaNacimiento: new Date('2021-02-14'), peso: 22.0 },
    { userId: usuarios[14].id,   nombre: 'Manchas',   especie: 'Gato',     raza: 'Doméstico',          fechaNacimiento: new Date('2020-07-08'), peso: 4.1 },
    { userId: usuarios[15].id,   nombre: 'Bolt',      especie: 'Perro',    raza: 'Dálmata',            fechaNacimiento: new Date('2022-04-03'), peso: 24.0 },
    { userId: usuarios[16].id,   nombre: 'Pantera',   especie: 'Gato',     raza: 'Bombay',             fechaNacimiento: new Date('2023-08-19'), peso: 3.5 },
    { userId: usuarios[17].id,   nombre: 'Gordito',   especie: 'Conejo',   raza: 'Rex',                fechaNacimiento: new Date('2022-12-12'), peso: 2.8 },
    { userId: usuarios[18].id,   nombre: 'Thor',      especie: 'Perro',    raza: 'Dóberman',           fechaNacimiento: new Date('2020-01-30'), peso: 38.0 },
    { userId: usuarios[19].id,   nombre: 'Perla',     especie: 'Gato',     raza: 'Ragdoll',            fechaNacimiento: new Date('2021-11-11'), peso: 5.0 },
    { userId: usuarios[20].id,   nombre: 'Pepe',      especie: 'Perro',    raza: 'Chihuahua',          fechaNacimiento: new Date('2023-03-03'), peso: 2.5 },
    { userId: usuarios[21].id,   nombre: 'Nube',      especie: 'Gato',     raza: 'Persa',              fechaNacimiento: new Date('2022-09-09'), peso: 4.3 },
    { userId: usuarios[22].id,   nombre: 'Dante',     especie: 'Perro',    raza: 'Xoloitzcuintle',    fechaNacimiento: new Date('2021-06-06'), peso: 14.0 },
    { userId: usuarios[23].id,   nombre: 'Estrella',  especie: 'Ave',      raza: 'Agaporni',           fechaNacimiento: new Date('2023-07-07'), peso: 0.06 },
    { userId: usuarios[24].id,   nombre: 'Gamba',     especie: 'Perro',    raza: 'Shih Tzu',           fechaNacimiento: new Date('2022-02-02'), peso: 6.8 },
  ];

  const mascotas = await Promise.all(
    mascotasData.map(d => prisma.mascota.create({ data: d }))
  );

  console.log(`✓ ${mascotas.length} mascotas creadas`);

  // ============================================
  // 7. HISTORIAS MÉDICAS (para las primeras 10)
  // ============================================
  const historias = [
    { mascotaId: mascotas[0].id,  vacunas: 'Trivalente (2024-01), Rabia (2024-01)',       alergias: 'Alérgica a pollo',               condiciones: 'Ninguna',             notas: 'Requiere dieta especial sin pollo.' },
    { mascotaId: mascotas[1].id,  vacunas: 'Polivalente (2023-11), Rabia (2023-11)',       alergias: 'Ninguna',                        condiciones: 'Displasia leve de cadera', notas: 'Control anual para displasia.' },
    { mascotaId: mascotas[2].id,  vacunas: 'Trivalente (2024-02), Rabia (2024-02)',       alergias: 'Sensible a penicilina',          condiciones: 'Ninguna',             notas: 'Revisiones cada 6 meses.' },
    { mascotaId: mascotas[3].id,  vacunas: 'Polivalente (2024-01)',                       alergias: 'Ninguna',                        condiciones: 'Ninguna',             notas: 'Activo y sano.' },
    { mascotaId: mascotas[4].id,  vacunas: 'Polivalente (2023-10), Rabia (2023-10)',       alergias: 'Ninguna',                        condiciones: 'Ninguna',             notas: 'Excelente estado de salud.' },
    { mascotaId: mascotas[5].id,  vacunas: 'Sin vacunas registradas',                     alergias: 'Colorantes artificiales',        condiciones: 'Ninguna',             notas: 'Esterilizado. Dieta de fibra.' },
    { mascotaId: mascotas[6].id,  vacunas: 'Trivalente (2024-03)',                        alergias: 'Ninguna',                        condiciones: 'Ninguna',             notas: 'Gata tranquila, buena condición.' },
    { mascotaId: mascotas[7].id,  vacunas: 'Polivalente (2023-09), Rabia (2023-09)',       alergias: 'Ninguna',                        condiciones: 'Artritis incipiente', notas: 'Suplemento Omega 3. Ejercicio moderado.' },
    { mascotaId: mascotas[8].id,  vacunas: 'Sin vacunas registradas',                     alergias: 'Ninguna',                        condiciones: 'Ninguna',             notas: 'Ave exótica. Dieta de frutas y semillas.' },
    { mascotaId: mascotas[9].id,  vacunas: 'Trivalente (2024-04)',                        alergias: 'Ninguna',                        condiciones: 'Ninguna',             notas: 'Gato grande, muy tranquilo.' },
  ];

  await Promise.all(historias.map(h => prisma.historiaMedica.create({ data: h })));

  console.log('✓ Historias médicas creadas');

  // ============================================
  // 8. CITAS
  // ============================================
  const citasData = [
    { usuarioId: sofia.id,         vetId: vets[0].id,  mascotaId: mascotas[0].id, fecha: new Date('2026-09-10T10:00:00'), status: 'PENDIENTE',  notas: 'Revisión general de Luna.' },
    { usuarioId: sofia.id,         vetId: vets[1].id,  mascotaId: mascotas[1].id, fecha: new Date('2026-08-15T14:30:00'), status: 'COMPLETADA', notas: 'Control de displasia.', diagnostico: 'Displasia estable. Ejercicio moderado.' },
    { usuarioId: usuarios[1].id,   vetId: vets[2].id,  mascotaId: mascotas[2].id, fecha: new Date('2026-09-20T09:00:00'), status: 'CONFIRMADA', notas: 'Vacunación anual.' },
    { usuarioId: usuarios[1].id,   vetId: vets[3].id,  mascotaId: mascotas[3].id, fecha: new Date('2026-09-22T11:00:00'), status: 'PENDIENTE',  notas: 'Revisión de rutina.' },
    { usuarioId: usuarios[2].id,   vetId: vets[0].id,  mascotaId: mascotas[4].id, fecha: new Date('2026-09-25T16:00:00'), status: 'PENDIENTE',  notas: 'Revisión general.' },
    { usuarioId: usuarios[3].id,   vetId: vets[4].id,  mascotaId: mascotas[5].id, fecha: new Date('2026-09-01T11:00:00'), status: 'COMPLETADA', notas: 'Control post-esterilización.', diagnostico: 'Recuperación satisfactoria.' },
    { usuarioId: usuarios[4].id,   vetId: vets[5].id,  mascotaId: mascotas[6].id, fecha: new Date('2026-09-05T10:30:00'), status: 'CONFIRMADA', notas: 'Primera visita.' },
    { usuarioId: usuarios[5].id,   vetId: vets[1].id,  mascotaId: mascotas[7].id, fecha: new Date('2026-08-20T15:00:00'), status: 'COMPLETADA', notas: 'Control artritis.', diagnostico: 'Artritis estable. Continuar suplemento.' },
    { usuarioId: usuarios[6].id,   vetId: vets[6].id,  mascotaId: mascotas[8].id, fecha: new Date('2026-09-12T09:00:00'), status: 'PENDIENTE',  notas: 'Revisión de plumas y pico.' },
    { usuarioId: usuarios[7].id,   vetId: vets[7].id,  mascotaId: mascotas[9].id, fecha: new Date('2026-09-18T14:00:00'), status: 'CONFIRMADA', notas: 'Desparasitación.' },
    { usuarioId: usuarios[8].id,   vetId: vets[8].id,  mascotaId: mascotas[10].id,fecha: new Date('2026-09-08T10:00:00'), status: 'PENDIENTE',  notas: 'Dificultad para respirar.' },
    { usuarioId: usuarios[9].id,   vetId: vets[9].id,  mascotaId: mascotas[11].id,fecha: new Date('2026-08-28T11:30:00'), status: 'COMPLETADA', notas: 'Revisión general.', diagnostico: 'Cachorro sano. Iniciar vacunación.' },
    { usuarioId: usuarios[10].id,  vetId: vets[10].id, mascotaId: mascotas[12].id,fecha: new Date('2026-09-15T08:30:00'), status: 'CONFIRMADA', notas: 'Control de peso.' },
    { usuarioId: usuarios[11].id,  vetId: vets[11].id, mascotaId: mascotas[13].id,fecha: new Date('2026-09-30T17:00:00'), status: 'PENDIENTE',  notas: 'Revisión de articulaciones.' },
  ];

  await Promise.all(citasData.map(c => prisma.cita.create({ data: c as any })));

  console.log(`✓ ${citasData.length} citas creadas`);

  // ============================================
  // 9. CALIFICACIONES
  // ============================================
  const calificaciones = [
    { usuarioId: sofia.id,        vetId: vets[1].id,  puntuacion: 5, comentario: 'Excelente atención con Max. Muy profesional.',          fecha: new Date('2026-08-16') },
    { usuarioId: usuarios[1].id,  vetId: vets[2].id,  puntuacion: 4, comentario: 'Muy buena atención con Miau. Volveré.',                  fecha: new Date('2026-08-22') },
    { usuarioId: usuarios[3].id,  vetId: vets[4].id,  puntuacion: 5, comentario: 'Excelente veterinaria. Fluffy quedó muy bien.',           fecha: new Date('2026-09-02') },
    { usuarioId: usuarios[5].id,  vetId: vets[1].id,  puntuacion: 4, comentario: 'Buen diagnóstico. Podría explicar más al dueño.',        fecha: new Date('2026-08-21') },
    { usuarioId: usuarios[9].id,  vetId: vets[9].id,  puntuacion: 5, comentario: 'Increíble con los cachorros. Muy recomendado.',          fecha: new Date('2026-08-29') },
    { usuarioId: usuarios[2].id,  vetId: vets[0].id,  puntuacion: 5, comentario: 'Pedro es un excelente veterinario. 100% recomendado.',   fecha: new Date('2026-09-01') },
    { usuarioId: usuarios[4].id,  vetId: vets[5].id,  puntuacion: 4, comentario: 'Muy amable y cuidadosa con Nala.',                       fecha: new Date('2026-09-06') },
    { usuarioId: usuarios[7].id,  vetId: vets[7].id,  puntuacion: 3, comentario: 'Buena atención pero espera muy larga.',                  fecha: new Date('2026-09-19') },
    { usuarioId: usuarios[8].id,  vetId: vets[6].id,  puntuacion: 5, comentario: 'Muy experto en animales exóticos. Excelente.',           fecha: new Date('2026-09-13') },
    { usuarioId: usuarios[11].id, vetId: vets[11].id, puntuacion: 4, comentario: 'Profesional y atento. Rex quedó muy bien.',              fecha: new Date('2026-09-01') },
  ];

  await Promise.all(calificaciones.map(c => prisma.calificacion.create({ data: c })));

  console.log(`✓ ${calificaciones.length} calificaciones creadas`);

  console.log('');
  console.log('====================================');
  console.log('✅ Seed completado exitosamente!');
  console.log('====================================');
  console.log('');
  console.log('🔐 Cuentas de prueba:');
  console.log('   sofia@vethome.com        / Test1234@   → USER');
  console.log('   pedro@vethome.com        / Test1234@   → VETERINARIAN (APROBADO)');
  console.log('   admin@vethome.com        / Admin1234@  → SUPER_ADMIN');
  console.log('   operaciones@vethome.com  / Admin1234@  → SUPER_ADMIN');
  console.log('   soporte@vethome.com      / Admin1234@  → SUPER_ADMIN');
  console.log('');
  console.log('📊 Resumen:');
  console.log('   • 3 Super Admins');
  console.log('   • 25 Usuarios propietarios');
  console.log('   • 15 Veterinarios (12 aprobados, 2 pendientes, 1 rechazado)');
  console.log('   • 10 Clínicas en Bogotá');
  console.log('   • 27 Mascotas (perros, gatos, aves, conejos, cerdo)');
  console.log('   • 10 Historias médicas');
  console.log('   • 14 Citas');
  console.log('   • 10 Calificaciones');
  console.log('');
  console.log('🔑 Contraseña usuarios adicionales: Password123!');
}

main()
  .catch((e) => { console.error('❌ Error en seed:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });