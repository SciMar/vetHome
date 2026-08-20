import { IsString, IsNotEmpty, IsOptional, IsInt, IsNumber, Min } from 'class-validator';

export class CreateMascotaDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  especie: string;

  @IsString()
  @IsOptional()
  raza?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  edad?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  peso?: number;
}