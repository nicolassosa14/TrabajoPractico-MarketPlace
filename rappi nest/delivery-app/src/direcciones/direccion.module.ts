import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Direccion } from './entities/direccion.entity';
import { DireccionRepository } from './repositories/direccion.repository';
import { DireccionService } from './service/direccion.service';
import { DireccionController } from './presentation/direccion.controller';
import { UsuariosModule } from '../usuarios/usuarios.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Direccion]),
    UsuariosModule,
  ],
  controllers: [DireccionController],
  providers: [DireccionService, DireccionRepository],
})
export class DireccionesModule {}
