import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTriageDto {
  @IsString()
  @IsNotEmpty()
  mascotaId: string;

  @IsString()
  @IsNotEmpty()
  sintomas: string;

  @IsString()
  @IsOptional()
  especie?: string;

  @IsString()
  @IsOptional()
  edad?: string;

  @IsString()
  @IsOptional()
  peso?: string;
}