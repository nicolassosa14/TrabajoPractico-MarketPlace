import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoUsuario } from '../entities/tipo-usuario.entity';

@Injectable()
export class TipoUsuarioRepository {
  constructor(
    @InjectRepository(TipoUsuario)
    private readonly repo: Repository<TipoUsuario>,
  ) {}

  findByName(nombre: string) {
    return this.repo.findOne({ where: { nombre } });
  }

  findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }
}
