import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateCitaDto {
  @IsString()
  @IsNotEmpty()
  vetId: string;

  @IsString()
  @IsNotEmpty()
  mascotaId: string;

  @IsDateString()
  fecha: string;

  @IsString()
  @IsOptional()
  notas?: string;
}