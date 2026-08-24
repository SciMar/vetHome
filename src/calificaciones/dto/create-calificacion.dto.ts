import { IsString, IsNotEmpty, IsOptional, IsInt, Min, Max } from 'class-validator';

export class CreateCalificacionDto {
  @IsString()
  @IsNotEmpty()
  vetId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  puntuacion: number;

  @IsString()
  @IsOptional()
  comentario?: string;
}