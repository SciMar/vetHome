import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RegisterVetDto } from './dto/register-vet.dto';

@Injectable()
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

  async registerVet(dto: RegisterVetDto) {
    const existe = await this.prisma.usuario.findUnique({ where: { email: dto.email } });
    if (existe) throw new ConflictException('El email ya está registrado');

    const hash = await bcrypt.hash(dto.password, 10);

    const nombreFormateado = dto.nombre
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

    return this.prisma.usuario.create({
      data: {
        email: dto.email.toLowerCase().trim(),
        nombre: nombreFormateado,
        password: hash,
        role: 'VETERINARIAN',
        veterinario: {
          create: {
            cedula: dto.cedula,
            tarjetaProfesional: dto.tarjetaProfesional,
          },
        },
      },
      select: {
        id: true,
        email: true,
        nombre: true,
        role: true,
        veterinario: {
          select: { estado: true, cedula: true },
        },
      },
    });
  }
}