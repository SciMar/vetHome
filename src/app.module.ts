import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MascotasModule } from './mascotas/mascotas.module';
import { ClinicasModule } from './clinicas/clinicas.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    MascotasModule,
    ClinicasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
