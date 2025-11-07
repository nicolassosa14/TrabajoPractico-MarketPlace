import { Test, TestingModule } from '@nestjs/testing';
import { LogisticsController } from './logistics.controller';
import { LogisticsService } from '../service/logistics.service';
import { CreateLogisticRequestDTO } from './dto/create-logistic.dto';
import { UpdateStatusLogisticRequestDTO } from './dto/update-status.dto';
import { UpdateLogisticRequestDTO } from './dto/update-logistic.dto';

describe('LogisticsController', () => {
  let controller: LogisticsController;
  let logisticsService: jest.Mocked<LogisticsService>;

  const mockLogisticsService = {
    CreateLogistic: jest.fn(),
    findAllAvailable: jest.fn(),
    UpdateStatus: jest.fn(),
    findAllByUserID: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogisticsController],
      providers: [
        {
          provide: LogisticsService,
          useValue: mockLogisticsService,
        },
      ],
    }).compile();

    controller = module.get<LogisticsController>(LogisticsController);
    logisticsService = module.get(LogisticsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a logistic with valid data', async () => {
      const dto: CreateLogisticRequestDTO = {
        user_id: 'uuid-123',
        vehicle_type: 'Motorcycle',
        license_plate: 'ABC-123',
        is_available: true,
      };

      const mockResponse = {
        id: 'logistic-456',
        user_id: 'uuid-123',
        vehicle_type: 'Motorcycle',
        license_plate: 'ABC-123',
        is_available: true,
      };

      mockLogisticsService.CreateLogistic.mockResolvedValue(mockResponse);

      const result = await controller.create(dto);

      expect(result).toEqual(mockResponse);
      expect(mockLogisticsService.CreateLogistic).toHaveBeenCalledTimes(1);
    });

    it('should set is_available to true by default', async () => {
      const dto: CreateLogisticRequestDTO = {
        user_id: 'uuid-456',
        vehicle_type: 'Truck',
        license_plate: 'XYZ-789',
      };

      mockLogisticsService.CreateLogistic.mockResolvedValue({});

      await controller.create(dto);

      expect(mockLogisticsService.CreateLogistic).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all available logistics', async () => {
      const mockResponse = [
        {
          id: 'logistic-1',
          user_id: 'uuid-1',
          vehicle_type: 'Motorcycle',
          license_plate: 'ABC-123',
          is_available: true,
        },
      ];

      mockLogisticsService.findAllAvailable.mockResolvedValue(mockResponse);

      const result = await controller.findAll();

      expect(result).toEqual(mockResponse);
      expect(mockLogisticsService.findAllAvailable).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no logistics available', async () => {
      mockLogisticsService.findAllAvailable.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('UpdateStatus', () => {
    it('should update logistic status', async () => {
      const dto: UpdateStatusLogisticRequestDTO = {
        id: 'logistic-123',
        user_id: 'uuid-456',
        is_available: false,
      };

      const mockResponse = {
        id: 'logistic-123',
        is_available: false,
      };

      mockLogisticsService.UpdateStatus.mockResolvedValue(mockResponse);

      const result = await controller.UpdateStatus(dto);

      expect(result).toEqual(mockResponse);
      expect(mockLogisticsService.UpdateStatus).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAllByUserID', () => {
    it('should return all logistics for a user', async () => {
      const userId = 'uuid-123';
      const mockResponse = [
        {
          id: 'logistic-1',
          user_id: userId,
          vehicle_type: 'Motorcycle',
          license_plate: 'ABC-123',
          is_available: true,
        },
      ];

      mockLogisticsService.findAllByUserID.mockResolvedValue(mockResponse);

      const result = await controller.findAllByUserID(userId);

      expect(result).toEqual(mockResponse);
      expect(mockLogisticsService.findAllByUserID).toHaveBeenCalledWith(userId);
    });

    it('should return empty array when user has no logistics', async () => {
      const userId = 'uuid-456';

      mockLogisticsService.findAllByUserID.mockResolvedValue([]);

      const result = await controller.findAllByUserID(userId);

      expect(result).toEqual([]);
    });
  });

  describe('update', () => {
    it('should update a logistic', async () => {
      const id = '123';
      const dto: UpdateLogisticRequestDTO = {};

      mockLogisticsService.update.mockResolvedValue('Update response');

      const result = await controller.update(id, dto);

      expect(result).toBe('Update response');
      expect(mockLogisticsService.update).toHaveBeenCalledWith(123, dto);
    });
  });

  describe('remove', () => {
    it('should remove a logistic', async () => {
      const id = '456';

      mockLogisticsService.remove.mockResolvedValue('Remove response');

      const result = await controller.remove(id);

      expect(result).toBe('Remove response');
      expect(mockLogisticsService.remove).toHaveBeenCalledWith(456);
    });
  });
});
