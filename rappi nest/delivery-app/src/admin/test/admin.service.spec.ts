


                                                  //------------TEST UNITARIOS------------------



import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from '../service/admin.service';
import { AdminUserRepository } from '../repositories/admin-user.repository';
import { ConflictException, BadRequestException } from '@nestjs/common';
import { AdminCreateUserDto } from '../dtos/create-user.dto';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { TipoUsuario } from '../../usuarios/entities/tipo-usuario.entity';

describe('AdminService', () => {
  let service: AdminService;
  let repo: any;

  beforeEach(async () => {
    repo = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAllByRole: jest.fn(),
      usuarioRepo: { findByEmail: jest.fn() },
      tipoRepo: { findByName: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: AdminUserRepository, useValue: repo },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  it('createUser should create user successfully', async () => {
    repo.usuarioRepo.findByEmail.mockResolvedValue(null);

    const tipoUsuarioMock: TipoUsuario = { id: 1, nombre: 'VENDOR', usuarios: [] };
    const userMock: Usuario = {
      id: 1,
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan@test.com',
      num_telefono: undefined,
      cod_area: undefined,
      passwordHash: 'hashedpassword',
      tipoUsuario: tipoUsuarioMock,
    };

    repo.tipoRepo.findByName.mockResolvedValue(tipoUsuarioMock);
    repo.create.mockResolvedValue(userMock);

    const dto = new AdminCreateUserDto();
    dto.nombre = 'Juan';
    dto.email = 'juan@test.com';
    dto.password = '123456';
    dto.rol = 'vendor';

    const result = await service.createUser(dto);

    expect(result).toEqual(expect.objectContaining({
      id: 1,
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan@test.com',
      num_telefono: undefined,
      cod_area: undefined,
      role: 'VENDOR',
    }));

    expect(repo.create).toHaveBeenCalledWith(expect.objectContaining({
      nombre: dto.nombre,
      email: dto.email.toLowerCase(),
      passwordHash: expect.any(String),
      tipoUsuario: tipoUsuarioMock,
    }));
  });

  it('createUser should throw ConflictException if email exists', async () => {
    repo.usuarioRepo.findByEmail.mockResolvedValue({ id: 1 });

    const dto = new AdminCreateUserDto();
    dto.nombre = 'X';
    dto.email = 'x@test.com';
    dto.password = '123456';
    dto.rol = 'vendor';

    await expect(service.createUser(dto)).rejects.toThrow(ConflictException);
  });

  it('createUser should throw BadRequestException if role does not exist', async () => {
    repo.usuarioRepo.findByEmail.mockResolvedValue(null);
    repo.tipoRepo.findByName.mockResolvedValue(null);

    const dto = new AdminCreateUserDto();
    dto.nombre = 'X';
    dto.email = 'x@test.com';
    dto.password = '123456';
    dto.rol = 'vendor';

    await expect(service.createUser(dto)).rejects.toThrow(BadRequestException);
  });
});
