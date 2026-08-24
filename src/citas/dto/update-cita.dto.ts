import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CitaStatus } from '../../../generated/prisma/client';

export class UpdateCitaDto {
  @IsEnum(CitaStatus)
  @IsOptional()
  status?: CitaStatus;

  @IsString()
  @IsOptional()
  diagnostico?: string;

  @IsString()
  @IsOptional()
  notas?: string;
}