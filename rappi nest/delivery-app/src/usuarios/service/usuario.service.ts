// src/usuario/services/usuario.service.ts
import { Injectable, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { UsuarioRepository } from '../repositories/usuario.repository';
import { TipoUsuarioRepository } from '../repositories/tipoUsuario.repository';
import { CreateUsuarioDto } from '../presentation/dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../presentation/dto/update-usuario.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsuarioService {
  constructor(
    private readonly usuarioRepo: UsuarioRepository,
    private readonly tipoRepo: TipoUsuarioRepository,
  ) {}

  async register(dto: CreateUsuarioDto) {
    const email = dto.email.toLowerCase().trim();

    const existing = await this.usuarioRepo.findByEmail(email);
    if (existing) throw new ConflictException('El email ya está registrado');

    const tipoCliente = await this.tipoRepo.findByName('cliente');
    if (!tipoCliente) throw new BadRequestException("El rol 'cliente' no existe en la base de datos.");

    const hash = await bcrypt.hash(dto.password, 10);

    const nuevo = await this.usuarioRepo.createAndSave({
      nombre: dto.nombre,
      apellido: dto.apellido,
      email,
      passwordHash: hash,
      num_telefono: dto.num_telefono,
      cod_area: dto.cod_area,
      tipoUsuario: tipoCliente,
    });

    const { passwordHash, tipoUsuario, ...safe } = nuevo as any;
    return {
      ...safe,
      role: tipoUsuario.nombre.toUpperCase(),
    };
  }

  async getProfile(id: number) {
    const usuario = await this.usuarioRepo.findById(id);
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    const { passwordHash, tipoUsuario, ...safe } = usuario as any;
    return { ...safe, role: tipoUsuario.nombre.toUpperCase() };
  }

  async updateProfile(id: number, dto: UpdateUsuarioDto) {
    const usuario = await this.usuarioRepo.findById(id);
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    const updateData: Partial<any> = {
      nombre: dto.nombre,
      apellido: dto.apellido,
      email: dto.email,
      num_telefono: dto.num_telefono,
      cod_area: dto.cod_area,
    };

    if (dto.password) updateData.passwordHash = await bcrypt.hash(dto.password, 10);

    const updated = await this.usuarioRepo.updateUsuario(id, updateData);
    const { passwordHash, tipoUsuario, ...safe } = updated as any;
    return { ...safe, role: tipoUsuario.nombre.toUpperCase() };
  }
}
