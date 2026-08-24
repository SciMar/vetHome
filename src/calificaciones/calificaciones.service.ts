import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';

@Injectable()
export class CalificacionesService {
  constructor(private prisma: PrismaService) {}

  async create(usuarioId: string, dto: CreateCalificacionDto) {
    const existe = await this.prisma.calificacion.findUnique({
      where: { usuarioId_vetId: { usuarioId, vetId: dto.vetId } },
    });
    if (existe) throw new ConflictException('Ya calificaste a este veterinario');

    const calificacion = await this.prisma.calificacion.create({
      data: {
        usuarioId,
        vetId: dto.vetId,
        puntuacion: dto.puntuacion,
        comentario: dto.comentario,
      },
    });

    // Actualizar promedio del vet
    const promedio = await this.prisma.calificacion.aggregate({
      where: { vetId: dto.vetId },
      _avg: { puntuacion: true },
    });

    await this.prisma.veterinario.update({
      where: { id: dto.vetId },
      data: { calificacionPromedio: promedio._avg.puntuacion ?? 0 },
    });

    return calificacion;
  }

  async findByVet(vetId: string) {
    return this.prisma.calificacion.findMany({
      where: { vetId },
      orderBy: { createdAt: 'desc' },
      include: {
        usuario: { select: { nombre: true } },
      },
    });
  }
}

