import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';

@Injectable()
export class CitasService {
  constructor(private prisma: PrismaService) {}

  async create(usuarioId: string, dto: CreateCitaDto) {
    return this.prisma.cita.create({
      data: {
        usuarioId,
        vetId: dto.vetId,
        mascotaId: dto.mascotaId,
        fecha: new Date(dto.fecha),
        notas: dto.notas,
      },
      include: {
        veterinario: { include: { usuario: { select: { nombre: true, email: true } } } },
        mascota: { select: { nombre: true, especie: true } },
      },
    });
  }

  async findByUsuario(usuarioId: string) {
    return this.prisma.cita.findMany({
      where: { usuarioId },
      orderBy: { fecha: 'desc' },
      include: {
        veterinario: { include: { usuario: { select: { nombre: true, email: true } } } },
        mascota: { select: { nombre: true, especie: true } },
      },
    });
  }

  async findByVet(vetId: string) {
    return this.prisma.cita.findMany({
      where: { vetId },
      orderBy: { fecha: 'asc' },
      include: {
        usuario: { select: { nombre: true, email: true } },
        mascota: { select: { nombre: true, especie: true } },
      },
    });
  }

  async findOne(id: string) {
    const cita = await this.prisma.cita.findUnique({
      where: { id },
      include: {
        veterinario: { include: { usuario: { select: { nombre: true, email: true } } } },
        mascota: { select: { nombre: true, especie: true } },
        usuario: { select: { nombre: true, email: true } },
      },
    });
    if (!cita) throw new NotFoundException(`Cita con id ${id} no encontrada`);
    return cita;
  }

  async update(id: string, dto: UpdateCitaDto) {
    await this.findOne(id);
    return this.prisma.cita.update({
      where: { id },
      data: dto,
    });
  }
}
