import { Test, TestingModule } from '@nestjs/testing';
import { LoginService } from '../service/login.service';
import { UsuarioRepository } from '../../usuarios/repositories/usuario.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UnauthorizedException } from '@nestjs/common';

describe('LoginService', () => {
  let service: LoginService;
  let usuarioRepo: Partial<UsuarioRepository>;
  let jwtService: Partial<JwtService>;

  beforeEach(async () => {
    usuarioRepo = {
      findByEmail: jest.fn(),
    };
    jwtService = {
      sign: jest.fn().mockReturnValue('fake-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginService,
        { provide: UsuarioRepository, useValue: usuarioRepo },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<LoginService>(LoginService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw UnauthorizedException if user not found', async () => {
    (usuarioRepo.findByEmail as jest.Mock).mockResolvedValue(null);

    await expect(
      service.login({ email: 'test@test.com', password: '1234' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if password is invalid', async () => {
    const hash = await bcrypt.hash('correct', 10);
    (usuarioRepo.findByEmail as jest.Mock).mockResolvedValue({
      id: 1,
      email: 'test@test.com',
      passwordHash: hash,
    });

    await expect(
      service.login({ email: 'test@test.com', password: 'wrong' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should return token and user info on valid login', async () => {
    const hash = await bcrypt.hash('correct', 10);
    (usuarioRepo.findByEmail as jest.Mock).mockResolvedValue({
      id: 1,
      nombre: 'Juan',
      apellido: 'Perez',
      email: 'test@test.com',
      passwordHash: hash,
      tipoUsuario: { nombre: 'ADMIN' },
    });

    const result = await service.login({ email: 'test@test.com', password: 'correct' });

    expect(result).toHaveProperty('access_token', 'fake-jwt-token');
    expect(result.user).toMatchObject({
      id: 1,
      nombre: 'Juan',
      apellido: 'Perez',
      email: 'test@test.com',
      role: 'ADMIN',
    });
    expect(result.redirectTo).toBe('/admin');
  });
});
