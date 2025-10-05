import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { DireccionService } from '../service/direccion.service';
import { DireccionRepository } from '../repositories/direccion.repository';
import { UsuarioRepository } from '../../usuarios/repositories/usuario.repository';
import { CreateDireccionDto } from '../presentation/dto/create-direccion.dto';
import { UpdateDireccionDto } from '../presentation/dto/update-direccion.dto';

describe('DireccionService', () => {
  let service: DireccionService;
  let direccionRepo: jest.Mocked<DireccionRepository>;
  let usuarioRepo: jest.Mocked<UsuarioRepository>;

  const mockTipoUsuario = {
    id: 1,
    nombre: 'CLIENT',
    usuarios: [],
  };

  const mockUsuario = {
    id: 1,
    nombre: 'Test',
    apellido: 'User',
    email: 'test@test.com',
    passwordHash: '$2b$10$hashedpassword',
    num_telefono: 1123456789,
    cod_area: 11,
    tipoUsuario: mockTipoUsuario,
    direcciones: [],
  };

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
    usuario: mockUsuario,
  };

  beforeEach(async () => {
    const mockDireccionRepo = {
      createAndSave: jest.fn(),
      findById: jest.fn(),
      findAllByUsuario: jest.fn(),
      updateDireccion: jest.fn(),
      deleteDireccion: jest.fn(),
    };

    const mockUsuarioRepo = {
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DireccionService,
        {
          provide: DireccionRepository,
          useValue: mockDireccionRepo,
        },
        {
          provide: UsuarioRepository,
          useValue: mockUsuarioRepo,
        },
      ],
    }).compile();

    service = module.get<DireccionService>(DireccionService);
    direccionRepo = module.get(DireccionRepository);
    usuarioRepo = module.get(UsuarioRepository);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('createForUser', () => {
    const createDto: CreateDireccionDto = {
      usuario_id: 1,
      calle: 'Av. Corrientes',
      altura: 1234,
      ciudad: 'Buenos Aires',
      provincia: 'CABA',
    };

    it('debe crear una dirección correctamente', async () => {
      usuarioRepo.findById.mockResolvedValue(mockUsuario as any);
      direccionRepo.createAndSave.mockResolvedValue(mockDireccion as any);

      const result = await service.createForUser(createDto, 1);

      expect(usuarioRepo.findById).toHaveBeenCalledWith(1);
      expect(direccionRepo.createAndSave).toHaveBeenCalledWith({
        ...createDto,
        usuario: mockUsuario,
      });
      expect(result).toEqual(mockDireccion);
    });

    it('debe lanzar NotFoundException si el usuario no existe', async () => {
      usuarioRepo.findById.mockResolvedValue(null);

      await expect(service.createForUser(createDto, 999)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.createForUser(createDto, 999)).rejects.toThrow(
        'Usuario no encontrado',
      );
    });
  });

  describe('getAllByUsuario', () => {
    it('debe retornar todas las direcciones del usuario', async () => {
      const direcciones = [mockDireccion];
      direccionRepo.findAllByUsuario.mockResolvedValue(direcciones as any);

      const result = await service.getAllByUsuario(1);

      expect(direccionRepo.findAllByUsuario).toHaveBeenCalledWith(1);
      expect(result).toEqual(direcciones);
    });

    it('debe retornar array vacío si no hay direcciones', async () => {
      direccionRepo.findAllByUsuario.mockResolvedValue([]);

      const result = await service.getAllByUsuario(1);

      expect(result).toEqual([]);
    });
  });

  describe('getOneForUser', () => {
    it('debe retornar una dirección si pertenece al usuario', async () => {
      direccionRepo.findById.mockResolvedValue(mockDireccion as any);

      const result = await service.getOneForUser(1, 1);

      expect(direccionRepo.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockDireccion);
    });

    it('debe lanzar NotFoundException si la dirección no existe', async () => {
      direccionRepo.findById.mockResolvedValue(null);

      await expect(service.getOneForUser(999, 1)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.getOneForUser(999, 1)).rejects.toThrow(
        'Dirección no encontrada',
      );
    });

    it('debe lanzar ForbiddenException si la dirección no pertenece al usuario', async () => {
      direccionRepo.findById.mockResolvedValue(mockDireccion as any);

      await expect(service.getOneForUser(1, 2)).rejects.toThrow(
        ForbiddenException,
      );
      await expect(service.getOneForUser(1, 2)).rejects.toThrow(
        'No tenés acceso a esta dirección',
      );
    });
  });

  describe('updateForUser', () => {
    const updateDto: UpdateDireccionDto = {
      calle: 'Nueva Calle',
      altura: 5678,
    };

    it('debe actualizar una dirección correctamente', async () => {
      const updatedDireccion = { ...mockDireccion, ...updateDto };
      direccionRepo.findById.mockResolvedValue(mockDireccion as any);
      direccionRepo.updateDireccion.mockResolvedValue(updatedDireccion as any);

      const result = await service.updateForUser(1, updateDto, 1);

      expect(direccionRepo.findById).toHaveBeenCalledWith(1);
      expect(direccionRepo.updateDireccion).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual(updatedDireccion);
    });

    it('debe lanzar NotFoundException si la dirección no existe', async () => {
      direccionRepo.findById.mockResolvedValue(null);

      await expect(service.updateForUser(999, updateDto, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('debe lanzar ForbiddenException si la dirección no pertenece al usuario', async () => {
      direccionRepo.findById.mockResolvedValue(mockDireccion as any);

      await expect(service.updateForUser(1, updateDto, 2)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('debe remover usuario_id del DTO antes de actualizar', async () => {
      const dtoWithUsuario: any = { ...updateDto, usuario_id: 2 };
      direccionRepo.findById.mockResolvedValue(mockDireccion as any);
      direccionRepo.updateDireccion.mockResolvedValue(mockDireccion as any);

      await service.updateForUser(1, dtoWithUsuario, 1);

      expect(direccionRepo.updateDireccion).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('removeForUser', () => {
    it('debe eliminar una dirección correctamente', async () => {
      direccionRepo.findById.mockResolvedValue(mockDireccion as any);
      direccionRepo.deleteDireccion.mockResolvedValue(true);

      const result = await service.removeForUser(1, 1);

      expect(direccionRepo.findById).toHaveBeenCalledWith(1);
      expect(direccionRepo.deleteDireccion).toHaveBeenCalledWith(1);
      expect(result).toEqual({ message: 'Dirección eliminada correctamente' });
    });

    it('debe lanzar NotFoundException si la dirección no existe', async () => {
      direccionRepo.findById.mockResolvedValue(null);

      await expect(service.removeForUser(999, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('debe lanzar ForbiddenException si la dirección no pertenece al usuario', async () => {
      direccionRepo.findById.mockResolvedValue(mockDireccion as any);

      await expect(service.removeForUser(1, 2)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
