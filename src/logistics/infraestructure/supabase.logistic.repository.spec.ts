import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SupabaseLogisticRepository } from './supabase.logistic.repository';
import Logistic from '../domain/models/logistic';

describe('SupabaseLogisticRepository', () => {
  let repository: SupabaseLogisticRepository;
  let mockSupabaseClient: any;

  beforeEach(async () => {
    mockSupabaseClient = {
      from: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupabaseLogisticRepository,
        {
          provide: 'SUPABASE_CLIENT',
          useValue: mockSupabaseClient,
        },
      ],
    }).compile();

    repository = module.get<SupabaseLogisticRepository>(
      SupabaseLogisticRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('createLogistic', () => {
    it('should create a logistic successfully', async () => {
      const logistic = new Logistic(
        'user-123',
        'Toyota',
        'ABC-1234',
        true,
        'id-123',
      );

      // Mock para verificar si existe el logistic
      const mockVerifyChain: any = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn(),
      };
      mockVerifyChain.eq
        .mockReturnValueOnce(mockVerifyChain)
        .mockReturnValueOnce({
          data: [],
          error: null,
        });

      // Mock para verificar el rol del usuario
      const mockRoleChain: any = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: [{ role: 'driver' }],
          error: null,
        }),
      };

      // Mock para insert
      const mockInsertChain: any = {
        insert: jest.fn().mockResolvedValue({
          data: { id: 'id-123' },
          error: null,
        }),
      };

      mockSupabaseClient.from
        .mockReturnValueOnce(mockVerifyChain)
        .mockReturnValueOnce(mockRoleChain)
        .mockReturnValueOnce(mockInsertChain);

      const result = await repository.createLogistic(logistic);

      expect(result).toBe('Logistic creado con éxito ');
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('drivers_details');
    });

    it('should throw BadRequestException when logistic already exists', async () => {
      const logistic = new Logistic(
        'user-123',
        'Toyota',
        'ABC-1234',
        true,
        'id-123',
      );

      const mockSecondEq: any = {
        eq: jest.fn(),
      };
      mockSecondEq.eq.mockResolvedValue({
        data: [{ id: 'existing-id' }],
        error: null,
      });

      const mockFirstEq: any = {
        eq: jest.fn().mockReturnValue(mockSecondEq),
      };

      const mockVerifyChain: any = {
        select: jest.fn().mockReturnValue(mockFirstEq),
      };

      mockSupabaseClient.from.mockReturnValue(mockVerifyChain);

      await expect(repository.createLogistic(logistic)).rejects.toThrow(
        'Ya existe este logistic para este driver',
      );
    });

    it('should throw BadRequestException when user is not found', async () => {
      const logistic = new Logistic(
        'user-123',
        'Toyota',
        'ABC-1234',
        true,
        'id-123',
      );

      // Mock para verificar si existe el logistic (no existe)
      const mockSecondEq: any = {
        eq: jest.fn(),
      };
      mockSecondEq.eq.mockResolvedValue({
        data: [],
        error: null,
      });

      const mockFirstEq: any = {
        eq: jest.fn().mockReturnValue(mockSecondEq),
      };

      const mockVerifyChain: any = {
        select: jest.fn().mockReturnValue(mockFirstEq),
      };

      // Mock para verificar el rol del usuario (usuario no encontrado)
      const mockRoleEqChain: any = {
        eq: jest.fn(),
      };
      mockRoleEqChain.eq.mockResolvedValue({
        data: [],
        error: null,
      });

      const mockRoleChain: any = {
        select: jest.fn().mockReturnValue(mockRoleEqChain),
      };

      mockSupabaseClient.from
        .mockReturnValueOnce(mockVerifyChain)
        .mockReturnValueOnce(mockRoleChain);

      await expect(repository.createLogistic(logistic)).rejects.toThrow(
        'Usuario no encontrado',
      );
    });

    it('should throw BadRequestException when user is not a driver', async () => {
      const logistic = new Logistic(
        'user-123',
        'Toyota',
        'ABC-1234',
        true,
        'id-123',
      );

      // Mock para verificar si existe el logistic (no existe)
      const mockSecondEq: any = {
        eq: jest.fn(),
      };
      mockSecondEq.eq.mockResolvedValue({
        data: [],
        error: null,
      });

      const mockFirstEq: any = {
        eq: jest.fn().mockReturnValue(mockSecondEq),
      };

      const mockVerifyChain: any = {
        select: jest.fn().mockReturnValue(mockFirstEq),
      };

      // Mock para verificar el rol del usuario (no es driver)
      const mockRoleEqChain: any = {
        eq: jest.fn(),
      };
      mockRoleEqChain.eq.mockResolvedValue({
        data: [{ role: 'customer' }],
        error: null,
      });

      const mockRoleChain: any = {
        select: jest.fn().mockReturnValue(mockRoleEqChain),
      };

      mockSupabaseClient.from
        .mockReturnValueOnce(mockVerifyChain)
        .mockReturnValueOnce(mockRoleChain);

      await expect(repository.createLogistic(logistic)).rejects.toThrow(
        'Este usuario no es un driver',
      );
    });

    it('should throw BadRequestException when insert fails', async () => {
      const logistic = new Logistic(
        'user-123',
        'Toyota',
        'ABC-1234',
        true,
        'id-123',
      );

      // Mock para verificar si existe el logistic
      const mockSecondEq: any = {
        eq: jest.fn(),
      };
      mockSecondEq.eq.mockResolvedValue({
        data: [],
        error: null,
      });

      const mockFirstEq: any = {
        eq: jest.fn().mockReturnValue(mockSecondEq),
      };

      const mockVerifyChain: any = {
        select: jest.fn().mockReturnValue(mockFirstEq),
      };

      // Mock para verificar el rol del usuario
      const mockRoleEqChain: any = {
        eq: jest.fn(),
      };
      mockRoleEqChain.eq.mockResolvedValue({
        data: [{ role: 'driver' }],
        error: null,
      });

      const mockRoleChain: any = {
        select: jest.fn().mockReturnValue(mockRoleEqChain),
      };

      // Mock para insert con error
      const mockInsertChain: any = {
        insert: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database error' },
        }),
      };

      mockSupabaseClient.from
        .mockReturnValueOnce(mockVerifyChain)
        .mockReturnValueOnce(mockRoleChain)
        .mockReturnValueOnce(mockInsertChain);

      await expect(repository.createLogistic(logistic)).rejects.toThrow(
        'Error al crear el logistic: Database error',
      );
    });
  });

  describe('VerifyExistLogisticForUserID', () => {
    it('should verify logistic exists for user and license plate', async () => {
      const userId = 'user-123';
      const licensePlate = 'ABC-1234';

      const mockSecondEq: any = {
        eq: jest.fn(),
      };
      mockSecondEq.eq.mockResolvedValue({
        data: [{ id: 'logistic-id' }],
        error: null,
      });

      const mockFirstEq: any = {
        eq: jest.fn().mockReturnValue(mockSecondEq),
      };

      const mockChain: any = {
        select: jest.fn().mockReturnValue(mockFirstEq),
      };

      mockSupabaseClient.from.mockReturnValue(mockChain);

      const result = await repository.VerifyExistLogisticForUserID(
        userId,
        licensePlate,
      );

      expect(result).toBe(true);
      expect(mockChain.select).toHaveBeenCalledWith('*');
    });

    it('should return false when logistic does not exist', async () => {
      const userId = 'user-123';
      const licensePlate = 'ABC-1234';

      const mockSecondEq: any = {
        eq: jest.fn(),
      };
      mockSecondEq.eq.mockResolvedValue({
        data: [],
        error: null,
      });

      const mockFirstEq: any = {
        eq: jest.fn().mockReturnValue(mockSecondEq),
      };

      const mockChain: any = {
        select: jest.fn().mockReturnValue(mockFirstEq),
      };

      mockSupabaseClient.from.mockReturnValue(mockChain);

      const result = await repository.VerifyExistLogisticForUserID(
        userId,
        licensePlate,
      );

      expect(result).toBe(false);
    });

    it('should throw BadRequestException when query fails', async () => {
      const userId = 'user-123';
      const licensePlate = 'ABC-1234';

      const mockSecondEq: any = {
        eq: jest.fn(),
      };
      mockSecondEq.eq.mockResolvedValue({
        data: null,
        error: { message: 'Query error' },
      });

      const mockFirstEq: any = {
        eq: jest.fn().mockReturnValue(mockSecondEq),
      };

      const mockChain: any = {
        select: jest.fn().mockReturnValue(mockFirstEq),
      };

      mockSupabaseClient.from.mockReturnValue(mockChain);

      await expect(
        repository.VerifyExistLogisticForUserID(userId, licensePlate),
      ).rejects.toThrow(BadRequestException);
      await expect(
        repository.VerifyExistLogisticForUserID(userId, licensePlate),
      ).rejects.toThrow('Error al verificar el logistic: Query error');
    });
  });

  describe('VerifyUserIdDriver', () => {
    it('should verify user is a driver', async () => {
      const userId = 'user-123';

      const mockChain: any = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: [{ user_id: userId, role: 'driver' }],
          error: null,
        }),
      };

      mockSupabaseClient.from.mockReturnValue(mockChain);

      const result = await repository.VerifyUserIdDriver(userId);

      expect(result).toEqual([{ user_id: userId, role: 'driver' }]);
    });

    it('should throw BadRequestException when verification fails', async () => {
      const userId = 'user-123';

      const mockChain: any = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database error' },
        }),
      };

      mockSupabaseClient.from.mockReturnValue(mockChain);

      await expect(repository.VerifyUserIdDriver(userId)).rejects.toThrow(
        BadRequestException,
      );
      await expect(repository.VerifyUserIdDriver(userId)).rejects.toThrow(
        'Error al verificar el driver: Database error',
      );
    });
  });

  describe('findAllAvailableLogistics', () => {
    it('should find all available logistics', async () => {
      const mockLogistics = [
        { id: '1', user_id: 'user-1', is_available: true },
        { id: '2', user_id: 'user-2', is_available: true },
      ];

      const mockChain: any = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: mockLogistics,
          error: null,
        }),
      };

      mockSupabaseClient.from.mockReturnValue(mockChain);

      const result = await repository.findAllAvailableLogistics();

      expect(result).toEqual(mockLogistics);
      expect(mockChain.select).toHaveBeenCalledWith('*');
      expect(mockChain.eq).toHaveBeenCalledWith('is_available', true);
    });

    it('should throw BadRequestException when no logistics available', async () => {
      const mockChain: any = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
      };

      mockSupabaseClient.from.mockReturnValue(mockChain);

      await expect(repository.findAllAvailableLogistics()).rejects.toThrow(
        BadRequestException,
      );
      await expect(repository.findAllAvailableLogistics()).rejects.toThrow(
        'No hay logistics disponibles',
      );
    });

    it('should throw BadRequestException when query fails', async () => {
      const mockChain: any = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Query error' },
        }),
      };

      mockSupabaseClient.from.mockReturnValue(mockChain);

      await expect(repository.findAllAvailableLogistics()).rejects.toThrow(
        BadRequestException,
      );
      await expect(repository.findAllAvailableLogistics()).rejects.toThrow(
        'Error al obtener los logistics: Query error',
      );
    });
  });

  describe('UpdateStatusLogisticByID', () => {
    it('should update logistic status successfully', async () => {
      const id = 'logistic-123';
      const userId = 'user-123';
      const isAvailable = false;

      const mockSecondEq: any = {
        eq: jest.fn(),
      };
      mockSecondEq.eq.mockResolvedValue({
        data: { id },
        error: null,
      });

      const mockFirstEq: any = {
        eq: jest.fn().mockReturnValue(mockSecondEq),
      };

      const mockChain: any = {
        update: jest.fn().mockReturnValue(mockFirstEq),
      };

      mockSupabaseClient.from.mockReturnValue(mockChain);

      const result = await repository.UpdateStatusLogisticByID(
        id,
        userId,
        isAvailable,
      );

      expect(result).toBe('Estado del logistic actualizado con éxito ');
      expect(mockChain.update).toHaveBeenCalledWith({ is_available: false });
    });

    it('should throw BadRequestException when update fails', async () => {
      const id = 'logistic-123';
      const userId = 'user-123';
      const isAvailable = false;

      const mockSecondEq: any = {
        eq: jest.fn(),
      };
      mockSecondEq.eq.mockResolvedValue({
        data: null,
        error: { message: 'Update failed' },
      });

      const mockFirstEq: any = {
        eq: jest.fn().mockReturnValue(mockSecondEq),
      };

      const mockChain: any = {
        update: jest.fn().mockReturnValue(mockFirstEq),
      };

      mockSupabaseClient.from.mockReturnValue(mockChain);

      await expect(
        repository.UpdateStatusLogisticByID(id, userId, isAvailable),
      ).rejects.toThrow(BadRequestException);
      await expect(
        repository.UpdateStatusLogisticByID(id, userId, isAvailable),
      ).rejects.toThrow('Error al actualizar el estado del logistic: Update failed');
    });
  });

  describe('findAllLogisticByUserID', () => {
    it('should find all logistics for a user', async () => {
      const userId = 'user-123';
      const mockLogistics = [
        { id: '1', user_id: userId, is_available: true },
        { id: '2', user_id: userId, is_available: false },
      ];

      const mockChain: any = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: mockLogistics,
          error: null,
        }),
      };

      mockSupabaseClient.from.mockReturnValue(mockChain);

      const result = await repository.findAllLogisticByUserID(userId);

      expect(result).toEqual(mockLogistics);
      expect(mockChain.select).toHaveBeenCalledWith('*');
      expect(mockChain.eq).toHaveBeenCalledWith('user_id', userId);
    });

    it('should return empty array when user has no logistics', async () => {
      const userId = 'user-123';

      const mockChain: any = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
      };

      mockSupabaseClient.from.mockReturnValue(mockChain);

      const result = await repository.findAllLogisticByUserID(userId);

      expect(result).toEqual([]);
    });

    it('should throw BadRequestException when query fails', async () => {
      const userId = 'user-123';

      const mockChain: any = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Query error' },
        }),
      };

      mockSupabaseClient.from.mockReturnValue(mockChain);

      await expect(repository.findAllLogisticByUserID(userId)).rejects.toThrow(
        BadRequestException,
      );
      await expect(repository.findAllLogisticByUserID(userId)).rejects.toThrow(
        'Error al obtener los logistics del usuario: Query error',
      );
    });
  });

  describe('findLogisticByID', () => {
    it('should find logistic by ID', async () => {
      const id = 'logistic-123';
      const mockLogistic = { id, user_id: 'user-123', is_available: true };

      const mockChain: any = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockLogistic,
          error: null,
        }),
      };

      mockSupabaseClient.from.mockReturnValue(mockChain);

      const result = await repository.findLogisticByID(id);

      expect(result).toEqual(mockLogistic);
      expect(mockChain.select).toHaveBeenCalledWith('*');
      expect(mockChain.eq).toHaveBeenCalledWith('id', id);
      expect(mockChain.single).toHaveBeenCalled();
    });

    it('should throw BadRequestException when logistic not found', async () => {
      const id = 'non-existent-id';

      const mockChain: any = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Not found' },
        }),
      };

      mockSupabaseClient.from.mockReturnValue(mockChain);

      await expect(repository.findLogisticByID(id)).rejects.toThrow(
        BadRequestException,
      );
      await expect(repository.findLogisticByID(id)).rejects.toThrow(
        'Error al obtener el logistic: Not found',
      );
    });
  });

  describe('updateLogisticByID', () => {
    it('should update logistic successfully', async () => {
      const id = 'logistic-123';
      const logistic = new Logistic(
        'user-123',
        'Honda',
        'XYZ-5678',
        true,
        id,
      );

      const result = await repository.updateLogisticByID(id, logistic);

      expect(result).toBe('Logistic actualizado con éxito ');
    });
  });
});
