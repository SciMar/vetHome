import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CitasService } from './citas.service';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('citas')
export class CitasController {
  constructor(private readonly citasService: CitasService) {}

  @Post()
  create(@GetUser('id') usuarioId: string, @Body() dto: CreateCitaDto) {
    return this.citasService.create(usuarioId, dto);
  }

  @Get('mis-citas')
  findByUsuario(@GetUser('id') usuarioId: string) {
    return this.citasService.findByUsuario(usuarioId);
  }

  @Get('vet/:vetId')
  findByVet(@Param('vetId') vetId: string) {
    return this.citasService.findByVet(vetId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.citasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCitaDto) {
    return this.citasService.update(id, dto);
  }
}
