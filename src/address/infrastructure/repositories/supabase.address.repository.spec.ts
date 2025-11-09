import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { SupabaseAddressRepository } from './supabase.address.repository';
import Address from '../../domain/models/address';
import { createMockSupabaseClient } from '../../../../test/mocks/supabase.mock';

describe('SupabaseAddressRepository', () => {
  let repository: SupabaseAddressRepository;
  let mockSupabaseClient: any;

  beforeEach(async () => {
    mockSupabaseClient = createMockSupabaseClient();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupabaseAddressRepository,
        {
          provide: 'SUPABASE_CLIENT',
          useValue: mockSupabaseClient,
        },
      ],
    }).compile();

    repository = module.get<SupabaseAddressRepository>(
      SupabaseAddressRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('createAddress', () => {
    it('should create an address successfully', async () => {
      const address = new Address(
        'uuid-123',
        40.7128,
        -74.0060,
        '12345',
        '123 Main Street',
        'Springfield',
        undefined,
        'Apt 4B',
      );

      // Mock para la búsqueda de direcciones existentes
      const mockSelectChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
      };

      // Primera llamada eq devuelve el mock, segunda llamada devuelve la promesa
      mockSelectChain.eq
        .mockReturnValueOnce(mockSelectChain)
        .mockResolvedValueOnce({ data: [], error: null });

      // Mock para la inserción
      const mockInsert = jest
        .fn()
        .mockResolvedValue({ data: { id: 1 }, error: null });

      mockSupabaseClient.from
        .mockReturnValueOnce(mockSelectChain)
        .mockReturnValueOnce({ insert: mockInsert });

      const result = await repository.createAddress(address);

      expect(result).toBe('Dirección creada con éxito ');
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('addresses');
      expect(mockInsert).toHaveBeenCalledWith({
        user_id: 'uuid-123',
        street_address: '123 Main Street',
        city: 'Springfield',
        postal_code: '12345',
        latitude: 40.7128,
        longitude: -74.0060,
        details: 'Apt 4B',
      });
    });

    it('should throw BadRequestException when address already exists', async () => {
      const address = new Address(
        'uuid-123',
        40.7128,
        -74.0060,
        '12345',
        '123 Main Street',
        'Springfield',
      );

      // Mock que retorna una dirección existente
      const mockSelectChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
      };

      const existingAddress = {
        id: 1,
        user_id: 'uuid-123',
        street_address: '123 Main Street',
      };

      mockSelectChain.eq
        .mockReturnValueOnce(mockSelectChain)
        .mockResolvedValueOnce({ data: [existingAddress], error: null });

      mockSupabaseClient.from.mockReturnValue(mockSelectChain);

      await expect(repository.createAddress(address)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should handle database errors during insert', async () => {
      const address = new Address(
        'uuid-123',
        40.7128,
        -74.0060,
        '12345',
        '123 Main Street',
        'Springfield',
      );

      const mockSelectChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
      };

      mockSelectChain.eq
        .mockReturnValueOnce(mockSelectChain)
        .mockResolvedValueOnce({ data: [], error: null });

      const errorObject = { message: 'Database connection failed' };
      const mockInsert = jest.fn().mockResolvedValue({
        data: null,
        error: errorObject,
      });

      mockSupabaseClient.from
        .mockReturnValueOnce(mockSelectChain)
        .mockReturnValueOnce({ insert: mockInsert });

      // El repository lanza el error tal cual lo recibe de Supabase
      await expect(repository.createAddress(address)).rejects.toEqual(
        errorObject,
      );
    });

    it('should create address without optional details', async () => {
      const address = new Address(
        'uuid-123',
        41.8781,
        -87.6298,
        '67890',
        '456 Oak Avenue',
        'Shelbyville',
      );

      const mockSelectChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
      };

      mockSelectChain.eq
        .mockReturnValueOnce(mockSelectChain)
        .mockResolvedValueOnce({ data: [], error: null });

      const mockInsert = jest
        .fn()
        .mockResolvedValue({ data: { id: 2 }, error: null });

      mockSupabaseClient.from
        .mockReturnValueOnce(mockSelectChain)
        .mockReturnValueOnce({ insert: mockInsert });

      await repository.createAddress(address);

      expect(mockInsert).toHaveBeenCalledWith({
        user_id: 'uuid-123',
        street_address: '456 Oak Avenue',
        city: 'Shelbyville',
        postal_code: '67890',
        latitude: 41.8781,
        longitude: -87.6298,
        details: undefined,
      });
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

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ data: mockAddresses, error: null }),
      };

      mockSupabaseClient.from.mockReturnValue(mockChain);

      const result = await repository.findAllAddressByUserID(userId);

      expect(result).toEqual(mockAddresses);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('addresses');
      expect(mockChain.select).toHaveBeenCalledWith('*');
      expect(mockChain.eq).toHaveBeenCalledWith('user_id', userId);
    });

    it('should return empty array when user has no addresses', async () => {
      const userId = 'uuid-456';

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ data: [], error: null }),
      };

      mockSupabaseClient.from.mockReturnValue(mockChain);

      const result = await repository.findAllAddressByUserID(userId);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should throw BadRequestException when query fails', async () => {
      const userId = 'uuid-123';

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database error' },
        }),
      };

      mockSupabaseClient.from.mockReturnValue(mockChain);

      await expect(repository.findAllAddressByUserID(userId)).rejects.toThrow(
        BadRequestException,
      );
      await expect(repository.findAllAddressByUserID(userId)).rejects.toThrow(
        'Error al obtener las direcciones: Database error',
      );
    });

    it('should handle network errors', async () => {
      const userId = 'uuid-123';

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Network timeout' },
        }),
      };

      mockSupabaseClient.from.mockReturnValue(mockChain);

      await expect(repository.findAllAddressByUserID(userId)).rejects.toThrow(
        'Error al obtener las direcciones: Network timeout',
      );
    });
  });

  describe('EditAdressByID', () => {
    it('should update an address successfully', async () => {
      const address = new Address(
        'uuid-123',
        40.7128,
        -74.0060,
        '99999',
        '789 Updated Street',
        'New City',
        'address-id-123',
        'Updated details',
      );

      // Mock para la verificación
      const mockVerifyChain: any = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn(),
      };
      mockVerifyChain.eq.mockReturnValueOnce(mockVerifyChain).mockResolvedValueOnce({
        data: [],
        error: null,
      });

      // Mock para la actualización
      const mockUpdateChain: any = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn(),
      };
      mockUpdateChain.eq
        .mockReturnValueOnce(mockUpdateChain)
        .mockResolvedValueOnce({
          data: { id: 'address-id-123' },
          error: null,
        });

      mockSupabaseClient.from
        .mockReturnValueOnce(mockVerifyChain)
        .mockReturnValueOnce(mockUpdateChain);

      const result = await repository.EditAdressByID(address);

      expect(result).toBe('Dirección actualizada con éxito');
      expect(mockSupabaseClient.from).toHaveBeenCalledTimes(2);
      expect(mockUpdateChain.update).toHaveBeenCalledWith({
        street_address: '789 Updated Street',
        city: 'New City',
        postal_code: '99999',
        details: 'Updated details',
      });
    });

    it('should throw BadRequestException when update fails', async () => {
      const address = new Address(
        'uuid-123',
        40.7128,
        -74.0060,
        '12345',
        '789 Street',
        'City',
        'address-id-123',
      );

      const mockVerifyChain: any = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn(),
      };
      mockVerifyChain.eq.mockReturnValueOnce(mockVerifyChain).mockResolvedValueOnce({
        data: [],
        error: null,
      });

      const mockUpdateChain: any = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn(),
      };
      mockUpdateChain.eq
        .mockReturnValueOnce(mockUpdateChain)
        .mockResolvedValueOnce({
          data: null,
          error: { message: 'Update failed' },
        });

      mockSupabaseClient.from
        .mockReturnValueOnce(mockVerifyChain)
        .mockReturnValueOnce(mockUpdateChain);

      await expect(repository.EditAdressByID(address)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should handle non-existent address ID', async () => {
      const address = new Address(
        'uuid-123',
        40.7128,
        -74.0060,
        '12345',
        'Street',
        'City',
        'non-existent-id',
      );

      const mockVerifyChain: any = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn(),
      };
      mockVerifyChain.eq.mockReturnValueOnce(mockVerifyChain).mockResolvedValueOnce({
        data: [],
        error: null,
      });

      const mockUpdateChain: any = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn(),
      };
      mockUpdateChain.eq
        .mockReturnValueOnce(mockUpdateChain)
        .mockResolvedValueOnce({
          data: null,
          error: { message: 'Address not found' },
        });

      mockSupabaseClient.from
        .mockReturnValueOnce(mockVerifyChain)
        .mockReturnValueOnce(mockUpdateChain);

      await expect(repository.EditAdressByID(address)).rejects.toThrow(
        'Error al editar la direccion: Address not found',
      );
    });
  });
});
