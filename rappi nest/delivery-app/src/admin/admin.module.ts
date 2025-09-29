import { Module } from '@nestjs/common';
import { AdminController } from './presentation/admin.controller';
import { AdminService } from './service/admin.service';
import { AdminUserRepository } from './repositories/admin-user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { TipoUsuario } from '../usuarios/entities/tipo-usuario.entity';
import { UsuarioRepository } from '../usuarios/repositories/usuario.repository';
import { TipoUsuarioRepository } from '../usuarios/repositories/tipoUsuario.repository';


@Module({
  imports: [TypeOrmModule.forFeature([Usuario, TipoUsuario])],
  controllers: [AdminController],
  providers: [
    AdminService,
    AdminUserRepository,
    UsuarioRepository,
    TipoUsuarioRepository,
    
  ],
  exports: [AdminService],
})
export class AdminModule {}
