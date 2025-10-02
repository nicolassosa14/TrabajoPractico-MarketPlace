// src/admin/tests/admin-user.repository.spec.ts


                                          //------------TEST UNITARIOS------------------
                                          

import { AdminUserRepository } from '../repositories/admin-user.repository';
import { NotFoundException } from '@nestjs/common';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { TipoUsuario } from '../../usuarios/entities/tipo-usuario.entity';

describe('AdminUserRepository', () => {
  let repo: AdminUserRepository;
  let usuarioRepoMock: any;
  let tipoRepoMock: any;

  beforeEach(() => {
    usuarioRepoMock = { 
      findById: jest.fn(), 
      repo: { find: jest.fn(), remove: jest.fn() }, 
      createAndSave: jest.fn(), 
      updateUsuario: jest.fn() 
    };
    tipoRepoMock = { findByName: jest.fn() };
    repo = new AdminUserRepository(usuarioRepoMock, tipoRepoMock);
  });

  // ---------------------------
  // findById
  // ---------------------------
  it('findById should throw NotFoundException if user not found', async () => {
    usuarioRepoMock.findById.mockResolvedValue(null);
    await expect(repo.findById(1)).rejects.toThrow(NotFoundException);
  });

  it('findById should return user if found', async () => {
    const tipoUsuarioMock: TipoUsuario = { id: 1, nombre: 'VENDOR', usuarios: [] };
    const user: Usuario = {
      id: 1,
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan@test.com',
      num_telefono: undefined,
      cod_area: undefined,
      passwordHash: 'hashedpassword',
      tipoUsuario: tipoUsuarioMock,
    };

    usuarioRepoMock.findById.mockResolvedValue(user);
    const result = await repo.findById(1);
    expect(result).toBe(user);
  });

  // ---------------------------
  // create
  // ---------------------------
  it('create should call usuarioRepo.createAndSave and return user', async () => {
    const tipoUsuarioMock: TipoUsuario = { id: 1, nombre: 'VENDOR', usuarios: [] };
    const usuario: Partial<Usuario> = { nombre: 'Test', email: 'test@test.com', tipoUsuario: tipoUsuarioMock };

    usuarioRepoMock.createAndSave.mockResolvedValue(usuario);
    const result = await repo.create(usuario);
    expect(usuarioRepoMock.createAndSave).toHaveBeenCalledWith(usuario);
    expect(result).toBe(usuario);
  });

  // ---------------------------
  // delete
  // ---------------------------
  it('delete should call remove and return success message', async () => {
    const tipoUsuarioMock: TipoUsuario = { id: 1, nombre: 'VENDOR', usuarios: [] };
    const user: Usuario = {
      id: 1,
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan@test.com',
      num_telefono: undefined,
      cod_area: undefined,
      passwordHash: 'hashedpassword',
      tipoUsuario: tipoUsuarioMock,
    };

    jest.spyOn(repo, 'findById').mockResolvedValue(user);
    usuarioRepoMock.repo.remove.mockResolvedValue(user);

    const result = await repo.delete(1);
    expect(usuarioRepoMock.repo.remove).toHaveBeenCalledWith(user);
    expect(result).toEqual({ message: 'Usuario eliminado correctamente' });
  });

  // ---------------------------
  // findAllByRole
  // ---------------------------
  it('findAllByRole should return combined users for given roles', async () => {
    const tipoVendor: TipoUsuario = { id: 1, nombre: 'VENDOR', usuarios: [] };
    const tipoDriver: TipoUsuario = { id: 2, nombre: 'DRIVER', usuarios: [] };

    tipoRepoMock.findByName.mockImplementation((name: string) => {
      if (name === 'VENDOR') return Promise.resolve(tipoVendor);
      if (name === 'DRIVER') return Promise.resolve(tipoDriver);
      return Promise.resolve(null);
    });

    const vendorUser: Usuario = { id: 1, nombre: 'V', email: 'v@test.com', tipoUsuario: tipoVendor, num_telefono: undefined, cod_area: undefined, passwordHash: 'hash', apellido: 'X' };
    const driverUser: Usuario = { id: 2, nombre: 'D', email: 'd@test.com', tipoUsuario: tipoDriver, num_telefono: undefined, cod_area: undefined, passwordHash: 'hash', apellido: 'Y' };

    usuarioRepoMock.repo.find.mockImplementation(({ where }) => {
      if (where.tipoUsuario.nombre === 'VENDOR') return Promise.resolve([vendorUser]);
      if (where.tipoUsuario.nombre === 'DRIVER') return Promise.resolve([driverUser]);
      return Promise.resolve([]);
    });

    const result = await repo.findAllByRole(['vendor', 'driver']);
    expect(result).toContain(vendorUser);
    expect(result).toContain(driverUser);
    expect(result.length).toBe(2);
  });
});
