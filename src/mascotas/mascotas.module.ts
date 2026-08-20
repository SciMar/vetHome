import { Module } from '@nestjs/common';
import { MascotasController } from './mascotas.controller';
import { MascotasService } from './mascotas.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [MascotasController],
  providers: [MascotasService, PrismaService]
})
export class MascotasModule {}
