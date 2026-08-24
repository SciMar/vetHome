import { Module } from '@nestjs/common';
import { CalificacionesController } from './calificaciones.controller';
import { CalificacionesService } from './calificaciones.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [CalificacionesController],
  providers: [CalificacionesService, PrismaService],
})
export class CalificacionesModule {}
