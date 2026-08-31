import { IsEmail, IsString, MinLength, IsEnum, Matches } from 'class-validator';
import { UserRole } from '../../../generated/prisma/client';

export class RegisterDto {
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

  @IsEnum(UserRole, { message: 'Rol inválido' })
  role: UserRole;
}