import { IsEmail, IsString, MinLength, IsOptional, IsNotEmpty } from 'class-validator';

export class RegisterVetDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  nombre: string;

  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  cedula: string;

  @IsString()
  @IsOptional()
  tarjetaProfesional?: string;
}