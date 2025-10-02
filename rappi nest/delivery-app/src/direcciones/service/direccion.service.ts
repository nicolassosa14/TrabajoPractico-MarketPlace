import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DireccionRepository } from '../repositories/direccion.repository';
import { CreateDireccionDto } from '../presentation/dto/create-direccion.dto';
import { UpdateDireccionDto } from '../presentation/dto/update-direccion.dto';
import { UsuarioRepository } from '../../usuarios/repositories/usuario.repository';

@Injectable()
export class DireccionService {
  constructor(
    private readonly repo: DireccionRepository,
    private readonly usuarioRepo: UsuarioRepository, 
  ) {}

  
  async createForUser(dto: CreateDireccionDto, usuarioId: number) {
    const usuario = await this.usuarioRepo.findById(usuarioId);
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    return this.repo.createAndSave({
      ...dto,
      usuario, 
    });
  }

  
  getAllByUsuario(usuarioId: number) {
    return this.repo.findAllByUsuario(usuarioId);
  }

  
  async getOneForUser(id: number, usuarioId: number) {
    const direccion = await this.repo.findById(id);
    if (!direccion) throw new NotFoundException('Dirección no encontrada');
    if (direccion.usuario.id !== usuarioId)
      throw new ForbiddenException('No tenés acceso a esta dirección');
    return direccion;
  }

  
  async updateForUser(id: number, dto: UpdateDireccionDto, usuarioId: number) {
  const direccion = await this.repo.findById(id);
  if (!direccion) throw new NotFoundException('Dirección no encontrada');
  if (direccion.usuario.id !== usuarioId)
    throw new ForbiddenException('No tenés acceso a esta dirección');
  const { usuario_id, ...updateData } = dto as any;
  
  const updated = await this.repo.updateDireccion(id, updateData);
  return updated;
}

  
  async removeForUser(id: number, usuarioId: number) {
    const direccion = await this.repo.findById(id);
    if (!direccion) throw new NotFoundException('Dirección no encontrada');
    if (direccion.usuario.id !== usuarioId)
      throw new ForbiddenException('No tenés acceso a esta dirección');

    await this.repo.deleteDireccion(id);
    return { message: 'Dirección eliminada correctamente' };
  }
}
