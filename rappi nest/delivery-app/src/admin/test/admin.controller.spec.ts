

                                                //------------TEST INTEGRACION------------------


// src/admin/__tests__/admin.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from '../presentation/admin.controller';
import { AdminService } from '../service/admin.service';
import { AdminCreateUserDto } from '../dtos/create-user.dto';
import { BadRequestException } from '@nestjs/common';

describe('AdminController', () => {
  let controller: AdminController;
  let service: any;

  beforeEach(async () => {
    service = {
      createUser: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
      listAll: jest.fn(),
      getUserById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        { provide: AdminService, useValue: service },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
  });

  it('POST /users should call service.createUser', async () => {
    const dto = new AdminCreateUserDto();
    dto.nombre = 'X';
    dto.email = 'x@test.com';
    dto.password = '123456';
    dto.rol = 'vendor';

    service.createUser.mockResolvedValue('ok');

    const result = await controller.createUser(dto);
    expect(result).toBe('ok');
    expect(service.createUser).toHaveBeenCalledWith(dto);
  });

  it('GET /users should call service.listAll', async () => {
    service.listAll.mockResolvedValue(['user1', 'user2']);
    const result = await controller.listUsers();
    expect(result).toEqual(['user1', 'user2']);
  });

  it('GET /users/:id should return user when found', async () => {
    const userMock = {
      id: 1,
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan@test.com',
      num_telefono: null,
      cod_area: null,
      role: 'VENDOR',
    };

    service.getUserById.mockResolvedValue(userMock);

    const result = await controller.getUser(1);
    expect(result).toEqual(userMock);
    expect(service.getUserById).toHaveBeenCalledWith(1);
  });

  it('GET /users/:id should throw BadRequestException if user not found', async () => {
    service.getUserById.mockRejectedValue(new BadRequestException('Usuario no encontrado'));

    await expect(controller.getUser(999)).rejects.toThrow(BadRequestException);
  });
});
