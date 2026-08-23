import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ClinicasService } from './clinicas.service';
import { CreateClinicaDto } from './dto/create-clinica.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('clinicas')
export class ClinicasController {
  constructor(private readonly clinicasService: ClinicasService) {}

  @Post()
  create(@Body() dto: CreateClinicaDto) {
    return this.clinicasService.create(dto);
  }

  @Get()
  findAll() {
    return this.clinicasService.findAll();
  }

  @Get('cercanas')
  findCercanas(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('radio') radio?: string,
  ) {
    return this.clinicasService.findCercanas(
      parseFloat(lat),
      parseFloat(lng),
      radio ? parseFloat(radio) : 5,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clinicasService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clinicasService.remove(id);
  }
}
