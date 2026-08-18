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

    const user = await this.prisma.usuario.create({
      data: { nombre, email, password: passwordHash, role },
    });

    // No devolvemos el hash de la contraseña
    const { password: _, ...result } = user;
    return result;
  }
}
