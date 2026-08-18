import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable ()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}          

async login(dto: LoginDto) {
  const usuario = await this.prisma.usuario.findUnique({
    where: { email: dto.email },
  });

  if (!usuario) {
    throw new UnauthorizedException('Credenciales inválidas');
  }

  const passwordValida = await bcrypt.compare(dto.password, usuario.password);
  if (!passwordValida) {
    throw new UnauthorizedException('Credenciales inválidas');
  }

  const payload = { sub: usuario.id, email: usuario.email, role: usuario.role };
  const token = await this.jwtService.signAsync(payload);

  return {
    access_token: token,
    usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, role: usuario.role },
  };
}
}
