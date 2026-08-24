import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CalificacionesService } from './calificaciones.service';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('calificaciones')
export class CalificacionesController {
  constructor(private readonly calificacionesService: CalificacionesService) {}

  @Post()
  create(@GetUser('id') usuarioId: string, @Body() dto: CreateCalificacionDto) {
    return this.calificacionesService.create(usuarioId, dto);
  }

  @Get('vet/:vetId')
  findByVet(@Param('vetId') vetId: string) {
    return this.calificacionesService.findByVet(vetId);
  }
}
