import { Injectable, NotFoundException } from '@nestjs/common';
import { UsuarioRepository } from '../../usuarios/repositories/usuario.repository';
import { TipoUsuarioRepository } from '../../usuarios/repositories/tipoUsuario.repository';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Injectable()
export class AdminUserRepository {
  constructor(
    private readonly usuarioRepo: UsuarioRepository,
    private readonly tipoRepo: TipoUsuarioRepository,
  ) {}

  async findById(id: number) {
    const usuario = await this.usuarioRepo.findById(id);
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    return usuario;
  }

  async findAllByRole(roles: ('vendor' | 'driver')[]) {
    const usuarios: Usuario[] = [];
    for (const rol of roles) {
      // Convertimos a mayúscula porque en la BD los roles están así
      const tipo = await this.tipoRepo.findByName(rol.toUpperCase());
      if (tipo) {
        const list = await this.usuarioRepo['repo'].find({ where: { tipoUsuario: tipo } });
        usuarios.push(...list);
      }
    }
    return usuarios;
  }

  async create(usuario: Partial<Usuario>) {
    return this.usuarioRepo.createAndSave(usuario);
  }

  async update(id: number, data: Partial<Usuario>) {
    return this.usuarioRepo.updateUsuario(id, data);
  }

  async delete(id: number) {
    const usuario = await this.findById(id);
    await this.usuarioRepo['repo'].remove(usuario);
    return { message: 'Usuario eliminado correctamente' };
  }
}
