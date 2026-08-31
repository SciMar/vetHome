import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateClinicaDto } from './dto/create-clinica.dto';

@Injectable()
export class ClinicasService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateClinicaDto) {
    return this.prisma.clinica.create({ data: dto });
  }

  findAll() {
    return this.prisma.clinica.findMany({
      orderBy: { nombre: 'asc' },
      include: { veterinarios: { include: { veterinario: { include: { usuario: { select: { nombre: true, email: true } } } } } } },
    });
  }

  async findOne(id: string) {
  return this.prisma.clinica.findUnique({
    where: { id },
    include: {
      veterinarios: {
        include: {
          veterinario: {
            include: {
              usuario: {
                select: {
                  nombre: true,
                  email: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

  async findCercanas(latitud: number, longitud: number, radioKm: number = 5) {
  return this.prisma.$queryRaw`
    SELECT * FROM (
      SELECT c.id, c.nombre, c.direccion, c.telefono, c.horario, c.latitud, c.longitud, c."createdAt", c."updatedAt",
        (6371 * acos(
          cos(radians(${latitud})) * cos(radians(c.latitud)) *
          cos(radians(c.longitud) - radians(${longitud})) +
          sin(radians(${latitud})) * sin(radians(c.latitud))
        )) AS distancia_km
      FROM "Clinica" c
      WHERE c.latitud IS NOT NULL AND c.longitud IS NOT NULL
    ) AS subquery
    WHERE distancia_km < ${radioKm}
    ORDER BY distancia_km ASC
  `;
}

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.clinica.delete({ where: { id } });
  }

  async agregarVet(clinicaId: string, vetId: string) {
  await this.findOne(clinicaId); // valida que la clínica existe
  return this.prisma.vetClinica.create({
    data: { clinicaId, vetId },
    include: {
      veterinario: {
        include: {
          usuario: { select: { nombre: true, email: true } },
        },
      },
    },
  });
}
}
