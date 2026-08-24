import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TriageService } from './triage.service';
import { CreateTriageDto } from './dto/create-triage.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('triage')
export class TriageController {
  constructor(private readonly triageService: TriageService) {}

  @Post()
  evaluar(@Body() dto: CreateTriageDto) {
    return this.triageService.evaluar(dto);
  }
}
