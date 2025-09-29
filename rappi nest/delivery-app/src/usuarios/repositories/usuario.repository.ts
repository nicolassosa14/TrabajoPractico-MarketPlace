import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';

@Injectable()
export class UsuarioRepository {
  constructor(
    @InjectRepository(Usuario)
    private readonly repo: Repository<Usuario>,
  ) {}

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  createAndSave(usuario: Partial<Usuario>) {
    const e = this.repo.create(usuario);
    return this.repo.save(e);
  }

  async updateUsuario(id: number, data: Partial<Usuario>) {
    await this.repo.update(id, data);
    return this.repo.findOne({ where: { id } });
  }
}


