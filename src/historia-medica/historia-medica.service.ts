import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { HistoriaMedicaDto } from './dto/historia-medica.dto';

@Injectable()
export class HistoriaMedicaService {
  constructor(private prisma: PrismaService) {}

  async findByMascota(mascotaId: string) {
    const historia = await this.prisma.historiaMedica.findUnique({
      where: { mascotaId },
    });
    if (!historia) throw new NotFoundException('Historia médica no encontrada');
    return historia;
  }

  async upsert(mascotaId: string, dto: HistoriaMedicaDto) {
    return this.prisma.historiaMedica.upsert({
      where: { mascotaId },
      update: dto,
      create: { mascotaId, ...dto },
    });
  }
}