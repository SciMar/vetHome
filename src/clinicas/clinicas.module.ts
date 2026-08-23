import { Module } from '@nestjs/common';
import { ClinicasController } from './clinicas.controller';
import { ClinicasService } from './clinicas.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [ClinicasController],
  providers: [ClinicasService, PrismaService]
})
export class ClinicasModule {}
