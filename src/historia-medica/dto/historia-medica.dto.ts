import { IsString, IsOptional } from 'class-validator';

export class HistoriaMedicaDto {
  @IsString()
  @IsOptional()
  vacunas?: string;

  @IsString()
  @IsOptional()
  alergias?: string;

  @IsString()
  @IsOptional()
  condiciones?: string;

  @IsString()
  @IsOptional()
  notas?: string;
}