import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { HistoriaMedicaService } from './historia-medica.service';
import { HistoriaMedicaDto } from './dto/historia-medica.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('historia-medica')
export class HistoriaMedicaController {
  constructor(private readonly historiaService: HistoriaMedicaService) {}

  @Get(':mascotaId')
  findByMascota(@Param('mascotaId') mascotaId: string) {
    return this.historiaService.findByMascota(mascotaId);
  }

  @Put(':mascotaId')
  upsert(@Param('mascotaId') mascotaId: string, @Body() dto: HistoriaMedicaDto) {
    return this.historiaService.upsert(mascotaId, dto);
  }
}