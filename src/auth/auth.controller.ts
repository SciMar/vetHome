import { Body, Controller, Post, Get, HttpCode, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { RegisterVetDto } from './dto/register-vet.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GetUser } from './get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.usersService.create(dto.nombre, dto.email, dto.password, dto.role);
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('register/vet')
  registerVet(@Body() dto: RegisterVetDto) {
    return this.authService.registerVet(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@GetUser('id') usuarioId: string) {
    return this.usersService.findById(usuarioId);
  }
}