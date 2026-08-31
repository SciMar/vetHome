import { IsEmail, IsString, MinLength, IsOptional, IsNotEmpty, Matches } from 'class-validator';

export class RegisterVetDto {
  @IsEmail({}, { message: 'Ingresa un email válido' })
  email: string;

  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  nombre: string;

  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(/[A-Z]/, { message: 'La contraseña debe tener al menos una mayúscula' })
  @Matches(/[0-9]/, { message: 'La contraseña debe tener al menos un número' })
  @Matches(/[!@#$%^&*]/, { message: 'La contraseña debe tener al menos un carácter especial (!@#$%^&*)' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'La cédula es obligatoria' })
  cedula: string;

  @IsString()
  @IsNotEmpty({ message: 'La tarjeta profesional es obligatoria' })
  tarjetaProfesional: string;
}