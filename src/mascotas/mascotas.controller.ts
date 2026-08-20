import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { MascotasService } from './mascotas.service';
import { CreateMascotaDto } from './dto/create-mascota.dto';
import { UpdateMascotaDto } from './dto/update-mascota.dto';

@Controller('mascotas')
export class MascotasController {
  constructor(private readonly mascotasService: MascotasService) {}

  @Post()
  create(@Body() dto: CreateMascotaDto) {
    return this.mascotasService.create(dto);
  }

  @Get()
  findAll(@Query('userId') userId?: string) {
    return this.mascotasService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mascotasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMascotaDto) {
    return this.mascotasService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mascotasService.remove(id);
  }
}
