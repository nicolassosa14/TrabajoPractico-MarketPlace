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
        '123 Main Street',
        'Springfield',
        '12345',
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

      expect(result).toBe('Dirección creada con éxito [object Object]');
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('addresses');
      expect(mockInsert).toHaveBeenCalledWith({
        user_id: 'uuid-123',
        street_address: '123 Main Street',
        city: 'Springfield',
        postal_code: '12345',
        details: 'Apt 4B',
      });
    });

    it('should throw BadRequestException when address already exists', async () => {
      const address = new Address(
        'uuid-123',
        '123 Main Street',
        'Springfield',
        '12345',
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
        '123 Main Street',
        'Springfield',
        '12345',
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
        '456 Oak Avenue',
        'Shelbyville',
        '67890',
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
      const id = 'address-id-123';
      const address = new Address(
        'uuid-123',
        '789 Updated Street',
        'New City',
        '99999',
        'Updated details',
      );

      const mockChain = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: { id, ...address },
          error: null,
        }),
      };

      mockSupabaseClient.from.mockReturnValue(mockChain);

      const result = await repository.EditAdressByID(id, address);

      expect(result).toBeDefined();
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('addresses');
      expect(mockChain.update).toHaveBeenCalledWith({ address });
      expect(mockChain.eq).toHaveBeenCalledWith('id', id);
    });

    it('should throw BadRequestException when update fails', async () => {
      const id = 'address-id-123';
      const address = new Address('uuid-123', '789 Street', 'City', '12345');

      const mockChain = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Update failed' },
        }),
      };

      mockSupabaseClient.from.mockReturnValue(mockChain);

      await expect(repository.EditAdressByID(id, address)).rejects.toThrow(
        BadRequestException,
      );
      await expect(repository.EditAdressByID(id, address)).rejects.toThrow(
        'Error al editar la direccion: Update failed',
      );
    });

    it('should handle non-existent address ID', async () => {
      const id = 'non-existent-id';
      const address = new Address('uuid-123', 'Street', 'City', '12345');

      const mockChain = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Address not found' },
        }),
      };

      mockSupabaseClient.from.mockReturnValue(mockChain);

      await expect(repository.EditAdressByID(id, address)).rejects.toThrow(
        'Error al editar la direccion: Address not found',
      );
    });
  });
});
