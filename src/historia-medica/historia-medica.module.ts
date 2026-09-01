import { Module } from '@nestjs/common';
import { HistoriaMedicaService } from './historia-medica.service';
import { HistoriaMedicaController } from './historia-medica.controller';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [HistoriaMedicaController],
  providers: [HistoriaMedicaService],
})
export class HistoriaMedicaModule {}