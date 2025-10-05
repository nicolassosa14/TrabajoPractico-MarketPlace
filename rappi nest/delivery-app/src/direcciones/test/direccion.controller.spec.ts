import { Test, TestingModule } from '@nestjs/testing';
import { DireccionController } from '../presentation/direccion.controller';
import { DireccionService } from '../service/direccion.service';
import { CreateDireccionDto } from '../presentation/dto/create-direccion.dto';
import { UpdateDireccionDto } from '../presentation/dto/update-direccion.dto';

describe('DireccionController', () => {
  let controller: DireccionController;
  let service: jest.Mocked<DireccionService>;

  const mockRequest = {
    user: { userId: 1, role: 'CLIENT' },
  } as any;

  const mockDireccion = {
    id: 1,
    calle: 'Av. Corrientes',
    altura: 1234,
    ciudad: 'Buenos Aires',
    provincia: 'CABA',
    pais: 'Argentina',
    latitud: -34.6037,
    longitud: -58.3816,
    instrucciones_entrega: 'Timbre A',
    usuario: {
      id: 1,
      nombre: 'Test',
      apellido: 'User',
      email: 'test@test.com',
    },
  };

  beforeEach(async () => {
    const mockService = {
      createForUser: jest.fn(),
      getAllByUsuario: jest.fn(),
      getOneForUser: jest.fn(),
      updateForUser: jest.fn(),
      removeForUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DireccionController],
      providers: [
        {
          provide: DireccionService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<DireccionController>(DireccionController);
    service = module.get(DireccionService);
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('debe crear una dirección', async () => {
      const dto: CreateDireccionDto = {
        usuario_id: 1,
        calle: 'Av. Corrientes',
        altura: 1234,
        ciudad: 'Buenos Aires',
        provincia: 'CABA',
      };

      service.createForUser.mockResolvedValue(mockDireccion as any);

      const result = await controller.create(dto, mockRequest);

      expect(service.createForUser).toHaveBeenCalledWith(dto, 1);
      expect(result).toEqual(mockDireccion);
    });
  });

  describe('getAll', () => {
    it('debe retornar todas las direcciones del usuario', async () => {
      const direcciones = [mockDireccion];
      service.getAllByUsuario.mockResolvedValue(direcciones as any);

      const result = await controller.getAll(mockRequest);

      expect(service.getAllByUsuario).toHaveBeenCalledWith(1);
      expect(result).toEqual(direcciones);
    });
  });

  describe('getOne', () => {
    it('debe retornar una dirección específica', async () => {
      service.getOneForUser.mockResolvedValue(mockDireccion as any);

      const result = await controller.getOne(1, mockRequest);

      expect(service.getOneForUser).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual(mockDireccion);
    });
  });

  describe('update', () => {
    it('debe actualizar una dirección', async () => {
      const dto: UpdateDireccionDto = {
        calle: 'Nueva Calle',
        altura: 5678,
      };

      const updatedDireccion = { ...mockDireccion, ...dto };
      service.updateForUser.mockResolvedValue(updatedDireccion as any);

      const result = await controller.update(1, dto, mockRequest);

      expect(service.updateForUser).toHaveBeenCalledWith(1, dto, 1);
      expect(result).toEqual(updatedDireccion);
    });
  });

  describe('remove', () => {
    it('debe eliminar una dirección', async () => {
      const message = { message: 'Dirección eliminada correctamente' };
      service.removeForUser.mockResolvedValue(message);

      const result = await controller.remove(1, mockRequest);

      expect(service.removeForUser).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual(message);
    });
  });

  describe('autenticación', () => {
    it('debe extraer el userId del request en todas las operaciones', async () => {
      const customRequest = {
        user: { userId: 42, role: 'CLIENT' },
      } as any;

      const dto: CreateDireccionDto = {
        usuario_id: 42,
        calle: 'Test',
        altura: 123,
        ciudad: 'Test',
        provincia: 'Test',
      };

      service.createForUser.mockResolvedValue(mockDireccion as any);
      service.getAllByUsuario.mockResolvedValue([mockDireccion] as any);
      service.getOneForUser.mockResolvedValue(mockDireccion as any);
      service.updateForUser.mockResolvedValue(mockDireccion as any);
      service.removeForUser.mockResolvedValue({ message: 'ok' });

      await controller.create(dto, customRequest);
      expect(service.createForUser).toHaveBeenCalledWith(dto, 42);

      await controller.getAll(customRequest);
      expect(service.getAllByUsuario).toHaveBeenCalledWith(42);

      await controller.getOne(1, customRequest);
      expect(service.getOneForUser).toHaveBeenCalledWith(1, 42);

      await controller.update(1, {}, customRequest);
      expect(service.updateForUser).toHaveBeenCalledWith(1, {}, 42);

      await controller.remove(1, customRequest);
      expect(service.removeForUser).toHaveBeenCalledWith(1, 42);
    });
  });
});