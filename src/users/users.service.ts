import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../../generated/prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(nombre: string, email: string, password: string, role: UserRole) {
  const existing = await this.prisma.usuario.findUnique({ where: { email } });
  if (existing) {
    throw new ConflictException('Ya existe un usuario con ese email');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const nombreFormateado = nombre
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  const user = await this.prisma.usuario.create({
    data: { nombre: nombreFormateado, email: email.toLowerCase().trim(), password: passwordHash, role },
  });

  const { password: _, ...result } = user;
  return result;
}
}
