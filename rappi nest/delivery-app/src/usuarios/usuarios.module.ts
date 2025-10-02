// src/usuario/usuario.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { TipoUsuario } from './entities/tipo-usuario.entity';
import { UsuarioRepository } from './repositories/usuario.repository';
import { TipoUsuarioRepository } from './repositories/tipoUsuario.repository';
import { UsuarioService } from './service/usuario.service';
import { AuthController } from './presentation/auth.controller';
import { UsuarioController } from './presentation/usuario.controller';


@Module({
  imports: [TypeOrmModule.forFeature([Usuario, TipoUsuario])],
  controllers: [AuthController, UsuarioController], 
  providers: [UsuarioService, UsuarioRepository, TipoUsuarioRepository],
  exports: [UsuarioService, UsuarioRepository],
})
export class UsuariosModule {}
