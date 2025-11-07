import { Test, TestingModule } from '@nestjs/testing';
import { AddressService } from './address.service';
import { AddressRepository } from '../domain/contract/address.repository';
import CreateAddressCommand from './dto/CreateAddress.dto';
import UpdateAddressCommand from './dto/UpdateAddress.dto';
import DeleteAddressCommand from './dto/DeleteAddress.dto';
import Address from '../domain/models/address';

describe('AddressService', () => {
  let service: AddressService;
  let addressRepository: jest.Mocked<AddressRepository>;

  const mockAddressRepository = {
    createAddress: jest.fn(),
    findAllAddressByUserID: jest.fn(),
    EditAdressByID: jest.fn(),
    deleteAddress: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressService,
        {
          provide: 'AddressRepository',
          useValue: mockAddressRepository,
        },
      ],
    }).compile();

    service = module.get<AddressService>(AddressService);
    addressRepository = module.get('AddressRepository');

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAddress', () => {
    it('should create an address with valid data', async () => {
      const command = new CreateAddressCommand(
        'uuid-123',
        '123 Main Street',
        'Springfield',
        '12345',
        40.7128,
        -74.0060,
        'Apt 4B',
      );

      const mockResponse = 'Dirección creada con éxito';

      mockAddressRepository.createAddress.mockResolvedValue(mockResponse);

      const result = await service.createAddress(command);

      expect(result).toBe(mockResponse);
      expect(mockAddressRepository.createAddress).toHaveBeenCalledTimes(1);
      expect(mockAddressRepository.createAddress).toHaveBeenCalledWith(command);
    });

    it('should create an address without optional details', async () => {
      const command = new CreateAddressCommand(
        'uuid-123',
        '456 Oak Avenue',
        'Shelbyville',
        '67890',
        41.8781,
        -87.6298,
      );

      mockAddressRepository.createAddress.mockResolvedValue('Success');

      await service.createAddress(command);

      expect(mockAddressRepository.createAddress).toHaveBeenCalledWith(command);
      expect(command.getDetails()).toBeUndefined();
    });

    it('should propagate repository errors', async () => {
      const command = new CreateAddressCommand(
        'uuid-123',
        '123 Main Street',
        'Springfield',
        '12345',
        40.7128,
        -74.0060,
      );

      mockAddressRepository.createAddress.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.createAddress(command)).rejects.toThrow(
        'Database error',
      );
    });

    it('should handle duplicate address error', async () => {
      const command = new CreateAddressCommand(
        'uuid-123',
        '123 Main Street',
        'Springfield',
        '12345',
        40.7128,
        -74.0060,
      );

      mockAddressRepository.createAddress.mockRejectedValue(
        new Error('Ya existe esta direccion para este usuario'),
      );

      await expect(service.createAddress(command)).rejects.toThrow(
        'Ya existe esta direccion para este usuario',
      );
    });
  });

  describe('findAllAddressByUserID', () => {
    it('should find all addresses for a user', async () => {
      const userId = 'uuid-123';
      const mockAddresses = [
        {
          id: 1,
          user_id: userId,
          street_address: '123 Main St',
          city: 'Springfield',
          postal_code: '12345',
          details: 'Apt 4B',
        },
        {
          id: 2,
          user_id: userId,
          street_address: '456 Oak Ave',
          city: 'Shelbyville',
          postal_code: '67890',
          details: null,
        },
      ];

      mockAddressRepository.findAllAddressByUserID.mockResolvedValue(
        mockAddresses as any,
      );

      const result = await service.findAllAddressByUserID(userId);

      expect(result).toEqual(mockAddresses);
      expect(mockAddressRepository.findAllAddressByUserID).toHaveBeenCalledWith(
        userId,
      );
      expect(
        mockAddressRepository.findAllAddressByUserID,
      ).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when user has no addresses', async () => {
      const userId = 'uuid-456';

      mockAddressRepository.findAllAddressByUserID.mockResolvedValue([]);

      const result = await service.findAllAddressByUserID(userId);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should propagate repository errors', async () => {
      const userId = 'uuid-123';

      mockAddressRepository.findAllAddressByUserID.mockRejectedValue(
        new Error('Error al obtener las direcciones'),
      );

      await expect(service.findAllAddressByUserID(userId)).rejects.toThrow(
        'Error al obtener las direcciones',
      );
    });

    it('should handle invalid user_id', async () => {
      const invalidUserId = '';

      mockAddressRepository.findAllAddressByUserID.mockResolvedValue([]);

      const result = await service.findAllAddressByUserID(invalidUserId);

      expect(mockAddressRepository.findAllAddressByUserID).toHaveBeenCalledWith(
        '',
      );
    });
  });

  describe('UpdateAddress', () => {
    it('should update address with valid data', async () => {
      const command = new UpdateAddressCommand(
        'address-id-123',
        'uuid-123',
        '789 Updated Street',
        'Updated City',
        '99999',
        'New instructions',
      );

      const mockUpdatedAddress = {
        id: 'address-id-123',
        user_id: 'uuid-123',
        street_address: '789 Updated Street',
        city: 'Updated City',
        postal_code: '99999',
        details: 'New instructions',
      };

      mockAddressRepository.EditAdressByID.mockResolvedValue(
        mockUpdatedAddress,
      );

      const result = await service.UpdateAddress(command);

      expect(result).toEqual(mockUpdatedAddress);
      expect(mockAddressRepository.EditAdressByID).toHaveBeenCalledTimes(1);
      expect(mockAddressRepository.EditAdressByID).toHaveBeenCalledWith(
        expect.any(Address),
      );
    });

    it('should handle partial updates', async () => {
      const command = new UpdateAddressCommand(
        'address-id-123',
        'uuid-123',
        undefined,
        'New City',
        undefined,
        'Updated details',
      );

      const mockUpdatedAddress = {
        id: 'address-id-123',
        user_id: 'uuid-123',
        city: 'New City',
        details: 'Updated details',
      };

      mockAddressRepository.EditAdressByID.mockResolvedValue(
        mockUpdatedAddress,
      );

      const result = await service.UpdateAddress(command);

      expect(result).toEqual(mockUpdatedAddress);
      expect(mockAddressRepository.EditAdressByID).toHaveBeenCalled();
    });

    it('should propagate repository errors', async () => {
      const command = new UpdateAddressCommand(
        'address-id-123',
        'uuid-123',
        '789 Updated Street',
        'Updated City',
      );

      mockAddressRepository.EditAdressByID.mockRejectedValue(
        new Error('Update failed'),
      );

      await expect(service.UpdateAddress(command)).rejects.toThrow(
        'Update failed',
      );
    });
  });

  describe('deleteAddress', () => {
    it('should delete an address with valid data', async () => {
      const command = new DeleteAddressCommand('uuid-123', 'address-id-456');

      const mockResponse = 'Dirección eliminada con éxito';

      mockAddressRepository.deleteAddress.mockResolvedValue(mockResponse);

      const result = await service.deleteAddress(command);

      expect(result).toBe(mockResponse);
      expect(mockAddressRepository.deleteAddress).toHaveBeenCalledTimes(1);
      expect(mockAddressRepository.deleteAddress).toHaveBeenCalledWith(
        'uuid-123',
        'address-id-456',
      );
    });

    it('should propagate repository errors during deletion', async () => {
      const command = new DeleteAddressCommand('uuid-123', 'address-id-456');

      mockAddressRepository.deleteAddress.mockRejectedValue(
        new Error('Delete failed'),
      );

      await expect(service.deleteAddress(command)).rejects.toThrow(
        'Delete failed',
      );
    });
  });
});
