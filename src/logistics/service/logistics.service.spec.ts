import { Test, TestingModule } from '@nestjs/testing';
import { LogisticsService } from './logistics.service';
import { LogisticRepository } from '../domain/contract/logistic.repository';
import { CreateLogisticCommand } from './dto/create-logistic.dto';
import { UpdateLogisticCommand } from './dto/update-logistic.dto';
import { UpdateStatusLogisticCommand } from './dto/update-status.dto';
import Logistic from '../domain/models/logistic';

describe('LogisticsService', () => {
  let service: LogisticsService;
  let logisticRepository: jest.Mocked<LogisticRepository>;

  const mockLogisticRepository = {
    createLogistic: jest.fn(),
    findAllAvailableLogistics: jest.fn(),
    UpdateStatusLogisticByID: jest.fn(),
    findAllLogisticByUserID: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogisticsService,
        {
          provide: 'LogisticRepository',
          useValue: mockLogisticRepository,
        },
      ],
    }).compile();

    service = module.get<LogisticsService>(LogisticsService);
    logisticRepository = module.get('LogisticRepository');

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('CreateLogistic', () => {
    it('should create a logistic with valid data', async () => {
      const command = new CreateLogisticCommand(
        'uuid-123',
        'Motorcycle',
        'ABC-123',
        true,
      );

      const mockResponse = {
        id: 'logistic-456',
        user_id: 'uuid-123',
        vehicle_type: 'Motorcycle',
        license_plate: 'ABC-123',
        is_available: true,
      };

      mockLogisticRepository.createLogistic.mockResolvedValue(mockResponse);

      const result = await service.CreateLogistic(command);

      expect(result).toEqual(mockResponse);
      expect(mockLogisticRepository.createLogistic).toHaveBeenCalledTimes(1);
      expect(mockLogisticRepository.createLogistic).toHaveBeenCalledWith(
        expect.any(Logistic),
      );
    });

    it('should create a logistic with unavailable status', async () => {
      const command = new CreateLogisticCommand(
        'uuid-456',
        'Truck',
        'XYZ-789',
        false,
      );

      const mockResponse = {
        id: 'logistic-789',
        user_id: 'uuid-456',
        vehicle_type: 'Truck',
        license_plate: 'XYZ-789',
        is_available: false,
      };

      mockLogisticRepository.createLogistic.mockResolvedValue(mockResponse);

      const result = await service.CreateLogistic(command);

      expect(result).toEqual(mockResponse);
    });

    it('should propagate repository errors', async () => {
      const command = new CreateLogisticCommand(
        'uuid-123',
        'Motorcycle',
        'ABC-123',
        true,
      );

      mockLogisticRepository.createLogistic.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.CreateLogistic(command)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('findAllAvailable', () => {
    it('should return all available logistics', async () => {
      const mockAvailableLogistics = [
        {
          id: 'logistic-1',
          user_id: 'uuid-1',
          vehicle_type: 'Motorcycle',
          license_plate: 'ABC-123',
          is_available: true,
        },
        {
          id: 'logistic-2',
          user_id: 'uuid-2',
          vehicle_type: 'Car',
          license_plate: 'DEF-456',
          is_available: true,
        },
      ];

      mockLogisticRepository.findAllAvailableLogistics.mockResolvedValue(
        mockAvailableLogistics,
      );

      const result = await service.findAllAvailable();

      expect(result).toEqual(mockAvailableLogistics);
      expect(
        mockLogisticRepository.findAllAvailableLogistics,
      ).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no logistics are available', async () => {
      mockLogisticRepository.findAllAvailableLogistics.mockResolvedValue([]);

      const result = await service.findAllAvailable();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should propagate repository errors', async () => {
      mockLogisticRepository.findAllAvailableLogistics.mockRejectedValue(
        new Error('Query failed'),
      );

      await expect(service.findAllAvailable()).rejects.toThrow('Query failed');
    });
  });

  describe('UpdateStatus', () => {
    it('should update logistic status', async () => {
      const command = new UpdateStatusLogisticCommand(
        'logistic-123',
        'uuid-456',
        false,
      );

      const mockResponse = {
        id: 'logistic-123',
        user_id: 'uuid-456',
        vehicle_type: 'Car',
        license_plate: 'ABC-789',
        is_available: false,
      };

      mockLogisticRepository.UpdateStatusLogisticByID.mockResolvedValue(
        mockResponse,
      );

      const result = await service.UpdateStatus(command);

      expect(result).toEqual(mockResponse);
      expect(
        mockLogisticRepository.UpdateStatusLogisticByID,
      ).toHaveBeenCalledTimes(1);
      expect(
        mockLogisticRepository.UpdateStatusLogisticByID,
      ).toHaveBeenCalledWith('logistic-123', 'uuid-456', false);
    });

    it('should handle status change from unavailable to available', async () => {
      const command = new UpdateStatusLogisticCommand(
        'logistic-789',
        'uuid-999',
        true,
      );

      mockLogisticRepository.UpdateStatusLogisticByID.mockResolvedValue({
        id: 'logistic-789',
        is_available: true,
      });

      const result = await service.UpdateStatus(command);

      expect(result.is_available).toBe(true);
      expect(
        mockLogisticRepository.UpdateStatusLogisticByID,
      ).toHaveBeenCalledWith('logistic-789', 'uuid-999', true);
    });

    it('should propagate repository errors', async () => {
      const command = new UpdateStatusLogisticCommand(
        'logistic-123',
        'uuid-456',
        false,
      );

      mockLogisticRepository.UpdateStatusLogisticByID.mockRejectedValue(
        new Error('Update failed'),
      );

      await expect(service.UpdateStatus(command)).rejects.toThrow(
        'Update failed',
      );
    });
  });

  describe('findAllByUserID', () => {
    it('should return all logistics for a specific user', async () => {
      const userId = 'uuid-123';
      const mockUserLogistics = [
        {
          id: 'logistic-1',
          user_id: userId,
          vehicle_type: 'Motorcycle',
          license_plate: 'ABC-123',
          is_available: true,
        },
        {
          id: 'logistic-2',
          user_id: userId,
          vehicle_type: 'Truck',
          license_plate: 'XYZ-789',
          is_available: false,
        },
      ];

      mockLogisticRepository.findAllLogisticByUserID.mockResolvedValue(
        mockUserLogistics,
      );

      const result = await service.findAllByUserID(userId);

      expect(result).toEqual(mockUserLogistics);
      expect(
        mockLogisticRepository.findAllLogisticByUserID,
      ).toHaveBeenCalledTimes(1);
      expect(mockLogisticRepository.findAllLogisticByUserID).toHaveBeenCalledWith(
        userId,
      );
    });

    it('should return empty array when user has no logistics', async () => {
      const userId = 'uuid-456';

      mockLogisticRepository.findAllLogisticByUserID.mockResolvedValue([]);

      const result = await service.findAllByUserID(userId);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should propagate repository errors', async () => {
      const userId = 'uuid-123';

      mockLogisticRepository.findAllLogisticByUserID.mockRejectedValue(
        new Error('Database connection failed'),
      );

      await expect(service.findAllByUserID(userId)).rejects.toThrow(
        'Database connection failed',
      );
    });
  });

  describe('update', () => {
    it('should return placeholder message (method not fully implemented)', () => {
      const result = service.update(123, new UpdateLogisticCommand());
      expect(result).toBe('This action updates a #123 logistic');
    });
  });

  describe('remove', () => {
    it('should return placeholder message (method not fully implemented)', () => {
      const result = service.remove(456);
      expect(result).toBe('This action removes a #456 logistic');
    });
  });
});
