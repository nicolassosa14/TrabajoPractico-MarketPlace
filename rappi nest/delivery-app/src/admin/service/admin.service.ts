import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AdminUserRepository } from '../repositories/admin-user.repository';
import { AdminCreateUserDto } from '../dtos/create-user.dto';
import { AdminUpdateUserDto } from '../dtos/update-user.dto';

@Injectable()
export class AdminService {
  constructor(private readonly adminRepo: AdminUserRepository) {}

  async createUser(dto: AdminCreateUserDto) {
    const email = dto.email.toLowerCase().trim();

    const existing = await this.adminRepo['usuarioRepo'].findByEmail(email);
    if (existing) throw new ConflictException('El email ya está registrado');

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const tipo = await this.adminRepo['tipoRepo'].findByName(dto.rol.toUpperCase());
    if (!tipo) throw new BadRequestException(`El rol '${dto.rol}' no existe`);

    const usuario = await this.adminRepo.create({
      nombre: dto.nombre,
      email,
      passwordHash,
      tipoUsuario: tipo,
    });

    const { passwordHash: _, tipoUsuario, ...safe } = usuario as any;
    return { ...safe, role: tipoUsuario.nombre.toUpperCase() };
  }

  async updateUser(id: number, dto: AdminUpdateUserDto) {
    const updateData: any = {};

    if (dto.nombre) updateData.nombre = dto.nombre;
    if (dto.email) updateData.email = dto.email.toLowerCase().trim();
    if (dto.password) updateData.passwordHash = await bcrypt.hash(dto.password, 10);
    if (dto.rol) {
      const tipo = await this.adminRepo['tipoRepo'].findByName(dto.rol.toUpperCase());
      if (!tipo) throw new BadRequestException(`El rol '${dto.rol}' no existe`);
      updateData.tipoUsuario = tipo;
    }

    const updated = await this.adminRepo.update(id, updateData);
    const { passwordHash, tipoUsuario, ...safe } = updated as any;
    return { ...safe, role: tipoUsuario.nombre.toUpperCase() };
  }

  async deleteUser(id: number) {
    return this.adminRepo.delete(id);
  }

  async listAll() {
    const usuarios = await this.adminRepo.findAllByRole(['vendor', 'driver']); 
    return usuarios.map((u: any) => ({
      id: u.id,
      nombre: u.nombre,
      email: u.email,
      role: u.tipoUsuario.nombre.toUpperCase(), 
    }));
  }
}
