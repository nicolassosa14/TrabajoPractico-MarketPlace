import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioService } from '../service/usuario.service';
import { UsuarioRepository } from '../repositories/usuario.repository';
import { TipoUsuarioRepository } from '../repositories/tipoUsuario.repository';
import bcrypt from 'bcryptjs';
import { ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let usuarioRepo: jest.Mocked<UsuarioRepository>;
  let tipoRepo: jest.Mocked<TipoUsuarioRepository>;

  beforeEach(async () => {
    usuarioRepo = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      createAndSave: jest.fn(),
      updateUsuario: jest.fn(),
    } as unknown as jest.Mocked<UsuarioRepository>;

    tipoRepo = {
      findByName: jest.fn(),
    } as unknown as jest.Mocked<TipoUsuarioRepository>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioService,
        { provide: UsuarioRepository, useValue: usuarioRepo },
        { provide: TipoUsuarioRepository, useValue: tipoRepo },
      ],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);

    // Mock de bcrypt.hash
    jest
      .spyOn(bcrypt, 'hash')
      .mockImplementation(async (_data: string, _saltOrRounds: number) => 'hashed');
  });

  describe('register', () => {
    it('debe crear un usuario nuevo correctamente', async () => {
      const dto = {
        nombre: 'Juan',
        apellido: 'Perez',
        email: 'juan@mail.com',
        password: '123456',
        num_telefono: 12345678,
        cod_area: 11,
      };

      usuarioRepo.findByEmail.mockResolvedValue(null); // no existe
      tipoRepo.findByName.mockResolvedValue({ id: 1, nombre: 'cliente' } as any);

      // Mock corregido: no incluimos password en el objeto devuelto
      usuarioRepo.createAndSave.mockResolvedValue({
        id: 1,
        nombre: dto.nombre,
        apellido: dto.apellido,
        email: dto.email,
        num_telefono: dto.num_telefono,
        cod_area: dto.cod_area,
        passwordHash: 'hashed',
        tipoUsuario: { nombre: 'cliente' },
      } as any);

      const result = await service.register(dto);

      expect(result).toEqual({
        id: 1,
        nombre: dto.nombre,
        apellido: dto.apellido,
        email: dto.email,
        num_telefono: dto.num_telefono,
        cod_area: dto.cod_area,
        role: 'CLIENTE',
      });

      expect(usuarioRepo.findByEmail).toHaveBeenCalledWith(dto.email.toLowerCase().trim());
      expect(tipoRepo.findByName).toHaveBeenCalledWith('cliente');
    });

    it('debe lanzar conflicto si el email ya existe', async () => {
      usuarioRepo.findByEmail.mockResolvedValue({ id: 1 } as any);
      await expect(service.register({ email: 'exist@mail.com' } as any)).rejects.toThrow(
        ConflictException,
      );
    });

    it("debe lanzar BadRequestException si no existe el rol 'cliente'", async () => {
      usuarioRepo.findByEmail.mockResolvedValue(null);
      tipoRepo.findByName.mockResolvedValue(null);

      await expect(service.register({ email: 'nuevo@mail.com' } as any)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getProfile', () => {
    it('debe retornar el perfil correctamente', async () => {
      usuarioRepo.findById.mockResolvedValue({
        id: 1,
        nombre: 'Juan',
        apellido: 'Perez',
        email: 'juan@mail.com',
        passwordHash: 'hashed',
        tipoUsuario: { nombre: 'cliente' },
      } as any);

      const result = await service.getProfile(1);
      expect(result).toEqual({
        id: 1,
        nombre: 'Juan',
        apellido: 'Perez',
        email: 'juan@mail.com',
        role: 'CLIENTE',
      });
    });

    it('debe lanzar NotFoundException si el usuario no existe', async () => {
      usuarioRepo.findById.mockResolvedValue(null);
      await expect(service.getProfile(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateProfile', () => {
    it('debe actualizar el perfil correctamente', async () => {
      usuarioRepo.findById.mockResolvedValue({
        id: 1,
        nombre: 'Juan',
        apellido: 'Perez',
        email: 'juan@mail.com',
        tipoUsuario: { nombre: 'cliente' },
      } as any);

      usuarioRepo.updateUsuario.mockResolvedValue({
        id: 1,
        nombre: 'Juan Updated',
        apellido: 'Perez',
        email: 'juan@mail.com',
        tipoUsuario: { nombre: 'cliente' },
      } as any);

      const result = await service.updateProfile(1, { nombre: 'Juan Updated', password: '123' });
      expect(result).toEqual({
        id: 1,
        nombre: 'Juan Updated',
        apellido: 'Perez',
        email: 'juan@mail.com',
        role: 'CLIENTE',
      });
    });

    it('debe lanzar NotFoundException si el usuario no existe', async () => {
      usuarioRepo.findById.mockResolvedValue(null);
      await expect(service.updateProfile(1, {} as any)).rejects.toThrow(NotFoundException);
    });
  });
});
