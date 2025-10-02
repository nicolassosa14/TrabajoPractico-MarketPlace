import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Direccion } from '../entities/direccion.entity';

@Injectable()
export class DireccionRepository {
  constructor(
    @InjectRepository(Direccion)
    private readonly repo: Repository<Direccion>,
  ) {}

  createAndSave(direccion: Partial<Direccion>) {
    const entity = this.repo.create(direccion);
    return this.repo.save(entity);
  }

  findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  findAllByUsuario(usuario_id: number) {
    return this.repo.find({ where: { usuario: { id: usuario_id } } });
  }

  async updateDireccion(id: number, data: Partial<Direccion>) {
  const { usuario, ...updateData } = data;

  await this.repo.update(id, updateData);
  return this.repo.findOne({ where: { id } });
}

  async deleteDireccion(id: number): Promise<boolean> {
  const result = await this.repo.delete(id);
  return !!(result.affected && result.affected > 0);
}
}
