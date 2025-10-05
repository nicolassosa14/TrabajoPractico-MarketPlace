// src/login/login.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoginController } from './presentation/login.controller';
import { LoginService } from './service/login.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UsuarioRepository } from '../usuarios/repositories/usuario.repository';
import { TipoUsuarioRepository } from '../usuarios/repositories/tipoUsuario.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { TipoUsuario } from '../usuarios/entities/tipo-usuario.entity';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') || 'change_this_secret',
        signOptions: { expiresIn: '12h' },
      }),
    }),
    // si querés usar los repositorios con @InjectRepository, también importá TypeOrmModule.forFeature
    TypeOrmModule.forFeature([Usuario, TipoUsuario]),
  ],
  controllers: [LoginController],
  providers: [LoginService, JwtStrategy, UsuarioRepository, TipoUsuarioRepository],
  exports: [LoginService, JwtStrategy],
})
export class LoginModule {}
