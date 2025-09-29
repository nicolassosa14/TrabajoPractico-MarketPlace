import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsuarioRepository } from '../../usuarios/repositories/usuario.repository';
import { LoginDto } from '../presentation/dto/login.dto';

@Injectable()
export class LoginService {
  constructor(
    private readonly usuarioRepo: UsuarioRepository,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Valida credenciales y retorna payload (token + role + redirectTo)
   */
  async login(dto: LoginDto) {
    const email = dto.email.toLowerCase().trim();
    const usuario = await this.usuarioRepo.findByEmail(email);

    if (!usuario) throw new UnauthorizedException('Credenciales inválidas');

    // campo password_hash en DB
    const hash = (usuario as any).passwordHash ?? (usuario as any).password_hash;
    const valid = await bcrypt.compare(dto.password, hash || '');
    if (!valid) throw new UnauthorizedException('Credenciales inválidas');

    // role real desde la BD (ej: "ADMIN", "VENDOR", etc.)
    const roleName = usuario.tipoUsuario?.nombre?.toUpperCase() ?? null;

    // payload que viaja en el token
    const payload = { sub: usuario.id, role: roleName };

    const accessToken = this.jwtService.sign(payload);

    // sugerir ruta de redirección según rol
    const redirectTo = this.suggestRedirect(roleName);

    return {
      access_token: accessToken,
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        role: roleName,
      },
      role: roleName,
      redirectTo,
    };
  }

  private suggestRedirect(role: string | null) {
    switch (role) {
      case 'ADMIN':
        return '/admin';
      case 'VENDOR':
        return '/vendor';
      case 'DRIVER':
        return '/driver';
      case 'CLIENT':
        return '/client';
      default:
        return '/'; // fallback
    }
  }
}
