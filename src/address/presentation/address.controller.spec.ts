import { Test, TestingModule } from '@nestjs/testing';
import { AddressController } from './address.controller';
import { AddressService } from '../service/address.service';
import CreateAddressRequestDTO from './dto/CreateAddress.dto';
import UpdateAddressRequestDTO from './dto/UpdateAddress.dto';

describe('AddressController', () => {
  let controller: AddressController;
  let addressService: jest.Mocked<AddressService>;

  const mockAddressService = {
    createAddress: jest.fn(),
    findAllAddressByUserID: jest.fn(),
    UpdateAddress: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddressController],
      providers: [
        {
          provide: AddressService,
          useValue: mockAddressService,
        },
      ],
    }).compile();

    controller = module.get<AddressController>(AddressController);
    addressService = module.get(AddressService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createAddressRequest', () => {
    it('should create an address successfully', async () => {
      const dto: CreateAddressRequestDTO = {
        user_id: 'uuid-123',
        street_address: '123 Main Street',
        city: 'Springfield',
        postal_code: '12345',
        details: 'Apt 4B',
      };

      const mockResponse = 'Dirección creada con éxito';

      mockAddressService.createAddress.mockResolvedValue(mockResponse);

      const result = await controller.createAddressRequest(dto);

      expect(result).toBe(mockResponse);
      expect(mockAddressService.createAddress).toHaveBeenCalledTimes(1);
    });

    it('should map DTO to Command correctly', async () => {
      const dto: CreateAddressRequestDTO = {
        user_id: 'uuid-456',
        street_address: '456 Oak Avenue',
        city: 'Shelbyville',
        postal_code: '67890',
        details: 'House with blue door',
      };

      mockAddressService.createAddress.mockResolvedValue('Success');

      await controller.createAddressRequest(dto);

      const command = mockAddressService.createAddress.mock.calls[0][0];
      expect(command.getUser_id()).toBe('uuid-456');
      expect(command.getStreet_address()).toBe('456 Oak Avenue');
      expect(command.getCity()).toBe('Shelbyville');
      expect(command.getPostal_code()).toBe('67890');
      expect(command.getDetails()).toBe('House with blue door');
    });

    it('should create address without optional details', async () => {
      const dto: CreateAddressRequestDTO = {
        user_id: 'uuid-789',
        street_address: '789 Elm Street',
        city: 'Capital City',
        postal_code: '54321',
      };

      mockAddressService.createAddress.mockResolvedValue('Success');

      await controller.createAddressRequest(dto);

      const command = mockAddressService.createAddress.mock.calls[0][0];
      expect(command.getDetails()).toBeUndefined();
    });

    it('should propagate service errors', async () => {
      const dto: CreateAddressRequestDTO = {
        user_id: 'uuid-123',
        street_address: '123 Main Street',
        city: 'Springfield',
        postal_code: '12345',
      };

      mockAddressService.createAddress.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(controller.createAddressRequest(dto)).rejects.toThrow(
        'Database error',
      );
    });

    it('should handle duplicate address error', async () => {
      const dto: CreateAddressRequestDTO = {
        user_id: 'uuid-123',
        street_address: '123 Main Street',
        city: 'Springfield',
        postal_code: '12345',
      };

      mockAddressService.createAddress.mockRejectedValue(
        new Error('Ya existe esta direccion para este usuario'),
      );

      await expect(controller.createAddressRequest(dto)).rejects.toThrow(
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

      mockAddressService.findAllAddressByUserID.mockResolvedValue(
        mockAddresses as any,
      );

      const result = await controller.findAllAddressByUserID(userId);

      expect(result).toEqual(mockAddresses);
      expect(mockAddressService.findAllAddressByUserID).toHaveBeenCalledWith(
        userId,
      );
      expect(mockAddressService.findAllAddressByUserID).toHaveBeenCalledTimes(
        1,
      );
    });

    it('should return empty array when user has no addresses', async () => {
      const userId = 'uuid-456';

      mockAddressService.findAllAddressByUserID.mockResolvedValue([]);

      const result = await controller.findAllAddressByUserID(userId);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should propagate service errors', async () => {
      const userId = 'uuid-123';

      mockAddressService.findAllAddressByUserID.mockRejectedValue(
        new Error('Error al obtener las direcciones'),
      );

      await expect(controller.findAllAddressByUserID(userId)).rejects.toThrow(
        'Error al obtener las direcciones',
      );
    });

    it('should handle empty user_id', async () => {
      const userId = '';

      mockAddressService.findAllAddressByUserID.mockResolvedValue([]);

      await controller.findAllAddressByUserID(userId);

      expect(mockAddressService.findAllAddressByUserID).toHaveBeenCalledWith(
        '',
      );
    });
  });

  describe('updateAddressRequest', () => {
    it('should update an address successfully', async () => {
      const dto: UpdateAddressRequestDTO = {
        user_id: 'address-id-123',
        street_address: '789 Updated Street',
        city: 'New City',
        postal_code: '99999',
        details: 'New instructions',
      };

      mockAddressService.UpdateAddress.mockResolvedValue(undefined);

      const result = await controller.updateAddressRequest(dto);

      // Actualmente UpdateAddress no retorna nada
      expect(result).toBeUndefined();
      expect(mockAddressService.UpdateAddress).toHaveBeenCalledTimes(1);
    });

    it('should map update DTO to Command correctly', async () => {
      const dto: UpdateAddressRequestDTO = {
        user_id: 'address-id-456',
        street_address: '456 New Street',
        city: 'Updated City',
        postal_code: '88888',
        details: 'Updated details',
      };

      mockAddressService.UpdateAddress.mockResolvedValue(undefined);

      await controller.updateAddressRequest(dto);

      const command = mockAddressService.UpdateAddress.mock.calls[0][0];
      expect(command.id).toBe('address-id-456');
      expect(command.street_address).toBe('456 New Street');
      expect(command.city).toBe('Updated City');
      expect(command.postal_code).toBe('88888');
      expect(command.details).toBe('Updated details');
    });

    it('should handle partial updates', async () => {
      const dto: UpdateAddressRequestDTO = {
        user_id: 'address-id-789',
        city: 'New City Only',
      };

      mockAddressService.UpdateAddress.mockResolvedValue(undefined);

      await controller.updateAddressRequest(dto);

      const command = mockAddressService.UpdateAddress.mock.calls[0][0];
      expect(command.id).toBe('address-id-789');
      expect(command.city).toBe('New City Only');
      expect(command.street_address).toBeUndefined();
      expect(command.postal_code).toBeUndefined();
    });

    // Nota: Estos tests deberían pasar una vez que se implemente UpdateAddress
    it.skip('should propagate update errors when implemented', async () => {
      const dto: UpdateAddressRequestDTO = {
        user_id: 'address-id-123',
        street_address: '789 Street',
      };

      mockAddressService.UpdateAddress.mockRejectedValue(
        new Error('Update failed'),
      );

      await expect(controller.updateAddressRequest(dto)).rejects.toThrow(
        'Update failed',
      );
    });
  });
});
