import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateMascotaDto } from './dto/create-mascota.dto';
import { UpdateMascotaDto } from './dto/update-mascota.dto';

@Injectable()
export class MascotasService {
  constructor(private prisma: PrismaService) {}

    create(data: CreateMascotaDto & { userId: string }) {
    return this.prisma.mascota.create({ data });
  }

  findAll(userId?: string) {
    return this.prisma.mascota.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const mascota = await this.prisma.mascota.findUnique({ where: { id } });
    if (!mascota) {
      throw new NotFoundException(`Mascota con id ${id} no encontrada`);
    }
    return mascota;
  }

  async update(id: string, dto: UpdateMascotaDto) {
    await this.findOne(id); // lanza 404 si no existe
    return this.prisma.mascota.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.mascota.delete({ where: { id } });
  }
}
