import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DireccionRepository } from '../repositories/direccion.repository';
import { Direccion } from '../entities/direccion.entity';

describe('DireccionRepository', () => {
  let repository: DireccionRepository;
  let mockRepo: jest.Mocked<Repository<Direccion>>;

  const mockTipoUsuario = {
    id: 1,
    nombre: 'CLIENT',
    usuarios: [],
  };

  const mockDireccion: Direccion = {
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
      passwordHash: '$2b$10$hashedpassword',
      num_telefono: 1123456789,
      cod_area: 11,
      tipoUsuario: mockTipoUsuario,
      direcciones: [],
    },
  };

  beforeEach(async () => {
    mockRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DireccionRepository,
        {
          provide: getRepositoryToken(Direccion),
          useValue: mockRepo,
        },
      ],
    }).compile();

    repository = module.get<DireccionRepository>(DireccionRepository);
  });

  it('debe estar definido', () => {
    expect(repository).toBeDefined();
  });

  describe('createAndSave', () => {
    it('debe crear y guardar una dirección', async () => {
      const direccionData: Partial<Direccion> = {
        calle: 'Av. Corrientes',
        altura: 1234,
        ciudad: 'Buenos Aires',
        provincia: 'CABA',
      };

      mockRepo.create.mockReturnValue(mockDireccion);
      mockRepo.save.mockResolvedValue(mockDireccion);

      const result = await repository.createAndSave(direccionData);

      expect(mockRepo.create).toHaveBeenCalledWith(direccionData);
      expect(mockRepo.save).toHaveBeenCalledWith(mockDireccion);
      expect(result).toEqual(mockDireccion);
    });
  });

  describe('findById', () => {
    it('debe encontrar una dirección por id', async () => {
      mockRepo.findOne.mockResolvedValue(mockDireccion);

      const result = await repository.findById(1);

      expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockDireccion);
    });

    it('debe retornar null si no encuentra la dirección', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      const result = await repository.findById(999);

      expect(result).toBeNull();
    });
  });

  describe('findAllByUsuario', () => {
    it('debe encontrar todas las direcciones de un usuario', async () => {
      const direcciones = [mockDireccion];
      mockRepo.find.mockResolvedValue(direcciones);

      const result = await repository.findAllByUsuario(1);

      expect(mockRepo.find).toHaveBeenCalledWith({
        where: { usuario: { id: 1 } },
      });
      expect(result).toEqual(direcciones);
    });

    it('debe retornar array vacío si el usuario no tiene direcciones', async () => {
      mockRepo.find.mockResolvedValue([]);

      const result = await repository.findAllByUsuario(1);

      expect(result).toEqual([]);
    });
  });

  describe('updateDireccion', () => {
    it('debe actualizar una dirección correctamente', async () => {
      const updateData = { calle: 'Nueva Calle', altura: 5678 };
      const updatedDireccion = { ...mockDireccion, ...updateData };

      mockRepo.update.mockResolvedValue({ affected: 1 } as any);
      mockRepo.findOne.mockResolvedValue(updatedDireccion);

      const result = await repository.updateDireccion(1, updateData);

      expect(mockRepo.update).toHaveBeenCalledWith(1, updateData);
      expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(updatedDireccion);
    });

    it('no debe incluir usuario en los datos de actualización', async () => {
      const updateData: any = { 
        calle: 'Nueva Calle', 
        usuario: mockDireccion.usuario 
      };

      mockRepo.update.mockResolvedValue({ affected: 1 } as any);
      mockRepo.findOne.mockResolvedValue(mockDireccion);

      await repository.updateDireccion(1, updateData);

      expect(mockRepo.update).toHaveBeenCalledWith(1, { calle: 'Nueva Calle' });
    });
  });

  describe('deleteDireccion', () => {
    it('debe eliminar una dirección y retornar true', async () => {
      mockRepo.delete.mockResolvedValue({ affected: 1, raw: {} } as any);

      const result = await repository.deleteDireccion(1);

      expect(mockRepo.delete).toHaveBeenCalledWith(1);
      expect(result).toBe(true);
    });

    it('debe retornar false si no se eliminó ningún registro', async () => {
      mockRepo.delete.mockResolvedValue({ affected: 0, raw: {} } as any);

      const result = await repository.deleteDireccion(999);

      expect(result).toBe(false);
    });
  });
});